import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { createStackNavigator } from "@react-navigation/stack";
import Availability from '../components/Kitchen/Availability';
import MngOrder from '../components/Kitchen/MngOrder';
import Blank from '../components/Home/Blank';
import { BackHandler } from 'react-native';

const Stack = createStackNavigator();
export class KitchenNavigation extends Component {

    componentDidMount () {
        const backHandler = BackHandler.addEventListener("hardwareBackPress", this.backAction());
        return () => backHandler.remove();
    }

    backAction () {
        return true;
    }


    render () {
        return (
            <>
                <Stack.Navigator initialRouteName='Blank'>
                    <Stack.Screen
                        name="Blank"
                        options={{ headerShown: false }}
                        component={Blank}
                    />
                    <Stack.Screen
                        name="Availability"
                        options={{ headerShown: false }}
                        component={Availability}
                    />
                    <Stack.Screen
                        name="Manage Orders"
                        options={{ headerShown: false }}
                        component={MngOrder}
                    />

                </Stack.Navigator>
            </>
        );
    }
}

export default KitchenNavigation;
