import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { Component } from "react";
import {
  FlatList,
  Image, Text,
  TouchableOpacity,
  View
} from "react-native";
import I18n from "react-native-i18n";
import Modal from "react-native-modal";
import { Text as TEXT } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconMA from 'react-native-vector-icons/MaterialIcons';
import IconMAA from 'react-native-vector-icons/MaterialCommunityIcons';
import scss from "../commonUtils/assets/styles/Bars.scss";
import headers from '../commonUtils/assets/styles/HeaderStyles.scss';
import MenuCategory from "../components/CustomerPortal/MenuCategory";
import UrmService from "../components/services/UrmService";
import forms from "../commonUtils/assets/styles/formFields.scss";
import styles from "../commonUtils/assets/styles/style.scss";
import RnPicker from "../commonUtils/RnPicker";
import CustomerService from "../components/services/CustomerService";
import Device from "react-native-device-detection";
import { RW } from "../Responsive";

var data = [];
var subData = [];
var currentSelection = "";
var dataCleared = true;
var firstDisplayRoute = "";
var displayName = "";

// Screen Maping for main navigation
export const screenMapping = {
  "Dashboard": "Home",
  "Billing Portal": "CustomerNavigation",
  "Inventory Portal": "InventoryNavigation",
  "Promotions & Loyalty": "PromoNavigation",
  "Accounting Portal": "AccountingNaviagtion",
  "Reports": "ReportsNavigation",
  "URM Portal": "UrmNavigation",
  "Ticketing Portal": "TicketingNavigation",
  "Kitchen Management": "KitchenNavigation",
  "Menu Category": "MenuNavigation",
  "Hotel Management": "HotelNavigation",
};

// Getting Images based on privilege name
const GetImageBasedOnPrevilageName = (name) => {
  return name === "Dashboard" ? (
    require("../commonUtils/assets/Images/home.png")
  ) : name === "Billing Portal" ? (
    require("../commonUtils/assets/Images/billing_portal_header_icon.png")
  ) : name === "Inventory Portal" ? (
    require("../commonUtils/assets/Images/inventory_dropdown_icon.png")
  ) : name === "Promotions & Loyalty" ? (
    require("../commonUtils/assets/Images/promotions_dropdown_icon.png")
  ) : name === "Accounting Portal" ? (
    require("../commonUtils/assets/Images/accounting_dropdown_icon.png")
  ) : name === "Reports" ? (
    require("../commonUtils/assets/Images/reports_dropdown_icon.png")
  ) : name === "URM Portal" ? (
    require("../commonUtils/assets/Images/urm_dropdown_icon.png")
  ) : (
    <></>
  );
};

