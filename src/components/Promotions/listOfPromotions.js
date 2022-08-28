import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Constants from "expo-constants";
import React, { Component } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import DatePicker from "react-native-date-picker";
import Device from "react-native-device-detection";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Modal from "react-native-modal";
import RNPickerSelect from "react-native-picker-select";
import { Chevron } from "react-native-shapes";
import Loader from "../../commonUtils/loader";
import LoginService from "../services/LoginService";
import PromotionsService from "../services/PromotionsService";
import UrmService from "../services/UrmService";
var deviceWidth = Dimensions.get("window").width;

class ListOfPromo extends Component {
  constructor(props) {
    super(props);
    this.camera = null;
    this.barcodeCodes = [];
    this.state = {
      barcodeId: "",
      flagone: true,
      flagtwo: false,
      flagthree: false,
      flagFilterOpen: false,
      flagFilterPromoOpen: false,
      flagFilterLoyaltyOpen: false,
      flagAddPromo: false,
      flagAddStore: false,
      datepickerOpen: false,
      datepickerendOpen: false,
      createdByArray: [],
      createdByTempArray: [],
      selectedStatus: "",
      selectedcreatedBy: "",
      poolsData: [1, 2],
      promoData: [1, 2],
      loyaltyData: [1, 2],
      productuom: "",
      selectedPromotionType: "",
      selectedPromotionName: "",
      modalVisible: true,
      selectedPoolType: "",
      selectedStore: "",
      doneButtonClicked: false,
      enddoneButtonClicked: false,
      startDate: "",
      endDate: "",
      selectedstoreId: 0,
      uom: [],
      date: new Date(),
      enddate: new Date(),
      open: false,
      chargeExtra: false,
      promoactiveStatus: true,
      poolsactiveStatus: true,
      domainId: 1,
      poolsDelete: false,
      promoDelete: false,
      delelePromoId: 0,
      delelePromoIndex: 0,
      deletePoolId: 0,
      promoNamesArray: [],
      invoiceNumber: "",
      loyaltyMobileNumber: "",
      storeNamesArray: [],
      storeNames: [],
      storeId: 1,
      privilages: [],
      subPrivilages: "",
    };
  }

  async componentDidMount() {
    var domainStringId = "";
    AsyncStorage.getItem("domainDataId")
      .then((value) => {
        domainStringId = value;
        this.setState({ domainId: parseInt(domainStringId) });
        console.log("domain data id" + this.state.domainId);
        this.getAllPromotions();
      })
      .catch(() => {
        this.setState({ loading: false });
        console.log("There is error getting domainDataId");
        // alert('There is error getting domainDataId');
      });

    const username = await AsyncStorage.getItem("username");
    var storeNames = [];
    axios.get(LoginService.getUserStores() + username).then((res) => {
      if (res.data["result"]) {
        for (var i = 0; i < res.data["result"].length; i++) {
          let number = res.data.result[i];
          const myArray = [];
          myArray = number.split(":");
          this.state.storeNamesArray.push({ name: myArray[0], id: myArray[1] });
          console.log(this.state.storeNamesArray);
          storeNames.push({
            value: this.state.storeNamesArray[i].name,
            label: this.state.storeNamesArray[i].name,
          });
        }
        this.setState({
          storeNames: storeNames,
        });

        this.setState({ storeNamesArray: this.state.storeNamesArray });
      }
    });

    AsyncStorage.getItem("custom:isSuperAdmin")
      .then((value) => {
        if (value === "true") {
          var domainId = "1";
          if (global.domainName === "Textile") {
            domainId = "1";
          } else if (global.domainName === "Retail") {
            domainId = "2";
          } else if (global.domainName === "Electrical & Electronics") {
            domainId = "3";
          }

          axios
            .get(UrmService.getPrivillagesForDomain() + domainId)
            .then((res) => {
              if (res.data && res.data["isSuccess"] === "true") {
                let len = res.data["result"].length;
                if (len > 0) {
                  if (len > 0) {
                    for (let i = 0; i < len; i++) {
                      let previlage = res.data["result"][i];
                      if (previlage.name === "Promotions & Loyalty") {
                        for (
                          let i = 0;
                          i < previlage.subPrivillages.length;
                          i++
                        ) {
                          console.log(
                            previlage.subPrivillages[i].parentPrivillageId,
                          );
                          if (
                            previlage.id ===
                            previlage.subPrivillages[i].parentPrivillageId
                          ) {
                            let subprivilage = previlage.subPrivillages[i];
                            if (subprivilage.name === "Dashboard") {
                              this.setState({ flagOne: false, flagTwo: false });
                            }
                            if (i === 0) {
                              this.state.privilages.push({
                                bool: true,
                                name: subprivilage.name,
                              });
                            } else {
                              this.state.privilages.push({
                                bool: false,
                                name: subprivilage.name,
                              });
                            }
                          }
                        }
                      }
                      this.setState({ privilages: this.state.privilages });
                    }
                  }
                }
              }
            });
        } else {
          AsyncStorage.getItem("rolename")
            .then((value) => {
              UrmService.getPrivillagesByRoleName(value).then((res) => {
                if (res.data && res.data["isSuccess"] === "true") {
                  let len = res.data["result"].parentPrivilages.length;
                  let length = res.data["result"].subPrivilages.length;
                  // console.log(.name)
                  if (len > 0) {
                    for (let i = 0; i < len; i++) {
                      let previlage = res.data["result"].parentPrivilages[i];
                      if (previlage.name === "Promotions & Loyalty") {
                        if (length > 0) {
                          for (let i = 0; i < length; i++) {
                            if (
                              previlage.id ===
                              res.data["result"].subPrivilages[i]
                                .parentPrivillageId
                            ) {
                              let subprivilage =
                                res.data["result"].subPrivilages[i];
                              if (i === 0) {
                                this.state.privilages.push({
                                  bool: true,
                                  name: subprivilage.name,
                                });
                              } else {
                                this.state.privilages.push({
                                  bool: false,
                                  name: subprivilage.name,
                                });
                              }
                            }
                            this.setState({
                              privilages: this.state.privilages,
                            });
                          }
                        }
                      }
                    }
                  }
                }
              });
            })
            .catch(() => {
              this.setState({ loading: false });
              console.log("There is error saving domainDataId");
              // alert('There is error saving domainDataId');
            });
        }
      })
      .catch(() => {
        this.setState({ loading: false });
        console.log("There is error getting sadasdsd");
        // alert('There is error getting sadasdsd');
      });
  }

  getAllPromotions = () => {
    this.setState({ promoData: [], promoNamesArray: [], loading: true });

    const params = {
      clientid: this.state.domainId,
      flag: true,
    };
    console.log(this.state.domainId);
    axios
      .get(PromotionsService.getAllPromotions(), { params })
      .then((res) => {
        if (res.data && res.data["isSuccess"] === "true") {
          this.setState({ loading: false });
          let len = res.data["result"]["promovo"].length;
          if (len > 0) {
            for (let i = 0; i < len; i++) {
              let number = res.data["result"]["promovo"][i];
              this.state.promoNamesArray.push({
                label: number.promotionName,
                value: number.promotionName,
              });

              if (this.state.promoactiveStatus === false) {
                if (number.isActive == false) {
                  this.state.promoData.push(number);
                }
              }
              if (this.state.promoactiveStatus === true) {
                if (number.isActive == true) {
                  console.log("----addedactivepools");
                  this.state.promoData.push(number);
                }
              }
              this.setState({
                promoData: this.state.promoData,
                promoNamesArray: this.state.promoNamesArray,
              });
              console.log("KKKKKK", this.state.promoData);
            }
          }
          return;
        }
      })
      .catch(() => {
        this.setState({ loading: false });
        this.setState({ loading: false });
        alert("No Records Found");
      });
  };

