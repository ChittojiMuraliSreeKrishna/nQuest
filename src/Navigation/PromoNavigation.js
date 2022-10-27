import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { BackHandler } from "react-native";
import Blank from '../components/Home/Blank';
import AddLoyalty from "../components/Promotions/AddLoyalty";
import AddPool from "../components/Promotions/AddPool";
import AddPromo from "../components/Promotions/AddPromo";
import EditPool from "../components/Promotions/EditPool";
import ListOfPromo from "../components/Promotions/listOfPromotions";
import Promo from "../components/Promotions/Promo";
const Stack = createStackNavigator();
export default class ProductsNavigation extends React.Component {

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
        <Stack.Navigator initialRouteName="Blank">
          <Stack.Screen
            name="Blank"
            options={{ headerShown: false }}
            component={Blank}
          />
          <Stack.Screen
            name="Manage Promotions"
            options={{ headerShown: false }}
            component={Promo}
          />
          <Stack.Screen
            name="List Of Promotions"
            options={{ headerShown: false }}
            component={ListOfPromo}
          />
          <Stack.Screen
            name="AddPool"
            options={{ headerShown: false }}
            component={AddPool}
          />
          <Stack.Screen
            name="EditPool"
            options={{ headerShown: false }}
            component={EditPool}
          />
          <Stack.Screen
            name="AddPromo"
            options={{ headerShown: false }}
            component={AddPromo}
          />
          <Stack.Screen
            name="AddLoyalty"
            options={{ headerShown: false }}
            component={AddLoyalty}
          />
        </Stack.Navigator>
      </>
    );
  }
}
