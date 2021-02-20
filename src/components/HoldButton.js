import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

const HoldButton = ({ title, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.holdButton}>
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  holdButton: {
    position: 'absolute',
    left: 5,
    bottom: 10,
    height: 70,
    width: 70,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007bff',
    borderRadius: 20,
    elevation: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default HoldButton;
