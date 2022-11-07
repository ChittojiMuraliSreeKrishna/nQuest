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
import IconFA from 'react-native-vector-icons/FontAwesome';
import IconIA from 'react-native-vector-icons/Ionicons';
import forms from '../../commonUtils/assets/styles/formFields.scss';
import scss from "../../commonUtils/assets/styles/style.scss";
import { formatListDates } from "../../commonUtils/DateFormate";
import DateSelector from "../../commonUtils/DateSelector";
import Loader from "../../commonUtils/loader";
import { RH, RW } from "../../Responsive";
import AccountingService from "../services/AccountingService";
import {
  flatListHeaderContainer
} from "../Styles/Styles";

var deviceWidth = Dimensions.get("window").width;

export default class CreditNotes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deleteCreditNotes: false,
      modalVisible: true,
      filterCreditData: [],
      creditNotes: [],
      storeId: 0,
      userId: 0,
      fromDate: "",
      toDate: "",
      mobileNumber: "",
      customerId: "",
      mobile: "",
      date: new Date(),
      enddate: new Date(),
      storeName: "",
      stores: [],
      fromDate: "",
      startDate: "",
      endDate: "",
      toDate: "",
      datepickerOpen: false,
      datepickerendOpen: false,
      isShowAllTransactions: false,
      transactionHistory: [],
      loading: false,
      filterActive: false,
      flagFilterOpen: false,
      isFetching: false
    };
  }

  modelCancel () {
    this.setState({
      modalVisible: false,
      flagFilterOpen: false
    });
  }

  modalViewCancel () {
    this.setState({
      modalVisible: false,
      isShowAllTransactions: false,
    });
  }

  async componentDidMount () {
    const storeId = await AsyncStorage.getItem("storeId");
    const userId = await AsyncStorage.getItem("custom:userId");
    this.setState({ storeId: storeId, userId: userId });
    this.getAllCreditNotes();
  }

  // Refreshing Credit Notes
  refresh () {
    this.setState({ creditNotes: [] }, () => {
      this.getAllCreditNotes();
    });
  }

  // Getting All Credit Notes
  async getAllCreditNotes () {
    this.setState({ loading: true });
    const accountType = "CREDIT";
    const { storeId } = this.state;
    console.log({ storeId });
    const reqOb = {
      fromDate: null,
      mobileNumber: null,
      storeId: storeId,
      toDate: null,
      accountType: accountType,
      customerId: null,
    };
    AccountingService.getCreditNotes(reqOb).then((res) => {
      if (res) {
        console.log({ res }, res.data.content);
        this.setState({ creditNotes: res.data.content });
      }
      this.setState({ loading: false });
    });
  }

  applyCreditNotesFilter () {
    this.setState({ loading: true });
    const accountType = "CREDIT";
    const { storeId, startDate, endDate, mobileNumber } = this.state;
    const reqOb = {
      fromDate: startDate,
      toDate: endDate,
      mobileNumber: mobileNumber ? `+91${mobileNumber}` : null,
      storeId: storeId,
      accountType: accountType,
      customerId: null,
    };
    console.log(reqOb);
    AccountingService.getCreditNotes(reqOb)
      .then((res) => {
        if (res) {
          // console.log(res.data)
          this.setState({
            filterCreditData: res.data.content,
            filterActive: true,
          });
        }
        this.setState({
          loading: false,
          modalVisible: false,
          flagFilterOpen: false,
        });
      })
      .catch((err) => {
        console.log(err);
        this.setState({
          loading: false,
          modalVisible: false,
          flagFilterOpen: false,
        });
      });
  }

  handleStoreName = (value) => {
    this.setState({ storeName: value });
  };

  datepickerClicked () {
    this.setState({ datepickerOpen: true });
  }

  enddatepickerClicked () {
    this.setState({ datepickerendOpen: true });
  }

  handleMobile = (value) => {
    this.setState({ mobileNumber: value });
  };

  datepickerClicked () {
    this.setState({ datepickerOpen: true });
  }

  enddatepickerClicked () {
    this.setState({ datepickerendOpen: true });
  }

  datepickerCancelClicked = () => {
    this.setState({
      datepickerOpen: false,
    });
  };

  datepickerEndCancelClicked = () => {
    this.setState({
      datepickerendOpen: false,
    });
  };

  handleDate = (value) => {
    this.setState({ startDate: value });
  };

  handleEndDate = (value) => {
    this.setState({ endDate: value });
  };

  handleViewCredit (item, index) {
    const reqOb = {
      fromDate: null,
      mobileNumber: null,
      storeId: item.storeId,
      toDate: null,
      accountType: item.accountType,
      customerId: item.customerId,
    };
    AccountingService.getAllLedgerLogs(reqOb).then((res) => {
      if (res) {
        this.setState({
          isShowAllTransactions: true,
          modalVisible: true,
          transactionHistory: res.data.content,
        });
      }
    });
  }

  // Edit Navigation
  handleAddCredit (item, index) {
    this.props.navigation.navigate("AddCreditNotes", {
      item: item,
      isEdit: true,
      onGoBack: () => this.refresh(),
      goBack: () => this.refresh(),
    });
  }

  // Filter Actions
  filterAction () {
    this.setState({ flagFilterOpen: true, modalVisible: true });
  }

  clearFilterAction () {
    this.setState({
      filterActive: false,
      mobileNumber: "",
      startDate: "",
      endDate: "",
      date: new Date(),
      enddate: new Date(),
    });
    this.getAllCreditNotes();
  }

  // Add Credit
  navigateToAddCreditNotes () {
    this.props.navigation.navigate("AddCreditNotes", {
      isEdit: false,
      onGoBack: () => this.refresh(),
      goBack: () => this.refresh(),
    });
  }

  render () {
    return (
      <View>
        {this.state.loading && <Loader loading={this.state.loading} />}
        <FlatList
          ListHeaderComponent={
            <View style={flatListHeaderContainer}>
              <View>
                <Text style={scss.flat_heading}>List Of Credit Notes - <Text style={{ color: '#ED1C24' }}>{this.state.filterActive ? this.state.filterCreditData.length : this.state.creditNotes.length}</Text> </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  style={{ height: 20, width: 20, marginRight: 20 }}
                  onPress={() => this.navigateToAddCreditNotes()}
                >
                  <Image
                    style={{ height: 20, width: 25 }}
                    source={require("../../commonUtils/assets/Images/add_credit.png")}
                  />
                </TouchableOpacity>
                {!this.state.filterActive && (
                  <IconFA
                    size={25}
                    name="sliders"
                    onPress={() => this.filterAction()}
                  ></IconFA>
                )}
                {this.state.filterActive && (
                  <IconFA
                    size={25}
                    name="sliders"
                    color="#ED1C24"
                    onPress={() => this.clearFilterAction()}
                  ></IconFA>
                )}
              </View>
            </View>
          }
          data={
            this.state.filterActive
              ? this.state.filterCreditData
              : this.state.creditNotes
          }
          style={scss.flatListBody}
          scrollEnabled={true}
          // ListEmptyComponent={<Text style={listEmptyMessage}>&#9888; Records Not Found</Text>}
          refreshing={this.state.isFetching}
          onRefresh={() => this.refresh()}
          renderItem={({ item, index }) => (
            <ScrollView>
              <View style={scss.flatListContainer}>
                <View style={scss.flatListSubContainer}>
                  <View style={scss.textContainer}>
                    <Text style={scss.highText}>#CRM ID: {item.customerId}</Text>
                    <Text style={scss.textStyleLight}>Name:
                      <Text style={scss.textStyleMedium}> {item.customerName}</Text>
                    </Text>
                  </View>
                  <View style={scss.textContainer}>
                    <Text style={scss.textStyleLight}>STORE:
                      <Text style={scss.textStyleMedium}> {item.storeId}</Text>
                    </Text>
                    <Text style={scss.textStyleLight}>
                      APPROVED BY: {"\n"}
                      {item.createdBy}
                    </Text>
                  </View>
                  <View style={scss.textContainer}>
                    <Text style={scss.textStyleLight}>
                      USED AMMOUNT: {item.usedAmount}
                    </Text>
                    <Text style={scss.textStyleLight}>BALANCE: {item.amount}</Text>
                  </View>
                  <View style={scss.flatListFooter}>
                    <Text style={scss.footerText}>
                      DATE:{" "}
                      {formatListDates(item.createdDate)}
                    </Text>
                    <View style={scss.buttonContainer}>
                      <IconFA
                        name="eye"
                        style={[ scss.action_icons, { paddingRight: 10 } ]}
                        size={25}
                        onPress={() => this.handleViewCredit(item, index)}
                      ></IconFA>
                      <IconIA
                        name="add-circle-outline"
                        size={25}
                        style={scss.action_icons}
                        onPress={() => this.handleAddCredit(item, index)}
                      ></IconIA>
                    </View>
                  </View>
                </View>
              </View>
            </ScrollView>
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
                    <View style={forms.filter_dates_container}>
                      <TouchableOpacity
                        style={forms.filter_dates}
                        testID="openModal"
                        onPress={() => this.datepickerClicked()}
                      >
                        <Text style={forms.fiter_dates_text}>
                          {this.state.startDate == ""
                            ? "START DATE"
                            : this.state.startDate}
                        </Text>
                        <Image
                          style={forms.calender_image}
                          source={require("../assets/images/calender.png")}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={forms.filter_dates}
                        testID="openModal"
                        onPress={() => this.enddatepickerClicked()}
                      >
                        <Text style={forms.fiter_dates_text}>
                          {this.state.endDate == ""
                            ? "END DATE"
                            : this.state.endDate}
                        </Text>
                        <Image
                          style={forms.calender_image}
                          source={require("../assets/images/calender.png")}
                        />
                      </TouchableOpacity>
                    </View>
                    {this.state.datepickerOpen && (
                      <View style={styles.dateTopView}>
                        <DateSelector
                          dateCancel={this.datepickerCancelClicked}
                          setDate={this.handleDate}
                        />
                      </View>
                    )}
                    {this.state.datepickerendOpen && (
                      <View style={styles.dateTopView}>
                        <DateSelector
                          dateCancel={this.datepickerEndCancelClicked}
                          setDate={this.handleEndDate}
                        />
                      </View>
                    )}
                    <TextInput
                      mode="outlined"
                      outlineColor="#d6d6d6"
                      activeOutlineColor="#d6d6d6"
                      style={forms.input_fld}
                      underlineColorAndroid="transparent"
                      placeholder="MOBILE"
                      maxLength={10}
                      keyboardType={"numeric"}
                      textContentType="telephoneNumber"
                      placeholderTextColor="#6F6F6F"
                      textAlignVertical="center"
                      autoCapitalize="none"
                      value={this.state.mobileNumber}
                      onChangeText={this.handleMobile}
                    />
                    <View style={forms.action_buttons_container}>
                      <TouchableOpacity style={[ forms.action_buttons, forms.submit_btn ]}
                        onPress={() => this.applyCreditNotesFilter()}>
                        <Text style={forms.submit_btn_text} >{I18n.t("APPLY")}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[ forms.action_buttons, forms.cancel_btn ]}
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
        {this.state.isShowAllTransactions && (
          <View>
            <Modal style={{ margin: 0 }} isVisible={this.state.modalVisible}
              onBackButtonPress={() => this.modalViewCancel()}
              onBackdropPress={() => this.modalViewCancel()} >
              <View style={forms.filterModelContainer}>
                <Text style={forms.popUp_decorator}>-</Text>
                <View style={forms.filterModelSub}>
                  <ScrollView>
                    <FlatList
                      data={this.state.transactionHistory}
                      scrollEnabled={true}
                      renderItem={({ item, index }) => (
                        <View style={scss.model_subbody}>
                          <View style={scss.model_text_container}>
                            <Text style={[ scss.highText, { textAlign: 'left' } ]}>
                              #CRM ID: {item.customerId}
                            </Text>
                            <Text style={[ scss.textStyleMedium, { textAlign: 'right' } ]}>
                              STORE: {item.storeId}
                            </Text>
                          </View>
                          <View style={scss.model_text_container}>
                            <Text style={[ scss.textStyleLight, { textAlign: 'left' } ]}>
                              TRANSACTION TYPE: {"\n"}
                              {item.transactionType}
                            </Text>
                            <Text style={[ scss.textStyleLight, { textAlign: 'right' } ]}>
                              ACCOUNT TYPE: {"\n"}
                              {item.accountType}
                            </Text>
                          </View>
                          <View style={scss.model_text_container}>
                            <Text style={[ scss.textStyleLight, , { textAlign: 'left' } ]}>
                              AMOUNT: {item.amount}
                            </Text>
                            <Text style={[ scss.textStyleLight, { textAlign: 'right' } ]}>
                              DATE:{" "}
                              {formatListDates(item.createdDate)}
                            </Text>
                          </View>
                        </View>
                      )}
                    />
                  </ScrollView>
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

  date: {
    width: deviceWidth,
    height: RH(200),
    marginTop: RH(50),
  },
  calenderpng: {
    position: "absolute",
    top: RH(10),
    right: 0,
  },
  dateTopView: {
    height: RW(280),
    width: deviceWidth,
    backgroundColor: "#ffffff",
  },
  dateTop2: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: Device.isTablet ? 15 : RH(10),
    marginLeft: Device.isTablet ? 20 : RW(10),
    marginRight: Device.isTablet ? 20 : RW(10),
  },

  // Styles For Mobile

  filterMainContainer_mobile: {
    width: deviceWidth,
    alignItems: "center",
    marginLeft: -20,
    backgroundColor: "#ffffff",
    height: 400,
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
  filterDateButton_mobile: {
    width: deviceWidth - 40,
    marginTop: 5,
    marginBottom: 10,
    marginLeft: 20,
    marginRight: 20,
    paddingLeft: 15,
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
  filterCloseImage_mobile: {
    color: "#ED1C24",
    fontFamily: "regular",
    fontSize: 12,
    position: "absolute",
    top: 10,
    right: 0,
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
  filterMainContainer_tablet: {
    width: deviceWidth,
    alignItems: "center",
    marginLeft: -40,
    backgroundColor: "#ffffff",
    height: 500,
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
  filterDateButton_tablet: {
    width: deviceWidth - 40,
    marginTop: 5,
    marginBottom: 10,
    marginLeft: 20,
    marginRight: 20,
    paddingLeft: 15,
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

const flats = StyleSheet.create({
  buttons: {
    flexDirection: "row",
    justifyContent: "center",
  },
  text: {
    height: "100%",
    flexDirection: "column",
    justifyContent: "space-around",
  },

  // flats for Mobile
  flatlistContainer_mobile: {
    height: 150,
    backgroundColor: "#fbfbfb",
    borderBottomWidth: 5,
    borderBottomColor: "#ffffff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  flatlistSubContainer_mobile: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    paddingLeft: 10,
    paddingRight: 10,
    alignItems: "center",
    height: 140,
  },
  flatlistTextAccent_mobile: {
    fontFamily: "medium",
    fontSize: 16,
    color: "#ED1C24",
  },
  flatlistText_mobile: {
    fontFamily: "regular",
    fontSize: 12,
    color: "#353c40",
  },
  flatlistTextCommon_mobile: {
    fontFamily: "regular",
    fontSize: 12,
    color: "#808080",
  },
  editButton_mobile: {
    width: 30,
    height: 30,
    borderBottomLeftRadius: 5,
    borderTopLeftRadius: 5,
    borderWidth: 1,
    borderColor: "lightgray",
    // borderRadius:5,
  },
  deleteButton_mobile: {
    width: 30,
    height: 30,
    borderBottomRightRadius: 5,
    borderTopRightRadius: 5,
    borderWidth: 1,
    borderColor: "lightgray",
  },

  // flats for Tablet
  flatlistContainer_tablet: {
    height: 200,
    backgroundColor: "#fbfbfb",
    borderBottomWidth: 5,
    borderBottomColor: "#ffffff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  flatlistSubContainer_tablet: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    paddingLeft: 20,
    paddingRight: 20,
    alignItems: "center",
    height: 160,
  },
  flatlistTextAccent_tablet: {
    fontFamily: "medium",
    fontSize: 21,
    color: "#ED1C24",
  },
  flatlistText_tablet: {
    fontFamily: "regular",
    fontSize: 21,
    color: "#353c40",
  },
  flatlistTextCommon_tablet: {
    fontFamily: "regular",
    fontSize: 17,
    color: "#808080",
  },
  flatlstTextCommon_tablet: {
    fontFamily: "regular",
    fontSize: 17,
    color: "#808080",
  },
  editButton_tablet: {
    width: 50,
    height: 50,
    borderBottomLeftRadius: 5,
    borderTopLeftRadius: 5,
    borderWidth: 1,
    borderColor: "lightgray",
    // borderRadius:5,
  },
  deleteButton_tablet: {
    width: 50,
    height: 50,
    borderBottomRightRadius: 5,
    borderTopRightRadius: 5,
    borderWidth: 1,
    borderColor: "lightgray",
  },
});
