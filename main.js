import { GAME_CONFIG } from './constants.js';
import { InputController } from './input.js';
import { Renderer } from './drawing.js';
import { RunnerGame } from './game.js';

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

if (!ctx) {
  throw new Error('Contexte Canvas 2D indisponible.');
}

canvas.width = GAME_CONFIG.width;
canvas.height = GAME_CONFIG.height;

const controls = {
  startButton: document.getElementById('start-btn'),
  jumpButton: document.getElementById('jump-btn'),
  slideButton: document.getElementById('slide-btn'),
  pauseButton: document.getElementById('pause-btn'),
  restartButton: document.getElementById('restart-btn')
};

const input = new InputController(canvas, controls);
const renderer = new Renderer(ctx);
const game = new RunnerGame(input, renderer, controls);

game.frame();
