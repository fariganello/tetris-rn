import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

const PauseModal = ({
  pauseModalVisible,
  setPauseModalVisible,
  running,
  setRunning,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={pauseModalVisible}
      onRequestClose={() => {
        setPauseModalVisible(!pauseModalVisible);
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>PAUSED</Text>
          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={() => {
              setPauseModalVisible(!pauseModalVisible);
              setRunning(!running);
            }}
          >
            <Text style={styles.textStyle}>RESUME</Text>
          </Pressable>
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

export default PauseModal;
