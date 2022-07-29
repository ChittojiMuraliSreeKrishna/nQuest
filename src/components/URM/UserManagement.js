import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { Component } from 'react';
import { Dimensions, FlatList, Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import DatePicker from 'react-native-date-picker';
import Device from 'react-native-device-detection';
import I18n from 'react-native-i18n';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Modal from 'react-native-modal';
import RNPickerSelect from 'react-native-picker-select';
import { Chevron } from 'react-native-shapes';
import { RW, RF, RH } from '../../Responsive';
import Loader from "../../commonUtils/loader";
import UrmService from '../services/UrmService';
import UrmDashboard from './UrmDashboard';
import EmptyList from '../Errors/EmptyList';
import { listEmptyMessage, pageNavigationBtn, pageNavigationBtnText, filterBtn, menuButton, headerNavigationBtn, headerNavigationBtnText, headerTitle, headerTitleContainer, headerTitleSubContainer, headerTitleSubContainer2, buttonContainer, buttonStyle, buttonStyle1, flatListMainContainer, flatlistSubContainer, buttonImageStyle, textContainer, textStyleLight, textStyleMedium, highText, pageNavigationBtnContainer } from '../Styles/Styles';
import { filterMainContainer, filterSubContainer, filterHeading, filterCloseImage, deleteText, deleteHeading, deleteHeader, deleteContainer, deleteCloseBtn } from '../Styles/PopupStyles';
import { inputField, rnPickerContainer, rnPicker, submitBtn, submitBtnText, cancelBtn, cancelBtnText, datePicker, datePickerBtnText, datePickerButton1, datePickerButton2, datePickerContainer, dateSelector, dateText, } from '../Styles/FormFields';
import Users from './users';
import Roles from './Roles';
import Stores from '../Accounting/Stores';

import scss from '../../assets/styles/HeaderStyles.scss';
var deviceheight = Dimensions.get("window").height;
var deviceWidth = Dimensions.get("window").width;


export default class UserManagement extends Component {

  constructor(props) {
    super(props);
    this.state = {
      flagUser: false,
      flagRole: false,
      flagFilterRoles: false,
      flagFilterUsers: false,
      filterButton: false,
      modalVisible: true,
      createdDate: "",
      date: new Date(),
      role: "",
      createdBy: "",
      branch: "",
      rolesData: [],
      usersData: [],
      roleDelete: false,
      userDelete: false,
      privilages: [],
      headerNames: [],
      clientId: 0,
      doneButtonClicked: false,
      navtext: '',
      flagDashboard: false,
      filterActive: false,
      usersError: "",
      rolesError: "",
      flagStore: false,
      configHeaders: [{ name: 'Stores' }, { name: 'Roles' }, { name: 'Users' }]
    };
  }


  async componentDidMount() {
    const clientId = await AsyncStorage.getItem("custom:clientId1");
    this.setState({ clientId: clientId });
    console.log({ clientId });
    AsyncStorage.getItem("rolename").then(value => {
      console.log({ value });
      if (value === "config_user") {
        for (let i = 0; i < this.state.configHeaders.length; i++) {
          if (i === 0) {
            this.state.privilages.push({ bool: true, name: this.state.configHeaders[i].name });
            this.setState({ flagStore: true });
          } else {
            this.state.privilages.push({ bool: false, name: this.state.configHeaders[i].name });
          }
        }
      } else {
        axios.get(UrmService.getPrivillagesByRoleName() + value).then(res => {
          if (res) {
            if (res.data) {
              let len = res.data.parentPrivileges.length;
              for (let i = 0; i < len; i++) {
                let privilege = res.data.parentPrivileges[i];
                if (privilege.name === "URM Portal") {
                  let privilegeId = privilege.id;
                  let sublen = res.data.subPrivileges.length;
                  let subPrivileges = res.data.subPrivileges;
                  for (let i = 0; i < sublen; i++) {
                    if (privilegeId === subPrivileges[i].parentPrivilegeId) {
                      let routes = subPrivileges[i].name;
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


  initialNavigation() {
    this.setState({ privilages: this.state.privilages }, () => {
      // console.error(this.state.privilages.length)
      if (this.state.privilages.length > 0) {
        if (this.state.privilages[0].name === "Dashboard") {
          this.setState({ flagUser: false, flagRole: false, flagDashboard: true, filterButton: false });
        } else if (this.state.privilages[0].name === "Users") {
          this.setState({ flagUser: true, flagRole: false, flagDashboard: false, filterButton: true, filterActive: false });
        } else if (this.state.privilages[0].name === "Roles") {
          this.setState({ flagUser: false, flagRole: true, flagDashboard: false, filterButton: true, filterActive: false });
        } else if (this.state.privilages[0].name === "Stores") {
          this.setState({ flagStore: true });
        }
        else {
          this.setState({ flagUser: false, flagRole: false, flagDashboard: false, filterButton: true, filterActive: false, flagStore: false });
          console.log("please update the privilages in Line.no: 161");
        }
      }
    });
  }

  getRolesList() {
    this.setState({ rolesData: [] });
    this.setState({ loading: true });

    axios.get(UrmService.getAllRoles() + this.state.clientId).then((res) => {
      let len = res.data["result"].length;
      if (len > 0) {
        for (let i = 0; i < len; i++) {
          let number = res.data.result[i];
          // console.log('sfsdfdfsdfdsfsfsdfs' + number);
          console.log(number);
          this.setState({ loading: false });
          this.state.rolesData.push(number);
        }
        this.setState({ rolesData: this.state.rolesData, rolesError: "", loading: false });
      } else {
        this.setState({ rolesError: "Records Not Found", loading: false });
      }
    }).catch(() => {
      this.setState({ loading: false, rolesError: "Records Not Found" });
      console.log("There is an Error Getting Roles");
    });
  }


  topbarAction = (item, index) => {
    if (item.name === "Users") {
      this.setState({ flagUser: true, flagRole: false, flagDashboard: false, filterButton: true, filterActive: false, flagStore: false }, () => {
      });

    }
    else if (item.name === "Roles") {
      this.setState({ flagRole: true, flagUser: false, flagDashboard: false, filterButton: true, flagStore: false, filterActive: false }, () => {
        this.getRolesList();
      });
    }
    else if (item.name === "Dashboard") {
      this.setState({ flagRole: false, flagUser: false, flagDashboard: true, filterButton: false, flagStore: false });
    }

    else if (item.name === "Stores") {
      this.setState({ flagRole: false, flagUser: false, flagDashboard: false, filterButton: false, flagStore: true });
    }

    if (this.state.privilages[index].bool === true) {
      this.state.privilages[index].bool = false;
    }
    else {
      this.state.privilages[index].bool = true;
    }
    for (let i = 0; i < this.state.privilages.length; i++) {
      if (index != i) {
        this.state.privilages[i].bool = false;
      }
      this.setState({ privilages: this.state.privilages });
    }

  };

  filterAction() {
    if (this.state.flagRole === true) {
      this.setState({ flagFilterRoles: true, filterActive: false });
    } else {
      this.setState({ flagFilterRoles: false });
    }
    if (this.state.flagUser === true) {
      this.setState({ flagFilterUsers: true });
    } else {
      this.setState({ flagFilterUsers: false });
    }
    this.setState({ modalVisible: true });
  }

  clearFilterAction() {
    if (this.state.flagUser === true) {
      this.setState({ filterActive: false }, () => {
        this.setState({ userType: "", role: "", branch: "" });
      });
    }
    else if (this.state.flagRole === true) {
      this.setState({ filterActive: false }, () => {
        this.getRolesList();
        this.setState({ role: "", createdBy: "", createdDate: "" });
      });
    }
  }

  modelCancel() {
    this.setState({ modalVisible: false, flagFilterRoles: false, flagFilterUsers: false });
  }

  navigateToCreateRoles() {
    this.props.navigation.navigate('CreateRole', {
      isEdit: false,
      onGoBack: () => this.refresh(),
    });
  }

  refresh() {
    this.getRolesList();
  }



  handleBackButtonClick() {
    this.props.navigation.openDrawer();
  }

  navigateToAddUsers() {
    this.props.navigation.navigate('AddUser', {
      isEdit: false,
      onGoBack: () => this.child.getAllUsers(),
    });
  }

  navigateToAddStores() {
    this.props.navigation.navigate('AddStore', {
      isEdit: false,
      onGoBack: () => this.child.getStoresList(),
    });
  }

  topbarAction1() {
    this.setState({ flagUser: true, flagRole: false });
  }

  topbarAction2() {
    this.getRolesList();
    this.setState({ flagRole: true, flagUser: false });
  }

  filterDatepickerClicked() {
    this.setState({ datepickerOpen: true });
  }

  filterDatepickerDoneClicked() {
    console.log(this.state.date);
    if (parseInt(this.state.date.getDate()) < 10 && parseInt(this.state.date.getMonth()) < 10) {
      this.setState({ createdDate: this.state.date.getFullYear() + "-0" + (this.state.date.getMonth() + 1) + "-0" + this.state.date.getDate(), doneButtonClicked: true, datepickerOpen: false });
    }
    else if (parseInt(this.state.date.getMonth()) < 10) {
      this.setState({ createdDate: this.state.date.getFullYear() + "-0" + (this.state.date.getMonth() + 1) + "-" + this.state.date.getDate(), doneButtonClicked: true, datepickerOpen: false });
    }
    else if (parseInt(this.state.date.getDate()) < 10) {
      this.setState({ createdDate: this.state.date.getFullYear() + "-" + (this.state.date.getMonth() + 1) + "-0" + this.state.date.getDate(), doneButtonClicked: true, datepickerOpen: false });
    }
    else {
      this.setState({ createdDate: this.state.date.getFullYear() + "-" + (this.state.date.getMonth() + 1) + "-" + this.state.date.getDate(), doneButtonClicked: true, datepickerOpen: false });
    }
  }

  filterDatepickerCancelClicked() {
    this.setState({ date: new Date(), datepickerOpen: false });
  }

  handleCreatedBy = (value) => {
    this.setState({ createdBy: value });
  };

  handleRole = (value) => {
    this.setState({ role: value });
  };

  handleUSerType = (value) => {
    this.setState({ userType: value });
  };

  handleBranch = (value) => {
    this.setState({ branch: value });
  };

  applyRoleFilter() {
    console.log("creatBy", this.state.createdBy);
    const searchRole = {
      "roleName": this.state.role ? this.state.role : null,
      "createdBy": this.state.createdBy ? this.state.createdBy : null,
      "createdDate": this.state.createdDate ? this.state.createdDate : null
    };
    console.log(searchRole);
    axios.post(UrmService.getRolesBySearch(), searchRole).then((res) => {
      console.log("KKKKK", res);
      if (res) {
        if (res.data.isSuccess === "true") {
          this.setState({ rolesData: res.data.result, modalVisible: false, flagFilterRoles: false, createdDate: "", role: "", createdBy: "" }, () => {
            this.setState({ filterActive: true, rolesError: "" });
          });
        } else {
          this.setState({ modalVisible: false, flagFilterRoles: false, userType: "", role: "", createdBy: "", rolesData: "" },
            () => {
              this.setState({ filterActive: true, rolesError: "Records Not Found" });
            });
          console.log("ooooo", res.data);
        }

      } else {
        this.setState({ rolesData: "", modalVisible: false, flagFilterRoles: false, createdDate: "", role: "", createdBy: "" }, () => {
          this.setState({ filterActive: true, rolesError: "Records Not Found" });
        });
      }
    }).catch((err) => {
      this.setState({ loading: false, rolesError: "Records Not Found", rolesData: "" });
      console.warn(err, "fkjnksjdf");
    });
  }

  applyUserFilter() {
    this.setState({ usersData: [] });
    const obj = {
      "id": null,
      "phoneNo": null,
      "name": null,
      "active": this.state.userType === "Active" ? "True" : "False",
      "inActive": this.state.userType === "InActive" ? "True" : "False",
      "roleName": this.state.role ? this.state.role : null,
      "storeName": this.state.branch ? this.state.branch : null,
      "clientDomainId": this.state.clientId,
    };
    console.log('search filter', obj);
    axios.post(UrmService.getUserBySearch(), obj).then((res) => {
      if (res) {
        console.log("users Data", res.data.result);
        if (res.data.isSuccess === "true") {

          let len = res.data["result"].length;
          if (len > 0) {
            for (let i = 0; i < len; i++) {
              let number = res.data.result[i];
              console.log(number);
              this.setState({ loading: false });

              // console.log('sadsddsad' + number.stores);
              let len = number.stores.length;
              number.storeName = "";
              if (len > 0) {
                for (let i = 0; i < len; i++) {
                  if (number.storeName === "") {
                    number.storeName = number.storeName + number.stores[i].name;
                  }
                  else {
                    number.storeName = number.storeName + "," + number.stores[i].name;
                  }
                }
              }
              this.state.usersData.push(number);
            }
            this.setState({ usersData: this.state.usersData, modalVisible: false, userType: "", role: "", createdBy: "", branch: "" },
              () => {
                this.setState({ filterActive: true, usersError: "" });
              });
          }
        } else {
          this.setState({ modalVisible: false, userType: "", role: "", createdBy: "", branch: '', usersData: "" },
            () => {
              this.setState({ filterActive: true, usersError: "Records Not Found" });
              console.log("records not found");
            });
        }

      } else {
        this.setState({ modalVisible: false, userType: "", role: "", createdBy: "", branch: "", usersData: "" }, () => {
          this.setState({ filterActive: true, usersError: "Records Not Found" });
        });
      }

    }).catch((err) => {
      this.setState({ loading: false, usersError: "Records Not Found", usersData: "" });
      console.warn(err);
    });
  }




  updateRoles() {
    this.getAllRoles();
  }


  handleedituser(item, index) {
    this.props.navigation.navigate('AddUser',
      {
        item: item, isEdit: true,
        onGoBack: () => this.child.getAllUsers(),
      });
  }

  handleeditRole(item, index) {
    this.props.navigation.navigate('CreateRole',
      {
        item: item, isEdit: true,
        onGoBack: () => this.child.getRolesList(),
      });
  }



  render() {
    return (
      <View style={styles.mainContainer}>
        {this.state.loading &&
          <Loader
            loading={this.state.loading} />
        }
        <SafeAreaView style={styles.mainContainer}>
          {/* <View style={headerTitleContainer} >
            <View style={headerTitleSubContainer}>
              <TouchableOpacity style={menuButton} onPress={() => this.handleBackButtonClick()}>
                <Image source={require('../assets/images/menu.png')} />
              </TouchableOpacity>
              <Text style={headerTitle}>
                {I18n.t("URM Portal")}
              </Text>
            </View>
            <View style={headerTitleSubContainer2}>
              {this.state.flagRole && (
                <TouchableOpacity style={headerNavigationBtn} onPress={() => this.navigateToCreateRoles()}>
                  <Text style={headerNavigationBtnText}>{I18n.t("Create Role")}</Text>
                </TouchableOpacity>
              )}
              {this.state.flagUser && (
                <TouchableOpacity style={[headerNavigationBtn, I18n.locale === "telugu" ? { height: 40 } : {}]} onPress={() => this.navigateToAddUsers()}>
                  <Text style={headerNavigationBtnText}>{I18n.t("Add User")}</Text>
                </TouchableOpacity>
              )}
              {this.state.flagStore && (
                <TouchableOpacity style={headerNavigationBtn} onPress={() => this.navigateToAddStores()}>
                  <Text style={headerNavigationBtnText}>{I18n.t("Add Store")}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View> */}

          <ScrollView>
            <View style={styles.container}>
              <FlatList
                style={pageNavigationBtnContainer}
                horizontal
                data={this.state.privilages}
                ListEmptyComponent={<EmptyList message={this.state.rolesError} />}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item, index }) => (
                  <TouchableOpacity style={[scss.pageNavigationBtn, { borderColor: item.bool ? '#ED1C24' : '#d7d7d7', }]} onPress={() => this.topbarAction(item, index)} >
                    <Text style={[scss.pageNavigationBtnText, { color: item.bool ? "#ED1C24" : '#00000073', }]}>
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                )}
                ListFooterComponent={<View style={{ width: 15 }}></View>}
              />

              {console.log(this.state.privilages)}

            </View>


            {this.state.flagDashboard && (
              <UrmDashboard />
            )}
            {this.state.flagRole && (
              <Roles
                ref={instance => { this.child = instance; }}
                navigation={this.props.navigation}
              />
            )}
            {this.state.flagUser && (
              <Users
                ref={instance => { this.child = instance; }}
                navigation={this.props.navigation}
              />
            )}
            {this.state.flagStore && (
              <Stores
                ref={instance => { this.child = instance; }}
                navigation={this.props.navigation}
              />
            )}
            {this.state.flagRole && this.state.roleDelete && (
              <View>
                <Modal isVisible={this.state.modalVisible} style={{ margin: 0 }}>
                  <View style={deleteContainer}>
                    <View>
                      <View style={filterSubContainer}>
                        <View style={deleteHeader}>
                          <Text style={filterHeading} > {I18n.t("Delete Role")} </Text>
                        </View>
                        <View>
                          <TouchableOpacity style={filterCloseImage} onPress={() => this.modelCancel()}>
                            <Image style={deleteCloseBtn} source={require('../assets/images/modelcancel.png')} />
                          </TouchableOpacity>
                        </View>
                      </View>
                      <Text style={{
                        height: Device.isTablet ? 2 : 1,
                        width: deviceWidth,
                        backgroundColor: 'lightgray',
                      }}></Text>
                    </View>

                    <Text style={deleteText}> {I18n.t("Are you sure want to delete Role")} ?  </Text>
                    <TouchableOpacity
                      style={filterSubmitBtn} onPress={() => this.deleteRole(item, index)}
                    >
                      <Text style={filterApplyBtnText}  > {I18n.t("DELETE")} </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={filterCancelBtn} onPress={() => this.modelCancel()}
                    >
                      <Text style={filterCancelBtnText}  > {I18n.t("CANCEL")} </Text>

                    </TouchableOpacity>
                  </View>
                </Modal>
              </View>
            )}
            {this.state.flagUser && this.state.userDelete && (
              <View>
                <Modal isVisible={this.state.modalVisible} style={{ margin: 0 }}>
                  <View style={deleteContainer}>
                    <View>
                      <View style={deleteHeader}>
                        <View>
                          <Text style={deleteHeading} > {I18n.t("Delete User")} </Text>
                        </View>
                        <View>
                          <TouchableOpacity style={filterCloseImage} onPress={() => this.modelCancel()}>
                            <Image style={deleteCloseBtn} source={require('../assets/images/modalCloseWhite.png')} />
                          </TouchableOpacity>
                        </View>
                      </View>
                      <Text style={{
                        height: Device.isTablet ? 2 : 1,
                        width: deviceWidth,
                        backgroundColor: 'lightgray',
                      }}></Text>
                    </View>
                    <Text style={deleteText}> {I18n.t("Are you sure want to delete User")}?  </Text>
                    <TouchableOpacity
                      style={filterSubmitBtn}
                      onPress={() => this.deleteUser(item, index)}
                    >
                      <Text style={filterApplyBtnText}  > {I18n.t("DELETE")} </Text>

                    </TouchableOpacity>

                    <TouchableOpacity
                      style={filterCancelBtn} onPress={() => this.modelCancel()}
                    >
                      <Text style={filterCancelBtnText}  > {I18n.t("CANCEL")} </Text>

                    </TouchableOpacity>
                  </View>
                </Modal>
              </View>
            )}

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
