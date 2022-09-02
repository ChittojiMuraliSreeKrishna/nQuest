import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import { Dimensions, FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import DatePicker from 'react-native-date-picker';
import Device from 'react-native-device-detection';
import I18n from 'react-native-i18n';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Modal from 'react-native-modal';
import { Appbar } from 'react-native-paper';
import ReportsService from '../services/ReportsService';
import FilterIcon from 'react-native-vector-icons/FontAwesome'
import { RH, RW } from '../../Responsive';
import RNPickerSelect from 'react-native-picker-select';
import { Chevron } from 'react-native-shapes';
import { emptyTextStyle } from '../Styles/FormFields';
import { flatListMainContainer, flatlistSubContainer, highText, loadMoreBtn, loadmoreBtnText, textContainer, textStyleMedium, textStyleSmall } from '../Styles/Styles';
import Loader from '../../commonUtils/loader';
import { formatDate } from '../../commonUtils/DateFormate';
import { reportErrorMessages } from '../Errors/errors';
import Message from '../Errors/Message';


var deviceWidth = Dimensions.get("window").width;
var deviceheight = Dimensions.get("window").height;

export class GoodsReturn extends Component {

  constructor(props) {
    super(props);
    this.state = {
      modalVisible: true,
      flagDeleteGoodsReturn: false,
      date: new Date(),
      enddate: new Date(),
      startDate: "",
      endDate: "",
      fromDate: "",
      toDate: "",
      returnSlipNumber: null,
      barCode: null,
      empId: "",
      storeId: null,
      domainId: 0,
      goodsReturn: [],
      flagFilterGoodsReturn: false,
      rtStatus: null,
      createdBy: null,
      loadMoreActive: false,
      totalPages: 0,
      pageNo: 0,
      loading: false,
      barcodeValid: true,
      returnSlipNumberValid: true,
      errors: {}
    };
  }

  componentDidMount() {
    if (global.domainName === "Textile") {
      this.setState({ domainId: 1 });
    }
    else if (global.domainName === "Retail") {
      this.setState({ domainId: 2 });
    }
    else if (global.domainName === "Electrical & Electronics") {
      this.setState({ domainId: 3 });
    }


    AsyncStorage.getItem("storeId").then((value) => {
      storeStringId = value;
      this.setState({ storeId: parseInt(storeStringId) });
      console.log(this.state.storeId);


    }).catch(() => {
      this.setState({ loading: false });
      console.log('There is error getting storeId');
      // alert('There is error getting storeId');
    });
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

  validationForm() {
    let isFormValid = true;
    let errors = {};

    if (this.state.barCode === '' || this.state.barCode === null) {
      isFormValid = false;
      errors["barCode"] = reportErrorMessages.barCode;
      this.setState({ barcodeValid: false });
    }

    if (this.state.returnSlipNumber === '' || this.state.returnSlipNumber === null) {
      isFormValid = false;
      errors["returnSlipNumber"] = reportErrorMessages.returnSlipNumber;
      this.setState({ returnSlipNumberValid: false });
    }

    this.setState({ errors: errors });
    return isFormValid;
  }

  applyGoodsReturnValidation(pageNumber) {
    const isFormValid = this.validationForm()
    if (isFormValid) {
      this.applyGoodsReturn(pageNumber)
    }
  }

  applyGoodsReturn(pageNumber) {
    this.setState({ loading: true, loadMoreActive: false });
    const obj = {
      dateFrom: this.state.startDate ? this.state.startDate : undefined,
      dateTo: this.state.endDate ? this.state.endDate : undefined,
      rtStatus: this.state.rtStatus ? this.state.rtStatus : null,
      // createdBy: this.state.createdBy ? this.state.createdBy : undefined,
      rtNumber: this.state.returnSlipNumber ? (this.state.returnSlipNumber).trim() : null,
      barcode: this.state.barCode ? (this.state.barCode).trim() : null,
      // domainId: this.state.domainId ? parseInt(this.state.domainId) : undefined,
      storeId: this.state.storeId ? parseInt(this.state.storeId) : null,
    };
    console.log('params are' + JSON.stringify(obj), pageNumber);
    ReportsService.returnSlips(obj, pageNumber).then((res) => {
      console.log("returnSlips response", res.data);
      console.log(res.data.result.length);
      if (res.data && res.data["isSuccess"] === "true") {
        if (res.data.result.length !== 0) {
          res.data.result.content.map((prop, i) => {
            let barcodeData = "";
            if (prop.barcodes.length > 0) {
              barcodeData = Array.prototype.map
                .call(prop.barcodes, function (item) {
                  return item.barCode;
                })
                .join(",");
            }
            prop.barcodeVal = barcodeData;
            prop.review = false;
          })
          this.setState({
            loading: false,
            goodsReturn: res.data.result.content,
            // rsDetailsList: res.data.result.content,
            totalPages: res.data.result.totalPages
            // totalPages: res.data.totalPages,
          })
          this.continuePagination();
          this.modelCancel()
        } else {
          alert("Results Not Found");
          this.modelCancel()
        }
      }
      else {
        alert(res.data.message);
        this.setState({ loading: false })
        this.modelCancel()
      }
    }).catch((err) => {
      alert('No Records Found');
      this.setState({ loading: false });
      this.modelCancel()
    })
  }

  // Pagination Function
  loadMoreList = () => {
    this.setState({ pageNo: this.state.pageNo + 1 }, () => {
      this.applyGoodsReturnValidation();
    });
  };


  continuePagination() {
    if (this.state.pageNo < this.state.totalPages - 1) {
      this.setState({ loadMoreActive: true });
    } else {
      this.setState({ loadMoreActive: false });
    }
  }

  datepickerCancelClicked() {
    this.setState({ date: new Date(), enddate: new Date(), datepickerOpen: false, datepickerendOpen: false });
  }

  handleReturnSlipNumber = (value) => {
    this.setState({ returnSlipNumber: value });
  };

  handleBarCode = (value) => {
    this.setState({ barCode: value });
  };

  handleEmpId = (value) => {
    this.setState({ empId: value });
  };

  handledeleteNewSale() {
    this.setState({ flagDeleteGoodsReturn: true, modalVisible: true });
  }


  filterAction() {
    this.setState({ flagFilterGoodsReturn: true, modalVisible: true })
  }

  modelCancel() {
    this.setState({
      flagFilterGoodsReturn: false, modalVisible: false,
      startDate: '', endDate: '',
      returnSlip: '', barCode: '',
      rtStatus: ''
    })
  }

  handleRTStatus = (value) => {
    this.setState({ rtStatus: value })
  }



  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
        <Appbar>
          <Appbar.Content title="Goods Return" />
          <FilterIcon
            name="sliders"
            size={25}
            onPress={() => this.filterAction()}
          />
        </Appbar>
        {this.state.loading && <Loader loading={this.state.loading} />}
        <FlatList
          data={this.state.goodsReturn}
          scrollEnabled={true}
          removeClippedSubviews={false}
          keyExtractor={(item, i) => i.toString()}
          ListEmptyComponent={<Text style={emptyTextStyle}>&#9888; {I18n.t("Results not loaded")}</Text>}
          // onEndReached={this.loadMoreList}
          // onEndReachedThreshold={200}
          renderItem={({ item, index }) => (
            <View style={[flatListMainContainer, { backgroundColor: "#FFF" }]} >
              <View style={flatlistSubContainer}>
                <View style={textContainer}>
                  <Text style={highText} >S NO: {index + 1} </Text>
                  <Text selectable={true} style={textStyleSmall}>{I18n.t("RTS NUMBER")}: {"\n"}{item.rtNumber}</Text>
                  <Text style={textStyleSmall}>{I18n.t("BARCODE")}: {"\n"}{item && item.barcodes.length !== 0 ? item.barcodes[0].barCode : '-'}</Text>
                </View>
                <View style={textContainer}>
                  <Text style={textStyleSmall} >{I18n.t("EMP ID")}: {item.createdBy} </Text>
                  <Text style={textStyleSmall}>{I18n.t("RTS DATE")}: {"\n"} {formatDate(item.createdInfo)}</Text>
                  <Text style={textStyleSmall}>{I18n.t("AMOUNT")}: {"\n"} ₹{item.amount}</Text>
                </View>
                <View style={textContainer}>
                  <View style={flats.buttons}>
                    <TouchableOpacity style={Device.isTablet ? flats.deleteButton_tablet : flats.deleteButton_mobile} onPress={() => this.handledeleteNewSale(item, index)}>
                      <Image style={{ alignSelf: 'center', top: 5, height: Device.isTablet ? 30 : 20, width: Device.isTablet ? 30 : 20 }} source={require('../assets/images/delete.png')} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          )}
          ListFooterComponent={
            this.state.loadMoreActive && (
              <TouchableOpacity
                style={loadMoreBtn}
                onPress={() => this.loadMoreList()}
              >
                <Text style={loadmoreBtnText}>Load More ?</Text>
              </TouchableOpacity>
            )
          }
        />


        {this.state.flagFilterGoodsReturn && (
          <View>
            <Modal style={{ margin: 0 }} isVisible={this.state.modalVisible}>
              <View style={styles.filterMainContainer} >
                <View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5, height: Device.isTablet ? 60 : 50 }}>
                    <View>
                      <Text style={{ marginTop: 15, fontSize: Device.isTablet ? 22 : 17, marginLeft: 20 }} > {I18n.t("Filter By")} </Text>
                    </View>
                    <View>
                      <TouchableOpacity style={{ width: Device.isTablet ? 60 : 50, height: Device.isTablet ? 60 : 50, marginTop: Device.isTablet ? 20 : 15, }} onPress={() => this.modelCancel()}>
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
                  <Text style={styles.headings}>{I18n.t("From Date")}</Text>
                  <TouchableOpacity
                    style={Device.isTablet ? styles.filterDateButton_tablet : styles.filterDateButton_mobile}
                    testID="openModal"
                    onPress={() => this.datepickerClicked()}
                  >
                    <Text
                      style={Device.isTablet ? styles.filterDateButtonText_tablet : styles.filterDateButtonText_mobile}
                    >{this.state.startDate == "" ? 'From Date' : this.state.startDate}</Text>
                    <Image style={{ position: 'absolute', top: 10, right: 0, }} source={require('../assets/images/calender.png')} />
                  </TouchableOpacity>
                  {this.state.datepickerOpen && (
                    <View style={{ height: 280, width: deviceWidth, backgroundColor: '#ffffff' }}>
                      <TouchableOpacity
                        style={Device.isTablet ? styles.datePickerButton_tablet : styles.datePickerButton_mobile} onPress={() => this.datepickerCancelClicked()}
                      >
                        <Text style={Device.isTablet ? styles.datePickerButtonText_tablet : styles.datePickerButtonText_mobile}  > Cancel </Text>

                      </TouchableOpacity>
                      <TouchableOpacity
                        style={Device.isTablet ? styles.datePickerEndButton_tablet : styles.datePickerEndButton_mobile} onPress={() => this.datepickerDoneClicked()}
                      >
                        <Text style={Device.isTablet ? styles.datePickerButtonText_tablet : styles.datePickerButtonText_mobile}  > Done </Text>

                      </TouchableOpacity>
                      <DatePicker style={{ width: deviceWidth, height: 200, marginTop: 50, }}
                        date={this.state.date}
                        mode={'date'}
                        onDateChange={(date) => this.setState({ date })}
                      />
                    </View>
                  )}
                  <Text style={styles.headings}>{I18n.t("To Date")}</Text>
                  <TouchableOpacity
                    style={Device.isTablet ? styles.filterDateButton_tablet : styles.filterDateButton_mobile}
                    testID="openModal"
                    onPress={() => this.enddatepickerClicked()}
                  >
                    <Text
                      style={Device.isTablet ? styles.filterDateButtonText_tablet : styles.filterDateButtonText_mobile}
                    >{this.state.endDate == "" ? 'To Date' : this.state.endDate}</Text>
                    <Image style={{ position: 'absolute', top: 10, right: 0, }} source={require('../assets/images/calender.png')} />
                  </TouchableOpacity>
                  {this.state.datepickerendOpen && (
                    <View style={{ height: 280, width: deviceWidth, backgroundColor: '#ffffff' }}>
                      <TouchableOpacity
                        style={Device.isTablet ? styles.datePickerButton_tablet : styles.datePickerButton_mobile} onPress={() => this.datepickerCancelClicked()}
                      >
                        <Text style={Device.isTablet ? styles.datePickerButtonText_tablet : styles.datePickerButtonText_mobile}  > Cancel </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={Device.isTablet ? styles.datePickerEndButton_tablet : styles.datePickerEndButton_mobile} onPress={() => this.datepickerendDoneClicked()}
                      >
                        <Text style={Device.isTablet ? styles.datePickerButtonText_tablet : styles.datePickerButtonText_mobile}  > Done </Text>

                      </TouchableOpacity>
                      <DatePicker style={{ width: deviceWidth, height: 200, marginTop: 50, }}
                        date={this.state.enddate}
                        mode={'date'}
                        onDateChange={(enddate) => this.setState({ enddate })}
                      />
                    </View>
                  )}
                  <Text style={styles.headings}>{I18n.t("RT Status")}</Text>
                  <View style={Device.isTablet ? styles.rnSelectContainer_tablet : styles.rnSelectContainer_mobile}>
                    <RNPickerSelect
                      // style={Device.isTablet ? styles.rnSelect_tablet : styles.rnSelect_mobile}
                      placeholder={{ label: 'RT Status', value: '' }}
                      Icon={() => {
                        return <Chevron style={styles.imagealign} size={1.5} color="gray" />;
                      }}
                      items={[
                        { value: 'PENDING', label: 'Pending', },
                        { value: 'COMPLETED', label: 'Completed', },
                      ]}
                      onValueChange={this.handleRTStatus}
                      style={Device.isTablet ? pickerSelectStyles_tablet : pickerSelectStyles_mobile}
                      value={this.state.rtStatus}
                      useNativeAndroidPickerStyle={false}
                    />
                  </View>
                  <Text style={styles.headings}>{I18n.t("RT Number")}</Text>
                  <TextInput
                    style={[Device.isTablet ? styles.input_tablet : styles.input_mobile, { width: deviceWidth - 40 }]}
                    underlineColorAndroid="transparent"
                    placeholder={I18n.t("RT Number")}
                    placeholderTextColor="#6F6F6F"
                    textAlignVertical="center"
                    autoCapitalize="none"
                    value={this.state.returnSlipNumber}
                    onChangeText={this.handleReturnSlipNumber}
                  />
                  <Text>
                    {!this.state.returnSlipNumberValid && (
                      <Message imp={true} message={this.state.errors["returnSlipNumber"]} />
                    )}
                  </Text>
                  <Text style={styles.headings}>{I18n.t("Barcode")}</Text>
                  <TextInput
                    style={[Device.isTablet ? styles.input_tablet : styles.input_mobile, { width: deviceWidth - 40 }]}
                    underlineColorAndroid="transparent"
                    placeholder={I18n.t("Barcode")}
                    placeholderTextColor="#6F6F6F"
                    textAlignVertical="center"
                    autoCapitalize="none"
                    value={this.state.barCode}
                    onChangeText={this.handleBarCode}
                  />
                  <Text style={styles.headings}>
                    {!this.state.barcodeValid && (
                      <Message imp={true} message={this.state.errors["barCode"]} />
                    )}
                  </Text>
                  <TouchableOpacity style={Device.isTablet ? styles.filterApplyButton_tablet : styles.filterApplyButton_mobile}
                    onPress={() => this.applyGoodsReturnValidation(this.state.pageNo)}>
                    <Text style={Device.isTablet ? styles.filterButtonText_tablet : styles.filterButtonText_mobile} >{I18n.t("APPLY")}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={Device.isTablet ? styles.filterCancelButton_tablet : styles.filterCancelButton_mobile}
                    onPress={() => this.modelCancel()}>
                    <Text style={Device.isTablet ? styles.filterButtonCancelText_tablet : styles.filterButtonCancelText_mobile}>{I18n.t("CANCEL")}</Text>
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

const pickerSelectStyles_mobile = StyleSheet.create({
  placeholder: {
    color: "#6F6F6F",
    fontFamily: "regular",
    fontSize: 15,
  },
  inputIOS: {
    justifyContent: 'center',
    height: 42,
    borderRadius: 3,
    borderWidth: 1,
    fontFamily: 'regular',
    //paddingLeft: -20,
    fontSize: 15,
    borderColor: '#FBFBFB',
    backgroundColor: '#FBFBFB',
  },
  inputAndroid: {
    justifyContent: 'center',
    height: 42,
    borderRadius: 3,
    borderWidth: 1,
    fontFamily: 'regular',
    //paddingLeft: -20,
    fontSize: 15,
    borderColor: '#FBFBFB',
    backgroundColor: '#FBFBFB',
    color: '#001B4A',

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
    justifyContent: 'center',
    height: 52,
    borderRadius: 3,
    borderWidth: 1,
    fontFamily: 'regular',
    //paddingLeft: -20,
    fontSize: 20,
    borderColor: '#FBFBFB',
    backgroundColor: '#FBFBFB',
  },
  inputAndroid: {
    justifyContent: 'center',
    height: 52,
    borderRadius: 3,
    borderWidth: 1,
    fontFamily: 'regular',
    //paddingLeft: -20,
    fontSize: 20,
    borderColor: '#FBFBFB',
    backgroundColor: '#FBFBFB',
    color: '#001B4A',

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

  imagealign: {
    marginTop: Device.isTablet ? 25 : 20,
    marginRight: Device.isTablet ? 30 : 20,
  },
  modelCloseImage: {
    fontFamily: 'regular',
    fontSize: 12,
    position: 'absolute',
    top: 10,
    right: Device.isTablet ? 15 : 30,
  },
  filterMainContainer: {
    // marginLeft: -40,
    // marginRight: -40,
    // paddingLeft: Device.isTablet ? 0 : 20,
    backgroundColor: '#ffffff',
    marginTop: Device.isTablet ? deviceheight - RW(700) : deviceheight - RW(600),
    height: Device.isTablet ? RH(850) : RH(750),
  },

  // Styles For Mobile

  filterMainContainer_mobile: {
    width: deviceWidth,
    alignItems: 'center',
    marginLeft: -20,
    backgroundColor: "#ffffff",
    height: 530,
    position: 'absolute',
    bottom: -20,
  },
  filterByTitle_mobile: {
    position: 'absolute',
    left: 20,
    top: 15,
    width: 300,
    height: 20,
    fontFamily: 'medium',
    fontSize: 16,
    color: '#353C40'
  },
  filterByTitleDecoration_mobile: {
    height: Device.isTablet ? 2 : 1,
    width: deviceWidth,
    backgroundColor: 'lightgray',
    marginTop: 50,
  },
  filterCloseButton_mobile: {
    position: 'absolute',
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
    borderColor: '#8F9EB717',
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
    fontFamily: "regular"
  },
  datePickerContainer_mobile: {
    height: 280,
    width: deviceWidth,
    backgroundColor: '#ffffff'
  },
  datePickerButton_mobile: {
    position: 'absolute',
    left: 20,
    top: 10,
    height: 30,
    backgroundColor: "#ED1C24",
    borderRadius: 5,
  },
  datePickerEndButton_mobile: {
    position: 'absolute',
    right: 20,
    top: 10,
    height: 30,
    backgroundColor: "#ED1C24",
    borderRadius: 5,
  },
  datePickerButtonText_mobile: {
    textAlign: 'center',
    marginTop: 5,
    color: "#ffffff",
    fontSize: 15,
    fontFamily: "regular"
  },
  input_mobile: {
    justifyContent: 'center',
    marginLeft: 20,
    marginRight: 20,
    height: 44,
    marginTop: 5,
    marginBottom: 10,
    borderColor: '#8F9EB717',
    borderRadius: 3,
    backgroundColor: '#FBFBFB',
    borderWidth: 1,
    fontFamily: 'regular',
    paddingLeft: 15,
    fontSize: 14,
  },
  filterCloseImage_mobile: {
    color: '#ED1C24',
    fontFamily: 'regular',
    fontSize: 12,
    position: 'absolute',
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
    textAlign: 'center',
    marginTop: 20,
    color: "#ffffff",
    fontSize: 15,
    fontFamily: "regular"
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
    textAlign: 'center',
    marginTop: 20,
    color: "#000000",
    fontSize: 15,
    fontFamily: "regular"
  },
  rnSelect_mobile: {
    color: '#8F9EB7',
    fontSize: 15
  },
  rnSelectContainer_mobile: {
    justifyContent: 'center',
    margin: 20,
    height: 44,
    marginTop: 5,
    marginBottom: 10,
    borderColor: '#8F9EB717',
    borderRadius: 3,
    backgroundColor: '#FBFBFB',
    borderWidth: 1,
    fontFamily: 'regular',
    paddingLeft: 15,
    fontSize: 14,
  },

  // Styles For Tablet
  filterMainContainer_tablet: {
    width: deviceWidth,
    alignItems: 'center',
    marginLeft: -40,
    backgroundColor: "#ffffff",
    height: 600,
    position: 'absolute',
    bottom: -40,
  },
  filterByTitle_tablet: {
    position: 'absolute',
    left: 20,
    top: 15,
    width: 300,
    height: 30,
    fontFamily: 'medium',
    fontSize: 21,
    color: '#353C40'
  },
  filterByTitleDecoration_tablet: {
    height: Device.isTablet ? 2 : 1,
    width: deviceWidth,
    backgroundColor: 'lightgray',
    marginTop: 60,
  },
  input_tablet: {
    justifyContent: 'center',
    marginLeft: 20,
    marginRight: 20,
    height: 54,
    marginTop: 5,
    marginBottom: 10,
    borderColor: '#8F9EB717',
    borderRadius: 3,
    backgroundColor: '#FBFBFB',
    borderWidth: 1,
    fontFamily: 'regular',
    paddingLeft: 15,
    fontSize: 20,
  },
  filterCloseButton_tablet: {
    position: 'absolute',
    right: 24,
    top: 10,
    width: 60,
    height: 60,
  },
  filterCloseImage_tablet: {
    color: '#ED1C24',
    fontFamily: 'regular',
    fontSize: 17,
    position: 'absolute',
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
    textAlign: 'center',
    marginTop: 20,
    color: "#ffffff",
    fontSize: 20,
    fontFamily: "regular"
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
    textAlign: 'center',
    marginTop: 20,
    color: "#000000",
    fontSize: 20,
    fontFamily: "regular"
  },
  filterDateButton_tablet: {
    width: deviceWidth - 40,
    marginTop: 5,
    marginBottom: 10,
    marginLeft: 20,
    marginRight: 20,
    paddingLeft: 15,
    borderColor: '#8F9EB717',
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
    fontFamily: "regular"
  },
  datePickerButton_tablet: {
    position: 'absolute',
    left: 20,
    top: 10,
    height: 40,
    backgroundColor: "#ED1C24",
    borderRadius: 5,
  },
  datePickerButtonText_tablet: {
    textAlign: 'center',
    marginTop: 5,
    color: "#ffffff",
    fontSize: 20,
    fontFamily: "regular"
  },
  datePickerEndButton_tablet: {
    position: 'absolute',
    right: 20,
    top: 10,
    height: 40,
    backgroundColor: "#ED1C24",
    borderRadius: 5,
  },
  rnSelect_tablet: {
    color: '#8F9EB7',
    fontSize: 20
  },
  rnSelectContainer_tablet: {
    justifyContent: 'center',
    margin: 20,
    height: 54,
    marginTop: 5,
    marginBottom: 10,
    borderColor: '#8F9EB717',
    borderRadius: 3,
    backgroundColor: '#FBFBFB',
    borderWidth: 1,
    fontFamily: 'regular',
    paddingLeft: 15,
    fontSize: 20,
  },
  headings: {
    fontSize: Device.isTablet ? 20 : 15,
    marginLeft: 20,
    color: '#B4B7B8',
    marginTop: Device.isTablet ? 10 : 5,
    marginBottom: Device.isTablet ? 10 : 5,
  }

});



// Styles For Flat-Lists


const flats = StyleSheet.create({
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  text: {
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'space-around',
  },


  // flats for Mobile
  flatlistContainer_mobile: {
    height: 150,
    backgroundColor: '#fbfbfb',
    borderBottomWidth: 5,
    borderBottomColor: '#ffffff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flatlistSubContainer_mobile: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    paddingLeft: 10,
    paddingRight: 10,
    alignItems: 'center',
    height: 140
  },
  flatlistTextAccent_mobile: {
    fontFamily: 'medium',
    fontSize: 16,
    color: '#ED1C24'
  },
  flatlistText_mobile: {
    fontFamily: 'regular',
    fontSize: 12,
    color: '#353c40'
  },
  flatlistTextCommon_mobile: {
    fontFamily: 'regular',
    fontSize: 12,
    color: '#808080'
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
    backgroundColor: '#fbfbfb',
    borderBottomWidth: 5,
    borderBottomColor: '#ffffff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flatlistSubContainer_tablet: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    paddingLeft: 20,
    paddingRight: 20,
    alignItems: 'center',
    height: 160
  },
  flatlistTextAccent_tablet: {
    fontFamily: 'medium',
    fontSize: 21,
    color: '#ED1C24'
  },
  flatlistText_tablet: {
    fontFamily: 'regular',
    fontSize: 21,
    color: '#353c40'
  },
  flatlistTextCommon_tablet: {
    fontFamily: 'regular',
    fontSize: 17,
    color: '#808080'
  },
  flatlstTextCommon_tablet: {
    fontFamily: 'regular',
    fontSize: 17,
    color: '#808080'
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
  }
});
