import { GAME_CONFIG } from './constants.js';

class Obstacle {
  constructor(x, speed, level, rng = Math.random) {
    this.x = x;
    this.speed = speed;
    this.width = 26 + rng() * 44;
    this.height = 26 + rng() * Math.min(70, 28 + level * 6);
    this.y = GAME_CONFIG.groundY - this.height;
    this.scored = false;
  }

  update(deltaTime) {
    this.x -= this.speed * deltaTime;
  }

  getHitbox() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    };
  }
}

export function calculateSpawnCooldown(level, gameSpeed, obstacleWidth, rngValue = Math.random()) {
  const intensity = Math.max(0.52, 1.25 - level * 0.06);
  const jitter = rngValue * 0.75;
  const naturalCooldown = intensity + jitter;
  const safeCooldown = (obstacleWidth + gameSpeed * GAME_CONFIG.minReactionSeconds) / gameSpeed;
  return Math.max(naturalCooldown, safeCooldown);
}

export class ObstacleManager {
  constructor(rng = Math.random) {
    this.items = [];
    this.spawnCooldown = 0;
    this.rng = rng;
  }

  reset() {
    this.items = [];
    this.spawnCooldown = 0;
  }

  update(deltaTime, gameSpeed, level) {
    this.spawnCooldown -= deltaTime;

    if (this.spawnCooldown <= 0) {
      const obstacle = this.spawn(gameSpeed, level);
      this.spawnCooldown = calculateSpawnCooldown(level, gameSpeed, obstacle.width, this.rng());
    }

    this.items.forEach((obstacle) => obstacle.update(deltaTime));
    this.items = this.items.filter((obstacle) => obstacle.x + obstacle.width > -30);
  }

  spawn(gameSpeed, level) {
    const x = GAME_CONFIG.width + 40 + this.rng() * 260;
    const obstacle = new Obstacle(x, gameSpeed, level, this.rng);
    this.items.push(obstacle);
    return obstacle;
  }
}

export function intersects(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}
