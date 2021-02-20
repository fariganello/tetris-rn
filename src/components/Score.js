import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const Score = ({ score }) => {
  return (
    <View style={styles.score}>
      <Text style={styles.title}>SCORE</Text>
      <Text>{score}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  score: {
    position: 'absolute',
    right: 0,
    bottom: 100,
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

export default Score;
