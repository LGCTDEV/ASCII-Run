// obstacle.js

const obstacle = {
  position: START_OBSTACLE_POSITION,
  speed: 0.25,
  patternIndex: 0,
  isBonus: false
};

const updateObstaclePosition = () => {
  obstacle.position -= obstacle.speed;

  if (player.score > player.topScore) {
    player.topScore = player.score;
    localStorage.setItem('topScore', player.topScore);
  }

  if (obstacle.position <= 0 - (obstacle.isBonus ? 1 : obstaclePatterns[obstacle.patternIndex].length)) {
    if (player.level < 10 || !player.isJumping) {
      obstacle.position = START_OBSTACLE_POSITION;
      player.score += 10;
      if (player.score % 400 === 0) {
        obstacle.isBonus = true;
      } else {
        obstacle.isBonus = false;
        obstacle.patternIndex = Math.floor(Math.random() * obstaclePatterns.length);
      }
      player.speed += 0.01;
      obstacle.speed += 0.01;

      if (player.score % 100 === 0) {
        player.level += 1;
        obstacle.speed += 0.01 * player.level;
        if (player.level > player.topLevel) {
          player.topLevel = player.level;
          localStorage.setItem('topLevel', player.topLevel);
        }
      }
    }
  }
};

const checkCollision = () => {
  const obstacleWidth = obstacle.isBonus ? 1 : obstaclePatterns[obstacle.patternIndex].length;
  const atObstacle = player.position >= obstacle.position && player.position < obstacle.position + obstacleWidth;
  const justAfterObstacle = player.position >= obstacle.position - CHARACTER_LENGTH && player.position < obstacle.position;
  const onObstacle = atObstacle || justAfterObstacle;
  const obstacleHeight = 1;
  const aboveObstacle = player.jumpHeight > obstacleHeight;

  if (onObstacle && !aboveObstacle) {
    if (obstacle.isBonus) {
      obstacle.speed /= 2;
      obstacle.position = START_OBSTACLE_POSITION;
      obstacle.isBonus = false;
      obstacle.patternIndex = Math.floor(Math.random() * obstaclePatterns.length);
      return false;
    } else {
      return true;
    }
  }

  return false;
};
