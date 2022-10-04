import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { Component } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,

  TouchableOpacity,
  View
} from "react-native";
import Device from "react-native-device-detection";
import I18n from "react-native-i18n";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Modal from "react-native-modal";
import { TextInput } from 'react-native-paper';
import RNPickerSelect from "react-native-picker-select";
import { Chevron } from "react-native-shapes";
import forms from '../../commonUtils/assets/styles/formFields.scss';
import scss from "../../commonUtils/assets/styles/style.scss";
import { RH } from "../../Responsive";
import EmptyList from "../Errors/EmptyList";
import UrmService from "../services/UrmService";
import {
  inputField,
  rnPicker,
  rnPickerContainer
} from "../Styles/FormFields";
import {
  filterCloseImage,
  filterHeading, filterSubContainer
} from "../Styles/PopupStyles";
import { filterBtn } from "../Styles/Styles";


var deviceheight = Dimensions.get("window").height;
var deviceWidth = Dimensions.get("window").width;
export default class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clientId: 0,
      pageNumber: 0,
      usersList: [],
      filterUserList: [],
      totalPages: 0,
      filterActive: false,
      modalVisible: true,
      flagFilterOpen: false,
      role: "",
      branch: "",
      userType: "",
    };
  }

  async componentDidMount () {
    const clientId = await AsyncStorage.getItem("custom:clientId1");
    this.setState({ clientId: clientId });
    console.log({ clientId });
    this.getAllUsers();
  }

  // Refresh Users
  refresh () {
    this.setState({ usersList: [] }, () => {
      this.getAllUsers();
    });
  }

  // Get All Users
  getAllUsers () {
    this.setState({ usersList: [] });
    const { clientId, pageNumber } = this.state;
    UrmService.getAllUsers(clientId, pageNumber).then((res) => {
      let userResponse = res.data.content;
      console.log({ userResponse });
      if (res) {
        if (res.data) {
          this.setState({
            usersList: this.state.usersList.concat(userResponse),
            totalPages: res.data.totalPages,
          });
        }
      }
    });
  }

  // Filter Actions
  // Applying Filter Action
  applyUserFilter () {
    const { userType, role, branch, clientId, pageNumber } = this.state;
    const searchUser = {
      id: 0,
      phoneNo: null,
      name: null,
      active: userType === "Active" ? "True" : "False",
      inActive: userType === "InActive" ? "True" : "False",
      roleName: role ? role.trim() : null,
      storeName: branch ? branch.trim() : null,
      clientId: clientId,
    };
    UrmService.getUserBySearch(searchUser, pageNumber).then((res) => {
      if (res) {
        console.log("user responsee", res.data.result);
        if (res?.data && res.data.status === 200) {
          let filteredUserRes = res.data.result.content;
          console.log({ filteredUserRes });
          this.setState({
            modalVisible: false,
            filterActive: true,
            filterUserList: filteredUserRes,
          });
          this.setState({
            branch: "",
            role: ""
          });
        } else {
          this.setState({ modalVisible: false });
          alert(res.data.message);
        }
      }
    });
  }

  // User Type Action
  handleUSerType = (value) => {
    this.setState({ userType: value });
  };

  // Role Name Action
  handleRole = (value) => {
    this.setState({ role: value });
  };

  // Branch Name Action
  handleBranch = (value) => {
    this.setState({ branch: value });
  };

  // Model Cancel
  modelCancel () {
    this.setState({ modalVisible: false });
  }

  // Filter Button Actions
  filterAction () {
    this.setState({ flagFilterOpen: true, modalVisible: true });
  }
  clearFilterAction () {
    this.setState({ filterActive: false, userType: "", role: "", branch: "" });
  }

  // Edit User Navigation
  handleedituser (item, index) {
    this.props.navigation.navigate("AddUser", {
      item: item,
      isEdit: true,
      onGoBack: () => this.refresh(),
      goBack: () => this.refresh(),
    });
  }

  // Add User Navigation
  handleAddUser (item, index) {
    this.props.navigation.navigate("AddUser", {
      isEdit: false,
      onGoBack: () => this.refresh(),
      goBack: () => this.refresh(),
    });
  }

  render () {
    return (
      <View>
        <FlatList
          style={scss.flatListBody}
          ListHeaderComponent={
            <View style={scss.headerContainer}>
              <Text style={scss.flat_heading}>
                Users -{" "}
                <Text style={{ color: "#ED1C24" }}>
                  {this.state.usersList.length}
                </Text>
              </Text>
              <View style={scss.subHeader}>
                <TouchableOpacity
                  style={filterBtn}
                  onPress={() => this.handleAddUser()}
                >
                  <Image
                    style={{
                      alignSelf: "flex-end",
                      height: 20,
                      width: 30,
                    }}
                    source={require("../../commonUtils/assets/Images/create_user_icon.png")}
                  />
                </TouchableOpacity>
                {!this.state.filterActive && (
                  <TouchableOpacity
                    style={filterBtn}
                    onPress={() => this.filterAction()}
                  >
                    <Image
                      style={{ alignSelf: "flex-end" }}
                      source={require("../assets/images/promofilter.png")}
                    />
                  </TouchableOpacity>
                )}
                {this.state.filterActive && (
                  <TouchableOpacity
                    style={filterBtn}
                    onPress={() => this.clearFilterAction()}
                  >
                    <Image
                      style={{ alignSelf: "flex-end" }}
                      source={require("../assets/images/clearFilterSearch.png")}
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          }
          data={
            this.state.filterActive
              ? this.state.filterUserList
              : this.state.usersList
          }
          ListEmptyComponent={<EmptyList message={this.state.rolesError} />}
          scrollEnabled={true}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View>
              <ScrollView>
                <View style={scss.flatListContainer}>
                  <View style={scss.flatListSubContainer}>
                    <View style={scss.textContainer}>
                      <Text style={scss.textStyleLight}>
                        UserName: {"\n"}
                        <Text style={scss.textStyleMedium}>
                          {item.userName}
                        </Text>
                      </Text>
                      <Text style={(scss.textStyleLight, scss.text_right)}>
                        UserId {"\n"}
                        <Text style={scss.textStyleMedium}>{item.id}</Text>
                      </Text>
                    </View>
                    <View style={scss.textContainer}>
                      <Text style={scss.textStyleLight}>
                        Store Name:{"\n"}
                        {item.stores.map((store, index) => {
                          return (
                            <Text style={scss.textStyleMedium}>
                              {store.name},
                            </Text>
                          );
                        })}
                      </Text>
                      <View style={scss.buttonContainer}>
                        {item.isActive ? (
                          <Text style={[ scss.active_txt ]}>Active</Text>
                        ) : (
                          <Text style={[ scss.inactive_txt ]}>In-Active</Text>
                        )}
                      </View>
                    </View>
                    <View style={scss.textContainer}>
                      <Text style={scss.textStyleLight}>
                        Role Name:{"\n"}
                        <Text style={scss.textStyleMedium}>{item.roleName}</Text>
                      </Text>

                    </View>
                    <View style={scss.textContainer}></View>
                    <View style={scss.flatListFooter}>
                      <Text style={scss.footerText}>
                        Date:{" "}
                        {item.createdDate
                          ? item.createdDate.toString().split(/T/)[ 0 ]
                          : item.createdDate}
                      </Text>
                      <TouchableOpacity
                        style={scss.footerSingleBtn}
                        onPress={() => this.handleedituser(item, index)}
                      >
                        <Image
                          style={scss.footerBtnImg}
                          source={require("../assets/images/edit.png")}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </ScrollView>
            </View>
          )}
        />
        {this.state.flagFilterOpen && (
          <View>
            <Modal isVisible={this.state.modalVisible} style={{ margin: 0 }}
              onBackButtonPress={() => this.modelCancel()}
              onBackdropPress={() => this.modelCancel()} >
              <View style={styles.filterMainContainer}>
                <View>
                  <View style={filterSubContainer}>
                    <View>
                      <Text style={filterHeading}> {I18n.t("Filter By")} </Text>
                    </View>
                    <View>
                      <TouchableOpacity
                        style={filterCloseImage}
                        onPress={() => this.modelCancel()}
                      >
                        <Image
                          style={{ margin: 5 }}
                          source={require("../assets/images/modelcancel.png")}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <Text
                    style={{
                      height: Device.isTablet ? 2 : 1,
                      width: deviceWidth,
                      backgroundColor: "lightgray",
                    }}
                  ></Text>
                </View>
                <KeyboardAwareScrollView enableOnAndroid={true}>
                  <View style={rnPickerContainer}>
                    <RNPickerSelect
                      placeholder={{
                        label: "USER TYPE",
                      }}
                      Icon={() => {
                        return (
                          <Chevron
                            style={styles.imagealign}
                            size={1.5}
                            color="gray"
                          />
                        );
                      }}
                      items={[
                        { label: "Active", value: "Active" },
                        { label: "InActive", value: "InActive" },
                      ]}
                      onValueChange={this.handleUSerType}
                      style={rnPicker}
                      value={this.state.userType}
                      useNativeAndroidPickerStyle={false}
                    />
                  </View>
                  <TextInput
                    style={inputField}
                    underlineColorAndroid="transparent"
                    placeholder={I18n.t("ROLE")}
                    placeholderTextColor="#6F6F6F"
                    textAlignVertical="center"
                    autoCapitalize="none"
                    value={this.state.role}
                    onChangeText={this.handleRole}
                  />
                  <TextInput
                    style={inputField}
                    underlineColorAndroid="transparent"
                    placeholder={I18n.t("STORE/BRANCH")}
                    placeholderTextColor="#6F6F6F"
                    textAlignVertical="center"
                    autoCapitalize="none"
                    value={this.state.branch}
                    onChangeText={this.handleBranch}
                  />
                  <View style={forms.action_buttons_container}>
                    <TouchableOpacity style={[ forms.action_buttons, forms.submit_btn ]}
                      onPress={() => this.applyUserFilter()}>
                      <Text style={forms.submit_btn_text} >{I18n.t("APPLY")}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[ forms.action_buttons, forms.cancel_btn ]}
                      onPress={() => this.modelCancel()}>
                      <Text style={forms.cancel_btn_text}>{I18n.t("CANCEL")}</Text>
                    </TouchableOpacity>
                  </View>
                </KeyboardAwareScrollView>
              </View>
            </Modal>
          </View>
        )}
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
    justifyContent: "center",
    // backgroundColor: '#FAFAFF'
  },
  flatList: {
    marginTop: 20,
  },
  filterMainContainer: {
    backgroundColor: '#ffffff',
    marginTop: Device.isTablet ? deviceheight - RH(500) : deviceheight - RH(400),
    height: Device.isTablet ? RH(500) : RH(400),
  }
});
