import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import ForgotPassword from '../components/Login/ForgotPassword';
import Login from '../components/Login/Login';
import SelectClient from '../components/Login/SelectClient';
import SelectStore from '../components/Login/SelectStore';
import SignUp from '../components/Login/SignUp';
import UpdateNewpassword from '../components/Login/UpdateNewpassword';
import ManagePassword from '../components/URM/ManagePassword';
import RegisterClient from '../components/URM/RegisterClient';
import LanguageSelection from '../components/Welcome/LanguageSelection';
import Welcome from '../components/Welcome/Welcome';
import HomeNavigation from './HomeNavigation';


const Stack = createStackNavigator();
export default class AuthNavigation extends React.Component {
  render () {
    return (

      <Stack.Navigator>
        <Stack.Screen name="LanguageSelection" options={{ headerShown: false }} component={LanguageSelection} />
        <Stack.Screen name="Welcome" options={{ headerShown: false }} component={Welcome} />
        <Stack.Screen name="Login" options={{ headerShown: false }} component={Login} />
        <Stack.Screen name="RegisterClient" options={{ headerShown: false }} component={RegisterClient} />
        <Stack.Screen name="SignUp" options={{ headerShown: false }} component={SignUp} />
        <Stack.Screen name="HomeNavigation" options={{ headerShown: false }} component={HomeNavigation} />
        <Stack.Screen name="SelectStore" options={{ headerShown: false }} component={SelectStore} />
        <Stack.Screen name="ForgotPassword" options={{ headerShown: false }} component={ForgotPassword} />
        <Stack.Screen name="UpdateNewpassword" options={{ headerShown: false }} component={UpdateNewpassword} />
        <Stack.Screen name="ManagePassword" options={{ headerShown: false }} component={ManagePassword} />
        <Stack.Screen name="SelectClient" options={{ headerShown: false }} component={SelectClient} />
      </Stack.Navigator>
    );
  }

}
