import { GAME_CONFIG } from './constants.js';
import { StickmanPlayer } from './player.js';
import { ObstacleManager, intersects } from './obstacle.js';

const BEST_SCORE_KEY = 'stickmanRunnerBestScore';
const BEST_LEVEL_KEY = 'stickmanRunnerBestLevel';

export class RunnerGame {
  constructor(input, renderer) {
    this.input = input;
    this.renderer = renderer;

    this.player = new StickmanPlayer();
    this.obstacleManager = new ObstacleManager();

    this.status = 'ready';
    this.elapsedSeconds = 0;
    this.distance = 0;
    this.gameSpeed = GAME_CONFIG.baseSpeed;
    this.score = 0;
    this.level = 1;

    this.bestScore = Number(localStorage.getItem(BEST_SCORE_KEY) || 0);
    this.bestLevel = Number(localStorage.getItem(BEST_LEVEL_KEY) || 1);

    this.lastTime = performance.now();
  }

  start() {
    this.status = 'running';
    this.elapsedSeconds = 0;
    this.distance = 0;
    this.gameSpeed = GAME_CONFIG.baseSpeed;
    this.score = 0;
    this.level = 1;
    this.player = new StickmanPlayer();
    this.obstacleManager.reset();
  }

  gameOver() {
    this.status = 'gameover';

    if (this.score > this.bestScore) {
      this.bestScore = this.score;
      localStorage.setItem(BEST_SCORE_KEY, String(this.bestScore));
    }

    if (this.level > this.bestLevel) {
      this.bestLevel = this.level;
      localStorage.setItem(BEST_LEVEL_KEY, String(this.bestLevel));
    }
  }

  update(deltaTime) {
    if (this.status === 'ready') {
      if (this.input.consumeJump()) {
        this.start();
      }
      return;
    }

    if (this.status === 'gameover') {
      if (this.input.consumeRestart() || this.input.consumeJump()) {
        this.start();
      }
      return;
    }

    if (this.input.consumeJump()) {
      this.player.jump();
    }

    this.elapsedSeconds += deltaTime;
    this.level = 1 + Math.floor(this.elapsedSeconds / GAME_CONFIG.levelStepSeconds);

    const targetSpeed = Math.min(
      GAME_CONFIG.maxSpeed,
      GAME_CONFIG.baseSpeed + this.level * 24
    );
    this.gameSpeed += (targetSpeed - this.gameSpeed) * 0.08;

    this.distance += this.gameSpeed * deltaTime;
    this.score = Math.floor(this.elapsedSeconds * GAME_CONFIG.pointsPerSecond);

    this.player.update(deltaTime);
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
        this.score += 5;
      }
    });
  }

  frame(now = performance.now()) {
    const deltaTime = Math.min(0.033, (now - this.lastTime) / 1000);
    this.lastTime = now;

    this.update(deltaTime);
    this.renderer.render({
      status: this.status,
      elapsedSeconds: this.elapsedSeconds,
      distance: this.distance,
      player: this.player,
      obstacles: this.obstacleManager.items,
      score: this.score,
      level: this.level,
      bestScore: this.bestScore,
      bestLevel: this.bestLevel
    });

    requestAnimationFrame((time) => this.frame(time));
  }
}
