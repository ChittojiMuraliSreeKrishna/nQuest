import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import { Dimensions, FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import DatePicker from 'react-native-date-picker';
import Device from 'react-native-device-detection';
import I18n from 'react-native-i18n';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Modal from 'react-native-modal';
import { Appbar } from 'react-native-paper';
import RNPickerSelect from 'react-native-picker-select';
import { Chevron } from 'react-native-shapes';
import FilterIcon from 'react-native-vector-icons/FontAwesome';
import IconMA from 'react-native-vector-icons/MaterialCommunityIcons';
import forms from '../../commonUtils/assets/styles/formFields.scss';
import scss from "../../commonUtils/assets/styles/style.scss";
import { formatDate } from '../../commonUtils/DateFormate';
import Loader from '../../commonUtils/loader';
import { RH } from '../../Responsive';
import ReportsService from '../services/ReportsService';
import { emptyTextStyle } from '../Styles/FormFields';
import { flatListMainContainer, flatlistSubContainer, highText, textContainer, textStyleSmall } from '../Styles/Styles';


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
      filterActive: false,
      loadPrevActive: false,
      loadNextActive: true
    };
  }

  componentDidMount () {
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


  datepickerClicked () {
    this.setState({ datepickerOpen: true });
  }

  enddatepickerClicked () {
    this.setState({ datepickerendOpen: true });
  }

  datepickerDoneClicked () {
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

  datepickerendDoneClicked () {
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

  applyGoodsReturn (pageNumber) {
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
      if (res.data && res.data[ "isSuccess" ] === "true") {
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
          });
          this.setState({ filterActive: true });
          this.setState({
            loading: false,
            goodsReturn: res.data.result.content,
            // rsDetailsList: res.data.result.content,
            totalPages: res.data.result.totalPages
            // totalPages: res.data.totalPages,
          });
          this.continuePagination();
          this.modelCancel();
        } else {
          alert("Results Not Found");
          this.modelCancel();
        }
      }
      else {
        alert(res.data.message);
        this.setState({ loading: false });
        this.modelCancel();
      }
    }).catch((err) => {
      alert('No Records Found');
      this.setState({ loading: false });
      this.modelCancel();
    });
  }

  loadMoreList = (value) => {
    if (value >= 0 && value < this.state.totalPages) {
      this.setState({ pageNo: value }, () => {
        this.applyGoodsReturn();
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
    if (this.state.totalPages > 1) {
      this.setState({ loadMoreActive: true });
    } else {
      this.setState({ loadMoreActive: false, loadNextActive: false });
    }
  }

  datepickerCancelClicked () {
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

  handledeleteNewSale () {
    this.setState({ flagDeleteGoodsReturn: true, modalVisible: true });
  }


  filterAction () {
    this.setState({ flagFilterGoodsReturn: true, modalVisible: true });
  }

  modelCancel () {
    this.setState({
      flagFilterGoodsReturn: false, modalVisible: false,
      startDate: '', endDate: '',
      returnSlip: '', barCode: '',
      rtStatus: ''
    });
  }

  handleRTStatus = (value) => {
    this.setState({ rtStatus: value });
  };

  clearFilterAction () {
    this.setState({
      loadMoreActive: false, loadNextActive: false,
      filterActive: false, flagFilterGoodsReturn: false, modalVisible: false,
      startDate: "", endDate: "",
      returnSlip: "", barCode: "",
      rtStatus: "", goodsReturn: []
    });
  }


  render () {
    return (
      <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
        <Appbar>
          <Appbar.Content title="Goods Return" />
          {this.state.filterActive ?
            <FilterIcon
              name="sliders"
              size={25}
              style={{ marginRight: 10 }}
              color="#ed1c24"
              onPress={() => this.clearFilterAction()}
            /> :
            <FilterIcon
              name="sliders"
              size={25}
              color="#000"
              style={{ marginRight: 10 }}
              onPress={() => this.filterAction()}
            />
          }
        </Appbar>
        {this.state.loading && <Loader loading={this.state.loading} />}
        <FlatList
          data={this.state.goodsReturn}
          scrollEnabled={true}
          removeClippedSubviews={false}
          keyExtractor={(item, i) => i.toString()}
          ListEmptyComponent={<Text style={emptyTextStyle}>&#9888; {I18n.t("Results not loaded")}</Text>}
          renderItem={({ item, index }) => (
            <View style={[ flatListMainContainer, { backgroundColor: "#FFF" } ]} >
              <View style={flatlistSubContainer}>
                <View style={textContainer}>
                  <Text style={highText} >S NO: {index + 1} </Text>
                  <Text selectable={true} style={textStyleSmall}>{I18n.t("RTS NUMBER")}: {"\n"}{item.rtNumber}</Text>
                  <Text style={textStyleSmall}>{I18n.t("BARCODE")}: {"\n"}{item && item.barcodes.length !== 0 ? item.barcodes[ 0 ].barCode : '-'}</Text>
                </View>
                <View style={textContainer}>
                  <Text style={textStyleSmall} >{I18n.t("EMP ID")}: {item.createdBy} </Text>
                  <Text style={textStyleSmall}>{I18n.t("RTS DATE & TIME")}: {"\n"} {formatDate(item.createdInfo)}</Text>
                  <Text style={textStyleSmall}>{I18n.t("AMOUNT")}: {"\n"} ₹{item.amount}</Text>
                </View>
                <View style={textContainer}>
                  <View style={styles.buttons}>
                    <TouchableOpacity style={styles.deleteButton} onPress={() => this.handledeleteNewSale(item, index)}>
                      <Image style={{ alignSelf: 'center', top: 5, height: Device.isTablet ? 30 : 20, width: Device.isTablet ? 30 : 20 }} source={require('../assets/images/delete.png')} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
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


        {this.state.flagFilterGoodsReturn && (
          <View>
            <Modal style={{ margin: 0 }} isVisible={this.state.modalVisible}
              onBackButtonPress={() => this.modelCancel()}
              onBackdropPress={() => this.modelCancel()} >
              <View style={forms.filterModelContainer} >
                <Text style={forms.popUp_decorator}>-</Text>
                <View style={forms.filterModelSub}>
                  <KeyboardAwareScrollView>
                    <View style={forms.filter_dates_container}>
                      <TouchableOpacity
                        style={forms.filter_dates}
                        testID="openModal"
                        onPress={() => this.datepickerClicked()}
                      >
                        <Text
                          style={forms.filter_dates_text}
                        >{this.state.startDate == "" ? 'START DATE' : this.state.startDate}</Text>
                        <Image style={forms.calender_image} source={require('../assets/images/calender.png')} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={forms.filter_dates}
                        testID="openModal"
                        onPress={() => this.enddatepickerClicked()}
                      >
                        <Text
                          style={forms.filter_dates_text}
                        >{this.state.endDate == "" ? 'END DATE' : this.state.endDate}</Text>
                        <Image style={forms.calender_image} source={require('../assets/images/calender.png')} />
                      </TouchableOpacity>
                    </View>

                    {this.state.datepickerOpen && (
                      <View style={{ height: 280, width: deviceWidth, backgroundColor: '#ffffff' }}>
                        <TouchableOpacity style={styles.datePickerButton} onPress={() => this.datepickerCancelClicked()}>
                          <Text style={styles.datePickerButtonText}  > Cancel </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.datePickerEndButton} onPress={() => this.datepickerDoneClicked()}>
                          <Text style={styles.datePickerButtonText}  > Done </Text>
                        </TouchableOpacity>
                        <DatePicker style={{ width: deviceWidth, height: 200, marginTop: 50, }}
                          date={this.state.date}
                          mode={'date'}
                          onDateChange={(date) => this.setState({ date })}
                        />
                      </View>
                    )}
                    {this.state.datepickerendOpen && (
                      <View style={{ height: 280, width: deviceWidth, backgroundColor: '#ffffff' }}>
                        <TouchableOpacity
                          style={styles.datePickerButton} onPress={() => this.datepickerCancelClicked()}
                        >
                          <Text style={styles.datePickerButtonText}  > Cancel </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.datePickerEndButton} onPress={() => this.datepickerendDoneClicked()}
                        >
                          <Text style={styles.datePickerButtonText}  > Done </Text>

                        </TouchableOpacity>
                        <DatePicker style={{ width: deviceWidth, height: 200, marginTop: 50, }}
                          date={this.state.enddate}
                          mode={'date'}
                          onDateChange={(enddate) => this.setState({ enddate })}
                        />
                      </View>
                    )}
                    <Text style={styles.headings}>{I18n.t("RT Status")}</Text>
                    <View style={styles.rnSelectContainer}>
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
                      style={forms.input_fld}
                      underlineColorAndroid="transparent"
                      placeholder={I18n.t("RT Number")}
                      placeholderTextColor="#6F6F6F"
                      textAlignVertical="center"
                      autoCapitalize="none"
                      value={this.state.returnSlipNumber}
                      onChangeText={this.handleReturnSlipNumber}
                    />
                    <Text style={styles.headings}>{I18n.t("Barcode")}</Text>
                    <TextInput
                      style={forms.input_fld}
                      underlineColorAndroid="transparent"
                      placeholder={I18n.t("Barcode")}
                      placeholderTextColor="#6F6F6F"
                      textAlignVertical="center"
                      autoCapitalize="none"
                      value={this.state.barCode}
                      onChangeText={this.handleBarCode}
                    />
                    <View style={forms.action_buttons_container}>
                      <TouchableOpacity style={[ forms.action_buttons, forms.submit_btn ]}
                        onPress={() => this.applyGoodsReturn(this.state.pageNo)}>
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
    marginTop: Device.isTablet ? deviceheight - RH(550) : deviceheight - RH(500),
    height: Device.isTablet ? RH(550) : RH(480)
  },
  input: {
    justifyContent: 'center',
    marginLeft: 20,
    marginRight: 20,
    height: Device.isTablet ? 54 : 44,
    marginTop: 5,
    marginBottom: 10,
    borderColor: '#8F9EB717',
    borderRadius: 3,
    backgroundColor: '#FBFBFB',
    borderWidth: 1,
    fontFamily: 'regular',
    paddingLeft: 15,
    fontSize: Device.isTablet ? 20 : 14,
  },
  rnSelect_mobile: {
    color: '#8F9EB7',
    fontSize: 15
  },
  datePickerButton: {
    position: 'absolute',
    left: 20,
    top: 10,
    height: Device.isTablet ? 40 : 30,
    backgroundColor: "#ED1C24",
    borderRadius: 5,
  },
  datePickerButtonText: {
    textAlign: 'center',
    marginTop: 5,
    color: "#ffffff",
    fontSize: Device.isTablet ? 20 : 15,
    fontFamily: "regular"
  },
  datePickerEndButton: {
    position: 'absolute',
    right: 20,
    top: 10,
    height: Device.isTablet ? 40 : 30,
    backgroundColor: "#ED1C24",
    borderRadius: 5,
  },
  rnSelect_tablet: {
    color: '#8F9EB7',
    fontSize: 20
  },
  rnSelectContainer: {
    justifyContent: 'center',
    margin: 20,
    height: Device.isTablet ? 54 : 44,
    marginTop: 5,
    marginBottom: 10,
    borderColor: '#8F9EB717',
    borderRadius: 3,
    backgroundColor: '#FBFBFB',
    borderWidth: 1,
    fontFamily: 'regular',
    paddingLeft: 15,
    fontSize: Device.isTablet ? 20 : 15,
  },
  headings: {
    fontSize: Device.isTablet ? 20 : 15,
    marginLeft: 20,
    color: '#B4B7B8',
    marginTop: Device.isTablet ? 10 : 5,
    marginBottom: Device.isTablet ? 10 : 5,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  deleteButton: {
    width: Device.isTablet ? 50 : 30,
    height: Device.isTablet ? 50 : 30,
    borderBottomRightRadius: 5,
    borderTopRightRadius: 5,
    borderWidth: 1,
    borderColor: "lightgray",
  }
});
