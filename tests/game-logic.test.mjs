import test from 'node:test';
import assert from 'node:assert/strict';

import { intersects, calculateSpawnCooldown } from '../obstacle.js';
import { computeScore } from '../game.js';
import { GAME_CONFIG } from '../constants.js';
import { StickmanPlayer } from '../player.js';

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
