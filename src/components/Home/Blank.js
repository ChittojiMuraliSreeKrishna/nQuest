import React, { useEffect, useState } from 'react';
import { BackHandler, ToastAndroid, View } from 'react-native';
import Loader from '../../commonUtils/loader';

const Blank = () => {
  const [ loading, setLoading ] = useState(true);
  const [ message, setMessage ] = useState("");
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 10000);
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  });

  const backAction = (e) => {
    ToastAndroid.showWithGravity('Back button is pressed', ToastAndroid.SHORT, ToastAndroid.TOP);
    return true;
  };

  return (
    <View>
      {loading && <Loader loading={loading} />}
    </View>
  );
};

export default Blank;