export class TopBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdown: null,
      route: "",
      domainId: "",
      firstDisplayName: "",
      firstDisplayNameScreen: "",
      modalVisibleData: false,
      refresh: true,
      privilages: [],
      headerNames: [],
      isClient: false,
      storeName: "",
      toggleTableBtn: false,
      toggleTableModel: false,
      availTables: [],
      availRooms: [],
      storeId: 0,
      clientId: 0,
      userId: 0,
      fromTableList: [],
      toTableList: [],
      fromRoomList: [],
      toRoomList: [],
      selectedTable: [],
      selectedRoom: [],
      selectedTableName: "",
      showBookDisabled: true,
      subHeaderName: "",
      fromTable: "",
      toTable: "",
      fromRoomValue: "",
      toRoomValue: "",
      selectedModel: "",
      disableBooking: false
    };
  }


  // Main Privileges
  _renderItem(previlage) {
    return (
      <TouchableOpacity
        style={scss.dropdown_items}
        onPress={() => {
          currentSelection = previlage.item;
          global.homeButtonClicked = false;
          global.profileButtonClicked = false;
          this.props.navigation.navigate(
            screenMapping[currentSelection],
            this.refresh(),
          );
          console.log(previlage.item);
          this.renderSubHeadings(previlage.item);
          this.setState({ modalVisibleData: false });
        }}
      >
        {/* <Image
          style={scss.icon}
          source={GetImageBasedOnPrevilageName(previlage.item)}
        /> */}
        <Text style={scss.textItem}>{I18n.t(previlage.item)}</Text>
      </TouchableOpacity>
    );
  }

  //Before screen render
  async componentWillMount() {
    currentSelection = "";
    var storeStringId = "";
    displayName = "";
    this.setState({ firstDisplayName: "", privilages: [] });
    var domainStringId = "";
  }
  async componentDidMount() {
    this.getPrivileges();
    this.getAllValues();
  }

  async getAllValues() {
    global.previlage1 = "";
    global.previlage2 = "";
    global.previlage3 = "";
    global.previlage4 = "";
    global.previlage5 = "";
    global.previlage6 = "";
    global.previlage7 = "";
    global.previlage8 = "";
    global.privilege9 = "";
    global.privilege10 = "";

    const username = await AsyncStorage.getItem("username");
    const rolename = await AsyncStorage.getItem("rolename");
    const storename = await AsyncStorage.getItem("storeName");
    const storeId = await AsyncStorage.getItem("storeId");
    const userId = await AsyncStorage.getItem("userId");
    const clientId = await AsyncStorage.getItem("custom:clientId1");
    this.setState({ storeId: storeId, clientId: clientId, userId: userId, storename: storename });
    global.username = username;
    global.rolename = rolename;
    global.storeName = storename;
  }

  // Getting All Privileges
  async getPrivileges() {
    await AsyncStorage.getItem("roleType").then((value) => {
      if (value === "super_admin") {
        let privilegesSet = new Set();
        global.previlage1 = "Dashboard";
        global.previlage2 = "Billing Portal";
        global.previlage3 = "Inventory Portal";
        global.previlage4 = "Promotions & Loyalty";
        global.previlage5 = "Accounting Portal";
        global.previlage6 = "Reports";
        global.previlage7 = "URM Portal";
      } else {
        AsyncStorage.getItem("rolename")
          .then((value) => {
            global.userrole = value;
            UrmService.getPrivillagesByRoleName(value).then((res) => {
              // console.log({ value }, global.userrole);
              // console.log({ res });
              if (res.data) {
                if (value === "client_support") {
                  this.setState({ isClient: true });
                }
                const { isClient } = this.state;
                let finalResult = this.groupByPrivileges(res.data.parentPrivileges);
                // console.log({ finalResult });
                var mobilePriv = isClient ? finalResult.web : finalResult.mobile;
                // console.log({ mobilePriv });
                let len = mobilePriv.length;
                if (len > 0) {
                  this.setState({
                    firstDisplayName: mobilePriv[0].name,
                  });
                  const firstDisplayName = this.state.firstDisplayName;
                  // console.log({ firstDisplayName });
                  firstDisplayRoute = mobilePriv[0].name;
                  var privilegesSet = new Set();
                  for (let i = 0; i < len; i++) {
                    let previlage = mobilePriv[i];
                    if (previlage.name === "Dashboard") {
                      global.previlage1 = "Dashboard";
                    }
                    if (previlage.name === "Billing Portal") {
                      global.previlage2 = "Billing Portal";
                    }
                    if (previlage.name === "Inventory Portal") {
                      global.previlage3 = "Inventory Portal";
                    }
                    if (previlage.name === "Promotions & Loyalty") {
                      global.previlage4 = "Promotions & Loyalty";
                    }
                    if (previlage.name === "Accounting Portal") {
                      global.previlage5 = "Accounting Portal";
                    }
                    if (previlage.name === "Reports") {
                      global.previlage6 = "Reports";
                    }
                    if (previlage.name === "URM Portal") {
                      global.previlage7 = "URM Portal";
                    }
                    if (previlage.name === "Ticketing Portal") {
                      global.previlage7 = "Ticketing Portal";
                    }
                    if (previlage.name === "Kitchen Management") {
                      global.privilege8 = "Kitchen Management";
                    }
                    if (previlage.name === "Menu Category") {
                      global.privilege9 = "Menu Category";
                    }
                    if (previlage.name === "Hotel Management") {
                      global.privilege10 = "Hotel Management";
                    }
                    privilegesSet.add(previlage.name);
                  }
                  data = Array.from(privilegesSet);
                  // console.log({ data }, "Privfinl");
                  this.getData();
                } else {
                  alert("Mobile Privileges Not Found");
                  this.props.navigation.push("Login");
                }
              }
            });
          })
          .catch((err) => {
            console.error(err);
          });
      }
    });
  }

  // Grouping the privileges
  groupByPrivileges = (array) => {
    // console.log({ array });
    let initialValue = {
      mobile: [],
      web: []
    };
    return array.reduce((accumulator, current) => {
      (current.previlegeType === 'Mobile') ? accumulator.mobile.push(current) : accumulator.web.push(current);
      return accumulator;
    }, initialValue);
  };

  // mapping the firstdisplay name & navigating
  async getData() {
    const { firstDisplayName, firstDisplayNameScreen } = this.state;
    this.setState({ privilages: [] }, () => {
      if (currentSelection === "") {
        currentSelection = firstDisplayName;
        this.setState({
          firstDisplayNameScreen: screenMapping[firstDisplayName],
          privilages: []
        });
        this.props.navigation.navigate(
          screenMapping[firstDisplayName],
          this.renderSubHeadings(firstDisplayName)
        );
      } else if (firstDisplayRoute === currentSelection) {
        this.props.navigation.navigate(
          screenMapping[firstDisplayRoute],
          this.renderSubHeadings(firstDisplayName)
        );
      }
    });
  }

  // For SubPrivileges
  async renderSubHeadings(privilegeName) {
    console.log({ privilegeName });
    this.setState({ headerNames: [], privilages: [] }, async () => {
      await AsyncStorage.getItem("rolename").then(value => {
        UrmService.getPrivillagesByRoleName(value).then(async (res) => {
          // console.log(res.data, "TopPrev");
          if (res) {
            if (res.data) {
              let finalSubResult = this.groupBySubPrivileges(res.data.parentPrivileges);
              // console.log({ finalSubResult })
              const { isClient } = this.state;
              var mobileSubPriv = isClient ? finalSubResult.web : finalSubResult.mobile;
              let len = mobileSubPriv.length;
              console.log({ mobileSubPriv, len });
              for (let i = 0; i < len; i++) {
                let privilege = mobileSubPriv[i];
                console.log({ privilege });
                if (privilege.name === String(privilegeName)) {
                  let privilegeId = privilege.id;
                  let sublen = privilege.subPrivileges.length;
                  let subPrivileges = privilege.subPrivileges;
                  console.log({ subPrivileges, sublen });
                  for (let i = 0; i < sublen; i++) {
                    if (privilegeId === subPrivileges[i].parentPrivilegeId) {
                      let routes = subPrivileges[i].name;
                      this.state.headerNames.push({ name: routes });
                      console.log({ routes });
                      // console.log("Header Names", this.state.headerNames);
                    }
                  }
                  await this.setState({ headerNames: this.state.headerNames }, () => {
                    for (let j = 0; j < this.state.headerNames.length; j++) {
                      if (j === 0) {
                        this.state.privilages.push({
                          bool: true,
                          name: this.state.headerNames[j].name,
                        });
                      } else {
                        this.state.privilages.push({
                          bool: false,
                          name: this.state.headerNames[j].name,
                        });
                      }
                    }
                  });
                  await this.setState({ privilages: this.state.privilages }, () => {
                    this.props.navigation.navigate(String(this.state.privilages[0].name));
                    if (this.state.privilages[0].name === "Menu" || this.state.privilages[0].name === "Invoice" || this.state.privilages[0].name === "Order status") {
                      this.getAllTables();
                      this.setState({ toggleTableBtn: true, subHeaderName: String(this.state.privilages[0].name) });
                      if (this.state.privilages[0].name === "Invoice") {
                        this.setState({ disableBooking: true });
                      } else {
                        this.setState({ disableBooking: false });
                      }
                    } else {
                      this.setState({ toggleTableBtn: false, subHeaderName: String(this.state.privilages[0].name) });
                    }
                    // console.log(this.state.privilages, "TopPtiv");
                    if (this.state.privilages.length > 0) {
                      // console.log(this.state.privilages, "buyPtiv")
                      this.changeNavigation();
                    }
                  });
                }
              }
            }
          }
        });
      });
    });
  }

  // for the flatlist to scroll back to index
  changeNavigation() {
    this.flatListRef.scrollToIndex({ animated: true, index: 0 });
  }

  // Grouping subprivileges
  groupBySubPrivileges(array) {
    console.log({ array });
    let initialValue = {
      mobile: [],
      web: []
    };
    return array.reduce((accumulator, current) => {
      (current.previlegeType === 'Mobile') ? accumulator.mobile.push(current) : accumulator.web.push(current);
      return accumulator;
    }, initialValue);
  }

  async componentWillUnmount() {
    await this.setState({ privilages: [] });
  }

  // Handling the popupModels
  modalHandle() {
    this.setState({ modalVisibleData: !this.state.modalVisibleData });
  }

  // For Refreshing the main privileges
  refresh() {
    console.log("inside refresh");
    this.setState({ refresh: !this.state.refresh });
  }

  // Handling model popup
  popupHandle() {
    this.setState({ popupModel: !this.state.popupModel });
  }

  // Profile Model Popup
  openProfilePopup() {
    this.setState({ popupModel: true });
  }

  // Navigate to settings
  settingsNavigate() {
    this.props.navigation.push("Settings");
    this.setState({ popupModel: false });
  }

  // Navigate to select store
  selectStoreNavigate() {
    this.props.navigation.navigate("SelectStore");
    this.setState({ popupModel: false });
  }

  // Navigate to select client
  selectClientNavigate() {
    this.props.navigation.navigate("SelectClient");
    this.setState({ popupModel: false });
  }

  // Navigate to login page
  logoutNavigation() {
    this.props.navigation.push("Login");
    this.setState({ popupModel: false });
  }

  // getItemLayout = (data, index) => (
  //   { length: this.state.privilages.length, offset: this.state.privilages.length * index, index }
  // )

  // For sub privileges navigation
  handleSubHeaderNavigation(value, index) {
    if (this.state.privilages[index].bool === true) {
      this.state.privilages[index].bool = false;
    } else {
      this.state.privilages[index].bool = true;
    }
    for (let i = 0; i < this.state.privilages.length; i++) {
      if (index != i) {
        this.state.privilages[i].bool = false;
      }
      this.setState({ privilages: this.state.privilages }, () => {
        const { privilages } = this.state;
        console.log({ value });
        if (value === "Menu" || value === "Invoice" || value === "Order Status") {

          this.getAllTables();
          this.setState({ toggleTableBtn: true, subHeaderName: value });
          if (value === "Invoice") {
            this.setState({ disableBooking: true });
          } else {
            this.setState({ disableBooking: false });
          }
        }
        else {
          this.setState({ toggleTableBtn: false });
        }
        this.props.navigation.replace(String(value), { table: this.state.selectedTable }, () => {
        });
      });
    }
  }

  // Tables Category
  getAllTables() {
    const type = 'Table';
    CustomerService.getTablesList(this.state.storeId, this.state.clientId, type).then((res) => {
      if (res?.data) {
        let tabels = res.data;
        tabels.concat({ clicked: false });
        console.log({ tabels });
        this.setState({ availTables: tabels }, () => {
          let fromTable = [];
          let toTable = [];
          for (let i = 0; i < res.data.length; i++) {
            if (res.data[i].status === true) {
              fromTable.push({ label: res.data[i].name, value: res.data[i].id });
            } else {
              toTable.push({ label: res.data[i].name, value: res.data[i].id });
            }
          }
          console.log({ fromTable, toTable });
          this.setState({ fromTableList: fromTable, toTableList: toTable });
        });
      }
    }).catch(err => {
      console.error({ err });
    });
  }

  // Show All Tables
  showAllTables() {
    this.getAllTables();
    this.getAllRooms();
    this.setState({ toggleTableModel: true, selectedModel: "Table" });
  }

  modelCancel() {
    this.setState({ toggleTableModel: false });
  }

  handleSelectTable(item, index) {
    console.log({ item });
    this.setState({ selectedTable: item }, () => {
      if (this.state.showBookDisabled) {
        this.props.navigation.replace(this.state.subHeaderName, { table: this.state.selectedTable });
        this.setState({ toggleTableModel: false });
      }
    });
    if (item.status === false) {
      this.setState({ showBookDisabled: false });
    } else {
      this.setState({ showBookDisabled: true });
    }
  }

  handleBookTable() {
    let obj = {
      status: true,
      id: this.state.selectedTable.id,
      storeId: this.state.storeId
    };
    console.log({ obj });
    CustomerService.bookTable(obj).then((res) => {
      if (res?.data) {
        let bookres = res?.data;
        console.log({ bookres });
        this.getAllTables();
        this.modelCancel();
        this.props.navigation.replace(this.state.subHeaderName, { table: this.state.selectedTable });
        this.setState({ toggleTableModel: false, showBookDisabled: true });
      }
    }).catch((err) => {
      console.log({ err });
      // alert("Something Went Wrong");
      this.setState({ toggleTableModel: false });
    });
  }

  handleFromTable = (value) => {
    console.log({ value });
    this.setState({ fromTable: value });
  };

  handleToTable = (value) => {
    console.log({ value });
    this.setState({ toTable: value });
  };


  handleShiftTable() {
    const { fromTable, toTable } = this.state;
    CustomerService.shiftTable(fromTable, toTable).then((res) => {
      let response = res?.data;
      console.log({ response }, res);
      if (response) {
        this.getAllTables();
        this.modelCancel();
        this.props.navigation.replace(this.state.subHeaderName);
      }
    }).catch((err) => {
      console.log({ err });
      this.getAllTables();
      this.modelCancel();
    });
  }


  // Room Category
  getAllRooms() {
    const type = "Room";
    CustomerService.getRoomsList(this.state.storeId, this.state.clientId, type).then((res) => {
      if (res?.data) {
        let rooms = [];
        rooms = res.data;

        console.log({ rooms });
        this.setState({ availRooms: rooms }, () => {
          let fromRoom = [];
          let toRoom = [];
          for (let i = 0; i < res.data.length; i++) {
            if (res.data[i].status === true) {
              fromRoom.push({ label: res.data[i].name, value: res.data[i].id });
            } else {
              toRoom.push({ label: res.data[i].name, value: res.data[i].id });
            }
          }
          console.log({ fromRoom, toRoom });
          this.setState({ fromRoomList: fromRoom, toRoomList: toRoom });
        });
      }
    }).catch(err => {
      console.error({ err });
    });
  }

  handleSelectRoom(item, index) {
    console.log({ item });
    this.setState({ selectedRoom: item }, () => {
      if (this.state.showBookDisabled || item.isOrderPlaced === true || this.state.disableBooking === true) {
        this.props.navigation.replace(this.state.subHeaderName, { table: this.state.selectedRoom });
        this.setState({ toggleTableModel: false });
      }
    });
    if (item.status === false) {
      this.setState({ showBookDisabled: false });
    } else {
      this.setState({ showBookDisabled: true });
    }
  }


  handleBookRoom() {
    let obj = {
      status: true,
      id: this.state.selectedRoom.id,
      storeId: this.state.storeId
    };
    console.log({ obj });
    CustomerService.bookRoom(obj).then((res) => {
      if (res?.data) {
        let bookres = res?.data;
        console.log({ bookres });
        this.getAllRooms();
        this.modelCancel();
        this.props.navigation.replace(this.state.subHeaderName, { table: this.state.selectedRoom });
        this.setState({ toggleTableModel: false, showBookDisabled: true });
      }
    }).catch((err) => {
      console.log({ err });
      // alert("Something Went Wrong");
      this.setState({ toggleTableModel: false });
    });
  }

  handleFromRoom = (value) => {
    console.log({ value });
    this.setState({ fromRoomValue: value });
  };

  handleToRoom = (value) => {
    console.log({ value });
    this.setState({ toRoomValue: value });
  };

  handleShiftRoom() {
    const { fromRoomValue, toRoomValue } = this.state;
    CustomerService.shiftRoom(fromRoomValue, toRoomValue).then((res) => {
      let response = res?.data;
      console.log({ response }, res);
      if (response) {
        this.getAllRooms();
        this.modelCancel();
        this.props.navigation.replace(this.state.subHeaderName);
      }
    }).catch((err) => {
      console.log({ err });
      this.getAllRooms();
      this.modelCancel();
    });
  }

  // Table/Room model selection functons
  getTableModel() {
    this.setState({ selectedModel: "Table" }, () => {
      this.getAllTables();
    });
  }

  getRoomModel() {
    this.setState({ selectedModel: "Room" }, () => {
      this.getAllRooms();
    });
  }


  render() {
    displayName =
      currentSelection === "" ? this.state.firstDisplayName : currentSelection;
    return (
      <>
        <View style={scss.topBarContainer}>
          <View style={scss.titleContainer}>
            <View style={scss.titleSubContainer}>
              <Image
                style={scss.logoimg}
                source={require("../commonUtils/assets/Images/r_logo.png")}
              />
            </View>
            <View style={scss.titleSubContainer}>
              <TouchableOpacity onPress={() => this.openProfilePopup()}
                style={scss.profileToggleBtn}>
                <Text style={[scss.heading_title, { fontWeight: "bold" }]}>
                  {global.username ? global.username : "Loading"}
                </Text>
                <Icon
                  name="menu-down"
                  color="#000"
                  size={25}
                ></Icon>
              </TouchableOpacity>
              <Text style={scss.heading_subtitle}>{global.userrole === "client_support" ? global.userrole : global.storeName ? global.storeName : "Loading"}</Text>
            </View>
          </View>
          <View>
            {this.state.toggleTableBtn && (<TouchableOpacity onPress={() => this.showAllTables()}>
              <Text>
                <Icon name="table-chair" />{" "}
                Book
              </Text>
            </TouchableOpacity>)}
          </View>
          {this.state.popupModel &&
            <Modal isVisible={this.state.popupModel}
              onRequestClose={() => {
                this.popupHandle();
              }}
              style={{ margin: 0 }}
              onBackButtonPress={() => this.popupHandle()}
              onBackdropPress={() => this.popupHandle()}
              animationIn={"slideInUp"} animationOut={"slideOutDown"} animationInTiming={500} animationOutTiming={700}>
              <View style={scss.popUp}>
                <Text style={scss.popUp_decorator}>-</Text>
                <View style={scss.popupModelContainer}>
                  <View style={scss.popUpButtons}>
                    <TEXT variant="labelMedium" style={[scss.popUpText, { textAlign: 'left' }]}>Role: <Text style={{ color: '#ED1C24' }}>{global.userrole}</Text> </TEXT>
                  </View>
                  <TouchableOpacity onPress={() => this.settingsNavigate()} style={scss.popUpButtons}>
                    <IconMA
                      name="person-outline"
                      size={25}
                      style={scss.popUpIcons}
                    ></IconMA>
                    <TEXT variant="labelMedium" style={scss.popUpText}>Profile</TEXT>
                  </TouchableOpacity>
                  {global.userrole === "client_support" ?
                    <TouchableOpacity style={[scss.popUpButtons]} onPress={() => this.selectClientNavigate()}>
                      <IconMA
                        name="people-outline"
                        size={25}
                        style={scss.popUpIcons}
                      ></IconMA>
                      <TEXT variant="labelMedium" style={[scss.popUpText]}>Select Client</TEXT>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity onPress={() => this.selectStoreNavigate()}
                      style={[scss.popUpButtons]}>
                      <IconMA
                        name="storefront"
                        size={25}
                        style={scss.popUpIcons}
                      ></IconMA>
                      <TEXT variant="labelMedium" style={[scss.popUpText]}>Select Store</TEXT>
                    </TouchableOpacity>}
                  <TouchableOpacity onPress={() => this.logoutNavigation()} style={[scss.popUpButtons]}>
                    <IconMA
                      name="logout"
                      color="#ED1C24"
                      size={25}
                      style={scss.popUpIcons}
                    ></IconMA>
                    <TEXT variant="labelMedium" style={[scss.popUpText, { color: "#ED1C24" }]}>Logout</TEXT>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          }
          <>
            <View>
              <TouchableOpacity
                style={{ flexDirection: "row", }}
                onPress={() => this.modalHandle()}
              >
                <Image
                  style={scss.icon}
                  source={GetImageBasedOnPrevilageName(
                    currentSelection === ""
                      ? this.state.firstDisplayName
                      : currentSelection,
                  )}
                />
                <Text style={scss.textItem}>{displayName ? I18n.t(displayName) : "Loading..."}</Text>
                <Image
                  style={{ margin: 10 }}
                  source={require("../components/assets/images/list_trangle.png")}
                />
              </TouchableOpacity>
            </View>
            {this.state.modalVisibleData && (
              <Modal
                style={{ margin: 0, backgroundColor: "rgba(0,0,0,0.7)", }}
                transparent={true}
                animationType="fade"
                visible={this.state.modalVisibleData}
                onRequestClose={() => {
                  this.modalHandle();
                }}
                onBackButtonPress={() => this.modalHandle()}
                onBackdropPress={() => this.modalHandle()}
              >
                <View style={scss.navigatorContainer}>
                  <View style={scss.navigatorSubContainer}>
                    <FlatList
                      data={data}
                      renderItem={(item) => this._renderItem(item)}
                      keyExtractor={(item, index) => String(index)} contentContainerStyle={{
                        flexDirection: "column",
                        justifyContent: "center",
                      }}
                    />
                  </View>
                </View>
              </Modal>
            )}
          </>
        </View>
        <View style={{ backgroundColor: '#d6d6d6', height: 40, width: '100%' }}>
          <FlatList
            horizontal
            data={this.state.privilages ? this.state.privilages : [{ name: 'Loading' }]}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            ref={(ref) => this.flatListRef = ref}
            keyExtractor={(item, index) => String(index)}
            style={headers.pageNavigationContainer}
            renderItem={({ item, index }) => (
              <View>
                <TouchableOpacity style={[headers.pageNavigationBtn, {
                  borderColor: item.bool ? "#ed1c24" : "#d7d7d7",
                  borderBottomWidth: item.bool ? 3 : 0
                }]} onPress={() => this.handleSubHeaderNavigation(item.name, index)}>
                  <Text style={headers.pageNavigationBtnText}>{item.name}</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
        {this.state.toggleTableModel && (
          <Modal style={{ margin: 0 }}
            isVisible={this.state.toggleTableModel}
            onBackButtonPress={() => this.modelCancel()}
            onBackdropPress={() => this.modelCancel()}
          >
            <View style={forms.tableModelContainer}>
              <View style={{ flexDirection: 'row', marginBottom: 20 }}>
                <TouchableOpacity onPress={() => this.getTableModel()}
                  style={{ minWidth: '50%', height: 50, backgroundColor: this.state.selectedModel === "Table" ? "#FFF" : '#d9d9d9', justifyContent: 'center', borderRightWidth: 1, borderRightColor: '#000', borderBottomColor: '#000', borderBottomWidth: this.state.selectedModel === "Table" ? 0 : 1 }}>
                  <Text style={{ textAlign: 'center', fontSize: 16, fontWeight: 'bold', color: this.state.selectedModel === "Table" ? "#000" : "#aaa" }}>Table</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.getRoomModel()}
                  style={{ minWidth: '50%', height: 50, backgroundColor: this.state.selectedModel === "Room" ? "#FFF" : '#d9d9d9', justifyContent: 'center', borderLeftColor: '#000', borderLeftWidth: 1, borderBottomColor: '#000', borderBottomWidth: this.state.selectedModel === "Room" ? 0 : 1 }}>
                  <Text style={{ textAlign: 'center', fontSize: 16, fontWeight: 'bold', color: this.state.selectedModel === "Room" ? "#000" : "#aaa" }}>Room</Text>
                </TouchableOpacity>
              </View>
              {this.state.selectedModel === "Table" ?
                <View style={{ justifyContent: 'space-around', alignItems: 'center', flexDirection: 'column' }}>
                  <Text style={[{ fontSize: 18, fontWeight: 'bold' }]}>Table Management</Text>
                  <View style={forms.filterModelSub}>
                    <Text style={{ fontSize: 16, marginLeft: 20, marginTop: 10, marginBottom: 10 }}>Select Table</Text>
                    <>
                      <View style={styles.tableBody}>
                        <FlatList
                          // keyExtractor={(item, index) => String(index)}
                          numColumns={5}
                          data={this.state.availTables}
                          renderItem={({ item, index }) => (
                            <View style={styles.tableContainer}>
                              <TouchableOpacity onPress={() => this.handleSelectTable(item, index)} style={[styles.tableBtn, { backgroundColor: item.status ? "#ddd" : "#fff" }]}>
                                <IconMAA name='table-furniture' size={20}></IconMAA>
                                <Text style={{ fontSize: 14 }}>{item.name}</Text>
                              </TouchableOpacity>
                            </View>
                          )}
                        />
                      </View>
                      {this.state.disableBooking === false && <TouchableOpacity style={[forms.action_buttons, { backgroundColor: this.state.showBookDisabled ? '#d9d9d9' : '#ed1c24' }]} disabled={this.state.showBookDisabled} onPress={() => this.handleBookTable()}>
                        <Text style={forms.submit_btn_text}>Book</Text>
                      </TouchableOpacity>}
                      <Text style={{ fontSize: 16, marginLeft: 20, marginTop: 10, marginBottom: 10 }}>Switch Table to</Text>
                      <View style={{ display: 'flex', flexDirection: 'row' }}>
                        <View style={{ width: Device.isTablet ? RW(280) : RW(180) }}>
                          <RnPicker
                            items={this.state.fromTableList}
                            setValue={this.handleFromTable}
                            placeHolder={"From"}
                          />
                        </View>
                        <View style={{ width: Device.isTablet ? RW(280) : RW(180) }}>
                          <RnPicker
                            items={this.state.toTableList}
                            setValue={this.handleToTable}
                            placeHolder={"To"}
                          />
                        </View>
                      </View>
                      <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: "center" }}>
                        <TouchableOpacity style={[forms.action_buttons, { backgroundColor: '#ed1c24' }]} onPress={() => this.handleShiftTable()} >
                          <Text style={forms.submit_btn_text}>Save</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[forms.action_buttons, { borderColor: '#dcdcdc', borderWidth: 1 }]}>
                          <Text style={forms.cancel_btn_text}>Cancel</Text>
                        </TouchableOpacity>
                      </View>
                    </>
                  </View>
                </View> : <View style={{ justifyContent: 'space-around', alignItems: 'center', flexDirection: 'column' }}>
                  <Text style={[{ fontSize: 18, fontWeight: 'bold' }]}>Room Management</Text>
                  <View style={forms.filterModelSub}>
                    <Text style={{ fontSize: 16, marginLeft: 20, marginTop: 10, marginBottom: 10 }}>Select Room</Text>
                    <>
                      <View style={styles.tableBody}>
                        <FlatList
                          // keyExtractor={(item, index) => String(index)}
                          numColumns={5}
                          data={this.state.availRooms}
                          renderItem={({ item, index }) => (
                            <View style={styles.tableContainer}>
                              <TouchableOpacity onPress={() => this.handleSelectRoom(item, index)} style={[styles.tableBtn, { backgroundColor: item.clicked ? "#0d0" : item.status ? "#ddd" : "#fff" }]}>
                                <IconMAA name='table-furniture' size={20}></IconMAA>
                                <Text style={{ fontSize: 14 }}>{item.name}</Text>
                              </TouchableOpacity>
                            </View>
                          )}
                        />
                      </View>

                      {this.state.disableBooking === false && <TouchableOpacity style={[forms.action_buttons, { backgroundColor: this.state.showBookDisabled ? '#d9d9d9' : '#ed1c24' }]} disabled={this.state.showBookDisabled} onPress={() => this.handleBookRoom()}>
                        <Text style={forms.submit_btn_text}>Book</Text>
                      </TouchableOpacity>}
                      <View style={{ height: 185 }}></View>
                      {/* <Text style={{ fontSize: 16, marginLeft: 20, marginTop: 10, marginBottom: 10 }}>Switch Room to</Text>
                      <View style={{ display: 'flex', flexDirection: 'row' }}>
                        <View style={{ width: Device.isTablet ? RW(280) : RW(180) }}>
                          <RnPicker
                            items={this.state.fromRoomList}
                            setValue={this.handleFromRoom}
                            placeHolder={"From"}
                          />
                        </View>
                        <View style={{ width: Device.isTablet ? RW(280) : RW(180) }}>
                          <RnPicker
                            items={this.state.toRoomList}
                            setValue={this.handleToRoom}
                            placeHolder={"To"}
                          />
                        </View>
                      </View>
                      <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: "center" }}>
                        <TouchableOpacity style={[forms.action_buttons, { backgroundColor: '#ed1c24' }]} onPress={() => this.handleShiftRoom()} >
                          <Text style={forms.submit_btn_text}>Save</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[forms.action_buttons, { borderColor: '#dcdcdc', borderWidth: 1 }]}>
                          <Text style={forms.cancel_btn_text}>Cancel</Text>
                        </TouchableOpacity>
                      </View> */}
                    </>
                  </View>
                </View>}
            </View>
          </Modal>
        )}
      </>
    );
  }
}





export default TopBar;
