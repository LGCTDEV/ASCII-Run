//constants.js
const GAME_WIDTH = 80;
const GAME_HEIGHT = 20;
const CHARACTER_LENGTH = 3;
const MAX_POSITION = 27;
const START_OBSTACLE_POSITION = 80;
const MAX_JUMP_HEIGHT = 5.5;
const GRAVITY = 0.007;


const characterRunFrames = [
  [
    '  O ',
    '/\\>',
    '\'| ',
    '>\\ ',
    '\' \\'
  ],
  [
    '  o ',
    '<|\\',
    ' /\'',
    ' >>',
    '/ \''
  ],
  [
    ' O  ',
    '<|>',
    '\'|\'',
    '/ \\',
    '| |'
  ]
];

const jumpCharacter = [
  ' \'O\'',
  '/|/',
  ' ! ',
  '> >',
  '- -'
];

const obstaclePatterns = [
  '*',
  '**',
  '***',
  '****',
  '*****',
  '******',
  '*******',
  '*******'
];

const backgroundsPatterns = [ 
 [
    "                                                          *                     ",
    "           *                                  *                             *   ",
    "                                                                   *            ",
    "                                *                                               ",
    "                                                                     *          ",
    "                  *                                                             ",
    "                                                                                ",
    "                                                        *                       ",
    "   *                                     *                                      ",
	"                                                                     *          ",
    "                  *                                                             ",
    "                                                                                ",
    "                                                        *                       ",

  ],
  
   [
    "                                                            .-~~~-.             ",
    "                                   *                .- ~ ~-(       )_ _         ",
    "                                                   /                     ~ -.   ",
    "                                                  |                           \\",
    "            *                                      \\                         .'",
    "                                                      ~- . _____________ . -~   ",
    "                                              *                             *   ",
    "                                                                                ",
    "                                *                                               ",
    "                                                                     *          ",
    "                  *                                                             ",
    "                                                                                ",
    "                                                        *                       ",
    "   *                                     *                                      "
  ],

  
 
  // ...more backgrounds...
];

const MAX_BACKGROUND_HEIGHT = Math.max(...backgroundsPatterns.map(pattern => pattern.length));
const BACKGROUND_POSITION = GAME_HEIGHT - MAX_BACKGROUND_HEIGHT;