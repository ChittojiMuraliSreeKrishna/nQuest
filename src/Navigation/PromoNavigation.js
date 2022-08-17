import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import AddLoyalty from "../components/Promotions/AddLoyalty";
import AddPool from "../components/Promotions/AddPool";
import AddPromo from "../components/Promotions/AddPromo";
import EditPool from "../components/Promotions/EditPool";
import ListOfPromo from "../components/Promotions/listOfPromotions";
import ManagePromo from "../components/Promotions/managePromo";
import Promo from "../components/Promotions/Promo";
import Pramotions from "../components/Promotions/promotions";
const Stack = createStackNavigator();
export default class ProductsNavigation extends React.Component {

    render() {
        return (
            <>
            <Stack.Navigator>
                <Stack.Screen name="Pramotions" options={{ headerShown: false }} component={Pramotions} />
                <Stack.Screen name="ListOfPromo" options={{ headerShown: false }} component={ListOfPromo} />
                <Stack.Screen name="ManagePromo" options={{ headerShown: false }} component={ManagePromo} />

                <Stack.Screen name="Promo" options={{ headerShown: false }} component={Promo} />
                <Stack.Screen name="AddPool" options={{ headerShown: false }} component={AddPool} />
                <Stack.Screen name="EditPool" options={{ headerShown: false }} component={EditPool} />
                <Stack.Screen name="AddPromo" options={{ headerShown: false }} component={AddPromo} />
                <Stack.Screen name="AddLoyalty" options={{ headerShown: false }} component={AddLoyalty} />
            </Stack.Navigator>
            </>
        );
    }
}