  render() {
    console.log("PPPPPPP", this.state.promoData);
    return (
      <View style={{ flex: 1 }}>
        {this.state.loading && <Loader loading={this.state.loading} />}
        <FlatList
          data={this.state.promoData}
          style={{ marginTop: 50 }}
          keyExtractor={(item) => item}
          renderItem={({ item, index }) => (
            <View
              style={{
                height: Device.isTablet ? 190 : 140,
                backgroundColor: "#FBFBFB",
                borderBottomWidth: 5,
                borderBottomColor: "#FFFFFF",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  flexDirection: "column",
                  width: "100%",
                  height: Device.isTablet ? 190 : 140,
                }}
              >
                <Text
                  style={{
                    fontSize: Device.isTablet ? 21 : 16,
                    marginLeft: 16,
                    marginTop: 20,
                    fontFamily: "medium",
                    color: "#ED1C24",
                  }}
                >
                  Promo id: #{String(item.promoId)}
                </Text>

                <Text
                  style={{
                    fontSize: Device.isTablet ? 17 : 12,
                    marginLeft: 16,
                    marginTop: 20,
                    fontFamily: "regular",
                    color: "#808080",
                  }}
                >
                  PROMO NAME
                </Text>
                <Text
                  style={{
                    fontSize: Device.isTablet ? 19 : 14,
                    marginLeft: 16,
                    marginTop: 0,
                    fontFamily: "medium",
                    color: "#353C40",
                  }}
                >
                  {String(item.promotionName)}
                </Text>

                <Text
                  style={{
                    position: "absolute",
                    fontSize: Device.isTablet ? 17 : 12,
                    right: 20,
                    marginTop: Device.isTablet ? 70 : 60,
                    fontFamily: "regular",
                    color: "#808080",
                  }}
                >
                  PRIORITY
                </Text>
                <Text
                  style={{
                    position: "absolute",
                    fontSize: Device.isTablet ? 17 : 12,
                    right: 20,
                    marginTop: Device.isTablet ? 85 : 75,
                    fontFamily: "regular",
                    color: "#353C40",
                  }}
                >
                  {String(item.priority)}
                </Text>

                <Text
                  style={{
                    fontSize: Device.isTablet ? 17 : 12,
                    marginLeft: 16,
                    marginTop: 6,
                    fontFamily: "regular",
                    color: "#808080",
                  }}
                >
                  START DATE
                </Text>
                <Text
                  style={{
                    fontSize: Device.isTablet ? 17 : 12,
                    marginLeft: 16,
                    marginTop: 0,
                    fontFamily: "regular",
                    color: "#353C40",
                  }}
                >
                  {item.startDate}
                </Text>
                <Text
                  style={{
                    fontSize: Device.isTablet ? 17 : 12,
                    marginLeft: 170,
                    marginTop: Device.isTablet ? -40 : -30,
                    fontFamily: "regular",
                    color: "#808080",
                  }}
                >
                  END DATE
                </Text>
                <Text
                  style={{
                    fontSize: Device.isTablet ? 17 : 12,
                    marginLeft: 170,
                    marginTop: 0,
                    fontFamily: "regular",
                    color: "#353C40",
                  }}
                >
                  {item.endDate}
                </Text>

                <Text
                  style={{
                    fontSize: Device.isTablet ? 17 : 12,
                    marginLeft: 170,
                    marginTop: Device.isTablet ? -95 : -65,
                    fontFamily: "regular",
                    color: "#808080",
                  }}
                >
                  STORE
                </Text>
                <Text
                  style={{
                    fontSize: Device.isTablet ? 17 : 12,
                    marginLeft: 170,
                    marginTop: 0,
                    fontFamily: "regular",
                    color: "#353C40",
                  }}
                >
                  -
                </Text>
              </View>

              <TouchableOpacity
                style={
                  item.isActive == true
                    ? {
                      position: "absolute",
                      right: 20,
                      top: 20,
                      width: 50,
                      height: 24,
                      backgroundColor: "#C1FCB0",
                      borderRadius: 5,
                    }
                    : {
                      position: "absolute",
                      right: 20,
                      top: 20,
                      width: Device.isTablet ? 70 : 50,
                      height: Device.isTablet ? 34 : 24,
                      backgroundColor: "#FCB0BA",
                      borderRadius: 5,
                    }
                }
              >
                <Text
                  style={{
                    textAlign: "center",
                    marginTop: 5,
                    color: "#353C40",
                    fontSize: Device.isTablet ? 17 : 12,
                    fontFamily: "regular",
                  }}
                >
                  {" "}
                  {item.isActive == true ? "Active" : "Inactive"}{" "}
                </Text>
              </TouchableOpacity>

              {this.state.promoDelete && (
                <View>
                  <Modal isVisible={this.state.modalVisible}>
                    <View
                      style={[
                        Device.isTablet
                          ? styles.filterMainContainer_tablet
                          : styles.filterMainContainer_mobile,
                        { height: Device.isTablet ? 350 : 250 },
                      ]}
                    >
                      <Text
                        style={
                          Device.isTablet
                            ? styles.filterByTitle_tablet
                            : styles.filterByTitle_mobile
                        }
                      >
                        {" "}
                        Delete Promotion{" "}
                      </Text>

                      <TouchableOpacity
                        style={
                          Device.isTablet
                            ? styles.filterCloseButton_tablet
                            : styles.filterCloseButton_mobile
                        }
                        onPress={() => this.modelCancel()}
                      >
                        <Image
                          style={
                            Device.isTablet
                              ? styles.filterCloseImage_tablet
                              : styles.filterCloseImage_mobile
                          }
                          source={require("../assets/images/modelcancel.png")}
                        />
                      </TouchableOpacity>

                      <Text
                        style={{
                          height: Device.isTablet ? 2 : 1,
                          width: deviceWidth,
                          backgroundColor: "lightgray",
                          marginTop: 50,
                        }}
                      ></Text>
                      <Text
                        style={{
                          position: "absolute",
                          top: 70,
                          height: Device.isTablet ? 40 : 20,
                          textAlign: "center",
                          fontFamily: "regular",
                          fontSize: Device.isTablet ? 23 : 18,
                          marginBottom: Device.isTablet ? 25 : 0,
                          color: "#353C40",
                        }}
                      >
                        {" "}
                        Are you sure want to delete Promotion?{" "}
                      </Text>
                      <TouchableOpacity
                        style={[
                          Device.isTablet
                            ? styles.filterApplyButton_tablet
                            : styles.filterApplyButton_mobile,
                          { marginTop: Device.isTablet ? 75 : 55 },
                        ]}
                        onPress={() => this.deletePromotion(item, index)}
                      >
                        <Text
                          style={
                            Device.isTablet
                              ? styles.filterButtonText_tablet
                              : styles.filterButtonText_mobile
                          }
                        >
                          {" "}
                          DELETE{" "}
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={
                          Device.isTablet
                            ? styles.filterCancelButton_tablet
                            : styles.filterCancelButton_mobile
                        }
                        onPress={() => this.modelCancel()}
                      >
                        <Text
                          style={
                            Device.isTablet
                              ? styles.filterButtonCancelText_tablet
                              : styles.filterButtonCancelText_mobile
                          }
                        >
                          {" "}
                          CANCEL{" "}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </Modal>
                </View>
              )}

              <TouchableOpacity
                style={{
                  position: "absolute",
                  right: 50,
                  top: Device.isTablet ? 130 : 90,
                  width: 30,
                  height: 30,
                  borderBottomLeftRadius: 5,
                  borderTopLeftRadius: 5,
                  borderWidth: 1,
                  borderColor: "lightgray",
                  // borderRadius:5,
                }}
                onPress={() => this.handleeditpromoaction(item, index)}
              >
                <Image
                  style={{
                    alignSelf: "center",
                    top: 5,
                    height: Device.isTablet ? 30 : 20,
                    width: Device.isTablet ? 30 : 20,
                  }}
                  source={require("../assets/images/edit.png")}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  position: "absolute",
                  right: 20,
                  top: Device.isTablet ? 130 : 90,
                  width: 30,
                  height: 30,
                  borderBottomRightRadius: 5,
                  borderTopRightRadius: 5,
                  borderWidth: 1,
                  borderColor: "lightgray",
                }}
                onPress={() => this.handlepromodeleteaction(item, index)}
              >
                <Image
                  style={{
                    alignSelf: "center",
                    top: 5,
                    height: Device.isTablet ? 30 : 20,
                    width: Device.isTablet ? 30 : 20,
                  }}
                  source={require("../assets/images/delete.png")}
                />
              </TouchableOpacity>
              <View
                style={{
                  backgroundColor: "grey",
                  flexDirection: "row",
                  justifyContent: "space-around",
                  alignItems: "center",
                  height: 30,
                  width: 90,
                }}
              ></View>
            </View>
          )}
        />

