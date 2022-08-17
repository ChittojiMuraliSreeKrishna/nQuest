import { createStackNavigator } from "@react-navigation/stack";
import React, { Component } from "react";
import Reports from "../components/Reports/Reports";

const Stack = createStackNavigator();
export default class ReportsNavigation extends Component {

    render() {
        return (
                <Stack.Navigator initialRouteName='Reports' >
                    <Stack.Screen name='Reports' options={{ headerShown: false }} component={Reports} />
                </Stack.Navigator>
            </>
        )
    }

}
;
