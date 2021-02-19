import {tetriminos} from './tetriminos';

//GENERATE PIECES

export const generateRandomTetrimino = () => {
  const tetriminoString = 'IOTSZJL';

  const randomIndex = tetriminoString[Math.floor(Math.random() * 7)];
  return tetriminos[randomIndex].shapes;
};

export const generateTetriminosBag = () => {
  const bag = [];

  for (let i = 0; i < 7; i++) {
    bag.push(generateRandomTetrimino());
  }

  return bag;
};

//STAGE

export const createNewBlankLine = () => {
  const newLine = [];

  for (let i = 0; i < 10; i++) {
    newLine[i] = {value: 0, state: 'clear'};
  }

  return newLine;
}

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
  const {grid} = screen;
  const newGrid = [...grid];
  let lines = 0;

  for (let y = 0; y < newGrid.length; y++) {
    let clear = true;
    
    for (let x = 0; x < newGrid[y].length; x++) {
      if(newGrid[y][x].state === 'clear') {
        clear = false;
      }
    }

    if(clear){
      newGrid.splice(y, 1);
      newGrid.unshift(createNewBlankLine());
      lines++;
    }
  }

  screen.grid = newGrid;
  return lines
};

export const updateGrid = (tetrimino, grid) => {
  const {shapes, coordinates, orientation} = tetrimino;
  const shape = shapes[orientation];
  const newGrid = [...grid];

  for (let y = 0; y < shape.length; y++) {
    for (
      let x = 0;
      x < shape[y].length;
      x++
    ) {
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
  const {coordinates, shapes, orientation} = tetrimino;
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

//COLLISIONS

export const checkCollision = (tetrimino, orientation, grid, {moveX, moveY}) => {
  const {coordinates, shapes} = tetrimino;
  const shape = shapes[orientation];

  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (shape[y][x]) {
        if (
          !grid[y + coordinates.y + moveY + 1] ||
          !grid[y + coordinates.y + moveY + 1][x + coordinates.x + moveX - 1] ||
          grid[y + coordinates.y + moveY + 1][x + coordinates.x + moveX - 1].state === 'merged'
        ) {
          return true;
        }
      }
    }
  }
  return false;
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

// export const handleMove = (setPiece, {moveX, moveY}) => {
//   setPiece((prevPiece) =>
//     updateTetrimino(prevPiece, moveX, moveY, prevPiece.orientation),
//   );
// };
