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

//GENERATE STAGE

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

//COLLISIONS

export const checkCollision = (piece, grid, {moveX, moveY}) => {
  for (let y = 0; y < piece.tetrimino.shape[0].length; y++) {
    for (let x = 0; x < piece.tetrimino.shape[0][y].length; x++) {
      if (piece.tetrimino.shape[0][y][x] === 1) {
        if (
          !grid[y + piece.coordinates.y + moveY] ||
          !grid[y + piece.coordinates.y + moveY][
            x + piece.coordinates.x + moveX - 1
          ]
        ) {
          return true;
        }
      }
    }
  }
  return false;
};

// PIECE MOVEMENT

export const handleMove = (setPiece, {moveX, moveY}) => {
  setPiece((prevPiece) => {
    return {
      ...prevPiece,
      coordinates: {
        x: prevPiece.coordinates.x + moveX,
        y: prevPiece.coordinates.y + moveY,
      },
    };
  });
};
