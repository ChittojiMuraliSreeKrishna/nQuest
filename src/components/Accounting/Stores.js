import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { Component } from "react";
import {
  Dimensions,
  FlatList, ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import Device from "react-native-device-detection";
import I18n from "react-native-i18n";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Modal from "react-native-modal";
import { TextInput } from "react-native-paper";
import RNPickerSelect from "react-native-picker-select";
import { Chevron } from "react-native-shapes";
import IconFA from 'react-native-vector-icons/FontAwesome';
import IconMA from 'react-native-vector-icons/MaterialIcons';
import forms from '../../commonUtils/assets/styles/formFields.scss';
import scss from "../../commonUtils/assets/styles/style.scss";
import { formatDate } from "../../commonUtils/DateFormate";
import Loader from "../../commonUtils/loader";
import RnPicker from "../../commonUtils/RnPicker";
import UrmService from "../services/UrmService";
import {
  rnPicker,
  rnPickerContainer
} from "../Styles/FormFields";

var deviceWidth = Dimensions.get("window").width;
var deviceHeight = Dimensions.get("window").height;

export default class Stores extends Component {
  constructor(props) {
    super(props);
    this.state = {
      storesDelete: false,
      modalVisible: true,
      storesList: [],
      city: "",
      storeName: "",
      storeDistrict: "",
      storeState: "",
      modalFalse: false,
      statesArray: [],
      states: [],
      stateId: 0,
      statecode: "",
      dictrictArray: [],
      dictricts: [],
      districtId: 0,
      filterStoresData: [],
      loading: false,
      flagFilterOpen: false,
      filterActive: false,
      pageNumber: 0,
      isFetching: false,
    };
  }

  componentDidMount() {
    this.getStoresList();
    this.getMasterStatesList();
    this.getMasterDistrictsList();
    this.props.navigation.addListener('focus', () => {
      this.getStoresList();
    });
  }

  // Edit Store Navigation
  handleeditStore(item, index) {
    console.log(item);
    this.props.navigation.navigate("AddStore", {
      item: item,
      isEdit: true,
      onGoBack: () => this.refresh(),
      goBack: () => this.refresh(),
    });
  }

  // Create Store Navigation
  handleCreateStore(item, index) {
    this.props.navigation.navigate("AddStore", {
      isEdit: false,
      onGoBack: () => this.refresh(),
      goBack: () => this.refresh(),
    });
  }

  // Refreshing Stores
  refresh() {
    this.setState({ storesList: [] }, () => {
      this.getStoresList();
    });
  }

  // Get All Stores
  async getStoresList() {
    this.setState({ storesList: [] });
    const clientId = await AsyncStorage.getItem("custom:clientId1");
    console.log({ clientId });
    this.setState({ loading: true });
    const { pageNumber } = this.state;
    const isActive = false;
    UrmService.getAllStores(clientId, pageNumber, isActive)
      .then((res) => {
        console.log({ res });
        if (res) {
          if (res.data) {
            let response = res.data;
            console.log({ response });
            this.setState({
              storesList: response,
            });
          }
        }
        this.setState({ loading: false });
      })
      .catch((err) => {
        console.error({ err });
        this.setState({ loading: false });
        if (this.state.flagStore === true) {
          this.setState({ storeError: "Records Not Found" });
          // alert("There is an Error while Getting Stores");
        }
      });
  }

  // Filter Actions
  // Store States
  getMasterStatesList() {
    this.setState({ states: [] });
    this.setState({ loading: false });
    var states = [];
    UrmService.getStates().then((res) => {
      if (res.data["result"]) {
        for (var i = 0; i < res.data["result"].length; i++) {
          states.push({
            value: res.data.result[i].stateCode,
            label: res.data.result[i].stateName,
          });

          if (res.data["result"][i].stateId === this.state.stateId) {
            console.log("stateId is" + this.state.statesArray[i].name);
            this.setState({ storeState: this.state.statesArray[i].name });
            // this.getMasterDistrictsList();
            this.getGSTNumber();
          }
        }
        this.setState({
          states: states,
        });
        this.setState({ statesArray: this.state.statesArray });
      }
    });
  }
  handleStoreState = (value) => {
    this.setState({ storeState: value, statecode: value }, () => {
      console.log(this.state.statecode, "yktld");
      this.getMasterDistrictsList(this.state.statecode);
    });
  };

  // Store Districts
  getMasterDistrictsList(id) {
    this.setState({ loading: true, dictricts: [], dictrictArray: [] });
    UrmService.getDistricts(id).then((res) => {
      if (res.data["result"]) {
        this.setState({ loading: false });
        let dictricts = [];
        for (var i = 0; i < res.data["result"].length; i++) {
          dictricts.push({
            value: res.data.result[i].districtId,
            label: res.data.result[i].districtName,
          });
          console.log({ dictricts });
          this.setState({
            dictricts: dictricts,
          });
          this.setState({ dictrictArray: this.state.dictrictArray },
            () => { this.setState({ loading: false }); });
        }
      } else {
        this.setState({ loading: false });
      }
    }).catch((err) => {
      console.error({ err });
      this.setState({ loading: false });
    });
  }
  handleDistrict = (value) => {
    this.setState({ storeDistrict: value, districtId: value });
  };

  // Store Name Actions
  handleStoreName = (value) => {
    this.setState({ storeName: value });
  };

  refresh() {
    this.setState({ pageNumber: 0 });
    this.getStoresList();
  }

  // Applying Filter
  applyStoreFilter() {
    const searchStore = {
      stateId: this.state.statecode ? this.state.statecode : null,
      cityId: null,
      districtId: this.state.districtId ? this.state.districtId : 0,
      storeName: this.state.storeName ? String(this.state.storeName) : null,
    };
    console.log("store search", searchStore);
    UrmService.getStoresBySearch(searchStore)
      .then((res) => {
        if (res) {
          if (res.data.isSuccess === "true") {
            this.setState({
              filterStoresData: res.data.result,
              filterActive: true,
            });
          } else {
            this.setState({ filterStoresData: [], filterActive: true });
          }
          console.log(res.data);
        }
        this.setState({ flagFilterOpen: false });
      })
      .catch((err) => {
        this.setState({ flagFilterOpen: false, filterActive: false });
      });
  }

  // Filter Cancel Actions
  filterAction() {
    this.setState({ flagFilterOpen: true, modalVisible: true });
  }
  clearFilterAction() {
    this.setState({ filterActive: false, statecode: "", districtId: '', storeName: '', storeState: "", storeDistrict: "" });
    this.getStoresList();
  }
  modelCancel() {
    this.setState({ modalVisible: false, flagFilterOpen: false });
  }

  render() {
    return (
      <View style={scss.mainContainer}>
        {this.state.loading && <Loader loading={this.state.loading} />}
        <FlatList
          ListHeaderComponent={
            <View style={scss.headerContainer}>
              <Text style={scss.flat_heading}>
                Stores List -{" "}
                <Text style={{ color: "#ED1C24" }}>
                  {this.state.filterActive ? this.state.filterStoresData.length : this.state.storesList.length}
                </Text>
              </Text>
              <View style={scss.subHeader}>
                <IconMA
                  name="add-business"
                  size={30}
                  style={{ marginRight: 10 }}
                  color="#ED1C24"
                  onPress={() => this.handleCreateStore()}
                ></IconMA>
                {!this.state.filterActive && (
                  <IconFA
                    name="sliders"
                    style={[{ marginRight: 10 }, scss.action_icons]}
                    size={25}
                    onPress={() => this.filterAction()}
                  ></IconFA>
                )}
                {this.state.filterActive && (
                  <IconFA
                    name="sliders"
                    style={{ marginRight: 10 }}
                    color="#ED1C24"
                    size={25}
                    onPress={() => this.clearFilterAction()}
                  ></IconFA>
                )}
              </View>
            </View>
          }
          data={
            this.state.filterActive
              ? this.state.filterStoresData
              : this.state.storesList
          }
          scrollEnabled={true}
          keyExtractor={(item, i) => i.toString()}
          refreshing={this.state.isFetching}
          onRefresh={() => this.refresh()}
          style={scss.flatListBody}
          ListEmptyComponent={
            <Text
              style={{
                color: "#cc241d",
                textAlign: "center",
                fontFamily: "bold",
                fontSize: Device.isTablet ? 21 : 17,
                marginTop: deviceHeight / 3,
              }}
            >
              &#9888; Records Not Found
            </Text>
          }
          renderItem={({ item, index }) => (
            <View>
              <ScrollView>
                <View style={scss.flatListContainer}>
                  <View style={scss.flatListSubContainer}>
                    <View style={scss.textContainer}>
                      <Text style={scss.textStyleLight}>
                        {I18n.t("Store Name")} {"\n"}
                        <Text style={scss.textStyleMedium}>{item.name}</Text>
                      </Text>
                      <Text style={(scss.textStyleLight, scss.text_right)}>
                        {I18n.t("Store Id")}
                        {"\n"}
                        <Text style={[scss.textStyleMedium, scss.text_right]}>
                          {item.id}{" "}
                        </Text>
                      </Text>
                    </View>
                    <View style={scss.textContainer}>
                      <Text style={scss.textStyleLight}>
                        {I18n.t("Location")}
                        {"\n"}
                        <Text style={scss.textStyleMedium}>{item.cityId} </Text>
                      </Text>
                      <View style={scss.buttonContainer}>
                        {item.isActive ? (
                          <Text style={scss.textStyleLight}>
                            Status{"\n"}
                            <Text
                              style={[scss.textStyleMedium, scss.active_txt]}
                            >
                              Active
                            </Text>
                          </Text>
                        ) : (
                          <Text
                            style={[
                              scss.textStyleMedium,
                              scss.inactive_txt
                            ]}
                          >
                            In-Active
                          </Text>
                        )}
                      </View>
                    </View>
                    <View style={scss.textContainer}>
                      <Text style={scss.textStyleLight}>
                        {I18n.t("Created By")}: {" "}
                        <Text style={scss.textStyleMedium}>
                          {item.userName}
                        </Text>
                      </Text>
                    </View>
                    <View style={scss.flatListFooter}>
                      <Text style={scss.footerText}>
                        {I18n.t("Date")} :{" "}
                        {formatDate(item.createdDate)}
                      </Text>
                      <IconFA
                        name="edit"
                        onPress={() => this.handleeditStore(item, index)}
                        size={25}
                        style={scss.action_icons}
                      ></IconFA>
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
              <View style={forms.filterModelContainer}>
                <Text style={forms.popUp_decorator}>-</Text>
                <View style={forms.filterModelSub}>
                  <KeyboardAwareScrollView>
                    <RnPicker
                      items={this.state.states}
                      setValue={this.handleStoreState}
                    />
                    <RnPicker
                      items={this.state.dictricts}
                      setValue={this.handleDistrict}
                    />
                    <TextInput
                      mode="flat"
                      outlineColor="#dfdfdf"
                      activeOutlineColor="dfdfdf"
                      style={forms.input_fld}
                      underlineColorAndroid="transparent"
                      placeholder={I18n.t("STORE NAME")}
                      placeholderTextColor="#6F6F6F"
                      textAlignVertical="center"
                      autoCapitalize="none"
                      value={this.state.storeName}
                      onChangeText={this.handleStoreName}
                    />
                    <View style={forms.action_buttons_container}>
                      <TouchableOpacity style={[forms.action_buttons, forms.submit_btn]}
                        onPress={() => this.applyStoreFilter()}>
                        <Text style={forms.submit_btn_text} >{I18n.t("APPLY")}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[forms.action_buttons, forms.cancel_btn]}
                        onPress={() => this.modelCancel()}>
                        <Text style={forms.cancel_btn_text}>{I18n.t("CANCEL")}</Text>
                      </TouchableOpacity>
                    </View>
                  </KeyboardAwareScrollView>
                </View>
              </View>
            </Modal>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  imagealign: {
    marginTop: Device.isTablet ? 25 : 20,
    marginRight: Device.isTablet ? 30 : 20,
  },
});
