import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

const GameOverModal = ({
  gameOverModalVisible,
  setGameOverModalVisible,
  setRunning,
  engine,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={gameOverModalVisible}
      onRequestClose={() => {
        setGameOverModalVisible(!gameOverModalVisible);
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>GAME OVER!</Text>
          <View style={styles.buttonWrapper}>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => {
                setGameOverModalVisible(!gameOverModalVisible);
                engine.dispatch({ type: 'restart-game' });
                setRunning(true);
              }}
            >
              <Text style={styles.textStyle}>RESTART</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              /*onPress={() => setGameOverModalVisible(!gameOverModalVisible)}*/
            >
              <Text style={styles.textStyle}>MENU</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonWrapper: {
    flexDirection: 'row',
    width: 180,
    justifyContent: 'space-between',
  },
  button: {
    minWidth: 80,
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalTitle: {
    fontSize: 30,
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default GameOverModal;