        {this.state.flagFilterOpen && (
          <View>
            <Modal isVisible={this.state.modalVisible}>
              <View
                style={[
                  Device.isTablet
                    ? styles.filterMainContainer_tablet
                    : styles.filterMainContainer_mobile,
                  { height: Device.isTablet ? 500 : 400 },
                ]}
              >
                <KeyboardAwareScrollView
                  KeyboardAwareScrollView
                  enableOnAndroid={true}
                >
                  <Text
                    style={
                      Device.isTablet
                        ? styles.filterByTitle_tablet
                        : styles.filterByTitle_mobile
                    }
                  >
                    {" "}
                    Filter by{" "}
                  </Text>

                  <TouchableOpacity
                    style={
                      Device.isTablet
                        ? styles.filterCloseButton_tablet
                        : styles.filterCloseButton_mobile
                    }
                    onPress={() => this.modelCancel()}
                  >
                    <Image
                      style={
                        Device.isTablet
                          ? styles.filterCloseImage_tablet
                          : styles.modalCancelImage_mobile
                      }
                      source={require("../assets/images/modelcancel.png")}
                    />
                  </TouchableOpacity>

                  <Text
                    style={
                      Device.isTablet
                        ? styles.filterByTitleDecoration_tablet
                        : styles.filterByTitleDecoration_mobile
                    }
                  ></Text>
                  <View style={{ marginTop: 10, width: deviceWidth }}>
                    <View
                      style={
                        Device.isTablet
                          ? styles.rnSelectContainer_tablet
                          : styles.rnSelectContainer_mobile
                      }
                    >
                      <RNPickerSelect
                        placeholder={{
                          label: "SELECT CREATED BY",
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
                        items={this.state.createdByArray}
                        onValueChange={this.handleCreatedBy}
                        style={
                          Device.isTablet
                            ? pickerSelectStyles_tablet
                            : pickerSelectStyles_mobile
                        }
                        value={this.state.selectedcreatedBy}
                        useNativeAndroidPickerStyle={false}
                      />
                    </View>

                    <View
                      style={
                        Device.isTablet
                          ? styles.rnSelectContainer_tablet
                          : styles.rnSelectContainer_mobile
                      }
                    >
                      <RNPickerSelect
                        placeholder={{
                          label: "SELECT POOL TYPE",
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
                          { label: "Buy", value: "Buy" },
                          { label: "Get", value: "Get" },
                          { label: "Both", value: "Both" },
                        ]}
                        onValueChange={this.handlePoolType}
                        style={
                          Device.isTablet
                            ? pickerSelectStyles_tablet
                            : pickerSelectStyles_mobile
                        }
                        value={this.state.selectedPoolType}
                        useNativeAndroidPickerStyle={false}
                      />
                    </View>

                    <View
                      style={
                        Device.isTablet
                          ? styles.rnSelectContainer_tablet
                          : styles.rnSelectContainer_mobile
                      }
                    >
                      <RNPickerSelect
                        placeholder={{
                          label: "SELECT STATUS",
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
                          { label: "Inactive", value: "Inactive" },
                        ]}
                        onValueChange={this.handleStatusBy}
                        style={
                          Device.isTablet
                            ? pickerSelectStyles_tablet
                            : pickerSelectStyles_mobile
                        }
                        value={this.state.selectedStatus}
                        useNativeAndroidPickerStyle={false}
                      />
                    </View>
                  </View>
                  <TouchableOpacity
                    style={
                      Device.isTablet
                        ? styles.filterApplyButton_tablet
                        : styles.filterApplyButton_mobile
                    }
                    onPress={() => this.applyFilter()}
                  >
                    <Text
                      style={
                        Device.isTablet
                          ? styles.filterButtonText_tablet
                          : styles.filterButtonText_mobile
                      }
                    >
                      {" "}
                      APPLY{" "}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={
                      Device.isTablet
                        ? styles.filterCancelButton_tablet
                        : styles.filterCancelButton_mobile
                    }
                    onPress={() => this.modelCancel()}
                  >
                    <Text
                      style={
                        Device.isTablet
                          ? styles.filterButtonCancelText_tablet
                          : styles.filterButtonCancelText_mobile
                      }
                    >
                      {" "}
                      CANCEL{" "}
                    </Text>
                  </TouchableOpacity>
                </KeyboardAwareScrollView>
              </View>
            </Modal>
          </View>
        )}

        {this.state.flagFilterPromoOpen && (
          <View>
            <Modal isVisible={this.state.modalVisible}>
              <View
                style={[
                  Device.isTablet
                    ? styles.filterMainContainer_tablet
                    : styles.filterMainContainer_mobile,
                  { height: Device.isTablet ? 650 : 500 },
                ]}
              >
                <KeyboardAwareScrollView
                  KeyboardAwareScrollView
                  enableOnAndroid={true}
                >
                  <Text
                    style={
                      Device.isTablet
                        ? styles.filterByTitle_tablet
                        : styles.filterByTitle_mobile
                    }
                  >
                    {" "}
                    Filter by{" "}
                  </Text>

                  <TouchableOpacity
                    style={
                      Device.isTablet
                        ? styles.filterCloseButton_tablet
                        : styles.filterCloseButton_mobile
                    }
                    onPress={() => this.modelCancel()}
                  >
                    <Image
                      style={
                        Device.isTablet
                          ? styles.filterCloseImage_tablet
                          : styles.modelCancelImage_mobile
                      }
                      source={require("../assets/images/modelcancel.png")}
                    />
                  </TouchableOpacity>

                  <Text
                    style={
                      Device.isTablet
                        ? styles.filterByTitleDecoration_tablet
                        : styles.filterByTitleDecoration_mobile
                    }
                  ></Text>
                  <View style={{ marginTop: 10, width: deviceWidth }}>
                    <View
                      style={
                        Device.isTablet
                          ? styles.rnSelectContainer_tablet
                          : styles.rnSelectContainer_mobile
                      }
                    >
                      <RNPickerSelect
                        placeholder={{
                          label: "SELECT STORE",
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
                        items={this.state.storeNames}
                        onValueChange={this.handleSelectStore}
                        style={
                          Device.isTablet
                            ? pickerSelectStyles_tablet
                            : pickerSelectStyles_mobile
                        }
                        value={this.state.selectedStore}
                        useNativeAndroidPickerStyle={false}
                      />
                    </View>

                    <TextInput
                      style={
                        Device.isTablet
                          ? styles.input_tablet
                          : styles.input_mobile
                      }
                      underlineColorAndroid="transparent"
                      placeholder="PROMO NAME"
                      placeholderTextColor="#6F6F6F"
                      textAlignVertical="center"
                      autoCapitalize="none"
                      value={this.state.selectedPromotionName}
                      onChangeText={this.handlePromotionName}
                    />

                    {/* <Text style={{
                                            position: 'absolute',
                                            left: 20,
                                            top: 110,
                                            width: 300,
                                            height: 20,
                                            fontFamily: 'regular',
                                            fontSize: Device.isTablet ? 17 : 12,
                                            color: '#353C40'
                                        }}> Start Date </Text> */}
                    <TouchableOpacity
                      style={{
                        width: deviceWidth - 40,
                        marginLeft: 20,
                        marginRight: 20,
                        height: Device.isTablet ? 54 : 44,
                        marginTop: 5,
                        marginBottom: 10,
                        borderColor: "#8F9EB717",
                        borderRadius: 3,
                        backgroundColor: "#F6F6F6",
                        borderRadius: 5,
                      }}
                      testID="openModal"
                      onPress={() => this.datepickerClicked()}
                    >
                      <Text
                        style={{
                          marginLeft: 16,
                          marginTop: 20,
                          color: "#6F6F6F",
                          fontSize: Device.isTablet ? 20 : 15,
                          fontFamily: "regular",
                        }}
                      >
                        {" "}
                        {this.state.doneButtonClicked == false
                          ? "Start Date"
                          : this.state.startDate}{" "}
                      </Text>
                      <Image
                        style={{ position: "absolute", top: 10, right: 0 }}
                        source={require("../assets/images/calender.png")}
                      />
                    </TouchableOpacity>

                    {/* <Text style={{
                                            position: 'absolute',
                                            left: 20,
                                            top: 175,
                                            width: 300,
                                            height: 20,
                                            fontFamily: 'regular',
                                            fontSize: Device.isTablet ? 17 :12,
                                            color: '#353C40'
                                        }}> End Date </Text> */}

                    <TouchableOpacity
                      style={{
                        width: deviceWidth - 40,
                        marginLeft: 20,
                        marginRight: 20,
                        height: Device.isTablet ? 54 : 44,
                        marginTop: 5,
                        marginBottom: 10,
                        borderColor: "#8F9EB717",
                        borderRadius: 3,
                        backgroundColor: "#F6F6F6",
                        borderRadius: 5,
                      }}
                      testID="openModal"
                      onPress={() => this.enddatepickerClicked()}
                    >
                      <Text
                        style={{
                          marginLeft: 16,
                          marginTop: 20,
                          color: "#6F6F6F",
                          fontSize: Device.isTablet ? 20 : 15,
                          fontFamily: "regular",
                        }}
                      >
                        {" "}
                        {this.state.enddoneButtonClicked == false
                          ? "End Date"
                          : this.state.endDate}{" "}
                      </Text>
                      <Image
                        style={{ position: "absolute", top: 10, right: 0 }}
                        source={require("../assets/images/calender.png")}
                      />
                    </TouchableOpacity>

                    {this.state.datepickerOpen && this.state.flagtwo && (
                      <View
                        style={{
                          height: 280,
                          width: deviceWidth,
                          backgroundColor: "ffffff",
                        }}
                      >
                        <TouchableOpacity
                          style={
                            Device.isTablet
                              ? styles.datePickerButton_tablet
                              : styles.datePickerButton_mobile
                          }
                          onPress={() => this.datepickerCancelClicked()}
                        >
                          <Text
                            style={
                              Device.isTablet
                                ? styles.datePickerButtonText_tablet
                                : styles.datePickerButtonText_mobile
                            }
                          >
                            {" "}
                            Cancel{" "}
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={
                            Device.isTablet
                              ? styles.datePickerEndButton_tablet
                              : styles.datePickerEndButton_mobile
                          }
                          onPress={() => this.datepickerDoneClicked()}
                        >
                          <Text
                            style={
                              Device.isTablet
                                ? styles.datePickerButtonText_tablet
                                : styles.datePickerButtonText_mobile
                            }
                          >
                            {" "}
                            Done{" "}
                          </Text>
                        </TouchableOpacity>
                        <DatePicker
                          style={{
                            width: deviceWidth,
                            height: 200,
                            marginTop: 50,
                          }}
                          date={this.state.date}
                          mode={"date"}
                          onDateChange={(date) => this.setState({ date })}
                        />
                      </View>
                    )}
                    {this.state.datepickerendOpen && this.state.flagtwo && (
                      <View
                        style={{
                          height: 280,
                          width: deviceWidth,
                          backgroundColor: "ffffff",
                        }}
                      >
                        <TouchableOpacity
                          style={
                            Device.isTablet
                              ? styles.datePickerButton_tablet
                              : styles.datePickerButton_mobile
                          }
                          onPress={() => this.datepickerCancelClicked()}
                        >
                          <Text
                            style={
                              Device.isTablet
                                ? styles.datePickerButtonText_tablet
                                : styles.datePickerButtonText_mobile
                            }
                          >
                            {" "}
                            Cancel{" "}
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={
                            Device.isTablet
                              ? styles.datePickerEndButton_tablet
                              : styles.datePickerEndButton_mobile
                          }
                          onPress={() => this.datepickerendDoneClicked()}
                        >
                          <Text
                            style={
                              Device.isTablet
                                ? styles.datePickerButtonText_tablet
                                : styles.datePickerButtonText_mobile
                            }
                          >
                            {" "}
                            Done{" "}
                          </Text>
                        </TouchableOpacity>
                        <DatePicker
                          style={{
                            width: deviceWidth,
                            height: 200,
                            marginTop: 50,
                          }}
                          date={this.state.enddate}
                          mode={"date"}
                          onDateChange={(enddate) => this.setState({ enddate })}
                        />
                      </View>
                    )}

                    <View
                      style={
                        Device.isTablet
                          ? styles.rnSelectContainer_tablet
                          : styles.rnSelectContainer_mobile
                      }
                    >
                      <RNPickerSelect
                        placeholder={{
                          label: "SELECT STATUS",
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
                          { label: "Inactive", value: "Inactive" },
                        ]}
                        onValueChange={this.handleStatusBy}
                        style={
                          Device.isTablet
                            ? pickerSelectStyles_tablet
                            : pickerSelectStyles_mobile
                        }
                        value={this.state.selectedStatus}
                        useNativeAndroidPickerStyle={false}
                      />
                    </View>
                  </View>
                  <TouchableOpacity
                    style={
                      Device.isTablet
                        ? styles.filterApplyButton_tablet
                        : styles.filterApplyButton_mobile
                    }
                    onPress={() => this.applyFilterForPromotions()}
                  >
                    <Text
                      style={
                        Device.isTablet
                          ? styles.filterButtonText_tablet
                          : styles.filterButtonText_mobile
                      }
                    >
                      {" "}
                      APPLY{" "}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={
                      Device.isTablet
                        ? styles.filterCancelButton_tablet
                        : styles.filterCancelButton_mobile
                    }
                    onPress={() => this.modelCancel()}
                  >
                    <Text
                      style={
                        Device.isTablet
                          ? styles.filterButtonCancelText_tablet
                          : styles.filterButtonCancelText_mobile
                      }
                    >
                      {" "}
                      CANCEL{" "}
                    </Text>
                  </TouchableOpacity>
                </KeyboardAwareScrollView>
              </View>
            </Modal>
          </View>
        )}

        {this.state.flagFilterLoyaltyOpen && (
          <View>
            <Modal isVisible={this.state.modalVisible}>
              <View
                style={[
                  Device.isTablet
                    ? styles.filterMainContainer_tablet
                    : styles.filterMainContainer_mobile,
                  { height: Device.isTablet ? 450 : 350 },
                ]}
              >
                <KeyboardAwareScrollView
                  KeyboardAwareScrollView
                  enableOnAndroid={true}
                >
                  <Text
                    style={
                      Device.isTablet
                        ? styles.filterByTitle_tablet
                        : styles.filterByTitle_mobile
                    }
                  >
                    {" "}
                    Filter by{" "}
                  </Text>

                  <TouchableOpacity
                    style={
                      Device.isTablet
                        ? styles.filterCloseButton_tablet
                        : styles.filterCloseButton_mobile
                    }
                    onPress={() => this.modelCancel()}
                  >
                    <Image
                      style={
                        Device.isTablet
                          ? styles.filterCloseImage_tablet
                          : styles.modelCancelImage_mobile
                      }
                      source={require("../assets/images/modelcancel.png")}
                    />
                  </TouchableOpacity>

                  <Text
                    style={
                      Device.isTablet
                        ? styles.filterByTitleDecoration_tablet
                        : styles.filterByTitleDecoration_mobile
                    }
                  ></Text>
                  <View style={{ marginTop: 10, width: deviceWidth }}>
                    <TextInput
                      style={
                        Device.isTablet
                          ? styles.input_tablet
                          : styles.input_mobile
                      }
                      underlineColorAndroid="transparent"
                      placeholder="INVOICE NUMBER"
                      placeholderTextColor="#6F6F6F"
                      textAlignVertical="center"
                      autoCapitalize="none"
                      value={this.state.invoiceNumber}
                      onChangeText={this.handleInvoicenumber}
                    />

                    <TextInput
                      style={
                        Device.isTablet
                          ? styles.input_tablet
                          : styles.input_mobile
                      }
                      underlineColorAndroid="transparent"
                      placeholder="MOBILE NUMBER"
                      placeholderTextColor="#6F6F6F"
                      textAlignVertical="center"
                      autoCapitalize="none"
                      value={this.state.loyaltyMobileNumber}
                      onChangeText={this.handleloyaltyMobileNumber}
                    />

                    <TouchableOpacity
                      style={
                        Device.isTablet
                          ? styles.filterApplyButton_tablet
                          : styles.filterApplyButton_mobile
                      }
                      onPress={() => this.getFilteredLoyaltyPoints()}
                    >
                      <Text
                        style={
                          Device.isTablet
                            ? styles.filterButtonText_tablet
                            : styles.filterButtonText_mobile
                        }
                      >
                        {" "}
                        APPLY{" "}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={
                        Device.isTablet
                          ? styles.filterCancelButton_tablet
                          : styles.filterCancelButton_mobile
                      }
                      onPress={() => this.modelCancel()}
                    >
                      <Text
                        style={
                          Device.isTablet
                            ? styles.filterButtonCancelText_tablet
                            : styles.filterButtonCancelText_mobile
                        }
                      >
                        {" "}
                        CANCEL{" "}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </KeyboardAwareScrollView>
              </View>
            </Modal>
          </View>
        )}

        {this.state.flagAddPromo && (
          <View>
            <Modal isVisible={this.state.modalVisible}>
              <View
                style={{
                  width: deviceWidth,
                  alignItems: "center",
                  marginLeft: -20,
                  backgroundColor: "#ffffff",
                  height: 530,
                  position: "absolute",
                  bottom: -20,
                }}
              >
                <KeyboardAwareScrollView
                  KeyboardAwareScrollView
                  enableOnAndroid={true}
                >
                  <Text
                    style={{
                      position: "absolute",
                      left: 20,
                      top: 15,
                      width: 300,
                      height: 20,
                      fontFamily: "medium",
                      fontSize: 16,
                      color: "#353C40",
                    }}
                  >
                    {" "}
                    Add Promo{" "}
                  </Text>

                  <TouchableOpacity
                    style={{
                      position: "absolute",
                      right: 20,
                      top: 8,
                      width: 50,
                      height: 50,
                    }}
                    onPress={() => this.modelCancel()}
                  >
                    <Image
                      style={{
                        color: "#ED1C24",
                        fontFamily: "regular",
                        fontSize: 12,
                        position: "absolute",
                        top: 10,
                        right: 0,
                      }}
                      source={require("../assets/images/modelcancel.png")}
                    />
                  </TouchableOpacity>

                  <Text
                    style={{
                      height: Device.isTablet ? 2 : 1,
                      width: deviceWidth,
                      backgroundColor: "lightgray",
                      marginTop: 50,
                    }}
                  ></Text>
                  <Text
                    style={{
                      position: "absolute",
                      left: 20,
                      top: 60,
                      width: 300,
                      height: 20,
                      fontFamily: "regular",
                      fontSize: 12,
                      color: "#353C40",
                    }}
                  >
                    {" "}
                    Please add promo code details{" "}
                  </Text>

                  <View style={{ marginTop: 30, width: deviceWidth }}>
                    <TextInput
                      style={
                        Device.isTablet
                          ? styles.input_tablet
                          : styles.input_mobile
                      }
                      underlineColorAndroid="transparent"
                      placeholder="PROMOTION NAME"
                      placeholderTextColor="#6F6F6F"
                      textAlignVertical="center"
                      autoCapitalize="none"
                      value={this.state.productmrp}
                      onChangeText={this.handleInventoryMRP}
                    />
                    <TextInput
                      style={
                        Device.isTablet
                          ? styles.input_tablet
                          : styles.input_mobile
                      }
                      underlineColorAndroid="transparent"
                      placeholder="DESCRIPTION"
                      placeholderTextColor="#6F6F6F"
                      textAlignVertical="center"
                      autoCapitalize="none"
                      value={this.state.productmrp}
                      onChangeText={this.handleInventoryMRP}
                    />

                    <TextInput
                      style={
                        Device.isTablet
                          ? styles.input_tablet
                          : styles.input_mobile
                      }
                      underlineColorAndroid="transparent"
                      placeholder="PRINT NAME ON SALE BILL"
                      placeholderTextColor="#6F6F6F"
                      textAlignVertical="center"
                      autoCapitalize="none"
                      value={this.state.productmrp}
                      onChangeText={this.handleInventoryMRP}
                    />

                    <View
                      style={
                        Device.isTablet
                          ? styles.rnSelectContainer_tablet
                          : styles.rnSelectContainer_mobile
                      }
                    >
                      <RNPickerSelect
                        placeholder={{
                          label: "APPLICABILITY",
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
                        items={this.state.uom}
                        onValueChange={this.handleUOM}
                        style={
                          Device.isTablet
                            ? pickerSelectStyles_tablet
                            : pickerSelectStyles_mobile
                        }
                        value={this.state.productuom}
                        useNativeAndroidPickerStyle={false}
                      />
                    </View>

                    <TouchableOpacity
                      style={{
                        width: 200,
                        marginTop: 20,
                      }}
                      onPress={() => this.chargeExtra()}
                    >
                      <Text
                        style={{
                          marginLeft: 40,
                          marginTop: 11,
                          color: "#6F6F6F",
                          fontSize: 15,
                          fontFamily: "regular",
                          width: 200,
                        }}
                      >
                        {" "}
                        {"Charge Tax Entra"}{" "}
                      </Text>

                      <Image
                        style={{ position: "absolute", top: 10, left: 20 }}
                        source={
                          //require('../assets/images/chargeunselect.png')}
                          this.state.chargeExtra
                            ? require("../assets/images/chargeselect.png")
                            : require("../assets/images/chargeunselect.png")
                        }
                      />
                    </TouchableOpacity>

                    {this.state.chargeExtra && (
                      <View
                        style={
                          Device.isTablet
                            ? styles.rnSelectContainer_tablet
                            : styles.rnSelectContainer_mobile
                        }
                      >
                        <RNPickerSelect
                          placeholder={{
                            label: "SELECT TAX %",
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
                          items={this.state.uom}
                          onValueChange={this.handleUOM}
                          style={
                            Device.isTablet
                              ? pickerSelectStyles_tablet
                              : pickerSelectStyles_mobile
                          }
                          value={this.state.productuom}
                          useNativeAndroidPickerStyle={false}
                        />
                      </View>
                    )}
                  </View>
                  <TouchableOpacity
                    style={
                      Device.isTablet
                        ? styles.filterApplyButton_tablet
                        : styles.filterApplyButton_mobile
                    }
                    onPress={() => this.inventoryUpdate()}
                  >
                    <Text
                      style={
                        Device.isTablet
                          ? filterButtonText_tablet
                          : styles.filterButtonText_mobile
                      }
                    >
                      {" "}
                      ADD{" "}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={
                      Device.isTablet
                        ? styles.filterCancelButton_tablet
                        : styles.filterCancelButton_mobile
                    }
                    onPress={() => this.modelCancel()}
                  >
                    <Text
                      style={
                        Device.isTablet
                          ? styles.filterButtonCancelText_tablet
                          : styles.filterButtonCancelText_mobile
                      }
                    >
                      {" "}
                      CANCEL{" "}
                    </Text>
                  </TouchableOpacity>
                </KeyboardAwareScrollView>
              </View>
            </Modal>
          </View>
        )}

        {this.state.flagAddStore && (
          <View>
            <Modal isVisible={this.state.modalVisible}>
              <View
                style={
                  Device.isTablet
                    ? styles.filterMainContainer_tablet
                    : styles.filterMainContainer_mobile
                }
              >
                <KeyboardAwareScrollView
                  KeyboardAwareScrollView
                  enableOnAndroid={true}
                >
                  <Text
                    style={
                      Device.isTablet
                        ? styles.filterByTitle_tablet
                        : styles.filterByTitle_mobile
                    }
                  >
                    {" "}
                    Add promo to store{" "}
                  </Text>

                  <TouchableOpacity
                    style={
                      Device.isTablet
                        ? styles.filterCloseButton_tablet
                        : styles.filterCloseButton_mobile
                    }
                    onPress={() => this.modelCancel()}
                  >
                    <Image
                      style={
                        Device.isTablet
                          ? styles.filterCloseImage_tablet
                          : styles.filterCloseImage_mobile
                      }
                      source={require("../assets/images/modelcancel.png")}
                    />
                  </TouchableOpacity>

                  <Text
                    style={
                      Device.isTablet
                        ? styles.filterByTitleDecoration_tablet
                        : styles.filterByTitleDecoration_mobile
                    }
                  ></Text>
                  <Text
                    style={{
                      position: "absolute",
                      left: 20,
                      top: 60,
                      width: 300,
                      height: 20,
                      fontFamily: "regular",
                      fontSize: Device.isTablet ? 17 : 12,
                      color: "#353C40",
                    }}
                  >
                    {" "}
                    Please add promo code details{" "}
                  </Text>

                  <View style={{ marginTop: 30, width: deviceWidth }}>
                    <View
                      style={
                        Device.isTablet
                          ? styles.rnSelectContainer_tablet
                          : styles.rnSelectContainer_mobile
                      }
                    >
                      <RNPickerSelect
                        placeholder={{
                          label: "PROMOTION TYPE",
                        }}
                        items={[
                          { label: "By_Promotion", value: "By_Promotion" },
                          { label: "By_Store", value: "By_Store" },
                        ]}
                        Icon={() => {
                          return (
                            <Chevron
                              style={styles.imagealign}
                              size={1.5}
                              color="gray"
                            />
                          );
                        }}
                        onValueChange={this.handleSelectPromotionType}
                        style={
                          Device.isTablet
                            ? pickerSelectStyles_tablet
                            : pickerSelectStyles_mobile
                        }
                        value={this.state.selectedPromotionType}
                        useNativeAndroidPickerStyle={false}
                      />
                    </View>

                    <View
                      style={
                        Device.isTablet
                          ? styles.rnSelectContainer_tablet
                          : styles.rnSelectContainer_mobile
                      }
                    >
                      <RNPickerSelect
                        placeholder={{
                          label: "PROMOTION NAME",
                        }}
                        items={this.state.promoNamesArray}
                        Icon={() => {
                          return (
                            <Chevron
                              style={styles.imagealign}
                              size={1.5}
                              color="gray"
                            />
                          );
                        }}
                        // items={this.state.uom}
                        onValueChange={this.handlePromotionName}
                        style={
                          Device.isTablet
                            ? pickerSelectStyles_tablet
                            : pickerSelectStyles_mobile
                        }
                        value={this.state.selectedPromotionName}
                        useNativeAndroidPickerStyle={false}
                      />
                    </View>

                    <View
                      style={
                        Device.isTablet
                          ? styles.rnSelectContainer_tablet
                          : styles.rnSelectContainer_mobile
                      }
                    >
                      <RNPickerSelect
                        placeholder={{
                          label: "SELECT STORE",
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
                        items={this.state.storeNames}
                        onValueChange={this.handleSelectStore}
                        style={
                          Device.isTablet
                            ? pickerSelectStyles_tablet
                            : pickerSelectStyles_mobile
                        }
                        value={this.state.selectedStore}
                        useNativeAndroidPickerStyle={false}
                      />
                    </View>

                    {/* <Text style={{
                                            position: 'absolute',
                                            left: 20,
                                            top: 170,
                                            width: 300,
                                            height: 20,
                                            fontFamily: 'regular',
                                            fontSize: 12,
                                            color: '#353C40'
                                        }}> Start Date </Text> */}
                    <TouchableOpacity
                      style={{
                        width: deviceWidth - 40,
                        marginLeft: 20,
                        marginRight: 20,
                        marginTop: 5,
                        marginBottom: 10,
                        borderColor: "#8F9EB717",
                        borderRadius: 3,
                        height: Device.isTablet ? 54 : 44,
                        backgroundColor: "#F6F6F6",
                        borderRadius: 5,
                      }}
                      testID="openModal"
                      onPress={() => this.datepickerClicked()}
                    >
                      <Text
                        style={{
                          marginLeft: 16,
                          marginTop: 20,
                          color: "#6F6F6F",
                          fontSize: Device.isTablet ? 20 : 15,
                          fontFamily: "regular",
                        }}
                      >
                        {" "}
                        {this.state.doneButtonClicked == false
                          ? "Start Date"
                          : this.state.startDate}{" "}
                      </Text>
                      <Image
                        style={{ position: "absolute", top: 10, right: 0 }}
                        source={require("../assets/images/calender.png")}
                      />
                    </TouchableOpacity>

                    {/* <Text style={{
                                            position: 'absolute',
                                            left: 20,
                                            top: 235,
                                            width: 300,
                                            height: 20,
                                            fontFamily: 'regular',
                                            fontSize: 12,
                                            color: '#353C40'
                                        }}> End Date </Text> */}

                    <TouchableOpacity
                      style={{
                        width: deviceWidth - 40,
                        marginLeft: 20,
                        marginRight: 20,
                        marginTop: 5,
                        marginBottom: 10,
                        borderColor: "#8F9EB717",
                        borderRadius: 3,
                        height: Device.isTablet ? 54 : 44,
                        backgroundColor: "#F6F6F6",
                        borderRadius: 5,
                      }}
                      testID="openModal"
                      onPress={() => this.enddatepickerClicked()}
                    >
                      <Text
                        style={{
                          marginLeft: 16,
                          marginTop: 20,
                          color: "#6F6F6F",
                          fontSize: Device.isTablet ? 20 : 15,
                          fontFamily: "regular",
                        }}
                      >
                        {" "}
                        {this.state.enddoneButtonClicked == false
                          ? "End Date"
                          : this.state.endDate}{" "}
                      </Text>
                      <Image
                        style={{ position: "absolute", top: 10, right: 0 }}
                        source={require("../assets/images/calender.png")}
                      />
                    </TouchableOpacity>
                  </View>
                  {this.state.datepickerOpen && this.state.flagtwo && (
                    <View
                      style={{
                        height: 280,
                        width: deviceWidth,
                        backgroundColor: "ffffff",
                      }}
                    >
                      <TouchableOpacity
                        style={
                          Device.isTablet
                            ? styles.datePickerButton_tablet
                            : styles.datePickerButton_mobile
                        }
                        onPress={() => this.datepickerCancelClicked()}
                      >
                        <Text
                          style={
                            Device.isTablet
                              ? styles.datePickerButtonText_tablet
                              : styles.datePickerButtonText_mobile
                          }
                        >
                          {" "}
                          Cancel{" "}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={
                          Device.isTablet
                            ? styles.datePickerEndButton_tablet
                            : styles.datePickerEndButton_mobile
                        }
                        onPress={() => this.datepickerDoneClicked()}
                      >
                        <Text
                          style={
                            Device.isTablet
                              ? styles.datePickerButtonText_tablet
                              : styles.datePickerButtonText_mobile
                          }
                        >
                          {" "}
                          Done{" "}
                        </Text>
                      </TouchableOpacity>
                      <DatePicker
                        style={{
                          width: deviceWidth,
                          height: 200,
                          marginTop: 50,
                        }}
                        date={this.state.date}
                        mode={"date"}
                        onDateChange={(date) => this.setState({ date })}
                      />
                    </View>
                  )}
                  {this.state.datepickerendOpen && this.state.flagtwo && (
                    <View
                      style={{
                        height: 280,
                        width: deviceWidth,
                        backgroundColor: "ffffff",
                      }}
                    >
                      <TouchableOpacity
                        style={
                          Device.isTablet
                            ? styles.datePickerButton_tablet
                            : styles.datePickerButton_mobile
                        }
                        onPress={() => this.datepickerCancelClicked()}
                      >
                        <Text
                          style={
                            Device.isTablet
                              ? styles.datePickerButtonText_tablet
                              : styles.datePickerButtonText_mobile
                          }
                        >
                          {" "}
                          Cancel{" "}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={
                          Device.isTablet
                            ? styles.datePickerEndButton_tablet
                            : styles.datePickerEndButton_mobile
                        }
                        onPress={() => this.datepickerendDoneClicked()}
                      >
                        <Text
                          style={
                            Device.isTablet
                              ? styles.datePickerButtonText_tablet
                              : styles.datePickerButtonText_mobile
                          }
                        >
                          {" "}
                          Done{" "}
                        </Text>
                      </TouchableOpacity>
                      <DatePicker
                        style={{
                          width: deviceWidth,
                          height: 200,
                          marginTop: 50,
                        }}
                        date={this.state.enddate}
                        mode={"date"}
                        onDateChange={(enddate) => this.setState({ enddate })}
                      />
                    </View>
                  )}

                  <TouchableOpacity
                    style={
                      Device.isTablet
                        ? styles.filterApplyButton_tablet
                        : styles.filterApplyButton_mobile
                    }
                    onPress={() => this.addPromoStore()}
                  >
                    <Text
                      style={
                        Device.isTablet
                          ? styles.filterButtonText_tablet
                          : styles.filterButtonText_mobile
                      }
                    >
                      {" "}
                      ADD{" "}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={
                      Device.isTablet
                        ? styles.filterCancelButton_tablet
                        : styles.filterCancelButton_mobile
                    }
                    onPress={() => this.modelCancel()}
                  >
                    <Text
                      style={
                        Device.isTablet
                          ? styles.filterButtonCancelText_tablet
                          : styles.filterButtonCancelText_mobile
                      }
                    >
                      {" "}
                      CANCEL{" "}
                    </Text>
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
export default ListOfPromo;

const pickerSelectStyles_mobile = StyleSheet.create({
  placeholder: {
    color: "#6F6F6F",
    fontFamily: "regular",
    fontSize: 15,
  },
  inputIOS: {
    justifyContent: "center",
    height: 42,
    borderRadius: 3,
    borderWidth: 1,
    fontFamily: "regular",
    //paddingLeft: -20,
    fontSize: 15,
    borderColor: "#FBFBFB",
    backgroundColor: "#FBFBFB",
  },
  inputAndroid: {
    justifyContent: "center",
    height: 42,
    borderRadius: 3,
    borderWidth: 1,
    fontFamily: "regular",
    //paddingLeft: -20,
    fontSize: 15,
    borderColor: "#FBFBFB",
    backgroundColor: "#FBFBFB",
    color: "#001B4A",

    // marginLeft: 20,
    // marginRight: 20,
    // marginTop: 10,
    // height: 40,
    // backgroundColor: '#ffffff',
    // borderBottomColor: '#456CAF55',
    // color: '#001B4A',
    // fontFamily: "bold",
    // fontSize: 16,
    // borderRadius: 3,
  },
});

const pickerSelectStyles_tablet = StyleSheet.create({
  placeholder: {
    color: "#6F6F6F",
    fontFamily: "regular",
    fontSize: 20,
  },
  inputIOS: {
    justifyContent: "center",
    height: 52,
    borderRadius: 3,
    borderWidth: 1,
    fontFamily: "regular",
    //paddingLeft: -20,
    fontSize: 20,
    borderColor: "#FBFBFB",
    backgroundColor: "#FBFBFB",
  },
  inputAndroid: {
    justifyContent: "center",
    height: 52,
    borderRadius: 3,
    borderWidth: 1,
    fontFamily: "regular",
    //paddingLeft: -20,
    fontSize: 20,
    borderColor: "#FBFBFB",
    backgroundColor: "#FBFBFB",
    color: "#001B4A",

    // marginLeft: 20,
    // marginRight: 20,
    // marginTop: 10,
    // height: 40,
    // backgroundColor: '#ffffff',
    // borderBottomColor: '#456CAF55',
    // color: '#001B4A',
    // fontFamily: "bold",
    // fontSize: 16,
    // borderRadius: 3,
  },
});

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#FAFAFF",
  },
  viewswidth: {
    backgroundColor: "#FFFFFF",
    width: deviceWidth,
    textAlign: "center",
    fontSize: 24,
    height: 84,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    // alignItems: 'center',
  },
  input: {
    justifyContent: "center",
    marginLeft: 20,
    marginRight: 20,
    height: 44,
    marginTop: 5,
    marginBottom: 10,
    borderColor: "#8F9EB717",
    borderRadius: 3,
    backgroundColor: "#FBFBFB",
    borderWidth: 1,
    fontFamily: "regular",
    paddingLeft: 15,
    fontSize: 14,
  },
  phoneinput: {
    justifyContent: "center",
    margin: 20,
    height: 44,
    marginTop: 5,
    marginBottom: 10,
    borderColor: "#8F9EB717",
    borderRadius: 3,
    backgroundColor: "#FBFBFB",
    borderWidth: 1,
    fontFamily: "regular",
    paddingLeft: 15,
    fontSize: 14,
  },
  createUserinput: {
    justifyContent: "center",
    margin: 40,
    height: 44,
    marginTop: 5,
    marginBottom: 10,
    borderColor: "#8F9EB717",
    borderRadius: 3,
    backgroundColor: "#FBFBFB",
    borderWidth: 1,
    fontFamily: "regular",
    paddingLeft: 15,
    fontSize: 14,
  },
  signInButton: {
    backgroundColor: "#ED1C24",
    justifyContent: "center",
    width: "46%",
    marginLeft: 10,
    marginTop: 10,
    height: 40,
    borderRadius: 10,
    fontWeight: "bold",
    margin: 5,
    // alignSelf:'center',
    // marginBottom:100,
  },
  qty: {
    backgroundColor: "#ED1C24",
    justifyContent: "center",
    width: "18%",
    marginTop: 10,
    height: 40,
    margin: 5,
    borderRadius: 5,
    fontWeight: "bold",
  },
  imagealign: {
    marginTop: Device.isTablet ? 25 : 20,
    marginRight: Device.isTablet ? 30 : 20,
  },
  itemscount: {
    backgroundColor: "#ED1C24",
    justifyContent: "center",
    width: "18%",
    marginLeft: 0,
    marginTop: 10,
    height: 40,
    borderRadius: 5,
    fontWeight: "bold",
    margin: 5,
    // alignSelf:'center',
    // marginBottom:100,
  },
  itemDetail: {
    backgroundColor: "#ffffff",

    width: "60%",
    marginLeft: 0,
    marginTop: 10,
    height: 40,
    borderRadius: 5,
    fontWeight: "bold",
    margin: 5,
    // alignSelf:'center',
    // marginBottom:100,
  },
  signInButtonRight: {
    backgroundColor: "#ED1C24",
    justifyContent: "center",
    width: "46%",
    marginRight: 10,
    marginTop: 10,
    height: 40,
    borderRadius: 10,
    fontWeight: "bold",
    margin: 5,
    // alignSelf:'center',
    // marginBottom:100,
  },
  signInButtonText: {
    color: "white",
    alignSelf: "center",
    fontSize: 14,
    fontFamily: "regular",
  },
  signInFieldStyle: {
    color: "black",
    marginLeft: 20,
    marginTop: 5,
    fontSize: 18,
    fontFamily: "regular",
    textAlign: "left",
  },
  findIteminput: {
    marginLeft: 30,
    marginRight: 30,
    marginTop: 20,
    marginBottom: 1000,
    height: 50,
    backgroundColor: "#DEF1FF",
    borderRadius: 10,
    color: "#001B4A",
    fontFamily: "regular",
    fontSize: 12,
  },
  qtyInput: {
    width: 50,
    height: 25,
    // marginTop: 20,
    // marginBottom: 1000,
    // height: 50,
    // backgroundColor: "#DEF1FF",
    // borderRadius: 10,
    // color: '#001B4A',
    // fontFamily: "regular",
    // fontSize: 12,
  },
  signUptext: {
    marginTop: 40,
    fontFamily: "regular",
    alignSelf: "center",
    color: "#FFFFFF",
    fontSize: 28,
  },
  saleBillsText: {
    marginLeft: 0,
    marginTop: -20,
    marginBottom: 10,
    fontFamily: "bold",
    color: "#0F2851",
    fontSize: 14,
  },
  tablecontainer: {
    flex: 1,
    // width:deviceWidth,
    marginLeft: 20,
    marginRight: 20,
    padding: 20,
    paddingTop: 30,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#FAFAFF",
  },
  flatList: {
    marginTop: 20,
  },
  privilagecontainer: {
    flex: 1,
    justifyContent: "center",
    // backgroundColor: '#FAFAFF'
  },
  head: {
    height: 45,
    borderColor: "#FAFAFF",
    borderWidth: 1,
    borderRadius: 10,
  },
  text: {
    margin: 6,
    color: "#ED1C24",
    fontFamily: "semibold",
    fontSize: 11,
  },
  textData: {
    margin: 6,
    color: "#48596B",
    fontFamily: "regular",
    fontSize: 10,
  },

  Topcontainer: {
    flexDirection: "row",
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 5,
    marginTop: 20,
    borderColor: "#ED1C24",
    width: "90%",
    //backgroundColor: '#ffffff',
    height: 50,
  },

  TopcontainerforModel: {
    flexDirection: "row",
    marginLeft: 0,
    marginRight: 0,
    marginTop: 10,
    width: "100%",
    backgroundColor: "grey",
    borderRadius: 20,
    height: 50,
  },
  TopcontainerforPay: {
    flexDirection: "row",
    marginLeft: 0,
    marginRight: 0,
    // marginTop: 10,
    width: "100%",
    backgroundColor: "#ffffff",
    borderColor: "lightgray",
    borderRadius: 0,
    height: 50,
    position: "absolute",
    bottom: 10,
  },
  TopcontainerforItems: {
    flexDirection: "row",
    marginLeft: 0,
    marginRight: 0,
    marginTop: 10,
    width: "100%",
    backgroundColor: "#ffffff",
    borderColor: "lightgray",
    borderRadius: 0,
    height: 50,
  },
  redbox: {
    backgroundColor: "#1CA2FF",
    alignSelf: "flex-start",

    //marginHorizontal: "1%",
    marginBottom: 6,
    width: "25%",
    height: 45,
    textAlign: "center",
  },
  bluebox: {
    backgroundColor: "#ED1C24",
    alignSelf: "flex-start",
    //marginHorizontal: "1%",
    marginBottom: 6,
    width: "25%",
    height: 45,
    textAlign: "center",
  },
  blackbox: {
    backgroundColor: "#ED1C24",
    alignSelf: "flex-start",
    //marginHorizontal: "1%",
    marginBottom: 6,
    width: "25%",
    height: 45,
    textAlign: "center",
  },
  greenbox: {
    backgroundColor: "#ED1C24",
    alignSelf: "flex-start",
    //marginHorizontal: "1%",
    marginBottom: 6,
    width: "25%",
    height: 45,
    textAlign: "center",
  },

  tabBar: {
    flexDirection: "row",
    paddingTop: Constants.statusBarHeight,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    padding: 16,
  },
  box: {
    width: 50,
    height: 50,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  button: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    //borderRadius: 4,
    backgroundColor: "#ED1C24",
    alignSelf: "flex-start",
    //marginHorizontal: "1%",
    marginBottom: 6,
    width: "25%",
    height: 45,
    textAlign: "center",
  },
  selected: {
    backgroundColor: "#BBE3FF",
    borderWidth: 0,
    backgroundColor: "#ED1C24",
  },
  buttonLabel: {
    textAlign: "center",
    color: "#BBE3FF",
    fontFamily: "regular",
    fontSize: 14,
  },
  selectedLabel: {
    color: "white",
    textAlign: "center",
    alignSelf: "center",
    marginTop: 10,
    fontFamily: "regular",
    fontSize: 14,
  },
  label: {
    textAlign: "center",
    marginBottom: 10,
    fontSize: 24,
  },

  //model
  modelcontainer: {
    alignItems: "center",
    backgroundColor: "#ede3f2",
    padding: 100,
  },
  modal: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#f7021a",
    padding: 100,
  },
  modeltext: {
    color: "#3f2949",
    marginTop: 10,
  },
  btn: {
    width: 40,
    height: 18,
    borderWidth: 0.2,
    borderColor: "#48596B",
    fontFamily: "regular",
    fontSize: 10,
  },
  btnText: { textAlign: "center", color: "#fff" },

  preview: {
    margin: 20,
    height: 300,
    marginTop: 5,
    marginBottom: 10,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  overlay: {
    position: "absolute",
    padding: 16,
    right: 0,
    left: 0,
    alignItems: "center",
  },
  topOverlay: {
    top: 0,
    flex: 1,
    marginLeft: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bottomOverlay: {
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  enterBarcodeManualButton: {
    padding: 15,
    backgroundColor: "white",
    borderRadius: 40,
  },
  scanScreenMessage: {
    fontSize: 14,
    color: "white",
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
  },

  modalActive: {
    backgroundColor: "#000000",
  },
  modalInActive: {
    backgroundColor: "#ffffff",
  },
  modalActiveText: {
    color: "#ffffff",
  },
  modalInActiveText: {
    color: "#000000",
  },

  // Styles For Mobile
  viewsWidth_mobile: {
    backgroundColor: "#ffffff",
    width: deviceWidth,
    textAlign: "center",
    fontSize: 24,
    height: Device.isAndroid ? 70 : 84,
  },
  menuButton_mobile: {
    position: "absolute",
    left: 10,
    bottom: 0,
    width: 40,
    height: 40,
  },
  headerTitle_mobile: {
    position: "absolute",
    left: 70,
    bottom: 10,
    width: 300,
    height: 25,
    fontFamily: "bold",
    fontSize: 18,
    color: "#353C40",
  },
  modalContainer_mobile: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    alignSelf: "center",
    borderRadius: 5,
    marginTop: 20,
    borderColor: "#ED1C24",
    width: "100%",
    height: 50,
  },
  modalButton_mobile: {
    borderColor: "#353C40",
    height: 32,
    width: "33.3%",
    borderWidth: 1,
    alignSelf: "flex-start",
  },
  modalButtonText_mobile: {
    height: 32,
    width: 100,
    marginTop: 5,
    fontFamily: "medium",
    fontSize: 12,
    textAlign: "center",
    alignItems: "center",
  },
  navigationButton_mobile: {
    position: "absolute",
    right: 30,
    top: 150,
    backgroundColor: "#ED1C24",
    borderRadius: 5,
    width: 90,
    height: 32,
    textAlign: "center",
    alignItems: "center",
  },
  navigationButton2_mobile: {
    position: "absolute",
    right: 130,
    top: 150,
    backgroundColor: "#ED1C24",
    borderRadius: 5,
    width: 90,
    height: 32,
    textAlign: "center",
    alignItems: "center",
  },
  navigationButtonText_mobile: {
    fontSize: 12,
    fontFamily: "regular",
    color: "#ffffff",
    marginTop: 8,
    textAlign: "center",
    alignSelf: "center",
  },
  actInactSwitch_mobile: {
    position: "absolute",
    left: 115,
    top: 150,
    width: 32,
    height: 30,
    borderColor: "lightgray",
    // borderRadius:5,
  },
  actInactSwitchTextButton_mobile: {
    position: "absolute",
    left: 10,
    top: 150,
    borderRadius: 5,
    width: 95,
    height: 32,
  },
  actInactSwitchText_mobile: {
    fontSize: 16,
    fontFamily: "regular",
    color: "#707070",
    marginLeft: 10,
    marginTop: 8,
    textAlign: "center",
    alignSelf: "center",
  },
  filterMainContainer_mobile: {
    width: deviceWidth,
    alignItems: "center",
    marginLeft: -20,
    backgroundColor: "#ffffff",
    position: "absolute",
    bottom: -20,
  },
  filterByTitle_mobile: {
    position: "absolute",
    left: 20,
    top: 15,
    width: 300,
    height: 20,
    fontFamily: "medium",
    fontSize: 16,
    color: "#353C40",
  },
  filterByTitleDecoration_mobile: {
    height: Device.isTablet ? 2 : 1,
    width: deviceWidth,
    backgroundColor: "lightgray",
    marginTop: 50,
  },
  filterCloseButton_mobile: {
    position: "absolute",
    right: 8,
    top: 15,
    width: 50,
    height: 50,
  },
  filterCloseImage_mobile: {
    color: "#ED1C24",
    fontFamily: "regular",
    fontSize: 12,
    position: "absolute",
    top: 10,
    right: 0,
  },
  filterDateButton_mobile: {
    width: deviceWidth - 40,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10,
    borderColor: "#8F9EB717",
    borderRadius: 3,
    height: 50,
    backgroundColor: "#F6F6F6",
    borderRadius: 5,
  },
  filterDateButtonText_mobile: {
    marginLeft: 16,
    marginTop: 20,
    color: "#6F6F6F",
    fontSize: 15,
    fontFamily: "regular",
  },
  datePickerContainer_mobile: {
    height: 280,
    width: deviceWidth,
    backgroundColor: "#ffffff",
  },
  datePickerButton_mobile: {
    position: "absolute",
    left: 20,
    top: 10,
    height: 30,
    backgroundColor: "#ED1C24",
    borderRadius: 5,
  },
  datePickerEndButton_mobile: {
    position: "absolute",
    right: 20,
    top: 10,
    height: 30,
    backgroundColor: "#ED1C24",
    borderRadius: 5,
  },
  datePickerButtonText_mobile: {
    textAlign: "center",
    marginTop: 5,
    color: "#ffffff",
    fontSize: 15,
    fontFamily: "regular",
  },
  input_mobile: {
    justifyContent: "center",
    marginLeft: 20,
    marginRight: 20,
    height: 44,
    marginTop: 5,
    marginBottom: 10,
    borderColor: "#8F9EB717",
    borderRadius: 3,
    backgroundColor: "#FBFBFB",
    borderWidth: 1,
    fontFamily: "regular",
    paddingLeft: 15,
    fontSize: 14,
  },
  filterApplyButton_mobile: {
    width: deviceWidth - 40,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
    height: 50,
    backgroundColor: "#ED1C24",
    borderRadius: 5,
  },
  filterButtonText_mobile: {
    textAlign: "center",
    marginTop: 20,
    color: "#ffffff",
    fontSize: 15,
    fontFamily: "regular",
  },
  filterCancelButton_mobile: {
    width: deviceWidth - 40,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
    height: 50,
    backgroundColor: "#ffffff",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#353C4050",
  },
  filterButtonCancelText_mobile: {
    textAlign: "center",
    marginTop: 20,
    color: "#000000",
    fontSize: 15,
    fontFamily: "regular",
  },
  rnSelect_mobile: {
    color: "#8F9EB7",
    fontSize: 15,
  },
  rnSelectContainer_mobile: {
    justifyContent: "center",
    margin: 20,
    height: 44,
    marginTop: 5,
    marginBottom: 10,
    borderColor: "#8F9EB717",
    borderRadius: 3,
    backgroundColor: "#FBFBFB",
    borderWidth: 1,
    fontFamily: "regular",
    paddingLeft: 15,
    fontSize: 14,
  },

  // Styles For Tablet
  viewsWidth_tablet: {
    backgroundColor: "#ffffff",
    width: deviceWidth,
    textAlign: "center",
    fontSize: 28,
    height: 90,
  },
  menuButton_tablet: {
    position: "absolute",
    left: 10,
    top: 38,
    width: 90,
    height: 90,
  },
  headerTitle_tablet: {
    position: "absolute",
    left: 70,
    top: 40,
    width: 300,
    height: 40,
    fontFamily: "bold",
    fontSize: 24,
    color: "#353C40",
  },
  modalContainer_tablet: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    alignSelf: "center",
    borderRadius: 5,
    marginTop: 20,
    borderColor: "#ED1C24",
    width: "100%",
    height: 50,
  },
  modalButton_tablet: {
    borderColor: "#353C40",
    height: 42,
    width: "33.3%",
    borderWidth: 1,
    alignSelf: "flex-start",
  },
  modalButtonText_tablet: {
    height: 42,
    width: 210,
    marginTop: 5,
    fontFamily: "medium",
    fontSize: 17,
    textAlign: "center",
    alignItems: "center",
  },
  navigationButton_tablet: {
    position: "absolute",
    right: 30,
    top: 170,
    backgroundColor: "#ED1C24",
    borderRadius: 5,
    width: 120,
    height: 32,
    textAlign: "center",
    alignItems: "center",
  },
  navigationButton2_tablet: {
    position: "absolute",
    right: 200,
    top: 170,
    backgroundColor: "#ED1C24",
    borderRadius: 5,
    width: 120,
    height: 32,
    textAlign: "center",
    alignItems: "center",
  },
  navigationButtonText_tablet: {
    fontSize: 17,
    fontFamily: "regular",
    color: "#ffffff",
    marginTop: 6,
    textAlign: "center",
    alignSelf: "center",
  },
  actInactSwitch_tablet: {
    position: "absolute",
    left: 140,
    top: 172,
    width: 42,
    height: 40,
    borderColor: "lightgray",
    // borderRadius:5,
  },
  actInactSwitchTextButton_tablet: {
    position: "absolute",
    left: 10,
    top: 169,
    borderRadius: 5,
    width: 125,
    height: 32,
  },
  actInactSwitchText_tablet: {
    fontSize: 21,
    fontFamily: "regular",
    color: "#707070",
    marginLeft: 10,
    marginTop: 8,
    textAlign: "center",
    alignSelf: "center",
  },
  filterMainContainer_tablet: {
    width: deviceWidth,
    alignItems: "center",
    marginLeft: -40,
    backgroundColor: "#ffffff",
    height: 600,
    position: "absolute",
    bottom: -40,
  },
  filterByTitle_tablet: {
    position: "absolute",
    left: 20,
    top: 15,
    width: 300,
    height: 30,
    fontFamily: "medium",
    fontSize: 21,
    color: "#353C40",
  },
  filterByTitleDecoration_tablet: {
    height: Device.isTablet ? 2 : 1,
    width: deviceWidth,
    backgroundColor: "lightgray",
    marginTop: 60,
  },
  filterCloseButton_tablet: {
    position: "absolute",
    right: 24,
    top: 10,
    width: 60,
    height: 60,
  },
  filterCloseImage_tablet: {
    color: "#ED1C24",
    fontFamily: "regular",
    fontSize: 17,
    position: "absolute",
    top: 10,
    right: 24,
  },
  filterDateButton_tablet: {
    width: deviceWidth - 30,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10,
    borderColor: "#8F9EB717",
    borderRadius: 3,
    height: 60,
    backgroundColor: "#F6F6F6",
    borderRadius: 5,
  },
  filterDateButtonText_tablet: {
    marginLeft: 16,
    marginTop: 20,
    color: "#6F6F6F",
    fontSize: 20,
    fontFamily: "regular",
  },
  datePickerButton_tablet: {
    position: "absolute",
    left: 20,
    top: 10,
    height: 40,
    backgroundColor: "#ED1C24",
    borderRadius: 5,
  },
  datePickerButtonText_tablet: {
    textAlign: "center",
    marginTop: 5,
    color: "#ffffff",
    fontSize: 20,
    fontFamily: "regular",
  },
  datePickerEndButton_tablet: {
    position: "absolute",
    right: 20,
    top: 10,
    height: 40,
    backgroundColor: "#ED1C24",
    borderRadius: 5,
  },
  input_tablet: {
    justifyContent: "center",
    marginLeft: 20,
    marginRight: 20,
    height: 54,
    marginTop: 5,
    marginBottom: 10,
    borderColor: "#8F9EB717",
    borderRadius: 3,
    backgroundColor: "#FBFBFB",
    borderWidth: 1,
    fontFamily: "regular",
    paddingLeft: 15,
    fontSize: 20,
  },
  filterApplyButton_tablet: {
    width: deviceWidth - 40,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
    height: 60,
    backgroundColor: "#ED1C24",
    borderRadius: 5,
  },
  filterButtonText_tablet: {
    textAlign: "center",
    marginTop: 20,
    color: "#ffffff",
    fontSize: 20,
    fontFamily: "regular",
  },
  filterCancelButton_tablet: {
    width: deviceWidth - 40,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
    height: 60,
    backgroundColor: "#ffffff",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#353C4050",
  },
  filterButtonCancelText_tablet: {
    textAlign: "center",
    marginTop: 20,
    color: "#000000",
    fontSize: 20,
    fontFamily: "regular",
  },
  flatlistContainer_tablet: {
    height: 160,
    backgroundColor: "#FBFBFB",
    borderBottomWidth: 5,
    borderBottomColor: "#FFFFFF",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  flatlistSubContainer_tablet: {
    flexDirection: "column",
    width: "100%",
    height: 160,
  },
  rnSelect_tablet: {
    color: "#8F9EB7",
    fontSize: 20,
  },
  rnSelectContainer_tablet: {
    justifyContent: "center",
    margin: 20,
    height: 54,
    marginTop: 5,
    marginBottom: 10,
    borderColor: "#8F9EB717",
    borderRadius: 3,
    backgroundColor: "#FBFBFB",
    borderWidth: 1,
    fontFamily: "regular",
    paddingLeft: 15,
    fontSize: 20,
  },
});
