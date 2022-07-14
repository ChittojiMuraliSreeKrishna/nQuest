import { Dimensions, FlatList, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, ClipboardStatic } from 'react-native';
import React, { Component } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import DatePicker from 'react-native-date-picker';
import Device from 'react-native-device-detection';
import Modal from 'react-native-modal';
import Loader from '../../commonUtils/loader';
import InventoryService from '../services/InventoryService';
import { listEmptyMessage, pageNavigationBtn, pageNavigationBtnText, filterBtn, menuButton, headerNavigationBtn, headerNavigationBtnText, headerTitle, headerTitleContainer, headerTitleSubContainer, headerTitleSubContainer2, buttonContainer, buttonStyle, buttonStyle1, flatListMainContainer, flatlistSubContainer, buttonImageStyle, textContainer, textStyleLight, textStyleMedium, highText, loadMoreBtn, loadmoreBtnText, flatListHeaderContainer, flatListTitle } from '../Styles/Styles';
import { filterMainContainer, filterSubContainer, filterHeading, filterCloseImage, deleteText, deleteHeading, deleteHeader, deleteContainer, deleteCloseBtn } from '../Styles/PopupStyles';
import { inputField, rnPickerContainer, rnPicker, submitBtn, submitBtnText, cancelBtn, cancelBtnText, datePicker, datePickerBtnText, datePickerButton1, datePickerButton2, datePickerContainer, dateSelector, dateText, } from '../Styles/FormFields';
import I18n from 'react-native-i18n';
import { ActivityIndicator } from 'react-native-paper';
import { RH, RF, RW } from '../../Responsive';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from '../../assets/styles/style.scss';

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
      filterActive: false,
      flagFilterOpen: false
    };
  }

  async componentDidMount() {
    const storeId = await AsyncStorage.getItem("storeId");
    this.setState({ storeId: storeId });
    this.getAllBarcodes();
    console.log({ styles });
  }

  // Filter Action
  filterAction() {
    this.setState({ flagFilterOpen: true, modalVisible: true });
  }

  clearFilterAction() {
    this.setState({ flagFilterOpen: false, filterActive: false });
    this.getAllBarcodes();
  }

  // Getting Barcodes Functions
  getAllBarcodes() {
    this.setState({ loading: true, loadMoreActive: false });
    const params = {
      "fromDate": "",
      "toDate": "",
      "barcode": "",
      "storeId": parseInt(this.state.storeId)
    };
    console.log("getBarcodes", params);
    axios.post(InventoryService.getTextileBarcodes() + '?page=' + parseInt(this.state.pageNo) + '&size=10', params).then((res) => {
      if (res.data) {
        let response = res.data.content;
        console.log({ response });
        this.setState({ barcodesList: this.state.barcodesList.concat(response), error: "", totalPages: res.data.totalPages, loading: false, });
        console.warn("BarList", this.state.barcodesList);
        if (response) {
        }
        this.continuePagination();
      }
    }).catch((err) => {
      this.setState({ loading: false, error: 'Records not found' });
    });
  }

  // Edit Barcodes Function
  handleeditbarcode(item, index) {
    this.props.navigation.navigate('EditBarcode'
      , {
        item: item, isEdit: true,
        onGoBack: () => this.getAllBarcodes(),
      });
  }

  // Delete Barcode Function
  handlebarcodedeleteaction(item, index) {
    this.setState({ inventoryDelete: true, modalVisible: true, barcodeTextileId: item.barcodeTextileId });
  }

  // Pagination Function
  loadMoreList = () => {
    if (this.state.filterActive) {
      this.setState({ filterPageNo: this.state.filterPageNo + 1 }, () => {
        this.applyBarcodeFilter();
      });
    }
    else {
      this.setState({ pageNo: this.state.pageNo + 1 }, () => {
        this.getAllBarcodes();
      });
    }
  };

  // Filter Functions

  modelCancel() {
    this.setState({ modalVisible: false, flagFilterOpen: false });
  }

  datepickerClicked() {
    this.setState({ datepickerOpen: true });
  }

  enddatepickerClicked() {
    this.setState({ datepickerendOpen: true });
  }
  datepickerDoneClicked() {
    if (parseInt(this.state.date.getDate()) < 10 && (parseInt(this.state.date.getMonth()) < 10)) {
      this.setState({ startDate: this.state.date.getFullYear() + "-0" + (this.state.date.getMonth() + 1) + "-" + "0" + this.state.date.getDate() });
    }
    else if (parseInt(this.state.date.getDate()) < 10) {
      this.setState({ startDate: this.state.date.getFullYear() + "-" + (this.state.date.getMonth() + 1) + "-" + "0" + this.state.date.getDate() });
    }
    else if (parseInt(this.state.date.getMonth()) < 10) {
      this.setState({ startDate: this.state.date.getFullYear() + "-0" + (this.state.date.getMonth() + 1) + "-" + this.state.date.getDate() });
    }
    else {
      this.setState({ startDate: this.state.date.getFullYear() + "-" + (this.state.date.getMonth() + 1) + "-" + this.state.date.getDate() });
    }
    this.setState({ doneButtonClicked: true, datepickerOpen: false, datepickerendOpen: false });
  }

  datepickerendDoneClicked() {
    if (parseInt(this.state.enddate.getDate()) < 10 && (parseInt(this.state.enddate.getMonth()) < 10)) {
      this.setState({ endDate: this.state.enddate.getFullYear() + "-0" + (this.state.enddate.getMonth() + 1) + "-" + "0" + this.state.enddate.getDate() });
    }
    else if (parseInt(this.state.enddate.getDate()) < 10) {
      this.setState({ endDate: this.state.enddate.getFullYear() + "-" + (this.state.enddate.getMonth() + 1) + "-" + "0" + this.state.enddate.getDate() });
    }
    else if (parseInt(this.state.enddate.getMonth()) < 10) {
      this.setState({ endDate: this.state.enddate.getFullYear() + "-0" + (this.state.enddate.getMonth() + 1) + "-" + this.state.enddate.getDate() });
    }
    else {
      this.setState({ endDate: this.state.enddate.getFullYear() + "-" + (this.state.enddate.getMonth() + 1) + "-" + this.state.enddate.getDate() });
    }
    this.setState({ enddoneButtonClicked: true, datepickerOpen: false, datepickerendOpen: false });
  }


  datepickerCancelClicked() {
    this.setState({ date: new Date(), enddate: new Date(), datepickerOpen: false, datepickerendOpen: false });
  }

  handlebarCodeId = (value) => {
    this.setState({ barCodeId: value.trim() });
  };

  applyBarcodeFilter() {
    console.log(this.state.filterActive, this.state.filterPageNo);
    this.setState({ loading: true, loadMoreActive: false });
    let list = {};
    list = {
      fromDate: this.state.startDate,
      toDate: this.state.endDate,
      barcode: this.state.barCodeId,
      storeId: parseInt(this.state.storeId)
    };
    console.log(list);
    axios.post(InventoryService.getTextileBarcodes() + '?page=' + parseInt(this.state.filterPageNo) + '&size=10', list).then(res => {
      console.log(res);
      if (res) {
        if (res.data) {
          this.setState({ loading: false, filterBarcodesList: this.state.filterBarcodesList.concat(res.data.content), error: "", filterActive: true, loading: false, totalPages: res.data.result.totalPages });
          console.log("filtered Data", res.data.content);
          this.setState({ fromDate: "", toDate: "", barCodeId: "" });
          this.continuePagination();
        }
      }
      this.setState({ loading: false, filterActive: true });
    }).catch((err) => {
      this.setState({ loading: false, filterActive: false });
      console.log(err);
    });
    this.setState({ modalVisible: false });
  }

  continuePagination() {
    if (this.state.filterActive) {
      if (this.state.totalPages > 2) {
        this.setState({ loadMoreActive: true });
      } else if (parseInt(this.state.totalPages) === parseInt(this.state.filterPageNo) + 1) {
        this.setState({ loadMoreActive: false });
      }
      else {
        this.setState({ loadMoreActive: false });
      }
    } else {
      if (this.state.totalPages > 2) {
        this.setState({ loadMoreActive: true });
      } else if (parseInt(this.state.totalPages) === parseInt(this.state.pageNo) + 1) {
        this.setState({ loadMoreActive: false });
      }
      else {
        this.setState({ loadMoreActive: false });
      }
    }
  }


  render() {
    return (
      <View>
        {this.state.loading &&
          <Loader
            loading={this.state.loading} />
        }
        <View>
          <FlatList
            style={styles.flatListBody}
            ListHeaderComponent={<View style={styles.headerContainer}>
              <Text style={flatListTitle}>Barcode List</Text>
              <View>
                {!this.state.filterActive &&
                  <TouchableOpacity
                    style={filterBtn}
                    onPress={() => this.filterAction()} >
                    <Image style={{ alignSelf: 'center', top: RH(5) }} source={require('../assets/images/promofilter.png')} />
                  </TouchableOpacity>
                }
                {this.state.filterActive &&
                  <TouchableOpacity
                    style={filterBtn}
                    onPress={() => this.clearFilterAction()} >
                    <Image style={{ alignSelf: 'center', top: RH(5) }} source={require('../assets/images/clearFilterSearch.png')} />
                  </TouchableOpacity>
                }
              </View>
            </View>}
            data={this.state.filterActive ? this.state.filterBarcodesList : this.state.barcodesList}
            scrollEnabled={true}
            ListEmptyComponent={<Text style={listEmptyMessage}>&#9888; Records Not Found</Text>}
            keyExtractor={(item, i) => i.toString()}
            removeClippedSubviews={false}
            renderItem={({ item, index }) => (
              <View style={{ flex: 1 }}>
                <ScrollView>
                  <View style={styles.flatListContainer}>
                    <View style={flatlistSubContainer}>
                      <View style={textContainer}>
                        <Text style={highText}>S.NO: {index + 1}</Text>
                      </View>
                      <View style={textContainer}>
                        <Text style={textStyleMedium}>{I18n.t("STORE")}: {this.state.storeName}</Text>
                        <Text style={textStyleLight}>{I18n.t("VALUE")}: ₹{item.value}</Text>
                      </View>
                      <View style={textContainer}>
                        <Text style={textStyleLight}>{I18n.t("LIST PRICE")}: ₹{item.itemMrp}</Text>
                        <Text style={textStyleLight}>QTY: {item.qty}</Text>
                      </View>
                      <View style={textContainer}>
                        <Text style={[textStyleMedium]} selectable={true}>{item.barcode}</Text>
                      </View>
                      <View style={styles.flatListFooter}>
                        <Text>CreatedDate: {item.createdDate ? item.createdDate.toString().split(/T/)[0] : item.createdDate}</Text>
                        <View style={buttonContainer}>
                          <TouchableOpacity style={buttonStyle1} onPress={() => this.handleeditbarcode(item, index)}>
                            <Image style={buttonImageStyle} source={require('../assets/images/edit.png')} />
                          </TouchableOpacity>
                          <TouchableOpacity style={buttonStyle} onPress={() => this.handlebarcodedeleteaction(item, index)}>
                            <Image style={buttonImageStyle} source={require('../assets/images/delete.png')} />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </View>
                </ScrollView>
              </View>
            )}
            // onEndReached={() => { this.loadMoreList() }}
            // onEndReachedThreshold={10}
            // ListFooterComponent={() => { return this.state.barcodesList.length > 10 || this.state.filterBarcodesList > 10 ? <ActivityIndicator size={"small"} /> : null }}
            ListFooterComponent={this.state.loadMoreActive && <TouchableOpacity style={loadMoreBtn} onPress={() => this.loadMoreList()}><Text style={loadmoreBtnText}>Load More ?</Text></TouchableOpacity>}
          />
        </View>
        {this.state.flagFilterOpen && (
          <View>
            <Modal style={{ margin: 0 }} isVisible={this.state.modalVisible}>
              <View style={filterMainContainer} >
                <View>
                  <View style={filterSubContainer}>
                    <Text style={filterHeading} > {I18n.t("Filter By")} </Text>
                    <TouchableOpacity style={filterCloseImage} onPress={() => this.modelCancel()}>
                      <Image style={{ margin: RH(5) }} source={require('../assets/images/modelcancel.png')} />
                    </TouchableOpacity>
                  </View>
                </View>
                <KeyboardAwareScrollView enableOnAndroid={true} >
                  <TouchableOpacity
                    style={dateSelector}
                    testID="openModal"
                    onPress={() => this.datepickerClicked()}
                  >
                    <Text
                      style={dateText}
                    >{this.state.startDate === "" ? 'Start Date' : this.state.startDate}</Text>
                    <Image style={filter.calenderpng} source={require('../assets/images/calender.png')} />
                  </TouchableOpacity>
                  {this.state.datepickerOpen && (
                    <View style={filter.dateTopView}>
                      <View style={filter.dateTop2}>
                        <TouchableOpacity
                          style={datePickerButton1} onPress={() => this.datepickerCancelClicked()}
                        >
                          <Text style={datePickerBtnText}  > Cancel </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={datePickerButton2} onPress={() => this.datepickerDoneClicked()}
                        >
                          <Text style={datePickerBtnText}  > Done </Text>
                        </TouchableOpacity>
                      </View>
                      <DatePicker style={datePicker}
                        date={this.state.date}
                        mode={'date'}
                        onDateChange={(date) => this.setState({ date })}
                      />
                    </View>
                  )}
                  <TouchableOpacity
                    style={dateSelector}
                    testID="openModal"
                    onPress={() => this.enddatepickerClicked()}
                  >
                    <Text
                      style={dateText}
                    >{this.state.endDate === '' ? 'End Date' : this.state.endDate}</Text>
                    <Image style={filter.calenderpng} source={require('../assets/images/calender.png')} />
                  </TouchableOpacity>

                  {this.state.datepickerendOpen && (
                    <View style={filter.dateTopView}>
                      <View style={filter.dateTop2}>
                        <View>
                          <TouchableOpacity
                            style={datePickerButton1} onPress={() => this.datepickerCancelClicked()}
                          >
                            <Text style={datePickerBtnText}  > Cancel </Text>
                          </TouchableOpacity>
                        </View>
                        <View>
                          <TouchableOpacity
                            style={datePickerButton2} onPress={() => this.datepickerendDoneClicked()}
                          >
                            <Text style={datePickerBtnText}  > Done </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                      <DatePicker style={datePicker}
                        date={this.state.enddate}
                        mode={'date'}
                        onDateChange={(enddate) => this.setState({ enddate })}
                      />
                    </View>
                  )}
                  <TextInput
                    style={inputField}
                    underlineColorAndroid="transparent"
                    placeholder={I18n.t("BARCODE ID")}
                    placeholderTextColor="#6F6F6F"
                    textAlignVertical="center"
                    autoCapitalize="none"
                    value={this.state.barCodeId}
                    onChangeText={this.handlebarCodeId}
                  />
                  <TouchableOpacity style={submitBtn}
                    onPress={() => this.applyBarcodeFilter()}>
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
        {this.state.inventoryDelete && (
          <View>
            <Modal style={{ margin: 0 }} isVisible={this.state.modalVisible}>
              <View style={deleteContainer}>
                <View>
                  <View style={deleteHeader}>
                    <View>
                      <Text style={deleteHeading} > {I18n.t("Delete Barcode")} </Text>
                    </View>
                    <View>
                      <TouchableOpacity style={deleteCloseBtn} onPress={() => this.modelCancel()}>
                        <Image style={{ margin: 5 }} source={require('../assets/images/modelcancel.png')} />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <Text style={filter.spaceText}></Text>
                </View>

                <Text style={deleteText}> {I18n.t("Are you sure want to delete Barcode")} ?  </Text>

                <TouchableOpacity
                  style={[submitBtn]}
                  onPress={() => this.deleteInventory()}
                >
                  <Text style={submitBtnText}  > {I18n.t("DELETE")} </Text>

                </TouchableOpacity>

                <TouchableOpacity
                  style={cancelBtn} onPress={() => this.modelCancel()}
                >
                  <Text style={cancelBtnText}  > {I18n.t("CANCEL")} </Text>

                </TouchableOpacity>
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
    backgroundColor: 'lightgray',
  },
  date: {
    width: deviceWidth,
    height: RH(200),
    marginTop: RH(50),
  },
  calenderpng: {
    position: 'absolute',
    top: RH(10),
    right: 0,
  },
  dateTopView: {
    height: RW(280),
    width: deviceWidth,
    backgroundColor: '#ffffff'
  },
  dateTop2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Device.isTablet ? 15 : RH(10),
    marginLeft: Device.isTablet ? 20 : RW(10),
    marginRight: Device.isTablet ? 20 : RW(10)
  },
  mainContainer: {
    flex: 1,
  },

});
