import Settings from '../components/Profile/Settings';
import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import PromoNavigation from './PromoNavigation';
import InventoryNavigation from './InventoryNavigation';
import { DrawerContent } from './DrawerContent';
import UrmNavigation from './UrmNavigation';
import NewSaleNavigation from './NewSaleNavigation';
import Home from '../components/Home/Home';
import AccountingNaviagtion from './AccountingNavigation';
import ReportsNavigation from './ReportsNavigation';
import CustomerNavigation from './CustomerNavigation';
import InventoryRetailNavigation from './InventoryRetailNavigation';
import CustomerRetailNavigation from './CustomerRetailNavigation';
import Device from 'react-native-device-detection';

const Drawer = createDrawerNavigator();
export default class SideNavigation extends React.Component {
    state = {
        route: ''
    }
    componentDidMount = () => {
        if (global.previlage1 === 'Dashboard') {
            this.setState({ route: 'Home' })
        } else if (global.previlage2 = 'Billing Portal') {
            this.setState({ route: 'CustomerNavigation' })
        } else if (global.previlage3 = 'Inventory Portal') {
            this.setState({ route: 'InventoryNavigation' })
        } else if (global.previlage4 = 'Promotions & Loyalty') {
            this.setState({ route: 'PromoNavigation' })
        } else if (global.previlage5 = 'Accounting Portal') {
            this.setState({ route: 'AccountingNaviagtion' })
        } else if (global.previlage6 = 'Reports') {
            this.setState({ route: 'ReportsNavigation' })
        } else if (global.previlage7 = 'URM Portal') {
            this.setState({ route: 'UrmNavigation' })
        }
    }
    render() {
        return (
            <Drawer.Navigator
                initialRouteName={this.state.route}
                screenOptions={{
                    drawerStyle: {
                        width: Device.isTablet ? 400 : 300,
                    }
                }} drawerContent={props => <DrawerContent {...props} />}>
                <Drawer.Screen name="Home" options={{ headerShown: false }} component={Home} />
                <Drawer.Screen name="Settings" options={{ headerShown: false }} component={Settings} />
                <Drawer.Screen name="PromoNavigation" options={{ headerShown: false }} component={PromoNavigation} />
                <Drawer.Screen name="InventoryNavigation" options={{ headerShown: false }} component={InventoryNavigation} />
                <Drawer.Screen name="UrmNavigation" options={{ headerShown: false }} component={UrmNavigation} />
                <Drawer.Screen name="ReportsNavigation" options={{ headerShown: false }} component={ReportsNavigation} />
                <Drawer.Screen name="AccountingNaviagtion" options={{ headerShown: false }} component={AccountingNaviagtion} />
                <Drawer.Screen name="CustomerNavigation" options={{ headerShown: false }} component={CustomerNavigation} />
                <Drawer.Screen name="CustomerRetailNavigation" options={{ headerShown: false }} component={CustomerRetailNavigation} />
                <Drawer.Screen name="NewSaleNavigation" options={{ headerShown: false }} component={NewSaleNavigation} />
                <Drawer.Screen name="InventoryRetailNavigation" options={{ headerShown: false }} component={InventoryRetailNavigation} />
                {/* <Drawer.Screen name="NewSaleTextileNavigation" options={{ headerShown: false }} component={NewSaleTextileNavigation} /> */}
            </Drawer.Navigator>
        );
    }
}