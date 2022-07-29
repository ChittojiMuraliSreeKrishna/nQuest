import { View, Text, StyleSheet, Image } from 'react-native';
import React, { Component } from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import { RW, RF, RH } from '../Responsive';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import UrmService from '../components/services/UrmService';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import scss from '../assets/styles/topBar.scss';

const data = [

];

var currentSelection = '';

const screenMapping = {

  "Dashboard": "Home",
  "Billing Portal": "CustomerNavigation",
  "Inventory Portal": "InventoryNavigation",
  "Promotions & Loyalty": "PromoNavigation",
  "Accounting Portal": "AccountingNaviagtion",
  "Reports": "ReportsNavigation",
  "URM Portal": "UrmNavigation"

};


const GetImageBasedOnPrevilageName = (name) => {
  return (
    name === "Dashboard" ? <Icon name="home" /> :
      name === "Billing Portal" ? require('../components/assets/images/customerportal.png') :
        name === "Inventory Portal" ? require('../components/assets/images/inventoryportal.png') :
          name === "Promotions & Loyalty" ? require('../components/assets/images/promotions.png') :
            name === "Accounting Portal" ? require('../components/assets/images/accounting.png') :
              name === "Reports" ? require('../components/assets/images/reports.png') :
                name === "URM Portal" ? require('../components/assets/images/urmportal.png') :
                  <></>
  );
};



