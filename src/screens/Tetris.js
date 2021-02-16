import React, {useState, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {GameLoop} from 'react-native-game-engine';
import {
  checkCollision,
  createGrid,
  generateTetriminosBag,
  handleMove,
} from '../logic';

const Tetris = () => {
  const [piecesBag, setPiecesBag] = useState(generateTetriminosBag());

  const [piece, setPiece] = useState({
    tetrimino: piecesBag[0],
    coordinates: {x: 4, y: 22},
  });

  const grid = createGrid();

  // useEffect(() => {
  //   const tick = setInterval(() => {
  //     handleMove(setPiece, {moveX: 0, moveY: 1});
  //   }, 2000);
  // }, []);

  const updateHandler = ({touches}) => {
    if (piecesBag.length <= 1) {
      setPiecesBag((prevBag) => [...prevBag].push(generateTetriminosBag()));
    }

    const move = touches.find((x) => x.type === 'move');

    if (move) {
      const dirX = move && move.delta.pageX > 0 ? 1 : -1;
      const collision = checkCollision(piece, grid, {moveX: dirX, moveY: 0});

      if (!collision) {
        handleMove(setPiece, {moveX: dirX, moveY: 0});
      }
    }
  };

  piece.tetrimino.shape[0].forEach((row, y) => {
    row.forEach((value, x) => {
      if (value === 1) {
        grid[piece.coordinates.y + y][piece.coordinates.x + x - 1].value = 1;
      }
    });
  });

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
