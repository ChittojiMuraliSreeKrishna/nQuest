import React, { Component } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TopBar from './TopBar';
import Settings from '../components/Profile/Settings';
import NewSaleNavigation from './NewSaleNavigation';
import Home from '../components/Home/Home';
import AccountingNaviagtion from './AccountingNavigation';
import ReportsNavigation from './ReportsNavigation';
import CustomerNavigation from './CustomerNavigation';
import InventoryRetailNavigation from './InventoryRetailNavigation';
import CustomerRetailNavigation from './CustomerRetailNavigation';
import PromoNavigation from './PromoNavigation';
import InventoryNavigation from './InventoryNavigation';
import UrmNavigation from './UrmNavigation';
import BottomTabNav from './BottomTabNav';


const Stack = createStackNavigator();


export default class TopBarNavigation extends Component {
  render() {
    return (
      <>
      <TopBar {...this.props}/>
      <Stack.Navigator >
        <Stack.Screen name="TopBar" options={{ headerShown: false }} component={TopBar} />
        <Stack.Screen name="Home" options={{ headerShown: false }} component={Home} />
        <Stack.Screen name="PromoNavigation" options={{ headerShown: false }} component={PromoNavigation} />
        <Stack.Screen name="InventoryNavigation" options={{ headerShown: false }} component={InventoryNavigation} />
        <Stack.Screen name="UrmNavigation" options={{ headerShown: false }} component={UrmNavigation} />
        <Stack.Screen name="ReportsNavigation" options={{ headerShown: false }} component={ReportsNavigation} />
        <Stack.Screen name="AccountingNaviagtion" options={{ headerShown: false }} component={AccountingNaviagtion} />
        <Stack.Screen name="CustomerNavigation" options={{ headerShown: false }} component={CustomerNavigation} />
        <Stack.Screen name="CustomerRetailNavigation" options={{ headerShown: false }} component={CustomerRetailNavigation} />
        <Stack.Screen name="NewSaleNavigation" options={{ headerShown: false }} component={NewSaleNavigation} />
        <Stack.Screen name="InventoryRetailNavigation" options={{ headerShown: false }} component={InventoryRetailNavigation} />
        <Stack.Screen name="Settings" options={{ headerShown: false }} component={Settings} />
      </Stack.Navigator>
      <BottomTabNav {...this.props}/>
      </>
    );
  }
}
