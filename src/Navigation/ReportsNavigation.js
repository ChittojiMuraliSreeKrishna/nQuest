import { createStackNavigator } from "@react-navigation/stack";
import React, { Component } from "react";
import Blank from '../components/Home/Blank';
import { GoodsReturn } from "../components/Reports/GoodsReturn";
import { ListOfBarcodes } from "../components/Reports/ListOfBarcodes";
import { ListOfEstimationSlip } from '../components/Reports/ListOfEstimationSlip';
import { ListOfPromotions } from "../components/Reports/ListOfPromotions";
import NewSaleReport from "../components/Reports/NewSaleReport";
import ReportsDashboard from "../components/Reports/ReportsDashboard";
import { SalesSumary } from "../components/Reports/SalesSumary";
import TaxReport from "../components/Reports/TaxReport";

const Stack = createStackNavigator();
export default class ReportsNavigation extends Component {
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
            name="List of Barcodes"
            options={{ headerShown: false }}
            component={ListOfBarcodes}
          />
          <Stack.Screen
            name="Goods Return"
            options={{ headerShown: false }}
            component={GoodsReturn}
          />
          <Stack.Screen
            name="List of Promotions"
            options={{ headerShown: false }}
            component={ListOfPromotions}
          />
          <Stack.Screen
            name="Sales Summary"
            options={{ headerShown: false }}
            component={SalesSumary}
          />
          <Stack.Screen
            name="Dashboard"
            options={{ headerShown: false }}
            component={ReportsDashboard}
          />
          <Stack.Screen
            name="New Sale Report"
            options={{ headerShown: false }}
            component={NewSaleReport}
          />
          <Stack.Screen
            name="Tax Report"
            options={{ headerShown: false }}
            component={TaxReport}
          />
          <Stack.Screen
            name="List of Estimation Slips"
            options={{ headerShown: false }}
            component={ListOfEstimationSlip}
          />
        </Stack.Navigator>
      </>
    );
  }
}
2;
