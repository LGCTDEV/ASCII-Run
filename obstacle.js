import { GAME_CONFIG } from './constants.js';

class Obstacle {
  constructor(x, speed, level) {
    this.x = x;
    this.speed = speed;
    this.width = 26 + Math.random() * 44;
    this.height = 26 + Math.random() * Math.min(70, 28 + level * 6);
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

export class ObstacleManager {
  constructor() {
    this.items = [];
    this.spawnCooldown = 0;
  }

  reset() {
    this.items = [];
    this.spawnCooldown = 0;
  }

  update(deltaTime, gameSpeed, level) {
    this.spawnCooldown -= deltaTime;

    if (this.spawnCooldown <= 0) {
      this.spawn(gameSpeed, level);
      const intensity = Math.max(0.52, 1.25 - level * 0.06);
      this.spawnCooldown = intensity + Math.random() * 0.75;
    }

    this.items.forEach((obstacle) => obstacle.update(deltaTime));
    this.items = this.items.filter((obstacle) => obstacle.x + obstacle.width > -30);
  }

  spawn(gameSpeed, level) {
    const x = GAME_CONFIG.width + 40 + Math.random() * 260;
    this.items.push(new Obstacle(x, gameSpeed, level));
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
