import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import SplashScreen from '../components/Welcome/SplashScreen';
import AuthNavigation from './AuthNavigation';
import HomeNavigation from './HomeNavigation';
import TopBarNavigation from './TopBarNavigation';

const Stack = createStackNavigator();
function AppRoute() {
    return (
        <NavigationContainer>
            <Stack.Navigator>   
                <Stack.Screen name="SplashScreen" options={{ headerShown: false }} component={SplashScreen} />
                <Stack.Screen name="AuthNavigation" options={{ headerShown: false }} component={AuthNavigation} />
                {/* <Stack.Screen name = "BottomTabBar" options={{headerShown:false}} component={BottomTabBar}/> */}
                <Stack.Screen name="HomeNavigation" options={{ headerShown: false }} component={HomeNavigation} />
                <Stack.Screen name="TopBarNavigation" options={{ headerShown: false }} component={TopBarNavigation} />
                {/* <Stack.Screen name="Signup" options={{ headerShown: false }} component={SignUp} /> */}
            </Stack.Navigator>
        </NavigationContainer>
    );
}
export default AppRoute