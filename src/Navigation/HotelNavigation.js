import { Text, View } from 'react-native';
import React, { Component } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TableManageMent from '../components/Inventory/TableManageMent';
import RoomManagement from '../components/Inventory/RoomManagement';
const Stack = createStackNavigator();

export class HotelNavigation extends Component {
    render() {
        return (
            <Stack.Navigator>
                <Stack.Screen
                    name="Table Management"
                    options={{ headerShown: false }}
                    component={TableManageMent}
                />
                <Stack.Screen
                    name="Room Management"
                    options={{ headerShown: false }}
                    component={RoomManagement}
                />
            </Stack.Navigator>
        );
    }
}

export default HotelNavigation;