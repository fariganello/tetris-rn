import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../tetriminos';

const Next = ({ next }) => {
  return (
    <View style={styles.nextContainer}>
      <Text style={styles.title}>NEXT</Text>
      {next &&
        next.map((row, rowIndex) => {
          return (
            <View style={styles.row} key={rowIndex} testID="next-row">
              {row.map((cell, cellIndex) => (
                <View
                  style={[
                    styles.cell,
                    cell
                      ? { backgroundColor: colors[cell - 1] }
                      : { backgroundColor: 'white' },
                  ]}
                  key={cellIndex}
                  testID="next-cell"
                />
              ))}
            </View>
          );
        })}
    </View>
  );
};

const styles = StyleSheet.create({
  nextContainer: {
    position: 'absolute',
    right: -80,
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

export default Next;
