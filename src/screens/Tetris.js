import React, {useState} from 'react';
import {GameEngine, dispatch } from 'react-native-game-engine';
import {Alert, StatusBar, StyleSheet, Text, View} from "react-native";
import Grid from '../components/Grid';
import Lines from '../components/Lines';
import {
  checkCollision,
  clearGrid,
  clearLines,
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

  const [running, setRunning] = useState(true);
  const [engine, setEngine] = useState(null);
  const [lines, setLines] = useState(0);

  onEvent = (e) => {
    if (e.type === "game-over") {
        setRunning(false);
        Alert.alert("Game Over");
    }
  } 
  const updateHandler = (entities, {touches, dispatch, events}) => {
    let {screen, tetrimino, tetriminosBag, lines} = entities;
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
        const dirX = move && move.delta.pageX > 0 ? 1 : -1;
        const collision = checkCollision(tetrimino, orientation, grid, {
          moveX: dirX,
          moveY: 0,
        });
  
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
      const clearedLines = clearLines(screen);
      setLines(lines + clearedLines);
      tetrimino.collisioned = false;
      const newTetrimino = tetriminosBag.pop();
      tetrimino = resetTetrimino(tetrimino, newTetrimino, 4, 18, 0);
    }
    
    return {
      screen,
      tetrimino,
      tetriminosBag,
      lines,
    };
  };

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <View style={styles.sidebar}>
          <Text>LEFT</Text>
        </View>
        <GameEngine 
        ref={(ref) => setEngine(ref)}
        systems={[ updateHandler ]}
        entities={{
          tetrimino: { 
            shapes: initialTetrimino,
            orientation: 0,
            coordinates: {x: 4, y: 18},
            collisioned: false,
            nextMove: 10,
            updateFrequency: 10,
          },
          tetriminosBag: initialBag,
          lines: 0,
          screen: {grid: initialGrid, renderer: <Grid/>},
        }}
        onEvent={onEvent}
        running={running}>
          <StatusBar hidden={true} />
          <Lines linesCounter={lines ? lines : 0}/>
        </GameEngine>
      </View>
      <View style={styles.bottomBar}>
        <Text>BOTTOM BAR</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex:1,
    flexDirection: "column",
  },
  sidebar: {
    width: 80,
    backgroundColor: "blue",
    height: 400,
  },
  topContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: 'flex-end',
  },
  bottomBar: {
    backgroundColor: "yellow",
    height: 80,
  }
});

export default Tetris;
