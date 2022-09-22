import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import Loader from '../../commonUtils/loader';

const Blank = () => {
  const [ loading, setLoading ] = useState(true);
  const [ message, setMessage ] = useState("");
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
      setMessage("Servers are loading please wait or restart the App");
    }, 10000);
  });

  return (
    <View>
      {loading && <Loader loading={loading} />}
      <Text>{message}</Text>
    </View>
  );
};

export default Blank;
