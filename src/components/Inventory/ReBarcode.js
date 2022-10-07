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
import IconMA from 'react-native-vector-icons/MaterialCommunityIcons';
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
import { listEmptyMessage } from "../Styles/Styles";


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
      viewBarcodeData: [],
      loadMoreActive: false,
      totalPages: 0,
      loadPrevActive: false,
      loadNextActive: true,
    };
  }

  async componentDidMount () {
    const storeId = await AsyncStorage.getItem("storeId");
    this.setState({ storeId: storeId });
    this.getAllReBarcodes();
  }

  // Rebarcode Data
  getAllReBarcodes () {
    const params = {
      fromDate: this.state.startDate,
      toDate: this.state.endDate,
      currentBarcodeId: this.state.barCodeId,
      storeId: this.state.storeId,
    };
    console.log(params);
    this.setState({ loading: true, loadMoreActive: false });
    const request = "?page=" + parseInt(this.state.pageNo) + "&size=10";
    axios
      .post(InventoryService.getbarcodeTexttileAdjustments() + request, params)
      .then((res) => {
        if (res.data) {
          this.setState({
            loading: false,
            reBarcodesData: res.data.content,
            totalPages: res.data.totalPages
          });
          if (res.data.length === 0) {
            this.setState({ error: "Records Not Found" });
          }
          this.continuePagination();
        }
      })
      .catch(() => {
        this.setState({ loading: false, error: "Records Not Found" });
      });
  }

  // Filter Actions
  filterAction () {
    this.setState({ flagFilterOpen: true, modalVisible: true });
  }

  clearFilterAction () {
    this.setState({ filterActive: false, reBarcodesData: [], filterRebarcodesData: [], startDate: "", endDate: "", barCodeId: "" });
    this.getAllReBarcodes();
  }

  modelCancel () {
    this.setState({ flagFilterOpen: false, modalVisible: false });
  }

  // Print
  print () { }

  // Filter ReBarcode Api
  applyReBarcodeFilter () {
    this.setState({ loadMoreActive: false });
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
            filterRebarcodesData:
              res.data.content,
            totalPages: res.data.totalPages,
            barCodeId: "",
            startDate: "",
            endDate: "",
            filterActive: true,
          });
          this.continuePagination();
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
    let domainDetails = {};
    InventoryService.getBarcodesDetails(this.state.storeId, domainDetails, item.currentBarcodeId).then(res => {
      if (res?.data) {
        console.log({ res });
        let viewData = res.data;
        if (res.status === 200) {
          // this.props.navigation.navigate('ViewReBarcode', {
          //   item: viewData, isEdit: true,
          //   onGoBack: () => {
          //     this.setState({ reBarcodesData: [] });
          //     this.getAllReBarcodes();
          //   }
          // });
          this.state.viewBarcodeData.push(res.data);
          this.setState({ viewBarcodeData: this.state.viewBarcodeData, viewBarcode: true });
        }
        console.log({ viewData }, this.state.viewBarcodeData.barcode);
      }
    }).catch((err) => {
      console.log({ err });
    });
  };

  handleModelView () {
    this.setState({ viewBarcodeData: [], viewBarcode: false });
  }

  // Pagination Function
  loadMoreList = (value) => {
    if (value >= 0 && value < this.state.totalPages) {
      this.setState({ pageNo: value }, () => {
        if (this.state.filterActive) {
          this.applyReBarcodeFilter();
        } else {
          this.getAllReBarcodes();
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

  modalHandleForClose = () => {
    this.setState({
      modalVisible: !this.state.modalVisible
    });
  };

  render () {
    return (
      <View>
        {this.state.loading && <Loader loading={this.state.loading} />}
        <FlatList
          removeClippedSubviews={false}
          style={scss.flatListBody}
          ListHeaderComponent={
            <View style={scss.headerContainer}>
              <Text style={scss.flat_heading}>List of Re-Barcodings - <Text style={{ color: "#ED1C24" }}>{this.state.filterActive ? this.state.filterRebarcodesData.length : this.state.reBarcodesData.length}</Text></Text>
              <View style={scss.headerContainer}>
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
                      {item.lastModifiedDate ? item.lastModifiedDate.toString().split(/T/)[ 0 ]
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

        {this.state.viewBarcode && (
          <View>
            <Modal style={{ margin: 0 }} isVisible={this.state.viewBarcode}
              onBackButtonPress={() => this.handleModelView()}
              onBackdropPress={() => this.handleModelView()}
            >
              <View style={forms.filterModelContainer}>
                <Text style={forms.popUp_decorator}>-</Text>
                <View style={forms.filterModelSub}>
                  <FlatList
                    removeClippedSubviews={false}
                    data={this.state.viewBarcodeData}
                    renderItem={({ item, index }) => (
                      <View>
                        <View style={scss.model_text_container}>
                          <Text variant="titleMedium" selectable={true} key={Math.random()}>{item.barcode}</Text>
                          <Text variant="bodyLarge">Qty: {item.qty}</Text>
                        </View>
                        <View style={scss.model_text_container}>
                          <Text variant="bodyLarge">Name: {item.name}</Text>
                          <Text variant="bodyLarge">Price: {item.itemMrp}</Text>
                        </View>
                        <View style={scss.model_text_container}>
                          <Text variant="bodyLarge">Batch No: {item.batchNo}</Text>
                        </View>
                        <View style={scss.model_subContainer}>
                          <ScrollView>
                            <View style={scss.model_subbody}>
                              <View style={scss.model_text_container}>
                                <Text variant="bodyMedium">Domain: {item.domainType}</Text>
                                <Text variant="bodyMedium">Division: {item.divisionName}</Text>
                              </View>
                              <View style={scss.model_text_container}>
                                <Text variant="bodyMedium">Section: {item.sectionName}</Text>
                                <Text variant="bodyMedium">SubSection: {item.subSectionName}</Text>
                              </View>
                              <View style={scss.model_text_container}>
                                <Text variant="bodyMedium">Category: {item.categoryName}</Text>
                                <Text variant="bodyMedium">HsnCode: {item.hsnCode}</Text>
                              </View>
                              <View style={scss.model_text_container}>
                                <Text variant="bodyMedium">Colour: {item.colour}</Text>
                                <Text variant="bodyMedium">costPrice: {item.costPrice}</Text>
                              </View>
                              <View style={scss.model_text_container}>
                                <Text variant="bodyMedium">Uom: {item.uom}</Text>
                                <Text variant="bodyMedium">store: {item.storeId}</Text>
                              </View>
                              <View style={scss.model_text_container}>
                                <Text variant="bodyMedium">EMP Id: {item.empId}</Text>
                                <Text variant="bodyMedium">VendorTax: {item.vendorTax}</Text>
                              </View>
                              {item.domainType === "Retail" && (
                                <View style={scss.model_text_container}>
                                  <Text variant="bodyMedium">FromDate: {item.fromDate
                                    ? item.fromDate.toString().split(/T/)[ 0 ]
                                    : item.fromDate}</Text>
                                  <Text variant="bodyMedium">ToDate: {item.toDate
                                    ? item.toDate.toString().split(/T/)[ 0 ]
                                    : item.toDate}</Text>
                                </View>
                              )}
                              <View style={scss.model_text_container}>
                                <Text variant="bodyMedium">CreatedDate:{" "}
                                  {item.createdDate
                                    ? item.createdDate.toString().split(/T/)[ 0 ]
                                    : item.createdDate}</Text>
                                <Text variant="bodyMedium"></Text>
                              </View>
                            </View>
                          </ScrollView>
                        </View>
                      </View>
                    )}
                  />
                </View>
                <TouchableOpacity style={forms.close_full_btn} onPress={() => this.handleModelView()}>
                  <Text style={forms.cancel_btn_text}>Close</Text>
                </TouchableOpacity>
              </View>
            </Modal>
          </View>
        )}

        {this.state.flagFilterOpen && (
          <View>
            <Modal style={{ margin: 0 }} isVisible={this.state.modalVisible}
              onBackButtonPress={() => this.modelCancel()}
              onBackdropPress={() => this.modelCancel()}>
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
                      activeOutlineColor="#b6b6b6"
                      outlineColor="#b6b6b6"
                      style={forms.input_fld}
                      placeholder={I18n.t("RE-BARCODE ID")}
                      placeholderTextColor="#6f6f6f"
                      value={this.state.barCodeId}
                      onChangeText={this.handlebarCodeId}
                    />
                    <View style={forms.action_buttons_container}>
                      <TouchableOpacity style={[ forms.action_buttons, forms.submit_btn ]}
                        onPress={() => this.applyReBarcodeFilter(0)}>
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
