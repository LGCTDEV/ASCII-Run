export class InputController {
  constructor(canvas, controls = {}) {
    this.jumpQueued = false;
    this.restartQueued = false;
    this.startQueued = false;
    this.pauseToggleQueued = false;

    window.addEventListener('keydown', (event) => {
      if (['Space', 'ArrowUp', 'KeyW'].includes(event.code)) {
        event.preventDefault();
        this.jumpQueued = true;
        this.startQueued = true;
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

    canvas.addEventListener('pointerdown', () => {
      this.jumpQueued = true;
    });

    controls.startButton?.addEventListener('click', () => {
      this.startQueued = true;
    });

    controls.jumpButton?.addEventListener('pointerdown', () => {
      this.jumpQueued = true;
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
}
