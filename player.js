import { GAME_CONFIG } from './constants.js';

export class StickmanPlayer {
  constructor() {
    this.x = 140;
    this.y = GAME_CONFIG.groundY;
    this.width = 32;
    this.height = 82;
    this.velocityY = 0;
    this.isGrounded = true;
    this.runCycle = 0;
  }

  jump() {
    if (!this.isGrounded) {
      return;
    }

    this.velocityY = GAME_CONFIG.jumpVelocity;
    this.isGrounded = false;
  }

  update(deltaTime) {
    this.runCycle += deltaTime * 0.014;

    this.velocityY += GAME_CONFIG.gravity * deltaTime;
    this.y += this.velocityY * deltaTime;

    if (this.y >= GAME_CONFIG.groundY) {
      this.y = GAME_CONFIG.groundY;
      this.velocityY = 0;
      this.isGrounded = true;
    }
  }

  getHitbox() {
    return {
      x: this.x - 10,
      y: this.y - this.height,
      width: this.width,
      height: this.height
    };
  }
}
