import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { AppRegistry, LogBox } from 'react-native';
// import * as CryptoJS from 'react-native-crypto-js';
import 'react-native-gesture-handler';
import App from './src/components/App';
LogBox.ignoreAllLogs(true);

// // For requests
axios.interceptors.request.use(
  (req) => {
    AsyncStorage.getItem("tokenkey").then((value) => {
      var finalToken = value.replace('"', '');
      const clientId = JSON.parse(AsyncStorage.getItem("custom:clientId1"))
      console.log({ clientId })
      // axios.defaults.headers.common = { 'Authorization': 'Bearer' + ' ' + finalToken, 'clientId': clientId ? clientId : 0 };
      req.headers.Authorization = "Bearer" + " " + finalToken
      req.headers.clientId = clientId ? clientId : "0"
    }).catch((err) => {
      this.setState({ loading: false });
      alert(err);
      console.log('There is error getting token');
    });
    // if (ENCRYPTION) {
    //   var text = JSON.stringify(req.data)
    //   const key = '23KAVfsyYqk+hxye3/LDM59Ts8hTiAs='
    //   const iv = '0000000000000000 '
    //   const cipher = CryptoJS.AES.encrypt(text, CryptoJS.enc.Utf8.parse(key), {
    //     iv: CryptoJS.enc.Utf8.parse(iv),
    //     padding: CryptoJS.pad.Pkcs7,
    //     mode: CryptoJS.mode.CBC
    //   })
    //   var encryptedBytes = cipher.toString()
    //   req.data = encryptedBytes;
    return req;
  },
  (err) => {
    return Promise.reject(err);
  }
);


//For response
axios.interceptors.response.use((response) => response, (error) => {
  // if(error.)
  // whatever you want to do with the error
  console.log(error.response.status);
  if (error.response.status === 404) {
    // alert('The requested resource does not exist or has been deleted')
  }

  if (error.response.status === 401) {
    // logOut()
    alert('Please login to access this resource');
  }
  if (error.response.status === 400) {
    error.response.data && error.response.data.message && alert(error.response.data.message)
  }

  if (error.response.status === 500) {
    error.response.data && error.response.data.error && alert(error.response.data.error)
  }

});
AppRegistry.registerComponent('main', () => App);
