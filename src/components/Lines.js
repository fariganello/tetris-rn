import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const Lines = ({ linesCounter }) => {
  return (
    <View style={styles.linesCounter}>
      <Text style={styles.title}>LINES</Text>
      <Text>{linesCounter}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  linesCounter: {
    position: 'absolute',
    right: -80,
    bottom: 0,
    height: 50,
    width: 80,
    alignSelf: 'flex-end',
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Lines;
