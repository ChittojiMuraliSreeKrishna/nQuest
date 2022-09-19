import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import Loader from '../../commonUtils/loader';

const Blank = () => {
  const [ loading, setLoading ] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 10000);
  });
  return (
    <View>
      {loading && <Loader loading={loading} />}
    </View>
  );
};

export default Blank;
