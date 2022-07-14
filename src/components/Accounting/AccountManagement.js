import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { Component } from 'react';
import { Dimensions, FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Device from 'react-native-device-detection';
import { ScrollView, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import I18n from 'react-native-i18n';
import Loader from "../../commonUtils/loader";
import LoginService from '../services/LoginService';
import UrmService from '../services/UrmService';
import AccountingDashboard from './AccountingDashboard';
import { pageNavigationBtn, pageNavigationBtnText, filterBtn, menuButton, headerNavigationBtn, headerNavigationBtnText, headerTitle, headerTitleContainer, headerTitleSubContainer, headerTitleSubContainer2, pageNavigationBtnContainer } from '../Styles/Styles';
import CreateHSNCode from './CreateHSNCode';
import CreateTaxMaster from './CreateTaxMaster';
import CreditNotes from './CreditNotes';
import DebitNotes from "./DebitNotes";
import Domain from './Domain.js';
import Stores from './Stores.js';
import AccountingService from '../services/AccountingService';


var deviceWidth = Dimensions.get("window").width;
var deviceheight = Dimensions.get("window").height;


export default class AccountManagement extends Component {

  constructor(props) {
    super(props);
    this.state = {
      flagShowFilterButton: false,
      flagDashboard: false,
      flagCreditNotes: false,
      flagDebitNotes: false,
      flagTaxMaster: false,
      flagHSNCode: false,
      flagStore: false,
      flagDomain: false,
      flagFilterCreditNotes: false,
      flagFilterDebitNotes: false,
      flagFilterStore: false,
      modalVisible: true,
      privilages: [],
      storesDelete: false,
      filterActive: false,
      headerNames: [],
      storeError: "",
      domainError: "",
      clearFilter: false
    };
  }


  async componentDidMount() {
    AsyncStorage.getItem("rolename").then(value => {
      console.log({ value });
      if (value === "super_admin") { }
      else {
        axios.get(UrmService.getPrivillagesByRoleName() + value).then(res => {
          console.log(res.data);
          if (res) {
            if (res.data) {
              let len = res.data.parentPrivileges.length;
              for (let i = 0; i < len; i++) {
                let privilege = res.data.parentPrivileges[i];
                if (privilege.name === "Accounting Portal") {
                  let privilegeId = privilege.id;
                  let sublen = res.data.subPrivileges.length;
                  let subPrivileges = res.data.subPrivileges;
                  for (let i = 0; i < sublen; i++) {
                    if (privilegeId === subPrivileges[i].parentPrivilegeId) {
                      let routes = subPrivileges[i].name;
                      console.log({ routes });
                      this.state.headerNames.push({ name: routes });
                      console.log("Header Names", this.state.headerNames);
                    }
                  }
                  this.setState({ headerNames: this.state.headerNames }, () => {
                    for (let j = 0; j < this.state.headerNames.length; j++) {
                      if (j === 0) {
                        this.state.privilages.push({ bool: true, name: this.state.headerNames[j].name });
                      } else {
                        this.state.privilages.push({ bool: false, name: this.state.headerNames[j].name });
                      }
                    }
                  });
                  this.initialNavigation();
                }
              }
            }
          }
        });
      }
    });
  }

  // Intial Routing
  initialNavigation() {
    if (this.state.privilages.length > 0) {
      this.setState({ privilages: this.state.privilages }, () => {
        if (this.state.privilages[0].name === "Dashboard") {
          this.setState({ flagDashboard: true });
        } else if (this.state.privilages[0].name === "Stores") {
          this.setState({ flagStore: true });
        } else if (this.state.privilages[0].name === "Doamin") {
          this.setState({ flagDomain: true });
        } else if (this.state.privilages[0].name === "Credit Notes") {
          this.setState({ flagCreditNotes: true });
        } else if (this.state.privilages[0].name === "Debit Notes") {
          this.setState({ flagDebitNotes: false });
        } else if (this.state.privilages[0].name === "Create Tax Master") {
          this.setState({ flagCreditNotes: true });
        } else if (this.state.privilages[0].name === "Create HSN Code") {
          this.setState({ flagHSNCode: true });
        }
        else {
          this.setState({ flagStore: false, flagDashboard: false, flagDomain: false, flagCreditNotes: false, flagDebitNotes: false, flagTaxMaster: false, flagHSNCode: false });
        }
      });
    }
  }

  // Navigation Functions

  topbarAction = (item, index) => {
    if (item.name === "Dashboard") {
      this.setState({ flagDashboard: true });
    } else {
      this.setState({ flagDashboard: false });
    }
    if (item.name === "Credit Notes") {
      this.setState({ flagCreditNotes: true });
    } else {
      this.setState({ flagCreditNotes: false });
    }
    if (item.name === "Debit Notes") {
      this.setState({ flagDebitNotes: true });
    } else {
      this.setState({ flagDebitNotes: false });
    }
    if (item.name === "Create Tax Master") {
      this.setState({ flagTaxMaster: true });
    } else {
      this.setState({ flagTaxMaster: false });
    }
    if (item.name === "Create HSN Code") {
      this.setState({ flagHSNCode: true });
    } else {
      this.setState({ flagHSNCode: false });
    }
    if (this.state.privilages[index].bool === true) {
      this.state.privilages[index].bool = false;
    } else {
      this.state.privilages[index].bool = true;
    }

    for (let i = 0; i < this.state.privilages.length; i++) {
      if (index != i) {
        this.state.privilages[i].bool = false;
      }
      this.setState({ privilages: this.state.privilages });
    }
    this.setState({ filterActive: false });
  };

  handlemenuButtonClick() {
    this.props.navigation.openDrawer();
  }

  navigateToAddCreditNotes() {
    this.props.navigation.navigate('AddCreditNotes', {
      isEdit: false,
      onGoBack: () => this.child.getAllCreditNotes()
    });
  }

  navigateToAdDebitNotes() {
    this.props.navigation.navigate('AddDebitNotes');
  }

  navigateToAddHsnCode() {
    this.props.navigation.navigate('AddHsnCode');
  }

  navigateToAddTax() {
    this.props.navigation.navigate('AddTaxMaster');
  }

  navigateToAddDomain() {
    this.props.navigation.navigate('AddDomain', {
      onGoBack: () => this.child.getDomains(),
    });
  }

  // Filter Functions

  filterAction() {
    if (this.state.flagCreditNotes === true) {
      this.setState({ flagFilterCreditNotes: true });
    } else {
      this.setState({ flagFilterCreditNotes: false });
    }
    if (this.state.flagDebitNotes === true) {
      this.setState({ flagFilterDebitNotes: true });
    } else {
      this.setState({ flagFilterDebitNotes: false });
    }
    if (this.state.flagStore === true) {
      this.setState({ flagFilterStore: true });
    } else {
      this.setState({ flagFilterStore: false });
    }
    this.setState({ modalVisible: true });
  }

  filterStores = () => {
    this.setState({ filterActive: true });
  };

  filterCredits = () => {
    this.setState({ filterActive: true });
    console.log("filters");
  };

  filterDebits = () => {
    this.setState({ filterActive: true });
  };

  clearFilterAction() {
    if (this.state.flagStore === true) {
      this.setState({ filterActive: false });
    }
    if (this.state.flagCreditNotes === true) {
      this.setState({ filterActive: false });

    }
    if (this.state.flagDebitNotes === true) {
      this.setState({ filterActive: false });
    }
  }

  modelCancel() {
    this.setState({ modalVisible: false, flagFilterCreditNotes: false, flagFilterStore: false, flagFilterCreditNotes: false, flagFilterDebitNotes: false });
  }

  modelClose = () => {
    this.modelCancel();
  };


  render() {
    return (
      <View style={styles.mainContainer}>
        {this.state.loading &&
          <Loader
            loading={this.state.loading} />
        }
        <SafeAreaView style={styles.mainContainer}>
          <View style={headerTitleContainer} >
            <View style={headerTitleSubContainer}>
              <TouchableOpacity style={menuButton} onPress={() => this.handlemenuButtonClick()}>
                <Image source={require('../assets/images/menu.png')} />
              </TouchableOpacity>
              <Text style={headerTitle}>
                {I18n.t("Accounting Portal")}
              </Text>
            </View>
            <View style={headerTitleSubContainer2}>
              {this.state.flagCreditNotes && (
                <TouchableOpacity style={headerNavigationBtn} onPress={() => this.navigateToAddCreditNotes()}>
                  <Text style={headerNavigationBtnText}>Add Credit</Text>
                </TouchableOpacity>
              )}

              {this.state.flagHSNCode && (
                <TouchableOpacity style={headerNavigationBtn} onPress={() => this.navigateToAddHsnCode()}>
                  <Text style={headerNavigationBtnText}>Add HSN</Text>
                </TouchableOpacity>
              )}
              {this.state.flagTaxMaster && (
                <TouchableOpacity style={headerNavigationBtn} onPress={() => this.navigateToAddTax()}>
                  <Text style={headerNavigationBtnText}>Add Tax</Text>
                </TouchableOpacity>
              )}

            </View>
          </View>
          <ScrollView>
            <View style={styles.container}>
              <FlatList
                style={pageNavigationBtnContainer}
                horizontal
                data={this.state.privilages}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                ListEmptyComponent={<Text style={{ color: '#cc241d', textAlign: "center", fontFamily: "bold", fontSize: Device.isTablet ? 21 : 17, marginTop: deviceheight / 3, marginLeft: deviceWidth / 3.5 }}>&#9888; Privileges  Not Found</Text>}
                renderItem={({ item, index }) => (
                  <TouchableOpacity style={[pageNavigationBtn, { backgroundColor: item.bool ? '#ED1C24' : '#FFFFFF', borderColor: item.bool ? '#ED1C24' : '#858585', }]} onPress={() => this.topbarAction(item, index)} >
                    <Text style={[pageNavigationBtnText, { color: item.bool ? "#FFFFFF" : '#858585', }]}>
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                )}
                ListFooterComponent={<View style={{ width: 15 }}></View>}
              />
              {this.state.flagDashboard && (
                <View>
                  <AccountingDashboard />
                </View>
              )}
              {this.state.flagCreditNotes && (
                <CreditNotes
                  filterCreditNotes={this.state.flagFilterCreditNotes}
                  modalVisible={this.state.modalVisible}
                  navigation={this.props.navigation}
                  modelCancelCallback={this.modelClose}
                  filterActive={this.state.filterActive}
                  childParams={this.filterCredits}
                  ref={instance => { this.child = instance; }}
                />
              )}
              {this.state.flagDebitNotes && (
                <DebitNotes
                  navigation={this.props.navigation}
                  filterDebitNotes={this.state.flagFilterDebitNotes}
                  modalVisible={this.state.modalVisible}
                  childParams={this.filterDebits}
                  filterActive={this.state.filterActive}
                  modelCancelCallback={this.modelClose}
                  ref={instance => { this.child = instance; }}
                />
              )}

              {this.state.flagTaxMaster && (
                <CreateTaxMaster
                  navigation={this.props.navigation}
                  ref={instance => { this.child = instance; }}
                />
              )}

              {this.state.flagHSNCode && (
                <CreateHSNCode
                  navigation={this.props.navigation}
                  ref={instance => { this.child = instance; }}
                />
              )}

            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  imagealign: {
    marginTop: Device.isTablet ? 25 : 20,
    marginRight: Device.isTablet ? 30 : 20,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    // backgroundColor: '#FAFAFF'
  },
  flatList: {
    marginTop: 20
  },
});
