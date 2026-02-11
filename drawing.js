import { COLORS, GAME_CONFIG } from './constants.js';

function drawSky(ctx, elapsedSeconds) {
  const gradient = ctx.createLinearGradient(0, 0, 0, GAME_CONFIG.height);
  const pulse = Math.sin(elapsedSeconds * 0.24) * 0.05;

  gradient.addColorStop(0, `hsl(204, 86%, ${76 + pulse * 20}%)`);
  gradient.addColorStop(0.7, `hsl(196, 91%, ${88 + pulse * 15}%)`);
  gradient.addColorStop(0.7, '#9acb61');
  gradient.addColorStop(1, '#79a84f');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, GAME_CONFIG.width, GAME_CONFIG.height);

  const moonX = GAME_CONFIG.width - 90 + Math.sin(elapsedSeconds * 0.22) * 18;
  const moonY = 80 + Math.cos(elapsedSeconds * 0.28) * 8;

  ctx.fillStyle = COLORS.moon;
  ctx.beginPath();
  ctx.arc(moonX, moonY, 28, 0, Math.PI * 2);
  ctx.fill();
}

function drawGround(ctx, distance) {
  ctx.fillStyle = '#5f8f45';
  ctx.fillRect(0, GAME_CONFIG.groundY, GAME_CONFIG.width, GAME_CONFIG.height - GAME_CONFIG.groundY);

  ctx.strokeStyle = COLORS.groundLine;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(0, GAME_CONFIG.groundY);
  ctx.lineTo(GAME_CONFIG.width, GAME_CONFIG.groundY);
  ctx.stroke();

  ctx.strokeStyle = '#82b45f';
  ctx.lineWidth = 2;
  for (let i = 0; i < 26; i++) {
    const x = (i * 54 - (distance * 1.8) % 54 + GAME_CONFIG.width) % GAME_CONFIG.width;
    ctx.beginPath();
    ctx.moveTo(x, GAME_CONFIG.groundY + 10);
    ctx.lineTo(x - 10, GAME_CONFIG.groundY + 26);
    ctx.stroke();
  }
}

