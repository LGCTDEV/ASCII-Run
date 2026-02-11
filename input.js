export class InputController {
  constructor(canvas, controls = {}) {
    this.jumpQueued = false;
    this.slideQueued = false;
    this.restartQueued = false;
    this.startQueued = false;
    this.pauseToggleQueued = false;
    this.tapQueued = false;

    window.addEventListener('keydown', (event) => {
      if (['Space', 'ArrowUp', 'KeyW'].includes(event.code)) {
        event.preventDefault();
        this.jumpQueued = true;
        this.startQueued = true;
      }

      if (['ArrowDown', 'KeyS'].includes(event.code)) {
        event.preventDefault();
        this.slideQueued = true;
      }

      if (event.code === 'KeyR') {
        event.preventDefault();
        this.restartQueued = true;
      }

      if (event.code === 'KeyP') {
        event.preventDefault();
        this.pauseToggleQueued = true;
      }
    });

    canvas.addEventListener('pointerdown', (event) => {
      if (!event.isPrimary) {
        return;
      }

      this.tapQueued = true;
    });

    controls.startButton?.addEventListener('click', () => {
      this.startQueued = true;
    });

    controls.jumpButton?.addEventListener('pointerdown', (event) => {
      event.preventDefault();
      this.jumpQueued = true;
    });

    controls.slideButton?.addEventListener('pointerdown', (event) => {
      event.preventDefault();
      this.slideQueued = true;
    });

    controls.pauseButton?.addEventListener('click', () => {
      this.pauseToggleQueued = true;
    });

    controls.restartButton?.addEventListener('click', () => {
      this.restartQueued = true;
    });
  }

  consumeJump() {
    const next = this.jumpQueued;
    this.jumpQueued = false;
    return next;
  }

  consumeSlide() {
    const next = this.slideQueued;
    this.slideQueued = false;
    return next;
  }

  consumeRestart() {
    const next = this.restartQueued;
    this.restartQueued = false;
    return next;
  }

  consumeStart() {
    const next = this.startQueued;
    this.startQueued = false;
    return next;
  }

  consumePauseToggle() {
    const next = this.pauseToggleQueued;
    this.pauseToggleQueued = false;
    return next;
  }

  consumeTap() {
    const next = this.tapQueued;
    this.tapQueued = false;
    return next;
  }
}
