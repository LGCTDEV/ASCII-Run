import { GAME_CONFIG } from './constants.js';
import { StickmanPlayer } from './player.js';
import { ObstacleManager, intersects } from './obstacle.js';

const BEST_SCORE_KEY = 'stickmanRunnerBestScore';
const BEST_LEVEL_KEY = 'stickmanRunnerBestLevel';

function safeGetStorageNumber(key, fallback) {
  try {
    const value = Number(localStorage.getItem(key));
    return Number.isFinite(value) ? value : fallback;
  } catch {
    return fallback;
  }
}

function safeSetStorageNumber(key, value) {
  try {
    localStorage.setItem(key, String(value));
  } catch {
    // Ignore storage errors for private mode / sandboxed contexts.
  }
}

export function computeScore(elapsedSeconds, bonusScore) {
  return Math.floor(elapsedSeconds * GAME_CONFIG.pointsPerSecond) + bonusScore;
}

export class RunnerGame {
  constructor(input, renderer, ui = {}) {
    this.input = input;
    this.renderer = renderer;
    this.ui = ui;

    this.player = new StickmanPlayer();
    this.obstacleManager = new ObstacleManager();

    this.status = 'ready';
    this.elapsedSeconds = 0;
    this.distance = 0;
    this.gameSpeed = GAME_CONFIG.baseSpeed;
    this.score = 0;
    this.bonusScore = 0;
    this.level = 1;
    this.effects = { particles: [], hitFlash: 0, shake: 0, scorePop: null };

    this.bestScore = safeGetStorageNumber(BEST_SCORE_KEY, 0);
    this.bestLevel = safeGetStorageNumber(BEST_LEVEL_KEY, 1);

    this.lastTime = performance.now();
    this.syncControls();
  }

  syncControls() {
    if (!this.ui.pauseButton || !this.ui.startButton || !this.ui.restartButton) {
      return;
    }

    this.ui.pauseButton.disabled = this.status === 'ready' || this.status === 'gameover';
    this.ui.pauseButton.textContent = this.status === 'paused' ? 'Reprendre' : 'Pause';
    this.ui.startButton.disabled = this.status !== 'ready';
    this.ui.restartButton.disabled = this.status === 'ready';
  }

  spawnParticles(x, y, amount = 7, color = '#ffffff') {
    for (let i = 0; i < amount; i++) {
      this.effects.particles.push({
        x,
        y,
        vx: -30 + Math.random() * 60,
        vy: -120 + Math.random() * 60,
        life: 0.5 + Math.random() * 0.35,
        color
      });
    }
  }

  start() {
    this.status = 'running';
    this.elapsedSeconds = 0;
    this.distance = 0;
    this.gameSpeed = GAME_CONFIG.baseSpeed;
    this.score = 0;
    this.bonusScore = 0;
    this.level = 1;
    this.effects = { particles: [], hitFlash: 0, shake: 0, scorePop: null };
    this.player = new StickmanPlayer();
    this.obstacleManager.reset();
    this.syncControls();
  }

  togglePause() {
    if (this.status === 'running') {
      this.status = 'paused';
    } else if (this.status === 'paused') {
      this.status = 'running';
    }
    this.syncControls();
  }

  gameOver() {
    this.status = 'gameover';
    this.effects.hitFlash = 0.5;
    this.effects.shake = 8;

    if (this.score > this.bestScore) {
      this.bestScore = this.score;
      safeSetStorageNumber(BEST_SCORE_KEY, this.bestScore);
    }

    if (this.level > this.bestLevel) {
      this.bestLevel = this.level;
      safeSetStorageNumber(BEST_LEVEL_KEY, this.bestLevel);
    }
    this.syncControls();
  }

  updateEffects(deltaTime) {
    this.effects.hitFlash = Math.max(0, this.effects.hitFlash - deltaTime);
    this.effects.shake = Math.max(0, this.effects.shake - deltaTime * 25);

    this.effects.particles.forEach((p) => {
      p.life -= deltaTime;
      p.vy += 420 * deltaTime;
      p.x += p.vx * deltaTime;
      p.y += p.vy * deltaTime;
    });
    this.effects.particles = this.effects.particles.filter((p) => p.life > 0);

    if (this.effects.scorePop) {
      this.effects.scorePop.life -= deltaTime;
      this.effects.scorePop.y -= 35 * deltaTime;
      if (this.effects.scorePop.life <= 0) {
        this.effects.scorePop = null;
      }
    }
  }

  update(deltaTime) {
    if (this.input.consumePauseToggle()) {
      this.togglePause();
    }

    if (this.status === 'ready') {
      if (this.input.consumeStart()) {
        this.start();
      }
      this.updateEffects(deltaTime);
      return;
    }

    if (this.status === 'gameover') {
      if (this.input.consumeRestart()) {
        this.start();
      }
      this.updateEffects(deltaTime);
      return;
    }

    if (this.status === 'paused') {
      this.updateEffects(deltaTime);
      return;
    }

    if (this.input.consumeJump()) {
      const didJump = this.player.jump();
      if (didJump) {
        this.spawnParticles(this.player.x, this.player.y - 20, 6, '#fff7d1');
      }
    }

    this.elapsedSeconds += deltaTime;
    this.level = 1 + Math.floor(this.elapsedSeconds / GAME_CONFIG.levelStepSeconds);

    const targetSpeed = Math.min(
      GAME_CONFIG.maxSpeed,
      GAME_CONFIG.baseSpeed + this.level * 24
    );
    this.gameSpeed += (targetSpeed - this.gameSpeed) * 0.08;

    this.distance += this.gameSpeed * deltaTime;

    const playerUpdate = this.player.update(deltaTime);
    if (playerUpdate.landed) {
      this.spawnParticles(this.player.x, this.player.y, 5, '#c8f59f');
    }

    this.obstacleManager.update(deltaTime, this.gameSpeed, this.level);

    const playerHitbox = this.player.getHitbox();
    const collides = this.obstacleManager.items.some((obstacle) => intersects(playerHitbox, obstacle.getHitbox()));

    if (collides) {
      this.gameOver();
      return;
    }

    this.obstacleManager.items.forEach((obstacle) => {
      if (!obstacle.scored && obstacle.x + obstacle.width < this.player.x) {
        obstacle.scored = true;
        this.bonusScore += 5;
        this.effects.scorePop = { text: '+5', x: this.player.x + 20, y: this.player.y - 90, life: 0.7 };
      }
    });

    this.score = computeScore(this.elapsedSeconds, this.bonusScore);
    this.updateEffects(deltaTime);
  }

  frame(now = performance.now()) {
    const deltaTime = Math.min(GAME_CONFIG.maxDeltaTime, (now - this.lastTime) / 1000);
    this.lastTime = now;

    this.update(deltaTime);
    this.renderer.render({
      status: this.status,
      elapsedSeconds: this.elapsedSeconds,
      distance: this.distance,
      player: this.player,
      obstacles: this.obstacleManager.items,
      score: this.score,
      bonusScore: this.bonusScore,
      level: this.level,
      bestScore: this.bestScore,
      bestLevel: this.bestLevel,
      effects: this.effects
    });

    requestAnimationFrame((time) => this.frame(time));
  }
}
