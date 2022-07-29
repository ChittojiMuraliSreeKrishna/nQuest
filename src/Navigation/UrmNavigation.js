import React, { Component } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import UserManagement from '../components/URM/UserManagement';
import AddUser from '../components/URM/AddUser';
import CreateRole from '../components/URM/CreateRole';
import EditUser from '../components/URM/EditUser';
import EditRole from '../components/URM/EditRole';
import Privilages from '../components/URM/Privilages';
import AddStore from '../components/Accounting/AddStore';
import TopBar from './TopBar';
import BottomTabBar from './BottomTabBar';
import BottomTabNav from './BottomTabNav';

const Stack = createStackNavigator();
export default class UrmNavigation extends Component { 
  render() {
    return (
      <>
      {/* <TopBar {...this.props}/> */}
      <Stack.Navigator initialRouteName='UserManagement' >
        <Stack.Screen name='UserManagement' options={{ headerShown: false }} component={UserManagement} />
        <Stack.Screen name='AddUser' options={{ headerShown: false }} component={AddUser} />
        <Stack.Screen name='AddStore' options={{ headerShown: false }} component={AddStore} />
        <Stack.Screen name='CreateRole' options={{ headerShown: false }} component={CreateRole} />
        <Stack.Screen name='EditUser' options={{ headerShown: false }} component={EditUser} />
        <Stack.Screen name='EditRole' options={{ headerShown: false }} component={EditRole} />
        <Stack.Screen name='Privilages' options={{ headerShown: false }} component={Privilages} />
      </Stack.Navigator>
      <BottomTabNav {...this.props}/>
      </>
    )
  }
}
2