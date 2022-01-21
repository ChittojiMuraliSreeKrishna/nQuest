import { createStackNavigator } from '@react-navigation/stack'
import React, { Component } from 'react'
import Home from '../components/tabbar/Home';
import Statitics from '../components/tabbar/Statitics';

const Stack = createStackNavigator();
export default class HomeNav extends React.Component {
    render() {
        return (

            <Stack.Navigator>
                <Stack.Screen name="Home" options={{headerShown: false}} component={Home} />
                <Stack.Screen name="Statitics" options={{headerShown: false}} component={Statitics} />
               
            </Stack.Navigator>

        );
    }

}

