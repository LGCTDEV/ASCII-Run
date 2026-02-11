import { GAME_CONFIG } from './constants.js';
import { StickmanPlayer } from './player.js';
import { ObstacleManager, PowerUpManager, intersects } from './obstacle.js';

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

export function computeScore(elapsedSeconds, bonusScore, comboMultiplier = 1) {
  const baseScore = Math.floor(elapsedSeconds * GAME_CONFIG.pointsPerSecond);
  return baseScore + Math.floor(bonusScore * Math.max(1, comboMultiplier));
}

export class RunnerGame {
  constructor(input, renderer, ui = {}) {
    this.input = input;
    this.renderer = renderer;
    this.ui = ui;

    this.player = new StickmanPlayer();
    this.obstacleManager = new ObstacleManager();
    this.powerUpManager = new PowerUpManager();

    this.status = 'ready';
    this.elapsedSeconds = 0;
    this.distance = 0;
    this.gameSpeed = GAME_CONFIG.baseSpeed;
    this.score = 0;
    this.bonusScore = 0;
    this.level = 1;
    this.combo = 0;
    this.comboMultiplier = 1;
    this.shieldCharges = 0;
    this.lastNearMissAt = -999;
    this.lastComboActionAt = 0;
    this.effects = { particles: [], hitFlash: 0, shake: 0, scorePop: null };

    this.bestScore = safeGetStorageNumber(BEST_SCORE_KEY, 0);
    this.bestLevel = safeGetStorageNumber(BEST_LEVEL_KEY, 1);

    this.lastTime = performance.now();
    this.syncControls();
  }

