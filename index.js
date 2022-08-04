import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { AppRegistry, LogBox } from 'react-native';
import 'react-native-gesture-handler';
import App from './src/components/App';
LogBox.ignoreAllLogs(true);

// // For requests
axios.interceptors.request.use(
   (req) => {
      AsyncStorage.getItem("tokenkey").then((value) => {
         var finalToken = value.replace('"', '');
         // console.log(finalToken);
         axios.defaults.headers.common = { 'Authorization': 'Bearer' + ' ' + finalToken };
         //console.log("Request to server:::::::::::::::::::" + 'Bearer' + ' ' + finalToken);
      }).catch((err) => {
         this.setState({ loading: false });
         // alert('There is error getting token');
          alert(err);

         console.log('There is error getting token');
      });
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

      alert('Please login to access this resource');
   }
   if(error.response.status === 400){
      alert(error.response.data.message)
   }

});
AppRegistry.registerComponent('main', () => App);
