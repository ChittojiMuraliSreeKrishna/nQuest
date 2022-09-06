import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { Component } from "react";
import {
  Dimensions,
  FlatList,
  Image, ScrollView, StyleSheet,
  TouchableOpacity, View
} from "react-native";
import DatePicker from "react-native-date-picker";
import Device from "react-native-device-detection";
import I18n from "react-native-i18n";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Modal from "react-native-modal";
import { Text, TextInput } from "react-native-paper";
import IconFA from 'react-native-vector-icons/FontAwesome';
import scss from "../../commonUtils/assets/styles/style.scss";
import Loader from "../../commonUtils/loader";
import { RH, RW } from "../../Responsive";
import InventoryService from "../services/InventoryService";
import {
  cancelBtn,
  cancelBtnText,
  datePicker,
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
import { flatListTitle, listEmptyMessage } from "../Styles/Styles";


var deviceWidth = Dimensions.get("window").width;
var deviceheight = Dimensions.get("window").height;

export default class ReBarcode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reBarcodesData: [],
      filterRebarcodesData: [],
      viewBarcode: [],
      viewModel: false,
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
      viewBarcode: false,
      viewBarcodeData: []
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
    console.log({ params });
    let domainDetails = {}
    InventoryService.getBarcodesDetails(this.state.storeId, domainDetails, item.currentBarcodeId).then(res => {
      if (res?.data) {
        console.log({ res })
        let viewBarcode = res.data
        console.log({ viewBarcode })
        if (res.status === 200) {
          this.props.navigation.navigate('ViewReBarcode', {
            item: viewBarcode, isEdit: true,
            onGoBack: () => {
              this.setState({ reBarcodesData: [] })
              this.getAllReBarcodes()
            }
          })
        }
      }
    }).catch((err) => {
      console.log({ err })
    })
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
          removeClippedSubviews={false}
          style={scss.flatListBody}
          ListHeaderComponent={
            <View style={scss.headerContainer}>
              <Text style={flatListTitle}>Re-Barcode List - <Text style={{ color: "#ED1C24" }}>{this.state.filterActive ? this.state.filterRebarcodesData.length : this.state.reBarcodesData.length}</Text></Text>
              <View style={scss.headerContainer}>
                {!this.state.filterActive && (
                  <IconFA
                    name="sliders"
                    size={25}
                    onPress={() => this.filterAction()}
                  >
                  </IconFA>
                )}
                {this.state.filterActive && (
                  <IconFA
                    name="sliders"
                    size={25}
                    color="#ED1C24"
                    onPress={() => this.clearFilterAction()}
                  >
                  </IconFA>
                )}
              </View>
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
            <ScrollView>
              <View style={scss.flatListContainer}>
                <View style={scss.flatListSubContainer}>
                  <View style={scss.textContainer}>
                    <Text style={scss.highText}>
                      {I18n.t("PARENT BARCODE")}: {item.toBeBarcodeId}
                    </Text>
                  </View>
                  <View style={scss.textContainer}>
                    <Text style={scss.textStyleMedium} selectable={true}>
                      {item.currentBarcodeId}
                    </Text>
                    <Text style={scss.textStyleLight}>
                      {I18n.t("EMPLOYEE ID")}: {"\n"}
                      {item.createdBy}
                    </Text>
                  </View>
                  <View style={scss.flatListFooter}>
                    <Text style={scss.footerText}>
                      {I18n.t("DATE")}:
                      {item.lastModifiedDate ? item.lastModifiedDate.toString().split(/T/)[0]
                        : item.lastModifiedDate}
                    </Text>
                    <IconFA
                      name="eye"
                      style={scss.action_icons}
                      size={20}
                      onPress={() => this.seeDetails(item, index)}
                    >
                    </IconFA>
                  </View>
                </View>
              </View>
            </ScrollView>
          )}
        />

        {this.state.viewBarcode && (
          <View>

          </View>
        )}

        {this.state.flagFilterOpen && (
          <View>
            <Modal style={{ margin: 0 }} isVisible={this.state.modalVisible}>
              <View style={filterMainContainer}>
                <View>
                  <View style={filterSubContainer}>
                    <Text style={filterHeading}> {I18n.t("Filter By")} </Text>
                    <TouchableOpacity
                      style={filterCloseImage}
                      onPress={() => this.modelCancel()}
                    >
                      <Image
                        style={{ margin: RH(5) }}
                        source={require("../assets/images/modelcancel.png")}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                <KeyboardAwareScrollView enableOnAndroid={true}>
                  <TouchableOpacity
                    style={dateSelector}
                    testID="openModal"
                    onPress={() => this.datepickerClicked()}
                  >
                    <Text style={dateText}>
                      {this.state.startDate === ""
                        ? "Start Date"
                        : this.state.startDate}
                    </Text>
                    <Image
                      style={filter.calenderpng}
                      source={require("../assets/images/calender.png")}
                    />
                  </TouchableOpacity>
                  {this.state.datepickerOpen && (
                    <View style={filter.dateTopView}>
                      <View style={filter.dateTop2}>
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
                        style={datePicker}
                        date={this.state.date}
                        mode={"date"}
                        onDateChange={(date) => this.setState({ date })}
                      />
                    </View>
                  )}
                  <TouchableOpacity
                    style={dateSelector}
                    testID="openModal"
                    onPress={() => this.enddatepickerClicked()}
                  >
                    <Text style={dateText}>
                      {this.state.endDate === ""
                        ? "End Date"
                        : this.state.endDate}
                    </Text>
                    <Image
                      style={filter.calenderpng}
                      source={require("../assets/images/calender.png")}
                    />
                  </TouchableOpacity>

                  {this.state.datepickerendOpen && (
                    <View style={filter.dateTopView}>
                      <View style={filter.dateTop2}>
                        <View>
                          <TouchableOpacity
                            style={datePickerButton1}
                            onPress={() => this.datepickerCancelClicked()}
                          >
                            <Text style={datePickerBtnText}> Cancel </Text>
                          </TouchableOpacity>
                        </View>
                        <View>
                          <TouchableOpacity
                            style={datePickerButton2}
                            onPress={() => this.datepickerendDoneClicked()}
                          >
                            <Text style={datePickerBtnText}> Done </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                      <DatePicker
                        style={datePicker}
                        date={this.state.enddate}
                        mode={"date"}
                        onDateChange={(enddate) => this.setState({ enddate })}
                      />
                    </View>
                  )}
                  <TextInput
                    mode="outlined"
                    activeOutlineColor="#6F6F6F"
                    style={inputField}
                    underlineColorAndroid="transparent"
                    placeholder={I18n.t("BARCODE ID")}
                    placeholderTextColor="#6F6F6F"
                    textAlignVertical="center"
                    autoCapitalize="none"
                    value={this.state.barCodeId}
                    onChangeText={this.handlebarCodeId}
                  />
                  <TouchableOpacity
                    style={submitBtn}
                    onPress={() => this.applyReBarcodeFilter(0)}
                  >
                    <Text style={submitBtnText}>{I18n.t("APPLY")}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={cancelBtn}
                    onPress={() => this.modelCancel()}
                  >
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

const filter = StyleSheet.create({
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
