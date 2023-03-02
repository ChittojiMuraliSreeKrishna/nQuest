import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import Privilages from '../components/URM/Privilages';
import SplashScreen from '../components/Welcome/SplashScreen';
import AuthNavigation from './AuthNavigation';
import HomeNavigation from './HomeNavigation';

const Stack = createStackNavigator();
function AppRoute() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* <Stack.Screen name="Privilages"
          options={{ headerShown: false }}
          component={Privilages}
        /> */}
        <Stack.Screen name="SplashScreen" options={{ headerShown: false }} component={SplashScreen} />
        <Stack.Screen name="AuthNavigation" options={{ headerShown: false }} component={AuthNavigation} />
        <Stack.Screen name="HomeNavigation" options={{ headerShown: false }} component={HomeNavigation} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default AppRoute;
