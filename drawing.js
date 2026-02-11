import { COLORS, GAME_CONFIG } from './constants.js';

function drawSky(ctx, elapsedSeconds) {
  const t = elapsedSeconds * 0.04;

  ctx.fillStyle = '#d8f3ff';
  ctx.beginPath();
  ctx.arc(830, 66, 28, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = COLORS.moon;
  ctx.beginPath();
  ctx.arc(120 + Math.sin(t) * 12, 74, 25, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = 'rgba(255,255,255,0.75)';
  for (let i = 0; i < 3; i++) {
    const x = (i * 330 + (elapsedSeconds * (18 + i * 8))) % (GAME_CONFIG.width + 180) - 140;
    const y = 58 + i * 34;

    ctx.beginPath();
    ctx.ellipse(x, y, 54, 20, 0, 0, Math.PI * 2);
    ctx.ellipse(x + 38, y + 3, 38, 15, 0, 0, Math.PI * 2);
    ctx.ellipse(x - 28, y + 3, 36, 15, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawGround(ctx, distance) {
  ctx.fillStyle = '#88bb58';
  ctx.fillRect(0, GAME_CONFIG.groundY, GAME_CONFIG.width, GAME_CONFIG.height - GAME_CONFIG.groundY);

  ctx.strokeStyle = COLORS.groundLine;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, GAME_CONFIG.groundY + 1);
  ctx.lineTo(GAME_CONFIG.width, GAME_CONFIG.groundY + 1);
  ctx.stroke();

  const dashSpeed = distance * 0.5;
  for (let i = -1; i < 22; i++) {
    const x = ((i * 54) - (dashSpeed % 54) + GAME_CONFIG.width) % GAME_CONFIG.width;
    ctx.fillStyle = '#6a9445';
    ctx.fillRect(x, GAME_CONFIG.groundY + 24, 30, 4);
  }
}

function drawStickman(ctx, player) {
  const bob = player.isGrounded ? Math.sin(player.runCycle) * 2.5 : -3;
  const baseX = player.x;
  const baseY = player.y + bob;

  ctx.strokeStyle = '#181818';
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';

  ctx.beginPath();
  ctx.arc(baseX, baseY - 68, 13, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(baseX, baseY - 55);
  ctx.lineTo(baseX, baseY - 25);
  ctx.stroke();

  const armSwing = Math.sin(player.runCycle) * 15;
  ctx.beginPath();
  ctx.moveTo(baseX, baseY - 46);
  ctx.lineTo(baseX - 18, baseY - 36 - armSwing * 0.2);
  ctx.moveTo(baseX, baseY - 45);
  ctx.lineTo(baseX + 18, baseY - 36 + armSwing * 0.2);
  ctx.stroke();

  const legSwing = Math.sin(player.runCycle) * 10;
  ctx.beginPath();
  ctx.moveTo(baseX, baseY - 24);
  ctx.lineTo(baseX - 16, baseY + legSwing);
  ctx.moveTo(baseX, baseY - 24);
  ctx.lineTo(baseX + 16, baseY - legSwing);
  ctx.stroke();
}

function drawObstacles(ctx, obstacles) {
  obstacles.forEach((obstacle) => {
    ctx.fillStyle = COLORS.obstacle;
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);

    ctx.fillStyle = COLORS.obstacleTop;
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, 8);
  });
}

function drawHud(ctx, state) {
  ctx.fillStyle = 'rgba(255,255,255,0.65)';
  ctx.fillRect(12, 12, 280, 86);

  ctx.fillStyle = COLORS.text;
  ctx.font = '700 20px Inter, sans-serif';
  ctx.fillText(`Score: ${state.score}`, 24, 40);

  ctx.font = '600 18px Inter, sans-serif';
  ctx.fillText(`Niveau: ${state.level}`, 24, 66);
  ctx.fillText(`Meilleur: ${state.bestScore}`, 24, 90);
}

function drawOverlay(ctx, title, subtitle, hint) {
  ctx.fillStyle = COLORS.overlay;
  ctx.fillRect(0, 0, GAME_CONFIG.width, GAME_CONFIG.height);

  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.font = '800 48px Inter, sans-serif';
  ctx.fillText(title, GAME_CONFIG.width / 2, 150);

  ctx.font = '500 24px Inter, sans-serif';
  ctx.fillText(subtitle, GAME_CONFIG.width / 2, 195);

  ctx.font = '500 20px Inter, sans-serif';
  ctx.fillText(hint, GAME_CONFIG.width / 2, 235);
  ctx.textAlign = 'start';
}

export class Renderer {
  constructor(ctx) {
    this.ctx = ctx;
  }

  render(model) {
    const { ctx } = this;
    ctx.clearRect(0, 0, GAME_CONFIG.width, GAME_CONFIG.height);

    drawSky(ctx, model.elapsedSeconds);
    drawGround(ctx, model.distance);
    drawObstacles(ctx, model.obstacles);
    drawStickman(ctx, model.player);
    drawHud(ctx, model);

    if (model.status === 'ready') {
      drawOverlay(
        ctx,
        'Stickman Runner',
        'Évite les obstacles et garde le rythme.',
        'Appuie sur ESPACE, ↑ ou clique pour commencer.'
      );
    }

    if (model.status === 'gameover') {
      drawOverlay(
        ctx,
        'Game Over',
        `Score final: ${model.score} • Niveau: ${model.level}`,
        'Appuie sur R pour relancer une partie.'
      );
    }
  }
}
