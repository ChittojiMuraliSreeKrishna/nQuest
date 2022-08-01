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
import { buttonContainer, buttonStyle, buttonStyle1, filterBtn, flatListMainContainer, flatlistSubContainer, headerNavigationBtn, headerNavigationBtnText, headerTitle, headerTitleContainer, headerTitleSubContainer, headerTitleSubContainer2, highText, buttonImageStyle, menuButton, textContainer, textStyleLight, textStyleMedium, flatListHeaderContainer, flatListTitle, singleButtonStyle } from '../Styles/Styles';
import { filterMainContainer, filterSubContainer, filterHeading, filterCloseImage, deleteText, deleteHeading, deleteHeader, deleteContainer, deleteCloseBtn } from '../Styles/PopupStyles';
import { inputField, rnPickerContainer, rnPicker, submitBtn, submitBtnText, cancelBtn, cancelBtnText, datePicker, datePickerBtnText, datePickerButton1, datePickerButton2, datePickerContainer, dateSelector, dateText, } from '../Styles/FormFields';
import scss from '../../commonUtils/assets/styles/style.scss';

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



  async componentDidMount() {
    const clientId = await AsyncStorage.getItem("custom:clientId1");
    this.setState({ clientId: clientId });
    console.log({ clientId });
    this.getAllUsers();
  }

  // Get All Users
  getAllUsers() {
    this.setState({ usersList: [] });
    const { clientId, pageNumber } = this.state;
    UrmService.getAllUsers(clientId, pageNumber).then(res => {
      let userResponse = res.data.content;
      console.log({ userResponse });
      if (res) {
        if (res.data) {
          this.setState({ usersList: this.state.usersList.concat(userResponse), totalPages: res.data.totalPages });
        }
      }
    });
  }

  // Filter Actions
  // Applying Filter Action
  applyUserFilter() {
    const { userType, role, branch, clientId, pageNumber } = this.state;
    const searchUser = {
      "id": 0,
      "phoneNo": null,
      "name": null,
      "active": userType === "Active" ? "True" : "False",
      "inActive": userType === "InActive" ? "True" : "False",
      "roleName": role ? role.trim() : null,
      "storeName": branch ? branch.trim() : null,
      "clientId": clientId
    };
    UrmService.getUserDetails(searchUser, pageNumber).then(res => {
      if (res) {
        let filteredUserRes = res.data.result.content;
        console.log({ filteredUserRes });
        this.setState({ modalVisible: false, filterActive: true, filterUserList: filteredUserRes });
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
  modelCancel() {
    this.setState({ modalVisible: false });
  }

  // Filter Button Actions
  filterAction() {
    this.setState({ flagFilterOpen: true, modalVisible: true });
  }
  clearFilterAction() {
    this.setState({ filterActive: false });
  }

  // Edit User Navigation
  handleedituser(item, index) {
    this.props.navigation.navigate('AddUser',
      {
        item: item, isEdit: true,
        onGoBack: () => this.getAllUsers(),
      });
  }

  // Add User Navigation
  handleAddUser(item, index) {
    this.props.navigation.navigate('AddUser', {
      isEdit: false,
      onGoBack: () => this.getAllUsers()
    });
  }

  render() {
    return (
      <View>
        <FlatList
          style={scss.flatListBody}
          ListHeaderComponent={<View style={scss.headerContainer}>
            <Text style={flatListTitle}>Users - <Text style={{ color: '#ED1C24' }}>{this.state.usersList.length}</Text></Text>
            <View style={scss.headerContainer}>
              <TouchableOpacity onPress={() => this.handleAddUser()}>
                <Image style={{ height: 20, width: 30, marginRight: 10 }} source={require('../../commonUtils/assets/Images/create_user_icon.png')} />
              </TouchableOpacity>
              {!this.state.filterActive &&
                <TouchableOpacity
                  style={filterBtn}
                  onPress={() => this.filterAction()} >
                  <Image style={{ alignSelf: 'center', top: 5 }} source={require('../assets/images/promofilter.png')} />
                </TouchableOpacity>
              }
              {this.state.filterActive &&
                <TouchableOpacity
                  style={filterBtn}
                  onPress={() => this.clearFilterAction()} >
                  <Image style={{ alignSelf: 'center', top: 5 }} source={require('../assets/images/clearFilterSearch.png')} />
                </TouchableOpacity>
              }
            </View>
          </View>}
          data={this.state.filterActive ? this.state.filterUserList : this.state.usersList}
          ListEmptyComponent={<EmptyList message={this.state.rolesError} />}
          scrollEnabled={true}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View>
              <ScrollView>
                <View style={scss.flatListContainer}>
                  <View style={scss.flatListSubContainer}>
                    <View style={scss.textContainer}>
                      <Text style={scss.highText}>UserId: {item.id}</Text>
                    </View>
                    <View style={scss.textContainer}>
                      <Text style={scss.textStyleMedium}>UserName: {item.userName}</Text>
                      <View style={scss.buttonContainer}>
                        {item.isActive ?
                          <Text style={[scss.textStyleMedium, { backgroundColor: '#009900', color: '#ffffff', marginTop: 5, padding: Device.isTablet ? 10 : 5, alignSelf: 'flex-start', borderRadius: Device.isTablet ? 10 : 5, fontFamily: 'medium' }]}>Active</Text>
                          :
                          <Text style={[scss.textStyleMedium, { backgroundColor: '#ee0000', color: '#ffffff', marginTop: 5, padding: Device.isTablet ? 10 : 5, alignSelf: 'flex-start', borderRadius: 5, fontFamily: 'medium' }]}>In-Active</Text>
                        }
                      </View>
                    </View>
                    <View style={scss.textContainer}>
                      <Text style={scss.textStyleMedium}>Stores: {item.stores.map((store, index) => {
                        return <Text>{store.name}, </Text>;
                      })}</Text>
                    </View>
                    <View style={scss.flatListFooter}>
                      <Text style={scss.footerText}>Date: {item.createdDate ? item.createdDate.toString().split(/T/)[0] : item.createdDate}</Text>
                      <TouchableOpacity style={scss.footerSingleBtn} onPress={() => this.handleedituser(item, index)}>
                        <Image style={scss.footerBtnImg} source={require('../assets/images/edit.png')} />
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
            <Modal isVisible={this.state.modalVisible} style={{ margin: 0 }}>
              <View style={filterMainContainer} >
                <View>
                  <View style={filterSubContainer}>
                    <View>
                      <Text style={filterHeading} > {I18n.t("Filter By")} </Text>
                    </View>
                    <View>
                      <TouchableOpacity style={filterCloseImage} onPress={() => this.modelCancel()}>
                        <Image style={{ margin: 5 }} source={require('../assets/images/modelcancel.png')} />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <Text style={{
                    height: Device.isTablet ? 2 : 1,
                    width: deviceWidth,
                    backgroundColor: 'lightgray',
                  }}></Text>
                </View>
                <KeyboardAwareScrollView enableOnAndroid={true} >

                  <View style={rnPickerContainer}>
                    <RNPickerSelect
                      placeholder={{
                        label: 'USER TYPE'
                      }}
                      Icon={() => {
                        return <Chevron style={styles.imagealign} size={1.5} color="gray" />;
                      }}
                      items={[
                        { label: 'Active', value: 'Active' },
                        { label: 'InActive', value: 'InActive' },
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
                  <TouchableOpacity style={submitBtn}
                    onPress={() => this.applyUserFilter()}>
                    <Text style={submitBtnText} >{I18n.t("APPLY")}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={cancelBtn}
                    onPress={() => this.modelCancel()}>
                    <Text style={cancelBtnText}>{I18n.t("CANCEL")}</Text>
                  </TouchableOpacity>
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
    justifyContent: 'center',
    // backgroundColor: '#FAFAFF'
  },
  flatList: {
    marginTop: 20
  },
});
