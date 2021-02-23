import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { SIDEBAR_WIDTH } from '../constants';

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
    left: 10,
    bottom: 10,
    height: 60,
    width: 60,
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
