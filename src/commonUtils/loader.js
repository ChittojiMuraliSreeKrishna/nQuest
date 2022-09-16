import React from 'react';
import {
  ActivityIndicator, Modal, StyleSheet,
  View
} from 'react-native';
import Device from "react-native-device-detection";

const Loader = props => {
  const {
    loading,
    ...attributes
  } = props;

  return (
    <Modal
      transparent={true}
      animationType={'none'}
      visible={true}
      onRequestClose={() => { console.log('close modal') }}>
      <View style={styles.modalBackground}>
        <View style={Device.isTablet ? styles.activityIndicatorWrapper_tablet : styles.activityIndicatorWrapper_mobile}>
          <ActivityIndicator size="large" color="#1D7791" />
          {/* <ActivityIndicator
            animating={true} /> */}
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040'
  },
  activityIndicatorWrapper_mobile: {
    backgroundColor: '#FFFFFF',
    height: 100,
    width: 100,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  activityIndicatorWrapper_tablet: {
    backgroundColor: '#FFFFFF',
    height: 150,
    width: 130,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around'
  }
});

export default Loader;
