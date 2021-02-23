import React from 'react';
import { tetriminos } from './tetriminos';
import Grid from './components/Grid';
import {
  START_POSITION_X,
  START_POSITION_Y,
  START_UPDATE_FREQUENCY,
} from './constants';

//GENERATE PIECES

export const shuffleString = (string) => {
  const array = string.split('');
  const { length } = array;

  for (var i = length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = array[i];
    array[i] = array[j];
    array[j] = tmp;
  }
  return array.join('');
};

export const generateTetriminosBag = () => {
  const bag = [];
  const tetriminoString = shuffleString('IOTSZJL');

  for (let i = 0; i < 7; i++) {
    bag.push(tetriminos[tetriminoString[i]].shapes);
  }

  return bag;
};

//STAGE

export const createNewBlankLine = () => {
  const newLine = [];

  for (let i = 0; i < 10; i++) {
    newLine[i] = { value: 0, state: 'clear' };
  }

  return newLine;
};

export const createGrid = () => {
  const newGrid = [];

  for (let i = 0; i < 40; i++) {
    newGrid[i] = createNewBlankLine();
  }

  return newGrid;
};

export const clearGrid = (grid) => {
  const newGrid = [...grid];

  for (let y = 0; y < newGrid.length; y++) {
    for (let x = 0; x < newGrid[y].length; x++) {
      newGrid[y][x].value = grid[y][x].state === 'clear' ? 0 : grid[y][x].value;
    }
  }

  return newGrid;
};

export const clearLines = (screen) => {
  const { grid } = screen;
  const newGrid = [...grid];
  let lines = 0;

  for (let y = 0; y < newGrid.length; y++) {
    let clear = true;

    for (let x = 0; x < newGrid[y].length; x++) {
      if (newGrid[y][x].state === 'clear') {
        clear = false;
      }
    }

    if (clear) {
      newGrid.splice(y, 1);
      newGrid.unshift(createNewBlankLine());
      lines++;
    }
  }

  screen.grid = newGrid;
  return lines;
};

export const updateGrid = (tetrimino, grid) => {
  const { shapes, coordinates, orientation } = tetrimino;
  const shape = shapes[orientation];
  const newGrid = [...grid];

  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (shape[y][x]) {
        newGrid[y + coordinates.y + 1][x + coordinates.x + -1] = {
          value: shape[y][x],
          state: 'clear',
        };
      }
    }
  }
  return newGrid;
};

export const mergePiece = (tetrimino, grid) => {
  const { coordinates, shapes, orientation } = tetrimino;
  const shape = shapes[orientation];
  const newGrid = [...grid];

  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (shape[y][x]) {
        newGrid[y + coordinates.y + 1][x + coordinates.x + -1] = {
          value: shape[y][x],
          state: 'merged',
        };
      }
    }
  }

  return newGrid;
};

// GAME

export const restartGame = (setHold, setNext, setLines, setLevel, setScore) => {
  const initialBag = generateTetriminosBag();
  const initialTetrimino = initialBag.pop();
  const initialGrid = createGrid();

  setHold([]);
  setNext(initialBag[initialBag.length - 1][0]);
  setLines(0);
  setLevel(1);
  setScore(0);

  return {
    screen: { grid: initialGrid, renderer: <Grid /> },
    tetriminosBag: initialBag,
    tetrimino: {
      shapes: initialTetrimino,
      orientation: 0,
      coordinates: { x: START_POSITION_X, y: START_POSITION_Y },
      collisioned: false,
      nextMove: 10,
      updateFrequency: START_UPDATE_FREQUENCY,
      keepLeft: false,
      keepRight: false,
    },
    game: { lines: 0, level: 1, score: 0 },
  };
};

//COLLISIONS

export const checkCollision = (
  tetrimino,
  orientation,
  grid,
  { moveX, moveY }
) => {
  const { coordinates, shapes } = tetrimino;
  const shape = shapes[orientation];

  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (shape[y][x]) {
        if (
          !grid[y + coordinates.y + moveY + 1] ||
          !grid[y + coordinates.y + moveY + 1][x + coordinates.x + moveX - 1] ||
          grid[y + coordinates.y + moveY + 1][x + coordinates.x + moveX - 1]
            .state === 'merged'
        ) {
          return true;
        }
      }
    }
  }
  return false;
};

