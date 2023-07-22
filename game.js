//game.js
function updateJump() {
  if (player.isJumping) {
    const jumpDuration = Date.now() - player.jumpStartTime;
    const jumpForce = Math.max(0, MAX_JUMP_HEIGHT - GRAVITY * jumpDuration);

    player.jumpHeight = jumpForce * (jumpDuration / 95);

    if (jumpForce === 0) {
      player.isJumping = false;
      player.jumpHeight = 0;
    }
  }
}



const gameLoop = () => {
  if (!player.isGameOver) {
    updatePlayerPosition();
    updateObstaclePosition();
    if (checkCollision()) {
      player.isGameOver = true;
    }
    updateJump();

    if (player.animationCounter === 5) {
      player.animationCounter = 0;
      player.animationState = (player.animationState + 1) % 3;
    }
    player.animationCounter++;
  }
  draw();
  requestAnimationFrame(gameLoop);
};


