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
    this.isSliding = false;
    this.slideTimeLeft = 0;
    this.slideCooldownLeft = 0;

    this.standingHeight = 82;
    this.slidingHeight = 46;
    this.slideDuration = 0.62;
    this.slideCooldown = 0.24;
  }

  jump() {
    if (!this.isGrounded || this.isSliding) {
      return false;
    }

    this.velocityY = GAME_CONFIG.jumpVelocity;
    this.isGrounded = false;
    return true;
  }

  slide() {
    if (!this.isGrounded || this.isSliding || this.slideCooldownLeft > 0) {
      return false;
    }

    this.isSliding = true;
    this.slideTimeLeft = this.slideDuration;
    this.height = this.slidingHeight;
    return true;
  }

  endSlide() {
    if (!this.isSliding) {
      return;
    }

    this.isSliding = false;
    this.slideTimeLeft = 0;
    this.slideCooldownLeft = this.slideCooldown;
    this.height = this.standingHeight;
  }

  update(deltaTime) {
    this.runCycle += deltaTime * 0.014;

    this.slideCooldownLeft = Math.max(0, this.slideCooldownLeft - deltaTime);

    if (this.isSliding) {
      this.slideTimeLeft -= deltaTime;
      if (this.slideTimeLeft <= 0 || !this.isGrounded) {
        this.endSlide();
      }
    }

    this.velocityY += GAME_CONFIG.gravity * deltaTime;
    this.y += this.velocityY * deltaTime;

    const wasGrounded = this.isGrounded;

    if (this.y >= GAME_CONFIG.groundY) {
      this.y = GAME_CONFIG.groundY;
      this.velocityY = 0;
      this.isGrounded = true;
    }

    return {
      landed: !wasGrounded && this.isGrounded
    };
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
