const GAME_WIDTH = 80;
const GAME_HEIGHT = 20;
const CHARACTER_LENGTH = 3;
const MAX_POSITION = 27;
const START_OBSTACLE_POSITION = 80;
const MAX_JUMP_HEIGHT = 5;
const GRAVITY = 0.007;
const character = '(O)';

const gameArea = document.getElementById('game-area');
gameArea.focus();



// Motifs d'obstacles possibles
var obstaclePatterns = ['#', '**', '***', '****', '*****', '******', '*******', '*******']; 

let player = {
  speed: 0,
  position: 1,
  isJumping: false,
  jumpHeight: 0,
  jumpStartTime: 0,
  isGameOver: false, 
  score: 0
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
        line += `<span class="character">${character}</span>`;
        j += CHARACTER_LENGTH - 1;
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
  lines = 'Score: ' + player.score + '\n' + lines; 
  gameArea.innerHTML = lines; 

  if (player.isGameOver) {
    gameArea.innerHTML += '<span class="game-over">Game Over! Press Space to Restart!</span>'; 
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
    player.score += 10; // Incrémente le score du joueur
    player.speed += 0.01; // Augmente la vitesse du joueur
    obstacle.speed += 0.01; // Augmente la vitesse de l'obstacle
    obstacle.patternIndex = Math.floor(Math.random() * obstaclePatterns.length); // Sélectionne un nouveau motif d'obstacle aléatoire
  }
}


function checkCollision() {
  // Obstacle width (size)
  const obstacleWidth = obstaclePatterns[obstacle.patternIndex].length;

  // Check if player is at, before or just after the obstacle
  const atObstacle = player.position >= obstacle.position && player.position < obstacle.position + obstacleWidth;
  const justAfterObstacle = player.position >= obstacle.position - CHARACTER_LENGTH && player.position < obstacle.position;
  const onObstacle = atObstacle || justAfterObstacle;
  
  // Obstacle height (all obstacles have a height of 1 for simplicity)
  const obstacleHeight = 1;
  
  // Check if player is above the obstacle
  const aboveObstacle = player.jumpHeight > obstacleHeight;
  
  // If the player is on the obstacle and not above it, there is a collision
  if (onObstacle && !aboveObstacle) {
    return true;
  }

  // Otherwise, there's no collision
  return false;
}


function handleJump(event) {
  if (event.code === 'Space' && event.type === 'keydown' && !player.isGameOver) {
    if (!player.isJumping) {
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
  if (event.code === 'Space' && event.type === 'keydown' && player.isGameOver) {
    resetGame();
  }
}

function resetGame() {
  player.position = 1;
  obstacle.position = START_OBSTACLE_POSITION;
  player.isJumping = false;
  player.jumpHeight = 0;
  player.isGameOver = false;
  player.score = 0;
  player.speed = 0;
  obstacle.speed = 0.25;
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
    draw();
  }
  requestAnimationFrame(gameLoop);
}

gameLoop();
