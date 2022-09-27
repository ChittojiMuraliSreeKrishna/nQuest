import { createStackNavigator } from '@react-navigation/stack';
import React, { Component } from 'react';
import { View } from 'react-native';
import Ticket from '../components/TicketingPortal/Ticket';

const Stack = createStackNavigator();
export class TicketingNavigation extends Component {
  render () {
    return (
      <View>
        <Stack.Navigator>
          <Stack.Screen name="Ticket Details" options={{ headerShown: false }} component={Ticket} />
        </Stack.Navigator>
      </View>
    );
  }
}

export default TicketingNavigation;
