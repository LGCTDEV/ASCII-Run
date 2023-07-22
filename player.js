// player.js
let backgroundPosition = 0;

const player = {
  speed: 0,
  position: 0,
  isJumping: false,
  jumpHeight: 0,
  jumpStartTime: 0,
  isGameOver: false,
  canRestart: false,
  gameOverCountdown: null,
  gameOverCounter: 0,
  isFirstGame: true,
  score: 0,
  level: 1,
  topScore: localStorage.getItem('topScore') || 0,
  topLevel: localStorage.getItem('topLevel') || 1,
  startCountdown: null,
  startCounter: 5,
  animationState: 0,
  backgroundIndex: 0,
  animationCounter: 0
};

const updatePlayerPosition = () => {
  player.position += player.speed;
  backgroundPosition += obstacle.speed;

  if (player.position > MAX_POSITION - CHARACTER_LENGTH) {
    player.position = MAX_POSITION - CHARACTER_LENGTH;
    player.speed = 0;
  }
};

const jump = () => {
  player.isJumping = true;
  player.jumpStartTime = Date.now();
};

const resetGame = () => {
  player.position = 0;
  obstacle.patternIndex = Math.floor(Math.random() * obstaclePatterns.length);
  obstacle.position = START_OBSTACLE_POSITION;
  player.isJumping = false;
  player.jumpHeight = 0;
  player.isGameOver = false;
  player.canRestart = false;
  player.score = 0;
  player.level = 1;
  player.speed = 0;
  obstacle.speed = 0.25;
  obstacle.isBonus = false;
  obstacle.length = Math.floor(Math.random() * obstaclePatterns.length);
  if (player.gameOverCountdown !== null) {
    clearInterval(player.gameOverCountdown);
    player.gameOverCountdown = null;
    player.gameOverCounter = 0;
  }

  // Change background every 4 levels
  if (player.level % 4 === 0) {
    player.backgroundIndex = (player.backgroundIndex + 1) % backgroundsPatterns.length;
  }
};
