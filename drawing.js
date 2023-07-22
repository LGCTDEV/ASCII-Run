//drawing.js

const gameArea = document.getElementById('game-area');
gameArea.focus();

function draw() {
  const floorJumpHeight = Math.floor(player.jumpHeight);
  const floorPlayerPosition = Math.floor(player.position);

  let characterToDraw;
  if (player.isJumping) {
    characterToDraw = jumpCharacter;
  } else {
    characterToDraw = characterRunFrames[player.animationState];
  }

  const backgroundPattern = backgroundsPatterns[Math.floor((player.level - 1) / 4) % backgroundsPatterns.length];

  let lines = '';
  for (let i = 0; i < GAME_HEIGHT; i++) {
    let line = '';
    let currentType = '';
    let currentChars = '';

    for (let j = 0; j < GAME_WIDTH; j++) {
      let charType;
      let char;

      if (
        i >= GAME_HEIGHT - characterToDraw.length - floorJumpHeight &&
        i < GAME_HEIGHT - floorJumpHeight &&
        j >= floorPlayerPosition &&
        j < floorPlayerPosition + CHARACTER_LENGTH
      ) {
        const characterRow = characterToDraw[i - (GAME_HEIGHT - characterToDraw.length - floorJumpHeight)];
        charType = 'character';
        char = characterRow[j - floorPlayerPosition];
      } else if (
        i === GAME_HEIGHT - 1 &&
        j >= obstacle.position &&
        j < obstacle.position + (obstacle.isBonus ? 1 : obstaclePatterns[obstacle.patternIndex].length)
      ) {
        charType = `obstacle${obstacle.isBonus ? ' bonus' : ''}`;
        char = obstacle.isBonus ? '@' : '+';
      } else if (i < backgroundPattern.length) {
        charType = 'background';
        char = backgroundPattern[i][(j + Math.floor(backgroundPosition)) % backgroundPattern[i].length];
      } else {
        charType = 'space';
        char = ' ';
      }

      if (charType !== currentType) {
        if (currentType !== '') {
          line += `<span class="${currentType}">${currentChars}</span>`;
        }
        currentType = charType;
        currentChars = char;
      } else {
        currentChars += char;
      }
    }

    if (currentType !== '') {
      line += `<span class="${currentType}">${currentChars}</span>`;
    }

    lines += line + '\n';
  }





  lines += '_'.repeat(START_OBSTACLE_POSITION) + '\n';
  lines = '<span class="score">Score: ' +
    player.score +
    ' Level: ' +
    player.level +
    ' '.repeat(GAME_WIDTH - player.score.toString().length - player.level.toString().length - player.topScore.toString().length - player.topLevel.toString().length - 38) +
    'Top Score: ' + player.topScore + ' Top Level: ' + player.topLevel + '</span>\n' + lines;

  gameArea.innerHTML = lines;

  if (player.isFirstGame && obstacle.position > 0 && !player.isGameOver) {
    if (player.startCountdown === null) {
      player.startCounter = 5;
      player.startCountdown = setInterval(() => {
        player.startCounter--;
        if (player.startCounter <= 0) {
          clearInterval(player.startCountdown);
          player.startCountdown = null;
          player.isFirstGame = false;
          obstacle.position = START_OBSTACLE_POSITION;
          obstacle.patternIndex = Math.floor(Math.random() * obstaclePatterns.length);
        }
        draw();
      }, 1000);
    } else {
      gameArea.innerHTML = gameArea.innerHTML += `<span class="game-control">Press SPACEBAR to jump!</span><span class="bonus"> Pick up '@' for bonus!</span><span class="game-control"> Game starts in ${player.startCounter}...</span>`;
    }
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


