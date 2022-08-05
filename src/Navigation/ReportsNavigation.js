import React, { Component } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import Reports from '../components/Reports/Reports';
import TopBar from './TopBar';
import BottomTabNav from './BottomTabNav';

const Stack = createStackNavigator();
export default class ReportsNavigation extends Component {
    render() {
        return (
            <>
                {/* <TopBar {...this.props} /> */}
                <Stack.Navigator initialRouteName='Reports' >
                    <Stack.Screen name='Reports' options={{ headerShown: false }} component={Reports} />
                </Stack.Navigator>
                {/* <BottomTabNav {...this.props} /> */}
            </>
        )
    }
}
2