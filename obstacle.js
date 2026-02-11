import { GAME_CONFIG } from './constants.js';

const OBSTACLE_PRESETS = [
  { name: 'short', width: [24, 36], height: [24, 40], color: '#30415f' },
  { name: 'block', width: [30, 54], height: [36, 70], color: '#3d5279' },
  { name: 'tower', width: [34, 58], height: [55, 96], color: '#5a6f99' }
];

class Obstacle {
  constructor(x, speed, level, rng = Math.random) {
    this.x = x;
    this.speed = speed;

    const preset = OBSTACLE_PRESETS[Math.floor(rng() * OBSTACLE_PRESETS.length)];
    this.type = preset.name;
    this.width = lerpRange(preset.width, rng);
    const extraHeight = Math.min(22, level * 2);
    this.height = lerpRange(preset.height, rng) + extraHeight;
    this.color = preset.color;
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

function lerpRange([min, max], rng) {
  return min + rng() * (max - min);
}

export function calculateSpawnCooldown(level, gameSpeed, obstacleWidth, rngValue = Math.random()) {
  const intensity = Math.max(0.5, 1.2 - level * 0.06);
  const jitter = rngValue * 0.7;
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

    this.items.forEach((obstacle) => {
      obstacle.speed = gameSpeed;
      obstacle.update(deltaTime);
    });
    this.items = this.items.filter((obstacle) => obstacle.x + obstacle.width > -30);
  }

  spawn(gameSpeed, level) {
    const x = GAME_CONFIG.width + 40 + this.rng() * 260;
    const obstacle = new Obstacle(x, gameSpeed, level, this.rng);
    this.items.push(obstacle);
    return obstacle;
  }
}

export class PowerUpManager {
  constructor(rng = Math.random) {
    this.items = [];
    this.cooldown = 8;
    this.rng = rng;
  }

  reset() {
    this.items = [];
    this.cooldown = 8;
  }

  update(deltaTime, gameSpeed, level) {
    this.cooldown -= deltaTime;

    const spawnRate = Math.max(5.5, 11 - level * 0.35);
    if (this.cooldown <= 0) {
      this.spawn(gameSpeed);
      this.cooldown = spawnRate + this.rng() * 2;
    }

    this.items.forEach((item) => {
      item.x -= gameSpeed * deltaTime;
      item.bob += deltaTime * 4;
      item.y = item.baseY + Math.sin(item.bob) * 8;
    });

    this.items = this.items.filter((item) => item.x + item.size > -20);
  }

  spawn(gameSpeed) {
    const x = GAME_CONFIG.width + 80 + this.rng() * 280;
    const highArc = this.rng() > 0.5;
    const baseY = highArc ? GAME_CONFIG.groundY - 120 : GAME_CONFIG.groundY - 62;
    this.items.push({
      x,
      y: baseY,
      baseY,
      size: 18,
      type: 'shield',
      bob: this.rng() * Math.PI * 2,
      speed: gameSpeed
    });
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
