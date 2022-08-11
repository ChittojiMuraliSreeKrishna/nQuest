import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import React, { Component } from "react";
import { Dimensions } from "react-native";
import HomeIcon from "react-native-vector-icons/Entypo";
import ProfileIcon from "react-native-vector-icons/Feather";
import Icon from "react-native-vector-icons/Octicons";
import ForgotPassword from "../components/Login/ForgotPassword";
import Login from "../components/Login/Login";
import SelectStore from "../components/Login/SelectStore";
import UpdateNewpassword from "../components/Login/UpdateNewpassword";
import Settings from "../components/Profile/Settings";
import ManagePassword from "../components/URM/ManagePassword";
import RegisterClient from "../components/URM/RegisterClient";
import LoginAfterLanguageSelect from "../components/Welcome/LoginAfterLanguageSelect";
import HomeNavigation from "./HomeNavigation";
import ReportsNavigation from "./ReportsNavigation";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const SCREEN_HEIGHT = Dimensions.get("window").height;

class BottomTabBar extends Component {
	render() {
		return (
			<Tab.Navigator
				initialRouteName="Home"
				screenOptions={{
					keyboardHidesTabBar: true,
					labelStyle: {
						fontSize: 12,
					},
					style: {
						backgroundColor: "#fff",
						color: "#dddddd",
						height:
							Platform.OS === "android"
								? SCREEN_HEIGHT / 11
								: SCREEN_HEIGHT / 9,
						borderTopWidth: 2,
					},
					indicatorStyle: {
						width: 20,
						color: "red",
						backgroundColor: "blue",
						borderTopColor: "red",
					},
					tabStyle: {
						alignItem: "center",
						paddingBottom: 5,
					},
					tabBarActiveTintColor: "#ED1C24",
					tabBarInactiveTintColor: "#353C40",
				}}

				// screenOptions={({ route }) => ({
				// tabBarIcon: ({ focused, color, size }) => {
				//   console.log(focused, route);
				//   let iconName;

				//   if (route.name === 'HOME') {
				//     iconName = focused ? <Image source={require('../components/assets/images/homeRed.png')} /> : <Image source={require('../components/assets/images/home.png')} />
				//   }
				//   else if (route.name === "REPORTS") {
				//     iconName = focused ? <Icon name="graph" size={20} color={'red'} /> : <Icon name='graph' size={20} />

				//   }
				//   else if (route.name === 'KATHABOOK') {
				//     iconName = focused ? <Image source={require('../components/assets/images/marketRed.png')} /> : <Image source={require('../components/assets/images/market.png')} />
				//   }
				//   else if (route.name === 'NEW SALE') {
				//     if (!Device.isTablet) {
				//       iconName = focused ? <Image style={{ marginTop: -30 }} source={require('../components/assets/images/newsaleRed.png')} /> : <Image style={{ marginTop: -30 }} source={require('../components/assets/images/newsaleRed.png')} />
				//     } else {
				//       iconName = focused ? <Image style={{ marginTop: -70, marginLeft: 100 }} source={require('../components/assets/images/newsaleRed.png')} /> : <Image style={{ marginTop: -70, marginLeft: 100 }} source={require('../components/assets/images/newsaleRed.png')} />
				//     }
				//   } else if (route.name === 'PROMO') {
				//     iconName = focused ? <Image source={require('../components/assets/images/promoRed.png')} /> : <Image source={require('../components/assets/images/promo.png')} />
				//   }
				//   else if (route.name === 'PROFILE') {
				//     iconName = focused ? <Image source={require('../components/assets/images/profileRed.png')} /> : <Image source={require('../components/assets/images/profile.png')} />
				//   }
				//   return iconName;
				// },
				// tabBarActiveTintColor: '#ED1C24',
				// tabBarInactiveTintColor: '#353C40',
				// tabBarLabel:() => {return null},
				// })}
			>
				<Tab.Screen
					name="HOME"
					title="Home"
					options={{
						headerShown: false,
						tabBarLabel: "Home",
						tabBarIcon: ({ color, size }) => (
							<HomeIcon name="home" color={color} size={size} />
						),
					}}
					component={HomeNavigation}
				/>
				{/* <Tab.Screen name="KATHABOOK" options={{ headerShown: false }} component={KathaBook} /> */}
				{/* <Tab.Screen name="NEW SALE" options={{ headerShown: false, unmountOnBlur: true }} component={NewSaleNavigation} /> */}
				{/* <Tab.Screen name="PROMO" options={{ headerShown: false }} component={PromoNavigation} /> */}
				<Tab.Screen
					name="REPORTS"
					options={{
						headerShown: false,
						tabBarLabel: "Reports",
						tabBarIcon: ({ color, size }) => (
							<Icon name="graph" color={color} size={size} />
						),
					}}
					component={ReportsNavigation}
				/>
				<Tab.Screen
					name="PROFILE"
					options={{
						headerShown: false,
						tabBarLabel: "Profile",
						tabBarIcon: ({ color, size }) => (
							<ProfileIcon name="user" color={color} size={size} />
						),
					}}
					component={Settings}
				/>
			</Tab.Navigator>
		);
	}
}

function NestedHomeNavigation() {
	return (
		<Stack.Navigator>
			{/* <Stack.Screen name="TopBarNavigation" options={{ headerShown: false }} component={TopBarNavigation} /> */}
			<Stack.Screen
				name="Login"
				options={{ headerShown: false }}
				component={Login}
			/>
			<Stack.Screen
				name="LoginAfterLanguageSelect"
				options={{ headerShown: false }}
				component={LoginAfterLanguageSelect}
			/>
			<Stack.Screen
				name="SelectStore"
				options={{ headerShown: false }}
				component={SelectStore}
			/>
			<Stack.Screen
				name="ForgotPassword"
				options={{ headerShown: false }}
				component={ForgotPassword}
			/>
			<Stack.Screen
				name="RegisterClient"
				options={{ headerShown: false }}
				component={RegisterClient}
			/>
			<Stack.Screen
				name="UpdateNewpassword"
				options={{ headerShown: false }}
				component={UpdateNewpassword}
			/>
			<Stack.Screen
				name="ManagePassword"
				options={{ headerShown: false }}
				component={ManagePassword}
			/>
		</Stack.Navigator>
	);
}

export default BottomTabBar;
