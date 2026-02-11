import test from 'node:test';
import assert from 'node:assert/strict';

import { intersects, calculateSpawnCooldown } from '../obstacle.js';
import { computeScore } from '../game.js';
import { GAME_CONFIG } from '../constants.js';

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
