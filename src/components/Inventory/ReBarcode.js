import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
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
import I18n from "react-native-i18n";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Modal from "react-native-modal";
import Loader from "../../commonUtils/loader";
import { RH, RW } from "../../Responsive";
import InventoryService from "../services/InventoryService";
import {
  cancelBtn,
  cancelBtnText,
  datePickerBtnText,
  datePickerButton1,
  datePickerButton2,
  dateSelector,
  dateText,
  inputField,
  submitBtn,
  submitBtnText
} from "../Styles/FormFields";
import {
  filterCloseImage,
  filterHeading,
  filterMainContainer,
  filterSubContainer
} from "../Styles/PopupStyles";
import {
  buttonContainer,
  buttonImageStyle,
  buttonStyle,
  buttonStyle1,
  filterBtn,
  flatListHeaderContainer,
  flatListMainContainer,
  flatlistSubContainer,
  flatListTitle,
  highText,
  listEmptyMessage,
  textContainer,
  textStyleLight,
  textStyleMedium
} from "../Styles/Styles";

var deviceWidth = Dimensions.get("window").width;
var deviceheight = Dimensions.get("window").height;

export default class ReBarcode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reBarcodesData: [],
      filterRebarcodesData: [],
      pageNo: 0,
      filterPageNo: 0,
      storeId: 0,
      filterActive: false,
      modalVisible: true,
      flagFilterOpen: false,
      date: new Date(),
      enddate: new Date(),
      startDate: "",
      endDate: "",
      barCodeId: "",
    };
  }

  async componentDidMount() {
    const storeId = await AsyncStorage.getItem("storeId");
    this.setState({ storeId: storeId });
    this.getAllReBarcodes();
  }

  // Rebarcode Data
  getAllReBarcodes() {
    const params = {
      fromDate: this.state.startDate,
      toDate: this.state.endDate,
      currentBarcodeId: this.state.barCodeId,
      storeId: this.state.storeId,
    };
    console.log(params);
    this.setState({ loading: true });
    const request = "?page=" + parseInt(this.state.pageNo) + "&size=10";
    axios
      .post(InventoryService.getbarcodeTexttileAdjustments() + request, params)
      .then((res) => {
        if (res.data) {
          // this.setState({ reBarcodesData: [] })
          this.setState({
            loading: false,
            reBarcodesData: this.state.reBarcodesData.concat(res.data.content),
          });
          console.log("rebarcodesData", this.state.reBarcodesData);
          if (res.data.length === 0) {
            this.setState({ error: "Records Not Found" });
          }
        }
      })
      .catch(() => {
        this.setState({ loading: false, error: "Records Not Found" });
      });
  }

  // Filter Actions
  filterAction() {
    this.setState({ flagFilterOpen: true, modalVisible: true });
  }

  clearFilterAction() {
    this.setState({ filterActive: false, reBarcodesData: [], filterRebarcodesData: [], startDate: "", endDate: "", barCodeId: "" });
    this.getAllReBarcodes();
  }

  modelCancel() {
    this.setState({ flagFilterOpen: false, modalVisible: false });
  }

  // Print
  print() { }

  // Filter ReBarcode Api
  applyReBarcodeFilter() {
    let list = {};
    list = {
      fromDate: this.state.startDate,
      toDate: this.state.endDate,
      currentBarcodeId: this.state.barCodeId,
      storeId: this.state.storeId,
    };
    const request = "?page=" + parseInt(this.state.filterPageNo) + "&size=10";
    axios
      .post(InventoryService.getbarcodeTexttileAdjustments() + request, list)
      .then((res) => {
        console.log(res.data);
        console.log(res.data.content.length);

        if (
          res?.data &&
          res.data.content.length > 0
        ) {
          this.setState({
            filterRebarcodesData: this.state.filterRebarcodesData.concat(
              res.data.content,
            ),
            barCodeId: "",
            startDate: "",
            endDate: "",
            filterActive: true,
          });
        }
      })
      .catch((err) => {
        this.setState({ loading: false });
        console.log(err);
        this.setState({ filterRebarcodesData: [] });
      });
    this.setState({ modalVisible: false });
  }

  // Date Actions
  datepickerClicked() {
    this.setState({ datepickerOpen: true });
  }

  enddatepickerClicked() {
    this.setState({ datepickerendOpen: true });
  }

  datepickerDoneClicked() {
    if (
      parseInt(this.state.date.getDate()) < 10 &&
      parseInt(this.state.date.getMonth()) < 10
    ) {
      this.setState({
        startDate:
          this.state.date.getFullYear() +
          "-0" +
          (this.state.date.getMonth() + 1) +
          "-" +
          "0" +
          this.state.date.getDate(),
      });
    } else if (parseInt(this.state.date.getDate()) < 10) {
      this.setState({
        startDate:
          this.state.date.getFullYear() +
          "-" +
          (this.state.date.getMonth() + 1) +
          "-" +
          "0" +
          this.state.date.getDate(),
      });
    } else if (parseInt(this.state.date.getMonth()) < 10) {
      this.setState({
        startDate:
          this.state.date.getFullYear() +
          "-0" +
          (this.state.date.getMonth() + 1) +
          "-" +
          this.state.date.getDate(),
      });
    } else {
      this.setState({
        startDate:
          this.state.date.getFullYear() +
          "-" +
          (this.state.date.getMonth() + 1) +
          "-" +
          this.state.date.getDate(),
      });
    }

    this.setState({
      doneButtonClicked: true,
      datepickerOpen: false,
      datepickerendOpen: false,
    });
  }

  datepickerendDoneClicked() {
    if (
      parseInt(this.state.enddate.getDate()) < 10 &&
      parseInt(this.state.enddate.getMonth()) < 10
    ) {
      this.setState({
        endDate:
          this.state.enddate.getFullYear() +
          "-0" +
          (this.state.enddate.getMonth() + 1) +
          "-" +
          "0" +
          this.state.enddate.getDate(),
      });
    } else if (parseInt(this.state.enddate.getDate()) < 10) {
      this.setState({
        endDate:
          this.state.enddate.getFullYear() +
          "-" +
          (this.state.enddate.getMonth() + 1) +
          "-" +
          "0" +
          this.state.enddate.getDate(),
      });
    } else if (parseInt(this.state.enddate.getMonth()) < 10) {
      this.setState({
        endDate:
          this.state.enddate.getFullYear() +
          "-0" +
          (this.state.enddate.getMonth() + 1) +
          "-" +
          this.state.enddate.getDate(),
      });
    } else {
      this.setState({
        endDate:
          this.state.enddate.getFullYear() +
          "-" +
          (this.state.enddate.getMonth() + 1) +
          "-" +
          this.state.enddate.getDate(),
      });
    }
    this.setState({
      enddoneButtonClicked: true,
      datepickerOpen: false,
      datepickerendOpen: false,
    });
  }

  datepickerCancelClicked() {
    this.setState({
      date: new Date(),
      endDate: new Date(),
      datepickerOpen: false,
      datepickerendOpen: false,
    });
  }

  // handle Barcodeid filter
  handlebarCodeId = (value) => {
    this.setState({ barCodeId: value.trim() });
  };

  // View RebarCode
  seeDetails = (item, index) => {
    this.setState({ barcodesData: [] });
    const params = {
      barcode: item.currentBarcodeId,
      storeId: this.state.storeId,
    };
    console.log("storeId" + this.state.storeId);
    console.error("params", params);
    // axios.get(InventoryService.getTextileBarcodesDetails(), { params }).then((res) => {
    //   if (res) {
    //     console.log("response edit", res);
    //     if (res.data && res.data["isSuccess"] === "true") {
    //       if (res.data["result"]) {
    //         this.state.barcodesData.push(res.data["result"]);
    //         this.props.navigation.navigate('ViewReBarcode'
    //           , {
    //             item: res.data["result"], isEdit: true,
    //             onGoBack: () => this.child.getAllBarcodes(),
    //           });
    //       }
    //       console.log(res.data)
    //       this.setState({ barcodesData: this.state.barcodesData });
    //     }
    //   }
    // }).catch(err => {
    //   console.log(err);
    // });
  };

  isLoadMoreList = () => {
    if (this.state.filterActive) {
      this.setState({ filterPageNo: this.state.filterPageNo + 1 }, () => {
        this.applyReBarcodeFilter();
      });
    } else {
      this.setState({ pageNo: this.state.pageNo + 1 }, () => {
        this.getAllReBarcodes();
      });
    }
  };

  render() {
    return (
      <View>
        {this.state.loading && <Loader loading={this.state.loading} />}
        <FlatList
          ListHeaderComponent={
            <View style={flatListHeaderContainer}>
              <Text style={flatListTitle}>Re-Barcode List</Text>
              {!this.state.filterActive && (
                <TouchableOpacity
                  style={filterBtn}
                  onPress={() => this.filterAction()}
                >
                  <Image
                    style={{ alignSelf: "center", top: RH(5) }}
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
                    style={{ alignSelf: "center", top: RH(5) }}
                    source={require("../assets/images/clearFilterSearch.png")}
                  />
                </TouchableOpacity>
              )}
            </View>
          }
          data={
            this.state.filterActive
              ? this.state.filterRebarcodesData
              : this.state.reBarcodesData
          }
          scrollEnabled={true}
          ListEmptyComponent={
            <Text style={listEmptyMessage}>&#9888; Records Not Found</Text>
          }
          renderItem={({ item, index }) => (
            <View style={flatListMainContainer}>
              <View style={flatlistSubContainer}>
                <View style={textContainer}>
                  <Text style={highText}>
                    {I18n.t("PARENT BARCODE")}: {item.toBeBarcodeId}
                  </Text>
                </View>
                <View style={textContainer}>
                  <Text style={textStyleMedium} selectable={true}>
                    {item.currentBarcodeId}
                  </Text>
                  <Text style={textStyleLight}>
                    {I18n.t("EMPLOYEE ID")}: {"\n"}
                    {item.createdBy}
                  </Text>
                </View>
                <View style={textContainer}>
                  <Text style={textStyleLight}>
                    {I18n.t("DATE")}: {"\n"}
                    {item.fromDate}
                  </Text>
                  <View style={buttonContainer}>
                    <TouchableOpacity
                      style={buttonStyle1}
                      onPress={() => this.print(item, index)}
                    >
                      <Image
                        style={buttonImageStyle}
                        source={require("../assets/images/print.png")}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={buttonStyle}
                      onPress={() => this.seeDetails(item, index)}
                    >
                      <Image
                        style={buttonImageStyle}
                        source={require("../assets/images/eye.png")}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          )}
        />
        {this.state.flagFilterOpen && (
          <View>
            <Modal style={{ margin: 0 }} isVisible={this.state.modalVisible}>
              <View style={filterMainContainer}>
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
                </View>
                <KeyboardAwareScrollView enableOnAndroid={true}>
                  <TouchableOpacity
                    style={dateSelector}
                    testID="openModal"
                    onPress={() => this.datepickerClicked()}
                  >
                    <Text style={dateText}>
                      {this.state.startDate
                        ? this.state.startDate
                        : "Start Date"}
                    </Text>
                    <Image
                      style={styles.calenderpng}
                      source={require("../assets/images/calender.png")}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={dateSelector}
                    testID="openModal"
                    onPress={() => this.enddatepickerClicked()}
                  >
                    <Text style={dateText}>
                      {this.state.endDate ? this.state.endDate : "End Date"}
                    </Text>
                    <Image
                      style={styles.calenderpng}
                      source={require("../assets/images/calender.png")}
                    />
                  </TouchableOpacity>
                  {this.state.datepickerOpen && this.state.flagRebarCode && (
                    <View style={styles.dateTopView}>
                      <View style={styles.dateTop2}>
                        <TouchableOpacity
                          style={datePickerButton1}
                          onPress={() => this.datepickerCancelClicked()}
                        >
                          <Text style={datePickerBtnText}> Cancel </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={datePickerButton2}
                          onPress={() => this.datepickerDoneClicked()}
                        >
                          <Text style={datePickerBtnText}> Done </Text>
                        </TouchableOpacity>
                      </View>
                      <DatePicker
                        style={styles.date}
                        date={this.state.date}
                        mode={"date"}
                        onDateChange={(date) => this.setState({ date })}
                      />
                    </View>
                  )}
                  {this.state.datepickerendOpen && this.state.flagRebarCode && (
                    <View style={styles.dateTopView}>
                      <View style={styles.dateTop2}>
                        <TouchableOpacity
                          style={datePickerButton1}
                          onPress={() => this.datepickerCancelClicked()}
                        >
                          <Text style={datePickerBtnText}> Cancel </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={datePickerButton2}
                          onPress={() => this.datepickerendDoneClicked()}
                        >
                          <Text style={datePickerBtnText}> Done </Text>
                        </TouchableOpacity>
                      </View>
                      <DatePicker
                        style={styles.date}
                        date={this.state.enddate}
                        mode={"date"}
                        onDateChange={(enddate) => this.setState({ enddate })}
                      />
                    </View>
                  )}
                  <TextInput
                    style={inputField}
                    underlineColorAndroid="transparent"
                    placeholder={I18n.t("RE-BARCODE ID")}
                    placeholderTextColor="#6F6F6F"
                    textAlignVertical="center"
                    autoCapitalize="none"
                    value={this.state.barCodeId}
                    onChangeText={this.handlebarCodeId}
                  />
                  <View>
                    <TouchableOpacity
                      style={submitBtn}
                      onPress={() => this.applyReBarcodeFilter()}
                    >
                      <Text style={submitBtnText}>{I18n.t("APPLY")}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={cancelBtn}
                      onPress={() => this.modelCancel()}
                    >
                      <Text style={cancelBtnText}>{I18n.t("CANCEL")}</Text>
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
  spaceText: {
    height: Device.isTablet ? 2 : 1,
    width: deviceWidth,
    backgroundColor: "lightgray",
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
  mainContainer: {
    flex: 1,
  },
});