  syncControls() {
    if (this.ui.pauseButton) {
      this.ui.pauseButton.disabled = this.status === 'ready' || this.status === 'gameover';
      this.ui.pauseButton.textContent = this.status === 'paused' ? 'Reprendre' : 'Pause';
      this.ui.pauseButton.setAttribute('aria-pressed', String(this.status === 'paused'));
    }

    if (this.ui.startButton) {
      this.ui.startButton.disabled = this.status !== 'ready';
    }

    if (this.ui.restartButton) {
      this.ui.restartButton.disabled = this.status === 'ready';
    }
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

  queueScorePop(text, color = '#ffc857') {
    this.effects.scorePop = {
      text,
      x: this.player.x + 20,
      y: this.player.y - 90,
      life: 0.9,
      color
    };
  }

  start() {
    this.status = 'running';
    this.elapsedSeconds = 0;
    this.distance = 0;
    this.gameSpeed = GAME_CONFIG.baseSpeed;
    this.score = 0;
    this.bonusScore = 0;
    this.level = 1;
    this.combo = 0;
    this.comboMultiplier = 1;
    this.shieldCharges = 0;
    this.lastNearMissAt = -999;
    this.lastComboActionAt = 0;
    this.effects = { particles: [], hitFlash: 0, shake: 0, scorePop: null };
    this.player = new StickmanPlayer();
    this.obstacleManager.reset();
    this.powerUpManager.reset();
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

  handleTapAction() {
    if (this.status === 'ready' || this.status === 'gameover') {
      this.start();
    }

    if (this.status === 'running') {
      const didJump = this.player.jump();
      if (didJump) {
        this.spawnParticles(this.player.x, this.player.y - 20, 6, '#fff7d1');
      }
    }
  }

  handleSlide() {
    if (this.status === 'ready' || this.status === 'gameover') {
      this.start();
    }

    if (this.status !== 'running') {
      return;
    }

    const didSlide = this.player.slide();
    if (didSlide) {
      this.spawnParticles(this.player.x + 12, this.player.y - 8, 8, '#d9c2ff');
      this.queueScorePop('Roulade !', '#d9c2ff');
    }
  }

  handleJump() {
    if (this.status === 'ready' || this.status === 'gameover') {
      this.start();
    }

    if (this.status !== 'running') {
      return;
    }

    const didJump = this.player.jump();
    if (didJump) {
      this.spawnParticles(this.player.x, this.player.y - 20, 6, '#fff7d1');
    }
  }

  registerObstaclePass(obstacle) {
    if (obstacle.scored || obstacle.x + obstacle.width >= this.player.x) {
      return;
    }

    obstacle.scored = true;
    this.combo += 1;
    this.lastComboActionAt = this.elapsedSeconds;
    this.comboMultiplier = 1 + Math.min(2, this.combo * 0.08);

    const comboBonus = 5 + Math.min(20, Math.floor(this.combo * 0.6));
    this.bonusScore += comboBonus;
    this.queueScorePop(`+${comboBonus}`);

    if (this.combo > 0 && this.combo % 6 === 0) {
      this.shieldCharges += 1;
      this.queueScorePop('Bouclier +1', '#8dd8ff');
    }
  }

  registerNearMiss(obstacle) {
    const obstacleBack = obstacle.x + obstacle.width;
    const nearPlayer = Math.abs(obstacleBack - this.player.x) < 36;
    const lowJump = this.player.y < GAME_CONFIG.groundY - 18 && this.player.y > GAME_CONFIG.groundY - 75;
    const evasiveSlide = obstacle.lane === 'air' && this.player.isSliding;

    if (!nearPlayer || (!lowJump && !evasiveSlide) || this.elapsedSeconds - this.lastNearMissAt < 0.45) {
      return;
    }

    this.lastNearMissAt = this.elapsedSeconds;
    this.lastComboActionAt = this.elapsedSeconds;
    this.bonusScore += evasiveSlide ? 10 : 8;
    this.queueScorePop(evasiveSlide ? 'Esquive roulade +10' : 'Near miss +8', '#36d399');
  }

  handleCollision() {
    if (this.shieldCharges > 0) {
      this.shieldCharges -= 1;
      this.effects.hitFlash = 0.25;
      this.effects.shake = 4;
      this.combo = Math.max(0, this.combo - 2);
      this.comboMultiplier = 1 + Math.min(2, this.combo * 0.08);
      this.queueScorePop('Bouclier sauvé !', '#8dd8ff');
      return true;
    }

    this.gameOver();
    return false;
  }

  update(deltaTime) {
    if (this.input.consumePauseToggle()) {
      this.togglePause();
    }

    if (this.input.consumeTap()) {
      this.handleTapAction();
    }

    if (this.input.consumeJump()) {
      this.handleJump();
    }

    if (this.input.consumeSlide()) {
      this.handleSlide();
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
    this.powerUpManager.update(deltaTime, this.gameSpeed, this.level);

    const playerHitbox = this.player.getHitbox();

    for (const obstacle of this.obstacleManager.items) {
      if (intersects(playerHitbox, obstacle.getHitbox())) {
        const canContinue = this.handleCollision();
        obstacle.x = -200;
        if (!canContinue) {
          return;
        }
      }

      this.registerObstaclePass(obstacle);
      this.registerNearMiss(obstacle);
    }

    this.powerUpManager.items = this.powerUpManager.items.filter((powerUp) => {
      const hitbox = {
        x: powerUp.x,
        y: powerUp.y,
        width: powerUp.size,
        height: powerUp.size
      };

      if (!intersects(playerHitbox, hitbox)) {
        return true;
      }

      this.shieldCharges = Math.min(3, this.shieldCharges + 1);
      this.bonusScore += 20;
      this.spawnParticles(powerUp.x, powerUp.y, 10, '#8dd8ff');
      this.queueScorePop('Power-up +20', '#8dd8ff');
      return false;
    });

    if (this.combo > 0 && this.elapsedSeconds - this.lastComboActionAt > 2.2 && this.player.isGrounded) {
      this.combo = Math.max(0, this.combo - deltaTime * 3);
      this.comboMultiplier = 1 + Math.min(2, this.combo * 0.08);
    }

    this.score = computeScore(this.elapsedSeconds, this.bonusScore, this.comboMultiplier);
    this.updateEffects(deltaTime);
  }

  frame(now = performance.now()) {
    const deltaTime = Math.min(GAME_CONFIG.maxDeltaTime, (now - this.lastTime) / 1000);
    this.lastTime = now;

    this.update(deltaTime);

    const model = {
      status: this.status,
      elapsedSeconds: this.elapsedSeconds,
      distance: this.distance,
      score: this.score,
      level: this.level,
      gameSpeed: this.gameSpeed,
      bestScore: this.bestScore,
      bestLevel: this.bestLevel,
      combo: this.combo,
      comboMultiplier: this.comboMultiplier,
      shieldCharges: this.shieldCharges,
      player: this.player,
      obstacles: this.obstacleManager.items,
      powerUps: this.powerUpManager.items,
      effects: this.effects
    };

    this.renderer.render(model);
    requestAnimationFrame((time) => this.frame(time));
  }
}
