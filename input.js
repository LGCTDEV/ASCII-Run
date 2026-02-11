export class InputController {
  constructor(canvas) {
    this.jumpQueued = false;
    this.restartQueued = false;

    window.addEventListener('keydown', (event) => {
      if (['Space', 'ArrowUp', 'KeyW'].includes(event.code)) {
        event.preventDefault();
        this.jumpQueued = true;
      }

      if (event.code === 'KeyR') {
        event.preventDefault();
        this.restartQueued = true;
      }
    });

    canvas.addEventListener('pointerdown', () => {
      this.jumpQueued = true;
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
}
