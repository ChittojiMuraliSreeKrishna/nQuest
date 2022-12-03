import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { Component } from "react";
import {
  Dimensions,
  FlatList, ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";
import Device from "react-native-device-detection";
import I18n from "react-native-i18n";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Modal from "react-native-modal";
import { Text } from 'react-native-paper';
import IconFA from 'react-native-vector-icons/FontAwesome';
import IconMA from 'react-native-vector-icons/MaterialCommunityIcons';
import IconMAA from 'react-native-vector-icons/MaterialIcons';
import forms from '../../commonUtils/assets/styles/formFields.scss';
import scss from "../../commonUtils/assets/styles/style.scss";
import Clipbrd from "../../commonUtils/Clipboard";
import DateSelector from "../../commonUtils/DateSelector";
import Loader from "../../commonUtils/loader";
import { RH, RW } from "../../Responsive";
import InventoryService from "../services/InventoryService";
import { listEmptyMessage } from "../Styles/Styles";

var deviceWidth = Dimensions.get("window").width;
var deviceheight = Dimensions.get("window").height;

export default class ProductCombo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      domainId: 0,
      storeId: 0,
      fromDate: "",
      toDate: "",
      productComboList: [],
      loading: false,
      filterActive: false,
      flagFilterOpen: false,
      modalVisible: true,
      modalVisibleView: true,
      startDate: "",
      endDate: "",
      date: new Date(),
      enddate: new Date(),
      flagViewProduct: false,
      viewProductData: [],
      loadMoreActive: false,
      totalPages: 0,
      pageNo: 0,
      filterPageNo: 0,
      loadPrevActive: false,
      loadNextActive: true,
      isFetching: false
    };
  }

  async componentDidMount() {
    const storeId = await AsyncStorage.getItem("storeId");
    this.setState({ storeId: parseInt(storeId) });
    this.getAllProductsCombo();
    this.props.navigation.addListener('focus', () => {
      this.getAllProductsCombo();
    });
  }

  // Refreshing the codes
  refresh() {
    this.setState({ productComboList: [] }, () => {
      this.getAllProductsCombo();
    });
  }

  async getAllProductsCombo() {
    this.setState({ loading: true, loadMoreActive: false });
    const { storeId, fromDate, toDate, pageNo } = this.state;
    let params = "?storeId=" + (storeId) + "&page=" + (pageNo) + "&size=10";
    console.log({ params });
    InventoryService.getProductCombo(params)
      .then((res) => {
        let productComboList = res.data.result.content;
        console.log({ productComboList });
        this.setState({
          productComboList: res?.data.result.content,
          loading: false,
          totalPages: res.data.result.totalPages
        });
        this.continuePagination();
      })
      .catch((err) => {
        console.log({ err });
        this.setState({ loading: false });
      });
  }

  filterAction() {
    this.setState({ flagFilterOpen: true, modalVisible: true });
  }

  clearFilterAction() {
    this.setState({ filterActive: false, flagFilterOpen: false, filteredProductsList: [], startDate: "", endDate: "" });
  }

  modelCancel() {
    this.setState({ modalVisible: false, flagViewProduct: false, flagFilterOpen: false, viewProductData: [] });
  }

  // Date Actions
  datepickerClicked() {
    this.setState({ datepickerOpen: true });
  }

  enddatepickerClicked() {
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

  handleAddProductCombo() {
    this.props.navigation.navigate("AddProduct", {
      isEdit: false,
      goBack: () => this.refresh(),
      onGoBack: () => this.refresh(),
    });
  }

  applyBarcodeFilter() {
    const { startDate, endDate, storeId, filterPageNo } = this.state;
    this.setState({ loadMoreActive: false });
    const filParams = `?storeId=${storeId}&fromDate=${startDate ? startDate : null}&page=${parseInt(filterPageNo)}&size=10`;
    console.log({ filParams });
    InventoryService.getProductCombo(filParams).then(
      (res) => {
        console.log({ res });
        if (res?.data && res.data.status === 200) {
          this.setState({
            filteredProductsList: res?.data.result.content,
            filterActive: true,
            modalVisible: false,
            totalPages: res.data.result.totalPages
          });
          this.continuePagination();
        } else {
          this.setState({ modalVisible: false });
        }
        console.log(this.state.filteredProductsList, "Filter");
      },
    );
  }

  viewProductActon(data, index) {
    let viewProduct = []
    viewProduct.push({ data });
    const uniqueData = viewProduct.filter((val, id, array) => {
      return array.indexOf(val) == id;
    })
    console.log({ uniqueData }, uniqueData.data)
    this.setState({
      viewProductData: uniqueData,
      modalVisibleView: true,
      flagViewProduct: true,
    });
  }

  modalHandleForClose = () => {
    this.setState({
      modalVisible: !this.state.modalVisible
    });
  };

  modalHandleForViewClose = () => {
    this.setState({
      modalVisibleView: !this.state.modalVisibleView,
      flagViewProduct: false,
      viewProductData: []
    });
  };

  // Pagination Function
  loadMoreList = (value) => {
    if (value >= 0 && value < this.state.totalPages) {
      this.setState({ pageNo: value }, () => {
        if (this.state.filterActive) {
          this.applyBarcodeFilter();
        } else {
          this.getAllProductsCombo();
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

  continuePagination() {
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

  render() {
    return (
      <View>
        {this.state.loading && <Loader loading={this.state.loading} />}
        <FlatList
          style={scss.flatListBody}
          ListHeaderComponent={
            <View style={scss.headerContainer}>
              <Text style={scss.flat_heading}>
                List of product bundles -{" "}
                <Text style={{ color: "#ED1C24" }}>
                  {this.state.filterActive ? this.state.filteredProductsList.length : this.state.productComboList.length}
                </Text>{" "}
              </Text>
              <View style={scss.headerContainer}>
                <IconMAA
                  size={30}
                  name="playlist-add"
                  style={{ marginRight: 10 }}
                  color="#ED1C24"
                  onPress={() => this.handleAddProductCombo()}
                >
                </IconMAA>
                {!this.state.filterActive && (
                  <IconFA
                    name="sliders"
                    size={20}
                    style={scss.action_icons}
                    onPress={() => this.filterAction()}
                  >
                  </IconFA>
                )}
                {this.state.filterActive && (
                  <IconFA
                    name="sliders"
                    size={20}
                    color="#ED1C24"
                    onPress={() => this.clearFilterAction()}
                  >
                  </IconFA>
                )}
              </View>
            </View>
          }
          data={
            this.state.filterActive ? this.state.filteredProductsList : this.state.productComboList
          }
          refreshing={this.state.isFetching}
          onRefresh={() => this.refresh()}
          scrollEnabled={true}
          keyExtractor={(item, i) => i.toString()}
          removeClippedSubviews={false}
          ListEmptyComponent={
            <Text style={listEmptyMessage}>&#9888; Records Not Found</Text>
          }
          renderItem={({ item, index }) => (
            <View>
              <ScrollView>
                <View style={scss.flatListContainer}>
                  <View style={scss.flatListSubContainer}>
                    <View style={scss.textContainer}>
                      <Text style={scss.highText}>Inventory-ID: {item.id}</Text>
                    </View>
                    <View style={scss.textContainer}>
                      <Text style={scss.textStyleLight}>Store Id:
                        <Text style={scss.textStyleMedium}> {item.storeId}</Text>
                      </Text>
                      <Text style={scss.textStyleLight}>Combo Name: {item.name}</Text>
                    </View>
                    <View style={scss.textContainer}>
                      <Text style={scss.textStyleLight}>
                        No.of Items: {item.bundleQuantity}
                      </Text>
                      <Text style={scss.textStyleLight}>Unit Price: {parseFloat(item.itemMrp).toFixed(2)}</Text>
                    </View>
                    <View style={scss.flatListFooter}>
                      <Text style={scss.footerText} >{item.barcode}{"  "}<Clipbrd data={item.barcode} /> </Text>
                      <IconFA
                        name="eye"
                        size={20}
                        style={scss.action_icons}
                        onPress={() => this.viewProductActon(item, index)}
                      >
                      </IconFA>
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
                        style={[scss.pag_nav_btn]}
                        color={this.state.loadPrevActive === true ? "#353c40" : "#b9b9b9"}
                        onPress={() => this.loadMoreList(0)}
                        name="chevron-double-left"
                        size={20}
                      />
                      <IconMA
                        style={[scss.pag_nav_btn]}
                        color={this.state.loadPrevActive === true ? "#353c40" : "#b9b9b9"}
                        onPress={() => this.loadMoreList(this.state.pageNo - 1)}
                        name="chevron-left"
                        size={20}
                      />
                    </View>
                  )}
                  <Text style={scss.page_nav_pageno}>{this.state.pageNo + 1}</Text>
                  {this.state.loadNextActive && (
                    <View style={scss.page_navigation_subcontainer}>
                      <IconMA
                        style={[scss.pag_nav_btn]}
                        onPress={() => this.loadMoreList(this.state.pageNo + 1)}
                        name="chevron-right"
                        size={20}
                      />
                      <IconMA
                        style={[scss.pag_nav_btn]}
                        onPress={() => this.loadMoreList(this.state.totalPages - 1)}
                        name="chevron-double-right"
                        size={20}
                      />
                    </View>
                  )}
                </View>
              </View>
            )
          }
        />
        {this.state.flagViewProduct && (
          <View>
            <Modal style={{ margin: 0 }} isVisible={this.state.modalVisibleView}
              onBackButtonPress={() => this.modalHandleForViewClose()}
              onBackdropPress={() => this.modalHandleForViewClose()}
            >
              <View style={forms.filterModelContainer}>
                <Text style={forms.popUp_decorator}>-</Text>
                <View style={forms.filterModelSub}>
                  <FlatList
                    removeClippedSubviews={false}
                    data={this.state.viewProductData}
                    renderItem={({ item, index }) => (
                      <View>
                        <View style={scss.model_text_container}>
                          <Text variant="titleMedium" key={Math.random()}>{item.data.barcode}{"  "}<Clipbrd data={item.data.barcode} /> </Text>
                          <Text variant="bodyLarge">Qty: {item.data.bundleQuantity}</Text>
                        </View>
                        <View style={scss.model_text_container}>
                          <Text variant="bodyLarge">Name: {item.data.name}</Text>
                          <Text variant="bodyLarge">Price: {parseFloat(item.data.itemMrp).toFixed(2)}</Text>
                        </View>
                        <View style={scss.model_subContainer}>
                          <ScrollView enableOnAndroid={true}>
                            {item.data.productTextiles.map((data, index) => {
                              return (
                                <View id={index} style={scss.model_subbody}>
                                  <View style={scss.model_text_container}>
                                    <Text variant="bodyMedium">S.No:  {index + 1}</Text>
                                    <Text variant="bodyMedium">Name:  {data.name}</Text>
                                  </View>
                                  <View style={scss.model_text_container}>
                                    <Text variant="bodyMedium">Price: {parseFloat(data.itemMrp).toFixed(2)}</Text>
                                    <Text variant="bodyMedium">Qty: {data.qty}</Text>
                                  </View>
                                  <View style={scss.model_text_container}>
                                    <Text variant="bodyMedium">{data.barcode}</Text>
                                    <Text></Text>
                                  </View>
                                </View>
                              );
                            })}
                          </ScrollView>
                        </View>
                      </View>
                    )}
                  />
                </View>
                <TouchableOpacity style={forms.close_full_btn} onPress={() => this.modalHandleForViewClose()}>
                  <Text style={forms.cancel_btn_text}>Close</Text>
                </TouchableOpacity>
              </View>
            </Modal>
          </View>
        )}
        {this.state.flagFilterOpen && (
          <View>
            <Modal style={{ margin: 0 }} isVisible={this.state.modalVisible}
              onBackButtonPress={() => this.modalHandleForClose()}
              onBackdropPress={() => this.modalHandleForClose()}>
              <View style={forms.filterModelContainer}>
                <Text style={forms.popUp_decorator}>-</Text>
                <View style={forms.filerModelSub}>
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
                        <IconFA
                          name="calendar"
                          size={18}
                          style={forms.calender_image}
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
                        <IconFA
                          name="calendar"
                          size={18}
                          style={forms.calender_image}
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
                    <View style={forms.action_buttons_container}>
                      <TouchableOpacity style={[forms.action_buttons, forms.submit_btn]}
                        onPress={() => this.applyBarcodeFilter()}>
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
