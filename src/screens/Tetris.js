import React, {useState} from 'react';
import {GameEngine, dispatch } from 'react-native-game-engine';
import { AntDesign, Feather } from '@expo/vector-icons'; 
import {Alert, StatusBar, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import Grid from '../components/Grid';
import Lines from '../components/Lines';
import Next from '../components/Next';
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
  const [next, setNext] = useState(initialTetrimino[0]);
console.log("DDDDDFFF", next)
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
    
    if (events.length){
      for(let i=0 ; i < events.length ; i++){
        let dirX = 0;
        let dirY = 0;

        if(/^move/.test(events[i].type)){
          if (events[i].type === "move-down"){
            dirY = 1;
          } else if (events[i].type === "move-left"){
            dirX = -1;
          } else if (events[i].type === "move-right"){
            dirX = 1;
          }

          const collision = checkCollision(tetrimino, orientation, grid, {
            moveX: dirX,
            moveY: dirY,
          });

          if (!collision) {
            tetrimino = updateTetrimino(tetrimino, dirX, dirY, orientation);
          } else if (dirY === 1 && coordinates.y < 20) {
            dispatch({ type: "game-over" })
          } else if (dirY === 1) {
            tetrimino.collisioned = true;    
          }
        }
          
        if(/^rotate/.test(events[i].type)){
          let newOrientation = 0;
          if (events[i].type === "rotate-clockwise"){
            newOrientation =
              orientation === shapes.length - 1 ? 0 : orientation + 1;
          } else if (events[i].type === "rotate-counter-clockwise") {
            newOrientation =
            orientation === 0 ? shapes.length - 1 : orientation - 1;
          }
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

        if (events[i].type === "hard-drop"){
          while(!checkCollision(tetrimino, orientation, grid, {moveX: 0, moveY: 1})) {
            tetrimino = updateTetrimino(tetrimino, 0, 1, orientation);
          }
          tetrimino.collisioned = true;
        }
          
      }
    }

    tetrimino.nextMove--;

    if (tetriminosBag.length === 1) {
      tetriminosBag = [...generateTetriminosBag(),...tetriminosBag];
    }

    if (nextMove === 0){
      tetrimino.nextMove = updateFrequency;

      dispatch({ type: "move-down" });
    }

    if(!collisioned) {
      screen.grid = clearGrid(grid);
  
      const move = touches.find((x) => x.type === 'move');

      if (move) {
        const dirX = move && move.delta.pageX > 0 ? 1 : -1;
        
        if(dirX < 0) {
          dispatch({ type: "move-left" });
        } else {
          dispatch({ type: "move-right" });
        }
      }
  
      const press = touches.find((x) => x.type === 'press');
  
      if (press) {
        dispatch({ type: "rotate-clockwise" });
      }

      screen.grid = updateGrid(tetrimino, grid);

    } else {
      screen.grid = mergePiece(tetrimino, grid);
      const clearedLines = clearLines(screen);
      setLines(lines + clearedLines);
      tetrimino.collisioned = false;
      const newTetrimino = tetriminosBag.pop();
      tetrimino = resetTetrimino(tetrimino, newTetrimino, 4, 18, 0);
      setNext(newTetrimino[0]);
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
          <Text></Text>
        </View>
        <GameEngine 
        style={styles.gameContainer}
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
          <Next next={next} />
          <Lines linesCounter={lines ? lines : 0}/>
        </GameEngine>
      </View>
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.buttonContainer} onPress={() => { engine.dispatch({ type: "rotate-clockwise" })} }>
          <AntDesign style={{transform: [{ rotateY: '180deg' }]}} name="back" size={50} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonContainer} onPress={() => { engine.dispatch({ type: "move-left" })} }>
          <Feather name="arrow-left" size={50} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonContainer} onPress={() => { engine.dispatch({ type: "move-down" })}} onLongPress={() => { engine.dispatch({ type: "hard-drop" })}}>
          <Feather name="arrow-down" size={50} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonContainer} onPress={() => { engine.dispatch({ type: "move-right" })} }>
          <Feather name="arrow-right" size={50} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonContainer} onPress={() => { engine.dispatch({ type: "rotate-counter-clockwise" })} }>
          <AntDesign name="back" size={50} color="black" />
        </TouchableOpacity>
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
    height: 400,
  },
  topContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: 'flex-end',
  },
  bottomBar: {
    height: 80,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'space-between',
    borderTopColor: "black",
    borderTopWidth: 1,
  },
  buttonContainer: {
    width: 50,
    height: 50,
  },
  gameContainer: {
    flex: 1,
  }
});

export default Tetris;
