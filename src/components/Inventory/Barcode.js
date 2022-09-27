import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { Component } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";
import DatePicker from "react-native-date-picker";
import Device from "react-native-device-detection";
import I18n from "react-native-i18n";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Modal from "react-native-modal";
import { Badge, Text, TextInput } from "react-native-paper";
import IconFA from 'react-native-vector-icons/FontAwesome';
import IconMA from 'react-native-vector-icons/MaterialCommunityIcons';
import IconMAA from 'react-native-vector-icons/MaterialIcons';
import forms from '../../commonUtils/assets/styles/formFields.scss';
import scss from "../../commonUtils/assets/styles/style.scss";
import Loader from "../../commonUtils/loader";
import { RH, RW } from "../../Responsive";
import InventoryService from "../services/InventoryService";
import {
  datePicker,
  datePickerBtnText,
  datePickerButton1,
  datePickerButton2
} from "../Styles/FormFields";
import {
  flatListTitle,
  listEmptyMessage
} from "../Styles/Styles";


var deviceWidth = Dimensions.get("window").width;
var deviceheight = Dimensions.get("window").height;

export default class Barcode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      storeId: 0,
      storeName: "",
      domainId: 0,
      barcodesList: [],
      filterBarcodesList: [],
      pageNo: 0,
      filterPageNo: 0,
      loading: false,
      inventoryDelete: false,
      modalVisible: false,
      barCodeId: "",
      startDate: "",
      endDate: "",
      date: new Date(),
      enddate: new Date(),
      filterActive: false,
      datepickerOpen: false,
      datepickerendOpen: false,
      doneButtonClicked: false,
      enddoneButtonClicked: false,
      loadMoreActive: false,
      totalPages: 0,
      flagFilterOpen: false,
      loadPrevActive: false,
      loadNextActive: true,
    };
  }

  async componentDidMount () {
    const storeId = await AsyncStorage.getItem("storeId");
    const newstoreId = await AsyncStorage.getItem("newstoreId");
    this.setState({ storeId: storeId });
    this.getAllBarcodes(0);
    this.setState({ pageNo: 0 });
    window.setTimeout(() => {
      this.setState({ loading: false });
    }, 11000);
  }

  // Filter Action
  filterAction () {
    this.setState({ flagFilterOpen: true, modalVisible: true, filterBarcodesList: [] });
  }

  clearFilterAction () {
    this.setState({ flagFilterOpen: false, filterActive: false, barcodesList: [], startDate: "", endDate: "", barCodeId: "", filterBarcodesList: [], pageNo: 0, filterPageNo: 0 });
    this.getAllBarcodes();
  }

  // Refresh Barcodes
  refresh () {
    this.setState({ barcodesList: [], filterBarcodesList: [], pageNo: 0, filterPageNo: 0, loadPrevActive: false }, () => {
      this.getAllBarcodes();
    });
  }

  // Getting Barcodes Functions
  getAllBarcodes (pageNumber) {
    this.setState({ loading: true, loadMoreActive: false });
    const params = {
      fromDate: "",
      toDate: "",
      barcode: "",
      storeId: parseInt(this.state.storeId),
    };
    console.log("getBarcodes", params);
    InventoryService.getTextileBarcodes(params, this.state.pageNo)
      .then((res) => {
        if (res.data) {
          let response = res.data.content;
          console.log({ response });
          this.setState({
            barcodesList: response,
            error: "",
            totalPages: res.data.totalPages,
            loading: false,
          });
          console.warn("BarList", this.state.barcodesList);
          if (response) {
          }
          this.continuePagination();
        }
      })
      .catch((err) => {
        this.setState({ loading: false, error: "Records not found" });
      });
  }

  // Edit Barcodes Function
  handleeditbarcode (item, index, value) {
    this.props.navigation.navigate("EditBarcode", {
      item: item,
      isEdit: true,
      reBar: value,
      onGoBack: () => this.refresh(),
      goBack: () => this.refresh(),
    });
  }

  // Delete Barcode Function
  handlebarcodedeleteaction (item, index) {
    this.setState({
      inventoryDelete: true,
      modalVisible: true,
      barcodeTextileId: item.id,
    });
  }

  // Pagination Function
  loadMoreList = (value) => {
    if (value >= 0 && value < this.state.totalPages) {
      this.setState({ pageNo: value }, () => {
        if (this.state.filterActive) {
          this.applyBarcodeFilter();
        } else {
          this.getAllBarcodes();
        }
        if (this.state.pageNo === (this.state.totalPages - 1)) {
          this.setState({ loadNextActive: false });
        } else {
          this.setState({ loadNextActive: true });
        }
        if (this.state.pageNo === 0) {
          this.setState({ loadPrevActive: false });
        } else {
          this.setState({ loadPrevActive: true });
        }
      });
    }
  };

  continuePagination () {
    if (this.state.filterActive) {
      if (this.state.totalPages > 1) {
        this.setState({ loadMoreActive: true });
      } else {
        this.setState({ loadMoreActive: false, loadNextActive: false });
      }
    } else {
      if (this.state.totalPages > 1) {
        this.setState({ loadMoreActive: true });
      }
      else {
        this.setState({ loadMoreActive: false, loadNextActive: false });
      }
    }
  }

  // Filter Functions
  modelCancel () {
    this.setState({ modalVisible: false, flagFilterOpen: false });
  }

  datepickerClicked () {
    this.setState({ datepickerOpen: true });
  }
  enddatepickerClicked () {
    this.setState({ datepickerendOpen: true });
  }

  datepickerDoneClicked () {
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

  datepickerendDoneClicked () {
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

  datepickerCancelClicked () {
    this.setState({
      date: new Date(),
      enddate: new Date(),
      datepickerOpen: false,
      datepickerendOpen: false,
    });
  }

  handlebarCodeId = (value) => {
    this.setState({ barCodeId: value.trim() });
  };

  applyBarcodeFilter (pageNumber) {
    this.setState({ loading: true, loadMoreActive: false });
    let list = {};
    list = {
      fromDate: this.state.startDate,
      toDate: this.state.endDate,
      barcode: this.state.barCodeId,
      storeId: parseInt(this.state.storeId),
    };
    console.log(list);
    InventoryService.getTextileBarcodes(list, this.state.pageNo)
      .then((res) => {
        console.log(res);
        if (res) {
          if (res.data) {
            let filResponse = res.data.content;
            console.log({ filResponse });
            this.setState({
              loading: false,
              filterBarcodesList: filResponse,
              error: "",
              filterActive: true,
              loading: false,
              totalPages: res.data.totalPages,
            });
            this.continuePagination();
          }
          this.setState({ fromDate: "", toDate: "", barCodeId: "" });
        }
        this.setState({ loading: false, filterActive: true });
      })
      .catch((err) => {
        this.setState({ loading: false, filterActive: false });
        console.log(err);
      });
    this.setState({ modalVisible: false });
  }


  // Add Barcode
  handleAddBarcode () {
    this.props.navigation.navigate("AddBarcode", {
      isEdit: false,
      onGoBack: () => this.refresh(),
      goBack: () => this.refresh(),
    });
  }

  deleteInventory (id) {
    InventoryService.deleteBarcode(id).then((res) => {
      if (res?.data) {
        alert(res.data.result);
        this.setState({ barcodesList: [] });
        this.getAllBarcodes();
      }
    });
  }


  render () {
    return (
      <View>
        {this.state.loading && <Loader loading={this.state.loading} />}
        <View>
          <FlatList
            style={scss.flatListBody}
            ListHeaderComponent={
              <View style={scss.headerContainer}>
                <Text style={flatListTitle}>
                  Barcode List -{" "}
                  <Badge size={30} style={{ color: "#ED1C24", }}>
                    {this.state.filterActive ? this.state.filterBarcodesList.length : this.state.barcodesList.length}
                  </Badge>
                </Text>
                <View style={scss.headerContainer}>
                  <IconMAA
                    size={30}
                    name="playlist-add"
                    style={{ marginRight: 10 }}
                    color="#ED1C24"
                    onPress={() => this.handleAddBarcode()}
                  >
                  </IconMAA>
                  {!this.state.filterActive && (
                    <IconFA
                      name="sliders"
                      size={25}
                      style={scss.action_icons}
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
                ? this.state.filterBarcodesList
                : this.state.barcodesList
            }
            scrollEnabled={true}
            ListEmptyComponent={
              <Text style={listEmptyMessage}>&#9888; Records Not Found</Text>
            }
            keyExtractor={(item, i) => i.toString()}
            removeClippedSubviews={false}
            renderItem={({ item, index }) => (
              <View style={{ flex: 1 }}>
                <ScrollView>
                  <View style={scss.flatListContainer}>
                    <View style={scss.flatListSubContainer}>
                      <View style={scss.textContainer}>
                        <Text style={scss.highText}>S.NO: {index + 1}</Text>
                      </View>
                      <View style={scss.textContainer}>
                        <Text style={scss.textStyleLight}> {I18n.t("DOMAIN")}:
                          <Text style={scss.textStyleMedium}>
                            {item.domainType}
                          </Text>
                        </Text>
                        <Text style={scss.textStyleLight}>
                          {I18n.t("VALUE")}: ₹{item.value}
                        </Text>
                      </View>
                      <View style={scss.textContainer}>
                        <Text style={scss.textStyleLight}>
                          {I18n.t("LIST PRICE")}: ₹{item.itemMrp}
                        </Text>
                        <Text style={scss.textStyleLight}>QTY: {item.qty}</Text>
                      </View>
                      <View style={scss.textContainer}>
                        <Text style={scss.textStyleMedium} selectable={true}>
                          {item.barcode}
                        </Text>
                      </View>
                      <View style={scss.flatListFooter}>
                        <Text style={scss.footerText}>
                          CreatedDate:{" "}
                          {item.createdDate
                            ? item.createdDate.toString().split(/T/)[ 0 ]
                            : item.createdDate}
                        </Text>
                        <View style={scss.buttonContainer}>
                          <IconMA
                            size={35}
                            style={{ paddingRight: 10 }}
                            name="barcode"
                            color="#ED241C"
                            onPress={() =>
                              this.handleeditbarcode(item, index, true)
                            }
                          >
                          </IconMA>
                          <IconFA
                            name="edit"
                            style={[ scss.action_icons, { paddingRight: 5 } ]}
                            size={25}
                            color="#000"
                            onPress={() =>
                              this.handleeditbarcode(item, index, false)
                            }
                          >
                          </IconFA>
                          <IconMA
                            name="trash-can-outline"
                            size={25}
                            style={scss.action_icons}
                            onPress={() =>
                              this.deleteInventory(item?.id)
                            }
                          >
                          </IconMA>
                        </View>
                      </View>
                    </View>
                  </View>
                </ScrollView>
              </View>
            )}
            ListFooterComponent={
              this.state.loadMoreActive && (
                <View style={scss.page_navigation_container}>
                  <View style={scss.page_navigation_subcontainer}>
                    <Text style={scss.page_nav_text}>{`Page: ${this.state.pageNo + 1} - ${this.state.totalPages}`}</Text>
                  </View>
                  <View style={scss.page_navigation_subcontainer}>
                    {this.state.loadPrevActive && (
                      <View style={scss.page_navigation_subcontainer}>
                        <IconMA
                          style={[ scss.pag_nav_btn ]}
                          color={this.state.loadPrevActive === true ? "#353c40" : "#b9b9b9"}
                          onPress={() => this.loadMoreList(0)}
                          name="chevron-double-left"
                          size={25}
                        />
                        <IconMA
                          style={[ scss.pag_nav_btn ]}
                          color={this.state.loadPrevActive === true ? "#353c40" : "#b9b9b9"}
                          onPress={() => this.loadMoreList(this.state.pageNo - 1)}
                          name="chevron-left"
                          size={25}
                        />
                      </View>
                    )}
                    <Text style={scss.page_nav_pageno}>{this.state.pageNo + 1}</Text>
                    {this.state.loadNextActive && (
                      <View style={scss.page_navigation_subcontainer}>
                        <IconMA
                          style={[ scss.pag_nav_btn ]}
                          onPress={() => this.loadMoreList(this.state.pageNo + 1)}
                          name="chevron-right"
                          size={25}
                        />
                        <IconMA
                          style={[ scss.pag_nav_btn ]}
                          onPress={() => this.loadMoreList(this.state.totalPages - 1)}
                          name="chevron-double-right"
                          size={25}
                        />
                      </View>
                    )}
                  </View>
                </View>
              )
            }
          />
        </View>
        {this.state.flagFilterOpen && (
          <View>
            <Modal style={{ margin: 0 }} isVisible={this.state.modalVisible}
              onBackButtonPress={() => this.modelCancel()}
              onBackdropPress={() => this.modelCancel()}
            >
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
                        <Text style={forms.filter_dates_text}>
                          {this.state.startDate === ""
                            ? "Start Date"
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
                        <Text style={forms.filter_dates_text}>
                          {this.state.endDate === ""
                            ? "End Date"
                            : this.state.endDate}
                        </Text>
                        <Image
                          style={forms.calender_image}
                          source={require("../assets/images/calender.png")}
                        />
                      </TouchableOpacity>
                    </View>
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
                      activeOutlineColor="#b9b9b9"
                      outlineColor="#b9b9b9"
                      style={forms.input_fld}
                      underlineColorAndroid="transparent"
                      placeholder={I18n.t("BARCODE ID")}
                      placeholderTextColor="#6f6f6f"
                      textAlignVertical="center"
                      autoCapitalize="none"
                      value={this.state.barCodeId}
                      onChangeText={this.handlebarCodeId}
                    />
                    <View style={forms.action_buttons_container}>
                      <TouchableOpacity style={[ forms.action_buttons, forms.submit_btn ]}
                        onPress={() => { this.setState({ pageNo: 0, loadPrevActive: false, loadNextActive: true }, () => this.applyBarcodeFilter(0)); }}>
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
      </View>
    );
  }
}
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
