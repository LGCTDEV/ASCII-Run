import test from 'node:test';
import assert from 'node:assert/strict';

import { intersects, calculateSpawnCooldown } from '../obstacle.js';
import { computeScore } from '../game.js';
import { GAME_CONFIG } from '../constants.js';
import { StickmanPlayer } from '../player.js';
import { RunnerGame } from '../game.js';

test('intersects detects overlap', () => {
  const a = { x: 10, y: 10, width: 20, height: 20 };
  const b = { x: 25, y: 25, width: 20, height: 20 };
  assert.equal(intersects(a, b), true);
});

test('intersects ignores separated rectangles', () => {
  const a = { x: 10, y: 10, width: 20, height: 20 };
  const b = { x: 40, y: 40, width: 20, height: 20 };
  assert.equal(intersects(a, b), false);
});

test('computeScore preserves bonus points over time', () => {
  assert.equal(computeScore(10, 15), Math.floor(10 * GAME_CONFIG.pointsPerSecond) + 15);
  assert.equal(computeScore(10.1, 15) >= computeScore(10, 15), true);
});

test('computeScore applies combo multiplier to bonus score only', () => {
  const base = Math.floor(12 * GAME_CONFIG.pointsPerSecond);
  assert.equal(computeScore(12, 30, 1.5), base + 45);
});

test('spawn cooldown guarantees minimum reaction window', () => {
  const level = 12;
  const speed = 700;
  const width = 68;
  const cooldown = calculateSpawnCooldown(level, speed, width, 0);
  const safeCooldown = (width + speed * GAME_CONFIG.minReactionSeconds) / speed;

  assert.equal(cooldown >= safeCooldown, true);
});


test('player can slide only while grounded', () => {
  const player = new StickmanPlayer();

  assert.equal(player.slide(), true);
  assert.equal(player.isSliding, true);

  player.jump();
  assert.equal(player.slide(), false);
});

test('player slide ends after duration and restores standing hitbox', () => {
  const player = new StickmanPlayer();
  const standingHeight = player.height;

  player.slide();
  assert.equal(player.height < standingHeight, true);

  player.update(player.slideDuration + 0.05);
  assert.equal(player.isSliding, false);
  assert.equal(player.height, standingHeight);
});


function createIdleInput() {
  return {
    consumePauseToggle: () => false,
    consumeTap: () => false,
    consumeJump: () => false,
    consumeSlide: () => false,
    consumeStart: () => false,
    consumeRestart: () => false
  };
}

test('combo decay uses last combo action timestamp', () => {
  const game = new RunnerGame(createIdleInput(), { render: () => {} });
  game.status = 'running';
  game.combo = 6;
  game.comboMultiplier = 1 + Math.min(2, game.combo * 0.08);
  game.elapsedSeconds = 10;
  game.lastComboActionAt = 7.7;

  game.obstacleManager.update = () => {};
  game.powerUpManager.update = () => {};
  game.obstacleManager.items = [];
  game.powerUpManager.items = [];

  game.update(0.3);

  assert.equal(game.combo < 6, true);
});

test('combo does not decay right after obstacle pass action', () => {
  const game = new RunnerGame(createIdleInput(), { render: () => {} });
  game.status = 'running';
  game.combo = 6;
  game.comboMultiplier = 1 + Math.min(2, game.combo * 0.08);
  game.elapsedSeconds = 10;
  game.lastComboActionAt = 9.9;

  game.obstacleManager.update = () => {};
  game.powerUpManager.update = () => {};
  game.obstacleManager.items = [];
  game.powerUpManager.items = [];

  game.update(0.3);

  assert.equal(game.combo, 6);
});

test('syncControls supports partial UI bindings', () => {
  const pauseButton = {
    disabled: false,
    textContent: '',
    setAttribute(name, value) {
      this[name] = value;
    }
  };

  const game = new RunnerGame(createIdleInput(), { render: () => {} }, { pauseButton });
  game.status = 'paused';

  game.syncControls();

  assert.equal(pauseButton.disabled, false);
  assert.equal(pauseButton.textContent, 'Reprendre');
  assert.equal(pauseButton['aria-pressed'], 'true');
});
