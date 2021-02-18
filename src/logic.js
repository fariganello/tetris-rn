import tetriminos from './tetriminos';

//GENERATE PIECES

export const generateRandomTetrimino = () => {
  const tetriminoString = 'IOTSZJL';

  const randomIndex = tetriminoString[Math.floor(Math.random() * 7)];
  return tetriminos[randomIndex];
};

export const generateTetriminosBag = () => {
  const bag = [];

  for (let i = 0; i < 7; i++) {
    bag.push(generateRandomTetrimino());
  }

  return bag;
};

//STAGE

export const createGrid = () => {
  const newGrid = [];

  for (let i = 0; i < 40; i++) {
    newGrid[i] = [];

    for (let j = 0; j < 10; j++) {
      newGrid[i][j] = {value: 0, state: 'clear'};
    }
  }
  return newGrid;
};

export const clearGrid = (grid) => {
  const newGrid = [...grid];

  for (let y = 0; y < newGrid.length; y++) {
    for (let x = 0; x < newGrid[y].length; x++) {
      newGrid[y][x].value = grid[y][x].state === 'clear' ? 0 : 1;
    }
  }
  return newGrid;
};

export const updateGrid = (piece, grid) => {
  const newGrid = [...grid];

  for (let y = 0; y < piece.tetrimino.shape[piece.orientation].length; y++) {
    for (
      let x = 0;
      x < piece.tetrimino.shape[piece.orientation][y].length;
      x++
    ) {
      if (piece.tetrimino.shape[piece.orientation][y][x] === 1) {
        newGrid[y + piece.coordinates.y][x + piece.coordinates.x + -1] = {
          value: 1,
          state: 'clear',
        };
      }
    }
  }
  return newGrid;
};

//COLLISIONS

export const checkCollision = (piece, orientation, grid, {moveX, moveY}) => {
  const {coordinates, tetrimino} = piece;
  const shape = tetrimino.shape[orientation];

  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (shape[y][x] === 1) {
        if (
          !grid[y + coordinates.y + moveY] ||
          !grid[y + coordinates.y + moveY][x + coordinates.x + moveX - 1]
        ) {
          return true;
        }
      }
    }
  }
  return false;
};

// PIECE MOVEMENT
export const modifyPiece = (piece, moveX, moveY, orientation) => {
  return {
    ...piece,
    coordinates: {
      x: piece.coordinates.x + moveX,
      y: piece.coordinates.y + moveY,
    },
    orientation,
  };
};

export const handleMove = (piece, setPiece, setGrid, {moveX, moveY}) => {
  setPiece((prevPiece) =>
    modifyPiece(prevPiece, moveX, moveY, prevPiece.orientation),
  );
};
