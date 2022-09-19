import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { Component } from 'react';
import { Dimensions, FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import DatePicker from 'react-native-date-picker';
import Device from 'react-native-device-detection';
import I18n from 'react-native-i18n';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Modal from 'react-native-modal';
import { Appbar } from 'react-native-paper';
import { RH } from '../../Responsive';
import ReportsService from '../services/ReportsService';
import FilterIcon from 'react-native-vector-icons/FontAwesome'
import { flatListMainContainer, flatlistSubContainer, highText, textContainer, textStyleMedium, textStyleSmall } from '../Styles/Styles';
import { color } from '../Styles/colorStyles';
import { emptyTextStyle } from '../Styles/FormFields';
import forms from '../../commonUtils/assets/styles/formFields.scss';
import scss from '../../commonUtils/assets/styles/style.scss'


var deviceWidth = Dimensions.get("window").width;
var deviceheight = Dimensions.get("window").height;

export class SalesSumary extends Component {


  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
      enddate: new Date(),
      startDate: "",
      endDate: "",
      fromDate: "",
      toDate: "",
      storeId: null,
      storeName: "",
      salesSumaryObject: [],
      flagFilterSalesSumary: false,
      modalVisible: true,
      itemId: "",
      itemName: "",
      storeList: [],
      domaindataId: "",
      dsList: [],
      totMrp: null,
      totalDiscount: null,
      billValue: null,
      filterActive: false
    };
  }

  componentDidMount() {
    // if (global.domainName === "Textile") {
    //   this.setState({ domainId: 1 });
    // }
    // else if (global.domainName === "Retail") {
    //   this.setState({ domainId: 2 });
    // }
    // else if (global.domainName === "Electrical & Electronics") {
    //   this.setState({ domainId: 3 });
    // }

    AsyncStorage.getItem("storeId").then((value) => {
      storeStringId = value;
      this.setState({ storeId: parseInt(storeStringId) });
      console.log(this.state.storeId);
    }).catch(() => {
      this.setState({ loading: false });
      console.log('There is error getting storeId');
      // alert('There is error getting storeId');
    });

    AsyncStorage.getItem("storeName").then((value) => {
      this.setState({ storeName: value });
      console.log(this.state.storeName);
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

  datepickerCancelClicked() {
    this.setState({ date: new Date(), enddate: new Date(), datepickerOpen: false, datepickerendOpen: false });
  }

  applySalesSummary() {
    const obj = {
      dateFrom: this.state.startDate ? this.state.startDate : undefined,
      dateTo: this.state.endDate ? this.state.endDate : undefined,
      store: {
        id:
          parseInt(this.state.storeId) && parseInt(this.state.storeId) != 0
            ? this.state.storeId
            : undefined,
        name: this.state.storeName,
      },
      storeId:
        parseInt(this.state.storeId) && parseInt(this.state.storeId) != 0
          ? parseInt(this.state.storeId)
          : undefined,
    };
    console.log('params are', obj);
    ReportsService.saleReports(obj).then((res) => {
      console.log(res);
      if (res.data && res.data["isSuccess"] === "true") {
        if (res.data.result.lenght !== 0) {
          let data = res.data.result;
          let a = [];
          data.salesSummery.transction = "Sales Invoicing";
          data.retunSummery.transction = "Return Invoicing";

          a.push(data.salesSummery);
          a.push(data.retunSummery);
          console.log(">>>>>>>>aaaaaaa", a);
          this.setState({
            filterActive: true,
            dsList: a,
            totMrp: data.totalMrp,
            billValue: data.billValue,
            totalDiscount: data.totalDiscount,
            totalSgst: data.totalSgst,
            totalCgst: data.totalCgst,
            totalIgst: data.totalIgst,
            totalCess: data.totalCess
          })
          this.setState({ startDate: "", endDate: "" })
          this.modelCancel()
        } else {
          alert("records not found");
          this.setState({ startDate: "", endDate: "" })
        }
      }
      else {
        this.setState({ startDate: "", endDate: "" })
        alert(res.data.message);
        this.modelCancel()
        // this.props.modelCancelCallback();
      }
    }
    ).catch(() => {
      alert('No Records Found');
      this.modelCancel()
      // this.props.modelCancelCallback();
    });
  }


  filterAction() {
    this.setState({ flagFilterSalesSumary: true, modalVisible: true })
  }

  modelCancel() {
    this.setState({ flagFilterSalesSumary: false, modalVisible: false })
  }

  clearFilterAction() {
    this.setState({
      filterActive: false, flagFilterSalesSumary: false, modalVisible: false, startDate: "", endDate: "", dsList: []
    })
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
        <Appbar>
          <Appbar.Content title="Sales Summary" />
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
              style={{ marginRight: 10 }}
              onPress={() => this.filterAction()}
            />
          }
        </Appbar>

        <FlatList
          data={this.state.dsList}
          scrollEnabled={true}
          ListEmptyComponent={<Text style={emptyTextStyle}>&#9888; {I18n.t("Results not loaded")}</Text>}
          renderItem={({ item, index }) => {
            if (index === 0) {
              return <View style={scss.flatListContainer}>
                <View style={scss.flatListSubContainer}>
                  <View style={scss.textContainer}>
                    <Text style={[scss.highText, { textAlign: 'left' }]} >{I18n.t("TRANSACTION")}: {"\n"}{item.transction} </Text>
                    <Text style={[scss.textStyleLight, { textAlign: 'right' }]}>{I18n.t("TOTAL MRP")}: {"\n"}<Text style={scss.textStyleMedium}>₹ {item.totalMrp}</Text></Text>
                  </View>
                  <View style={scss.textContainer}>
                    <Text style={[scss.textStyleLight, { textAlign: 'left' }]}>{I18n.t("PROMO OFFER")}: {"\n"}<Text style={scss.textStyleMedium}>₹ {item.totalDiscount}</Text></Text>
                    <Text style={[scss.textStyleLight, { textAlign: 'right' }]}>{I18n.t("INVOICE AMOUNT")}: {"\n"}<Text style={scss.textStyleMedium}>₹ {item.billValue}</Text></Text>
                  </View>
                </View>
              </View>;
            }
            if (index === 1) {
              return <View style={scss.flatListContainer} >
                <View style={scss.flatListSubContainer}>
                  <View style={scss.textContainer}>
                    <Text style={[scss.highText, { textAlign: 'left' }]} >{I18n.t("TRANSACTION")}: {"\n"}{item.transction} </Text>
                    <Text style={[scss.textStyleLight, { textAlign: 'right' }]}>TOTAL MRP: {"\n"}<Text style={scss.textStyleMedium}>₹ {item.totalMrp}</Text></Text>
                  </View>
                  <View style={scss.textContainer}>
                    <Text style={[scss.textStyleLight, { textAlign: 'left' }]}>{I18n.t("PROMO OFFER")}: {"\n"}<Text style={scss.textStyleMedium}>₹ {item.totalDiscount}</Text></Text>
                    <Text style={[scss.textStyleLight, { textAlign: 'right' }]}>{I18n.t("INVOICE AMOUNT")}: {"\n"}<Text style={scss.textStyleMedium}>₹ {item.billValue}</Text></Text>
                  </View>
                </View>
              </View>;
            }

          }}
        />

        {this.state.totMrp !== null &&
          <View style={[scss.flatListContainer, { backgroundColor: color.accent }]}>
            <View style={scss.flatListSubContainer}>
              <View style={scss.textContainer}>
                <Text style={[scss.textStyleMedium, { color: color.white, textAlign: 'left' }]} >{I18n.t("TOTAL MRP")}: {"\n"}₹ {this.state.totMrp} </Text>
                <Text style={[scss.textStyleMedium, { color: color.white, textAlign: 'right' }]}>{I18n.t("TOTAL PROMO OFFER")}:{"\n"}₹ {this.state.totalDiscount}</Text>
              </View>
              <View style={scss.textContainer}>
                <Text style={[scss.textStyleMedium, { color: color.white, textAlign: 'left' }]}>{I18n.t("GRAND TOTAL")}: {"\n"}₹ {this.state.billValue}</Text>
              </View>
            </View>
          </View>
        }

        {this.state.flagFilterSalesSumary && (
          <View>
            <Modal style={{ margin: 0 }} isVisible={this.state.modalVisible}
              onBackButtonPress={() => this.modelCancel()}
              onBackdropPress={() => this.modelCancel()} >
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
                      <TouchableOpacity
                        style={styles.datePickerButton} onPress={() => this.datepickerCancelClicked()}
                      >
                        <Text style={styles.datePickerButtonText}  > Cancel </Text>

                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.datePickerEndButton} onPress={() => this.datepickerDoneClicked()}
                      >
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

                  <View style={forms.action_buttons_container}>
                    <TouchableOpacity style={[forms.action_buttons, forms.submit_btn]}
                      onPress={() => this.applySalesSummary()}>
                      <Text style={forms.submit_btn_text} >{I18n.t("APPLY")}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[forms.action_buttons, forms.cancel_btn]}
                      onPress={() => this.modelCancel()}>
                      <Text style={forms.cancel_btn_text}>{I18n.t("CANCEL")}</Text>
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
    backgroundColor: '#ffffff',
    marginTop: Device.isTablet ? deviceheight - RH(500) : deviceheight - RH(400),
    height: Device.isTablet ? RH(500) : RH(400),
  },
  filterApplyButton: {
    width: deviceWidth - 40,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
    height: Device.isTablet ? 60 : 50,
    backgroundColor: "#ED1C24",
    borderRadius: 5,
  },
  filterButtonText: {
    textAlign: 'center',
    marginTop: 20,
    color: "#ffffff",
    fontSize: Device.isTablet ? 20 : 15,
    fontFamily: "regular"
  },
  filterCancelButton: {
    width: deviceWidth - 40,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
    height: Device.isTablet ? 60 : 50,
    backgroundColor: "#ffffff",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#353C4050",
  },
  filterButtonCancelText: {
    textAlign: 'center',
    marginTop: 20,
    color: "#000000",
    fontSize: Device.isTablet ? 20 : 15
  },
  filterDateButton: {
    width: deviceWidth - 40,
    marginTop: 5,
    marginBottom: 10,
    marginLeft: 20,
    marginRight: 20,
    paddingLeft: 15,
    borderColor: '#8F9EB717',
    borderRadius: 3,
    height: Device.isTablet ? 60 : 50,
    backgroundColor: "#F6F6F6",
    borderRadius: 5,
  },
  filterDateButtonText: {
    marginLeft: 16,
    marginTop: 20,
    color: "#6F6F6F",
    fontSize: Device.isTablet ? 20 : 15
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
  },
  datePickerEndButton: {
    position: 'absolute',
    right: 20,
    top: 10,
    height: Device.isTablet ? 40 : 30,
    backgroundColor: "#ED1C24",
    borderRadius: 5,
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
  flatlistSubContainerTotal_mobile: {
    backgroundColor: '#e4d7d7',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    paddingLeft: 10,
    paddingRight: 10,
    alignItems: 'center',
    height: 140
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
  flatlistSubContainerTotal_tablet: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: '#e4d7d7',
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
  },




});
