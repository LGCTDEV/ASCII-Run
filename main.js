import { GAME_CONFIG } from './constants.js';
import { InputController } from './input.js';
import { Renderer } from './drawing.js';
import { RunnerGame } from './game.js';

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

if (!ctx) {
  throw new Error('Canvas 2D context indisponible.');
}

canvas.width = GAME_CONFIG.width;
canvas.height = GAME_CONFIG.height;

const input = new InputController(canvas);
const renderer = new Renderer(ctx);
const game = new RunnerGame(input, renderer);

game.frame();