function drawStickman(ctx, player) {
  const bounce = Math.sin(player.runCycle) * (player.isGrounded ? 4 : 1.5);
  const baseY = player.y + bounce;
  const legSwing = Math.sin(player.runCycle * 2.4) * 11;
  const armSwing = Math.sin(player.runCycle * 2.8 + 1.1) * 10;

  ctx.save();
  ctx.translate(player.x, baseY);

  ctx.strokeStyle = '#142437';
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';

  if (player.isSliding) {
    ctx.beginPath();
    ctx.arc(-12, -24, 10, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(-2, -24);
    ctx.lineTo(20, -16);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(12, -16);
    ctx.lineTo(28, -8);
    ctx.moveTo(10, -18);
    ctx.lineTo(20, -2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(-2, -24);
    ctx.lineTo(-20, -12);
    ctx.stroke();

    ctx.restore();
    return;
  }

  ctx.beginPath();
  ctx.arc(0, -68, 11, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(0, -56);
  ctx.lineTo(0, -26);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(0, -45);
  ctx.lineTo(-16 + armSwing * 0.45, -36);
  ctx.moveTo(0, -45);
  ctx.lineTo(16 - armSwing * 0.45, -36);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(0, -26);
  ctx.lineTo(-11 + legSwing, 0);
  ctx.moveTo(0, -26);
  ctx.lineTo(11 - legSwing, 0);
  ctx.stroke();

  ctx.restore();
}

function drawObstacles(ctx, obstacles) {
  obstacles.forEach((obstacle) => {
    ctx.fillStyle = obstacle.color || COLORS.obstacle;
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);

    ctx.fillStyle = obstacle.lane === 'air' ? '#d6b7ff' : COLORS.obstacleTop;
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, 7);

    if (obstacle.lane === 'air') {
      ctx.fillStyle = 'rgba(214, 183, 255, 0.2)';
      ctx.fillRect(obstacle.x + 6, obstacle.y + obstacle.height, obstacle.width - 12, 4);
    }
  });
}

function drawPowerUps(ctx, powerUps) {
  powerUps.forEach((powerUp) => {
    const centerX = powerUp.x + powerUp.size / 2;
    const centerY = powerUp.y + powerUp.size / 2;

    ctx.save();
    ctx.fillStyle = 'rgba(141, 216, 255, 0.22)';
    ctx.beginPath();
    ctx.arc(centerX, centerY, powerUp.size, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#8dd8ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, powerUp.size * 0.45, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#d8f3ff';
    ctx.font = '700 12px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('✦', centerX, centerY + 4);
    ctx.restore();
  });
}

function drawHud(ctx, model) {
  const panelWidth = 430;
  const panelHeight = 96;

  ctx.fillStyle = 'rgba(10, 16, 26, 0.42)';
  ctx.fillRect(16, 16, panelWidth, panelHeight);

  ctx.fillStyle = '#ffffff';
  ctx.font = '700 24px Inter, sans-serif';
  ctx.fillText(`Score ${model.score}`, 26, 46);

  ctx.fillStyle = COLORS.text;
  ctx.font = '600 16px Inter, sans-serif';
  ctx.fillText(`Niveau ${model.level}`, 28, 72);
  ctx.fillText(`Combo x${model.comboMultiplier.toFixed(1)}`, 132, 72);
  ctx.fillText(`Bouclier ${'🛡️'.repeat(model.shieldCharges) || '—'}`, 262, 72);
  if (model.player.isSliding) {
    ctx.fillStyle = '#d9c2ff';
    ctx.fillText('Roulade active', 28, 92);
  }

  ctx.font = '600 14px Inter, sans-serif';
  ctx.fillText(`Meilleur score ${model.bestScore}`, 28, 96);
  ctx.fillText(`Meilleur niveau ${model.bestLevel}`, 228, 96);
}

function drawEffects(ctx, effects) {
  effects.particles.forEach((p) => {
    ctx.save();
    ctx.globalAlpha = Math.max(0, p.life * 1.5);
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x, p.y, 3, 3);
    ctx.restore();
  });

  if (effects.scorePop) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, effects.scorePop.life * 1.4);
    ctx.fillStyle = effects.scorePop.color || COLORS.bonus;
    ctx.font = '700 24px Inter, sans-serif';
    ctx.fillText(effects.scorePop.text, effects.scorePop.x, effects.scorePop.y);
    ctx.restore();
  }

  if (effects.hitFlash > 0) {
    ctx.save();
    ctx.globalAlpha = effects.hitFlash * 0.5;
    ctx.fillStyle = COLORS.danger;
    ctx.fillRect(0, 0, GAME_CONFIG.width, GAME_CONFIG.height);
    ctx.restore();
  }
}

function drawOverlay(ctx, title, subtitle, hint) {
  ctx.fillStyle = COLORS.overlay;
  ctx.fillRect(0, 0, GAME_CONFIG.width, GAME_CONFIG.height);

  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.font = '800 46px Inter, sans-serif';
  ctx.fillText(title, GAME_CONFIG.width / 2, 150);

  ctx.font = '500 24px Inter, sans-serif';
  ctx.fillText(subtitle, GAME_CONFIG.width / 2, 195);

  ctx.fillStyle = COLORS.info;
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

    if (model.effects.shake > 0) {
      const shakeX = (Math.random() - 0.5) * model.effects.shake;
      const shakeY = (Math.random() - 0.5) * model.effects.shake;
      ctx.save();
      ctx.translate(shakeX, shakeY);
    }

    drawSky(ctx, model.elapsedSeconds);
    drawGround(ctx, model.distance);
    drawObstacles(ctx, model.obstacles);
    drawPowerUps(ctx, model.powerUps);
    drawStickman(ctx, model.player);
    drawHud(ctx, model);
    drawEffects(ctx, model.effects);

    if (model.effects.shake > 0) {
      ctx.restore();
    }

    if (model.status === 'ready') {
      drawOverlay(
        ctx,
        'Stickman Runner Turbo',
        'Enchaîne des combos, récupère des boucliers et vise un high score.',
        'Clique sur Démarrer ou appuie sur ESPACE/↑. Bas/S = roulade.'
      );
    }

    if (model.status === 'paused') {
      drawOverlay(
        ctx,
        'Pause',
        `Score: ${model.score} • Niveau: ${model.level}`,
        'Appuie sur P ou Reprendre pour continuer.'
      );
    }

    if (model.status === 'gameover') {
      drawOverlay(
        ctx,
        'Partie terminée',
        `Score final: ${model.score} • Niveau: ${model.level}`,
        'Appuie sur R ou sur Rejouer.'
      );
    }
  }
}
