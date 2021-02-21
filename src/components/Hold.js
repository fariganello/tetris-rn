import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../tetriminos';

const Hold = ({ hold }) => {
  const shape = hold[0];

  return (
    <View style={styles.holdContainer}>
      <Text style={styles.title}>HOLD</Text>
      {shape &&
        shape.map((row, rowIndex) => {
          return (
            <View style={styles.row} key={rowIndex} testID="hold-row">
              {row.map((cell, cellIndex) => (
                <View
                  style={[
                    styles.cell,
                    cell
                      ? { backgroundColor: colors[cell - 1] }
                      : { backgroundColor: 'white' },
                  ]}
                  key={cellIndex}
                  testID="hold-cell"
                />
              ))}
            </View>
          );
        })}
    </View>
  );
};

const styles = StyleSheet.create({
  holdContainer: {
    position: 'absolute',
    left: -80,
    bottom: 320,
    height: 80,
    width: 80,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  cell: {
    width: 15,
    height: 15,
    borderColor: 'white',
    borderTopWidth: 1,
    borderLeftWidth: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

export default Hold;