export const resolveCollision = (
  tetrimino,
  grid,
  game,
  dirX,
  dirY,
  setScore,
  handlePlaySound,
  dispatch,
  event,
  keepMovingDirection
) => {
  const { coordinates, orientation } = tetrimino;

  const collision = checkCollision(tetrimino, orientation, grid, {
    moveX: dirX,
    moveY: dirY,
  });

  if (!collision) {
    tetrimino = resolveMove(
      tetrimino,
      game,
      dirX,
      dirY,
      setScore,
      handlePlaySound,
      dispatch,
      event,
      keepMovingDirection
    );
  } else if (dirY === 1 && coordinates.y < 19) {
    dispatch(event);
  } else if (dirY === 1) {
    tetrimino.collisioned = true;
  }
  return tetrimino;
};

// PIECE MOVEMENT
export const updateTetrimino = (tetrimino, moveX, moveY, orientation) => {
  return {
    ...tetrimino,
    coordinates: {
      x: tetrimino.coordinates.x + moveX,
      y: tetrimino.coordinates.y + moveY,
    },
    orientation,
  };
};

export const resetTetrimino = (tetrimino, shapes, x, y, orientation) => {
  return {
    ...tetrimino,
    shapes,
    coordinates: {
      x,
      y,
    },
    orientation,
  };
};

const dispatchEvent = (keepMoving, dispatch, event) => {
  if (keepMoving) {
    dispatch(event);
  }
};

export const resolveMove = (
  tetrimino,
  game,
  dirX,
  dirY,
  setScore,
  handlePlaySound,
  dispatch,
  event,
  keepMovingDirection
) => {
  const { orientation } = tetrimino;
  const { level, score } = game;

  tetrimino = updateTetrimino(tetrimino, dirX, dirY, orientation);

  handlePlaySound && handlePlaySound('move', false);

  if (dirY) {
    const newScore = calculateScore('softDrop', level, 1);
    game.score = score + newScore;
    setScore(game.score);
  }

  if (dirX) {
    if (keepMovingDirection && tetrimino[keepMovingDirection]) {
      setTimeout(
        dispatchEvent,
        800,
        tetrimino[keepMovingDirection],
        dispatch,
        event
      );
    } else {
      dispatch(event);
    }
  }

  tetrimino.game = game;
  return tetrimino;
};

export const applyRotation = (tetrimino, grid, type) => {
  const { shapes, orientation } = tetrimino;
  let newOrientation = 0;
  let dirX = 0;
  let dirY = 0;
  let collision = true;

  if (type === 'rotate-clockwise') {
    newOrientation = orientation === shapes.length - 1 ? 0 : orientation + 1;
  } else if (type === 'rotate-counter-clockwise') {
    newOrientation = orientation === 0 ? shapes.length - 1 : orientation - 1;
  }
  if (
    !checkCollision(tetrimino, newOrientation, grid, {
      moveX: 0,
      moveY: 0,
    })
  ) {
    collision = false;
  } else if (
    !checkCollision(tetrimino, newOrientation, grid, {
      moveX: 1,
      moveY: 0,
    })
  ) {
    dirX = 1;
    collision = false;
  } else if (
    !checkCollision(tetrimino, newOrientation, grid, {
      moveX: -1,
      moveY: 0,
    })
  ) {
    dirX = -1;
    collision = false;
  }
  if (!collision) {
    tetrimino = updateTetrimino(tetrimino, dirX, dirY, newOrientation);
  }
  return tetrimino;
};

// SCORE

export const calculateScore = (event, level, cells) => {
  let score = 0;

  switch (event) {
    case 'single': {
      score = 100 * level;
      break;
    }
    case 'double': {
      score = 300 * level;
      break;
    }
    case 'triple': {
      score = 500 * level;
      break;
    }
    case 'tetris': {
      score = 800 * level;
      break;
    }
    case 'softDrop': {
      score = 1 * cells;
      break;
    }
    case 'hardDrop': {
      score = 2 * cells;
      break;
    }
  }

  return score;
};
