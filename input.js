//input.js
const handleJump = (event) => {
  if (event.code === 'Space' && event.type === 'keydown' && !player.isGameOver && !player.isFirstGame) {
    if (!player.isJumping) {
      if (player.isFirstGame) {
        player.isFirstGame = false;
      }
      jump();
    }
  }
};

const handleRestart = (event) => {
  if (event.code === 'Space' && event.type === 'keydown' && player.isGameOver && player.canRestart) {
    resetGame();
  }
};




