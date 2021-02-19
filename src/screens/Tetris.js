import React, {useState} from 'react';
import {GameEngine, dispatch } from 'react-native-game-engine';
import {Alert} from "react-native";
import Grid from '../components/Grid';
import {
  checkCollision,
  clearGrid,
  createGrid,
  generateTetriminosBag,
  mergePiece,
  resetTetrimino,
  updateTetrimino,
  updateGrid,
} from '../logic';

const Tetris = () => {
  const initialBag = generateTetriminosBag();
  const initialTetrimino = initialBag.pop();
  const initialGrid = createGrid();
  // const [piecesBag, setPiecesBag] = useState(generateTetriminosBag());

  // const [piece, setPiece] = useState({
  //   tetrimino: piecesBag.shift(),
  //   orientation: 0,
  //   coordinates: {x: 4, y: 20},
  // });

  // const [grid, setGrid] = useState(createGrid());

  // const [touchEvent, setTouchEvent] = useState(false);

  // useEffect(() => {
  //   const tick = setInterval(() => {
     
  //   }, 1000);
  // }, []);
  const [running, setRunning] = useState(true);

  onEvent = (e) => {
    if (e.type === "game-over") {
        setRunning(false);
        Alert.alert("Game Over");
    }
  } 

  const updateHandler = (entities, {touches, dispatch, events}) => {
    let {screen, tetrimino, tetriminosBag} = entities;
    const {grid} = screen;
    const {shapes, orientation, coordinates, collisioned, nextMove, updateFrequency} = tetrimino;
   
    tetrimino.nextMove--;

    if (tetriminosBag.length === 1) {
      tetriminosBag = [...generateTetriminosBag(),...tetriminosBag];
    }

    if (nextMove === 0){
      tetrimino.nextMove = updateFrequency;

      const collision = checkCollision(tetrimino, orientation, grid, {
            moveX: 0,
            moveY: 1,
      });
    
      if (!collision) {
        tetrimino = updateTetrimino(tetrimino, 0, 1, orientation);
      } else if(coordinates.y < 20) {
        dispatch({ type: "game-over" })
      } else {
        tetrimino.collisioned = true;    
      }
    }

    if(!collisioned) {
      const move = touches.find((x) => x.type === 'move');

      screen.grid = clearGrid(grid);
  
      if (move) {
        // setTouchEvent(true);
        // setTimeout(() => {
        //   // now set to false later (example here is 1/2 sec)
        //   setTouchEvent(false);
        // }, 200);
  
        const dirX = move && move.delta.pageX > 0 ? 1 : -1;
        const collision = checkCollision(tetrimino, orientation, grid, {
          moveX: dirX,
          moveY: 0,
        });
  
        // if (!touchEvent && !collision) {
        if (!collision) {
          tetrimino = updateTetrimino(tetrimino, dirX, 0, orientation);
        }
      }
  
      const press = touches.find((x) => x.type === 'press');
  
      if (press) {
        const newOrientation =
          orientation === shapes.length - 1 ? 0 : orientation + 1;
        if (!checkCollision(tetrimino, newOrientation, grid, {moveX: 0, moveY: 0})) {
          tetrimino = updateTetrimino(tetrimino, 0, 0, newOrientation);
        } else if (
          !checkCollision(tetrimino, newOrientation, grid, {moveX: 1, moveY: 0})
        ) {
          tetrimino = updateTetrimino(tetrimino, 1, 0, newOrientation);
        } else if (
          !checkCollision(tetrimino, newOrientation, grid, {moveX: -1, moveY: 0})
        ) {
          tetrimino = updateTetrimino(tetrimino, -1, 0, newOrientation);
        }
      }
      screen.grid = updateGrid(tetrimino, grid);

    } else {
      screen.grid = mergePiece(tetrimino, grid);
      tetrimino.collisioned = false;
      const newTetrimino = tetriminosBag.pop();
      tetrimino = resetTetrimino(tetrimino, newTetrimino, 4, 18, 0);
    }
    

    return {
      screen,
      tetrimino,
      tetriminosBag,
    };
  };

  return (
    <GameEngine 
    systems={[ updateHandler ]}
    entities={{
      screen: {grid: initialGrid, renderer: <Grid />},
      tetrimino: { 
        shapes: initialTetrimino,
        orientation: 0,
        coordinates: {x: 4, y: 18},
        collisioned: false,
        nextMove: 10,
        updateFrequency: 10,
      },
      tetriminosBag: initialBag,
    }}
    onEvent={this.onEvent}
    running={running}>
    </GameEngine>
  );
};

export default Tetris;
