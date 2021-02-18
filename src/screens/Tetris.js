import React, {useState, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {GameLoop} from 'react-native-game-engine';
import {
  checkCollision,
  clearGrid,
  createGrid,
  generateTetriminosBag,
  handleMove,
  modifyPiece,
  updateGrid,
} from '../logic';

const Tetris = () => {
  const [piecesBag, setPiecesBag] = useState(generateTetriminosBag());

  const [piece, setPiece] = useState({
    tetrimino: piecesBag[0],
    orientation: 0,
    coordinates: {x: 4, y: 22},
  });

  const [grid, setGrid] = useState(createGrid());

  const [touchEvent, setTouchEvent] = useState(false);

  // useEffect(() => {
  //   const tick = setInterval(() => {
  //     handleMove(setPiece, {moveX: 0, moveY: 1});
  //   }, 2000);
  // }, []);

  const updateHandler = ({touches}) => {
    // if (piecesBag.length <= 1) {
    //   setPiecesBag((prevBag) => [...prevBag].push(generateTetriminosBag()));
    // }
    const {tetrimino, orientation} = piece;

    const move = touches.find((x) => x.type === 'move');

    setGrid(clearGrid(grid));

    if (move) {
      setTouchEvent(true);
      setTimeout(() => {
        // now set to false later (example here is 1/2 sec)
        setTouchEvent(false);
      }, 200);

      const dirX = move && move.delta.pageX > 0 ? 1 : -1;
      const collision = checkCollision(piece, orientation, grid, {
        moveX: dirX,
        moveY: 0,
      });

      if (!touchEvent && !collision) {
        handleMove(piece, setPiece, setGrid, {moveX: dirX, moveY: 0});
      }
    }

    const press = touches.find((x) => x.type === 'press');

    if (press) {
      const newOrientation =
        orientation === tetrimino.shape.length - 1 ? 0 : orientation + 1;
      if (!checkCollision(piece, newOrientation, grid, {moveX: 0, moveY: 0})) {
        setPiece((prevPiece) => modifyPiece(prevPiece, 0, 0, newOrientation));
      } else if (
        !checkCollision(piece, newOrientation, grid, {moveX: 1, moveY: 0})
      ) {
        setPiece((prevPiece) => modifyPiece(prevPiece, 1, 0, newOrientation));
      } else if (
        !checkCollision(piece, newOrientation, grid, {moveX: -1, moveY: 0})
      ) {
        setPiece((prevPiece) => modifyPiece(prevPiece, -1, 0, newOrientation));
      }
    }

    setGrid((prevGrid) => updateGrid(piece, prevGrid));
  };

  return (
    <GameLoop onUpdate={updateHandler}>
      <View style={styles.grid}>
        {grid.map((row, rowIndex) => {
          return (
            rowIndex >= 20 && (
              <View style={styles.row} key={rowIndex} testID="tetris-row">
                {row.map((cell, cellIndex) => (
                  <View
                    style={[
                      styles.cell,
                      cell.value
                        ? {backgroundColor: piece.tetrimino.color}
                        : {backgroundColor: 'black'},
                    ]}
                    key={cellIndex}
                    testID="tetris-cell"
                  />
                ))}
              </View>
            )
          );
        })}
      </View>
    </GameLoop>
  );
};

const styles = StyleSheet.create({
  grid: {
    flex: 1,
    flexDirection: 'column',
    marginHorizontal: 90,
    justifyContent: 'flex-start',
    height: 100,
    marginTop: 100,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  cell: {
    width: 25,
    height: 25,
    borderColor: 'white',
    borderTopWidth: 1,
    borderLeftWidth: 1,
  },
});

export default Tetris;
