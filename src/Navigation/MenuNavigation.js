import React, { Component } from 'react';
import { Text, View } from 'react-native';
import MenuCategory from '../components/CustomerPortal/MenuCategory';
import OrderStatus from '../components/CustomerPortal/OrderStatus';
import { createStackNavigator } from "@react-navigation/stack";
import CustomerNavigation from './CustomerNavigation';
const Stack = createStackNavigator();


class MenuNavigation extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    componentDidMount () {
        // alert(this.props.showTable)
    }

    render () {
        // alert(this.props.showTable)
        return (
            <Stack.Navigator>
                {this.props.showTable && (
                    alert("hey")
                )}
                <Stack.Screen
                    name="Menu"
                    options={{ headerShown: false }}
                    component={MenuCategory}
                // showTable={this.props.showTable}
                />
                <Stack.Screen
                    name="Order Status"
                    options={{ headerShown: false }}
                    component={OrderStatus}
                />
            </Stack.Navigator>
        );
    }
}

export default MenuNavigation;
