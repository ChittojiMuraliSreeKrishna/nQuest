import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import JSEncrypt from 'jsencrypt';
import { AppRegistry, LogBox } from 'react-native';
import * as CryptoJS from 'react-native-crypto-js';
import 'react-native-gesture-handler';
import { ENCRYPTION } from './src/commonUtils/Base';
import App from './src/components/App';
LogBox.ignoreAllLogs(true);

// For request
if (ENCRYPTION) {
  // Public Key
  var encrypt = new JSEncrypt();
  // Copied from https://github.com/travist/jsencrypt
  var publicKey = `MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEApcFVlWr1VQzgo4pqJYIPoSmdu2VGHv2gnupRs4eCVJTajzSnLORVs/DBSKg0qIaBdiFnmjB7agn1XiRb1ekgwC7Zys4fzIJlW53knV280jDvQ7uBn7NiIp+NUY0ZPZqk2Uh1YD9VhzS8y+wWmjTw6qdmr0ZtzQrmH1R0HHk3WHXLaOF/7rWpo7UOZtXTJfMeTpQ9Jvz/Lv8aS/oSLunY+6Xtf6qClAEg1zt7fvkMoFfiXL9mJXvDlqSFNx2sUaiZ/UL7e40aWMpuJihmUGvMp2Z97RtzXZekNk+2q4s7wg/cOnQcuJSD/yuh2HFoC2B0IOgtXk5Q+RXfMWhQoaImWQIDAQAB`;
  // Assign our encryptor to utilize the public key.
  encrypt.setPublicKey(publicKey);
}

// Request Interceptors
axios.interceptors.request.use(
  (req) => {
    // const key = "23KAVfsyYqk+hxye3/LDM59Ts8hTiAs=";
    // var encryptedKey = encrypt.encrypt(key);
    // Encryption
    if (ENCRYPTION) {
      var text = JSON.stringify(req.data);
      const key = "23KAVfsyYqk+hxye3/LDM59Ts8hTiAs=";
      const iv = "0000000000000000";
      var encryptedKey = encrypt.encrypt(key);
      // console.log({ encryptedKey });
      const cipher = CryptoJS.AES.encrypt(text, CryptoJS.enc.Utf8.parse(key), {
        iv: CryptoJS.enc.Utf8.parse(iv), // parse the IV
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC,
      });
      var encryptedBytes = cipher.toString();
    }

    var clientId = null;
    AsyncStorage.getItem("custom:clientId1").then(value => {
      clientId = value ? value : "0";
      // console.log({ clientId });
    });
    // req.headers = {
    //   "Content-Type": "application/json",
    // };
    var finalToken = null;
    AsyncStorage.getItem("tokenkey").then(value => {
      finalToken = value.replace(' " ', '');
      console.log({ finalToken });
    });


    // req.headers.clientId = clientId ? clientId : "0";
    if (finalToken !== null) {
      req.headers.Authorization = "Bearer" + " " + finalToken;
      req.headers.clientId = clientId ? clientId : "0";
    }

    // req.headers[ "Content-Type" ] = "application/json";
    // req.headers[ "enc-key" ] = encryptedKey;
    if (ENCRYPTION) {
      // req.headers = {
      //   "Content-Type": "application/json",
      //   "enc-key": encryptedKey,
      //   "Authorization": "Bearer" + " " + finalToken,
      //   "clientId": clientId ? clientId : "0"
      // };
      req.headers[ "Content-Type" ] = "application/json";
      req.headers[ "enc-key" ] = encryptedKey;
      req.headers[ "Authorization" ] = "Bearer" + " " + finalToken;
      req.headers[ "clientId" ] = clientId ? clientId : "0";

      req.data = encryptedBytes;
    }
    console.log(req.headers);
    console.log({ req });
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
    error.response.data && error.response.data.message && alert(error.response.data.message);
  }

  if (error.response.status === 500) {
    error.response.data && error.response.data.error && alert(error.response.data.error)
      ||
      error.response.data && error.response.data.message && alert(error.response.data.message);
  }


});
AppRegistry.registerComponent('main', () => App);
