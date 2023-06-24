const GAME_WIDTH = 80;
const GAME_HEIGHT = 20;
const CHARACTER_LENGTH = 3;
const MAX_POSITION = 27;
const START_OBSTACLE_POSITION = 80;
const MAX_JUMP_HEIGHT = 5;
const GRAVITY = 0.007;
const character = '(O)';
const jumpCharacter = '\\o/';


const gameArea = document.getElementById('game-area');
gameArea.focus();

var obstaclePatterns = ['*', '**', '***', '****', '*****', '******', '*******', '*******']; 

let player = {
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
  level: 1
};

let obstacle = {
  position: START_OBSTACLE_POSITION,
  speed: 0.25,
  patternIndex: 0
};

function draw() {
  const floorJumpHeight = Math.floor(player.jumpHeight); 
  const floorPlayerPosition = Math.floor(player.position); 

  let lines = '';
  for (let i = 0; i < GAME_HEIGHT; i++) { 
    let line = '';
    for (let j = 0; j < GAME_WIDTH; j++) { 
      if (
        i === GAME_HEIGHT - 1 - floorJumpHeight &&
        j === floorPlayerPosition) {
        if (player.isJumping) {
          line += `<span class="character">${jumpCharacter}</span>`;
          j += jumpCharacter.length - 1; 
        } else {
          line += `<span class="character">${character}</span>`;
          j += CHARACTER_LENGTH - 1;
        }
      } else if (
        i === GAME_HEIGHT - 1 &&
        j >= obstacle.position &&
        j < obstacle.position + obstaclePatterns[obstacle.patternIndex].length)
      {
        line += `<span class="obstacle">+</span>`;
      } else {
        line += ' ';
      }
    }
    lines += line + '\n'; 
  }

  lines += '_'.repeat(START_OBSTACLE_POSITION) + '\n'; 
  lines = 'Score: ' + player.score + ' Level: ' + player.level + '\n' + lines; 
  gameArea.innerHTML = lines; 

  if (player.isFirstGame && obstacle.position > 0 && player.isGameOver != true) {
    gameArea.innerHTML = gameArea.innerHTML += '<span class="game-control">Controls : Press SPACEBAR to jump!</span>' ;
  } else if (player.isGameOver) {
    if (player.canRestart) {
      gameArea.innerHTML += '<span class="game-over">Game Over! Press Space to Restart!</span>'; 
    } else if (player.gameOverCountdown === null) {
      player.gameOverCounter = 3;
      player.gameOverCountdown = setInterval(() => {
        player.gameOverCounter--;
        if (player.gameOverCounter <= 0) {
          clearInterval(player.gameOverCountdown);
          player.gameOverCountdown = null;
          player.canRestart = true;
        }
        draw();
      }, 1000);
    } else {
      gameArea.innerHTML += `<span class="game-over">Game Over! Press Space to Restart in ${player.gameOverCounter}!</span>`;
    }
  }
}

function updatePlayerPosition() {
  player.position += player.speed; 
  
  if (player.position > MAX_POSITION - CHARACTER_LENGTH) {
    player.position = MAX_POSITION - CHARACTER_LENGTH; 
    player.speed = 0; 
  }
}

function updateObstaclePosition() {
  obstacle.position -= obstacle.speed;

  if (obstacle.position <= 0 - obstaclePatterns[obstacle.patternIndex].length) {
    obstacle.position = START_OBSTACLE_POSITION; 
    player.score += 10; 
    player.speed += 0.01; 
    obstacle.speed += 0.01; 
    obstacle.patternIndex = Math.floor(Math.random() * obstaclePatterns.length); 

    if (player.score % 100 === 0) {
      player.level += 1; 
      obstacle.speed += 0.01 * player.level; 
    }
  }
}

function checkCollision() {
  const obstacleWidth = obstaclePatterns[obstacle.patternIndex].length;
  const atObstacle = player.position >= obstacle.position && player.position < obstacle.position + obstacleWidth;
  const justAfterObstacle = player.position >= obstacle.position - CHARACTER_LENGTH && player.position < obstacle.position;
  const onObstacle = atObstacle || justAfterObstacle;
  const obstacleHeight = 1;
  const aboveObstacle = player.jumpHeight > obstacleHeight;
  
  if (onObstacle && !aboveObstacle) {
    return true;
  }

  return false;
}

function handleJump(event) {
  if (event.code === 'Space' && event.type === 'keydown' && !player.isGameOver) {
    if (!player.isJumping) {
      if (player.isFirstGame) {
        player.isFirstGame = false;
      }
      jump();
    }
  }
}

function jump() {
  player.isJumping = true;
  player.jumpStartTime = Date.now();
}

function updateJump() {
  if (player.isJumping) {
    const jumpDuration = Date.now() - player.jumpStartTime;
    const jumpForce = Math.max(0, MAX_JUMP_HEIGHT - GRAVITY * jumpDuration); 

    player.jumpHeight = jumpForce * (jumpDuration / 100);

    if (jumpForce === 0) {
      player.isJumping = false;
      player.jumpHeight = 0;
    }
  }
}

function handleRestart(event) {
  if (event.code === 'Space' && event.type === 'keydown' && player.isGameOver && player.canRestart) {
    resetGame();
  }
}

function resetGame() {
  player.position = 0;
  obstacle.position = START_OBSTACLE_POSITION;
  player.isJumping = false;
  player.jumpHeight = 0;
  player.isGameOver = false;
  player.canRestart = false;
  player.score = 0;
  player.level = 1;
  player.speed = 0;
  obstacle.speed = 0.25;
  if (player.gameOverCountdown !== null) {
    clearInterval(player.gameOverCountdown);
    player.gameOverCountdown = null;
    player.gameOverCounter = 0;
  }
}

document.addEventListener('keydown', handleJump); 
document.addEventListener('keydown', handleRestart); 

function gameLoop() {
  if (!player.isGameOver) {
    updatePlayerPosition();
    updateObstaclePosition();
    if (checkCollision()) {
      player.isGameOver = true;
    }
    updateJump();
  }
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();
