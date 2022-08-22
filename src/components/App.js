import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as Font from 'expo-font';
import React from 'react';
import { StyleSheet } from 'react-native';
import { MD3LightTheme as DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { openDatabase } from 'react-native-sqlite-storage';
import AppRoute from '../Navigation/AppRoute';


// Connction to access the pre-populated db
const db = openDatabase({ name: 'tbl_items.db', createFromLocation: 1 });

const theme = {
  ...DefaultTheme,
  myOwnProperty: true,
  colors: {
    primary: '#ED1C24',
    secondary: '#353C40',
    white: '#FFFFFF',
    black: '#000000',
    grey_ultralight: '#F5F5F5',
    grey_lighter: '#F8F8F8',
    grey_light: '#B6B7B8',
    grey: '#B9B9B9',
    grey_dark: '#898989',
    grey_darker: '#4D4F5C',
  }
}
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      getListOfBarcodes: []
    }
  }

  async componentDidMount() {
    AsyncStorage.getItem("tokenkey").then((value) => {
      var finalToken = value.replace('"', '');
      // console.log(finalToken);
      axios.defaults.headers.common = { 'Authorization': 'Bearer' + ' ' + finalToken }
      // console.log("Request to server:::::::::::::::::::" + 'Bearer' + ' ' + finalToken);
    })

    Font.loadAsync({
      bold: require("./assets/fonts/ProductSans-Bold.ttf"),
      regular: require("./assets/fonts/ProductSans-Regular.ttf"),
      medium: require("./assets/fonts/ProductSans-Medium.ttf"),
      semibold: require("./assets/fonts/Metropolis-SemiBold.otf"),
    });
  }



  render() {
    return (
      <PaperProvider theme={theme}>
        <AppRoute />
      </PaperProvider>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