export class TopBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdown: null,
      route: '',
      loading: false,
      domainId: '',
      firstDisplayName: '',
      firstDisplayNameScreen: ''

    };
  }
  _renderItem(item) {
    return (
      <View style={styles.item}>
        <Image style={styles.icon} source={GetImageBasedOnPrevilageName(item.label)} />
        <Text style={styles.textItem}>{item.label}</Text>
      </View>
    );
  }
  //Before screen render
  async UNSAFE_componentWillMount() {
    console.log("topbar component will mount ", this.state);
    // console.warn("Gloal", global.previlage1);
    this.setState({ loading: false });
    var storeStringId = "";
    var domainStringId = "";

    AsyncStorage.getItem("storeId").then((value) => {
      storeStringId = value;
      this.setState({ storeId: parseInt(storeStringId) });
      //console.log(this.state.storeId);
      // console.log("cssafsfs " + this.state.storeId);
    }).catch(() => {
      console.log('There is error getting storeId');
    });

    await AsyncStorage.getItem("rolename").then((value) => {
      global.userrole = value;
    }).catch(() => {
      console.log('There is error getting userrole');
    });

    await AsyncStorage.getItem("username").then(value => {
      global.username = value;
    });

    await AsyncStorage.getItem("storeName").then(value => {
      global.storeName = value;
    });

    global.previlage1 = '';
    global.previlage2 = '';
    global.previlage3 = '';
    global.previlage4 = '';
    global.previlage5 = '';
    global.previlage6 = '';
    global.previlage7 = '';
    global.previlage8 = '';
    this.getPrivileges();
    //console.log("");
  }

  async getPrivileges() {
    await AsyncStorage.getItem("roleType").then((value) => {
      if (value === "config_user") {
        global.previlage1 = '';
        global.previlage2 = '';
        global.previlage3 = '';
        global.previlage4 = '';
        global.previlage5 = '';
        global.previlage6 = '';
        global.previlage7 = 'URM Portal';
      }
      else if (value === "super_admin") {
        global.previlage1 = 'Dashboard';
        global.previlage2 = 'Billing Portal';
        global.previlage3 = 'Inventory Portal';
        global.previlage4 = 'Promotions & Loyalty';
        global.previlage5 = 'Accounting Portal';
        global.previlage6 = 'Reports';
        global.previlage7 = 'URM Portal';
      } else {
        AsyncStorage.getItem("rolename").then(value => {
          //console.log("role name", value);
          global.userrole = value;
          axios.get(UrmService.getPrivillagesByRoleName() + value).then((res) => {
            // console.log("Privileges", res.data);
            if (res.data) {
              let len = res.data.parentPrivileges.length;

              // console.log(.name)
              if (len > 0) {
                this.setState({ firstDisplayName: res.data.parentPrivileges[0].name });
                const firstDisplayName = this.state.firstDisplayName;
                // this.props.navigation.navigate(firstDisplayName);
                for (let i = 0; i < len; i++) {
                  let previlage = res.data.parentPrivileges[i];
                  if (previlage.name === "Dashboard") {
                    global.previlage1 = 'Dashboard';
                  }
                  if (previlage.name === "Billing Portal") {
                    global.previlage2 = 'Billing Portal';
                  }
                  if (previlage.name === "Inventory Portal") {
                    global.previlage3 = 'Inventory Portal';
                  }
                  if (previlage.name === "Promotions & Loyalty") {
                    global.previlage4 = 'Promotions & Loyalty';
                  }
                  if (previlage.name === "Accounting Portal") {
                    global.previlage5 = 'Accounting Portal';
                  }
                  if (previlage.name === "Reports") {
                    global.previlage6 = 'Reports';
                  }
                  if (previlage.name === "URM Portal") {
                    global.previlage7 = 'URM Portal';
                  }
                  var dropDownItem = { label: previlage.name, value: previlage.name };
                  if (currentSelection === '')
                    data.push(dropDownItem);
                }
                // this.props.navigation.navigate(firstDisplayName);
                //this.setState({ loading: false });
              }

              this.getData();
            }
          });
        }).catch((err) => {
          console.log(err);
        });
      }
    });

  }
  async getData() {

    const { firstDisplayName, firstDisplayNameScreen } = this.state;
    console.log("CD: current selection ", currentSelection);
    if (currentSelection === '') {
      currentSelection = firstDisplayName;
      this.setState({ firstDisplayNameScreen: screenMapping[firstDisplayName] });
      this.props.navigation.navigate(this.state.firstDisplayNameScreen);
    }
  };

  render() {
    const active = this.props.active;
    var placeholderData = currentSelection === '' ? this.state.firstDisplayName : currentSelection;
    console.log("placeholderData in topbar", placeholderData, currentSelection);

    return (
      <View style={styles.headerContainer} >
        <View
        >
          <Image
            style={styles.logoimage}
            source={require('../assets/Images/retail_logo_head.png')}
          ></Image>
        </View>
        <View>

          <Dropdown
            style={scss.dropDown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={data}
            labelField="label"
            valueField="value"
            //Place holdvalue shows in selection
            placeholder={placeholderData}
            maxHeight={300}
            //value={currentSelection === '' ? this.state.firstDisplayName : currentSelection}
            onChange={item => {
              console.log("current selection before onchange", currentSelection);
              var screenName = screenMapping[item.label];
              currentSelection = item.label;
              this.setState({ firstDisplayName: item.label });
              console.log("screenName : " + screenName + ", displayname: " + item.label + ", currentSelection " + currentSelection);
              //this.setState({currentSelection:item.label});
              console.log("current selection after on change", currentSelection);
              global.homeButtonClicked = false;
              global.profileButtonClicked = false;
              this.props.navigation.navigate(screenName);
            }}
            renderLeftIcon={() => (
              <Image style={styles.icon} source={GetImageBasedOnPrevilageName(currentSelection === '' ? this.state.firstDisplayName : currentSelection)} />
            )}
            renderItem={item => this._renderItem(item)}
          />
        </View>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 1
  },
  dropdown: {
    margin: 16,
    height: 50,
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
    width: RW(170)
  },
  placeholderStyle: {
    fontSize: RF(12),
    fontFamily: 'bold',
    color: "#353C40",
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 36,
  },
  icon: {
    marginRight: 5,
    width: 25,
    height: 25,
  },
  item: {
    paddingVertical: 17,
    paddingHorizontal: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textItem: {
    flex: 1,
    fontSize: RF(10),
    fontFamily: 'bold'
  },
  logoimage: {
    width: RW(160),
    height: RH(60)
  }
});
export default TopBar;
