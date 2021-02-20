import React from 'react';
import {StyleSheet, View} from 'react-native';
import {colors} from '../tetriminos';

const Grid = ({grid}) => {
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
                            ? {backgroundColor: colors[cell.value - 1]}
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
    )
}

const styles = StyleSheet.create({
    grid: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'flex-end',
      alignItems: 'flex-start',
      height: 100,
      width: 200,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'center',
    },
    cell: {
      width: 20,
      height: 20,
      borderColor: 'white',
      borderTopWidth: 1,
      borderLeftWidth: 1,
    },
  });

export default Grid;
