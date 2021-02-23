import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { colors } from '../tetriminos';
import { MAX_COLUMNS, MAX_ROWS, SIDEBAR_WIDTH } from '../constants';

const windowWidth = Dimensions.get('window').width;
const cellWidth = (windowWidth - SIDEBAR_WIDTH * 2) / MAX_COLUMNS;
console.log("CELL WIDTH", cellWidth)
const Grid = ({ grid }) => {
  return (
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
                      ? { backgroundColor: colors[cell.value - 1] }
                      : { backgroundColor: 'black' },
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
  );
};

const styles = StyleSheet.create({
  grid: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cell: {
    width: cellWidth,
    height: cellWidth,
    borderColor: 'white',
    borderTopWidth: 1,
    borderLeftWidth: 1,
  },
});

export default Grid;
