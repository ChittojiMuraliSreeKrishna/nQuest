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
import RNPickerSelect from 'react-native-picker-select';
import { Chevron } from 'react-native-shapes';
import { RF, RH, RW } from '../../Responsive';
import ReportsService from '../services/ReportsService';
var deviceWidth = Dimensions.get("window").width;
var deviceheight = Dimensions.get("window").height;

export class ListOfPromotions extends Component {

  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
      enddate: new Date(),
      startDate: "",
      endDate: "",
      fromDate: "",
      toDate: "",

      promoId: "",
      sotres: [],
      selectedStore: "",
      storeId: 0,
      storeName: "",
    };
  }

  componentDidMount() {
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

  handleSelectStores = (value) => {
    this.setState({ selectedStore: value });
  };

  handlePromoId = (value) => {
    this.setState({ promoId: value });
  };

  applyListPromotions() {
    if (this.state.startDate === "") {
      this.state.startDate = null;
    }
    if (this.state.endDate === "") {
      this.state.endDate = null;
    }
    if (this.state.promoId === "") {
      this.state.promoId = null;
    }


    const obj = {
      // "startDate":this.state.startDate,
      // "endDate":this.state.endDate,
      // storeName: this.state.storeName,
      // "promoId":this.state.promoId,
      "startDate": "2021-11-01",
      "endDate": "2021-10-10",
      "storeName": "Km-Patny",
      "promoId": 1
    };
    console.log('params are' + JSON.stringify(obj));
    axios.post(ReportsService.promotionsList(), obj).then((res) => {
      console.log(res.data);
      if (res.data && res.data["isSuccess"] === "true") {
        this.props.childParamlistofPromotions(res.data.result);
        this.props.filterActiveCallback();
        this.props.modelCancelCallback();
      }
      else {
        alert(res.data.message);
      }
    }
    ).catch(() => {
      this.setState({ loading: false });
      alert('No Results Found');
      this.props.modelCancelCallback();
    });
  }

  modelCancel() {
    this.props.modelCancelCallback();
  }

  render() {
    return (
      <View>
        <Appbar>
          <Appbar.Content title="List Of Promotions" />
        </Appbar>
        <FlatList
          data={this.props.listPromotions}
          style={{ marginTop: 20 }}
          scrollEnabled={true}
          keyExtractor={(item, i) => i.toString()}
          ListEmptyComponent={<Text style={{ fontSize: Device.isTablet ? RF(21) : RF(17), fontFamily: 'bold', color: '#000000', textAlign: 'center', marginTop: deviceheight / 3 }}>&#9888; {I18n.t("Results not loaded")}</Text>}
          renderItem={({ item, index }) => (
            <View style={Device.isTablet ? flats.flatlistContainer_tablet : flats.flatlistContainer_mobile} >
              <View style={Device.isTablet ? flats.flatlistSubContainer_tablet : flats.flatlistSubContainer_mobile}>
                <View style={flats.text}>
                  <Text style={Device.isTablet ? flats.flatlistTextAccent_tablet : flats.flatlistTextAccent_mobile} >PROMO ID: {index + 1} </Text>
                  <Text style={Device.isTablet ? flats.flatlistText_tablet : flats.flatlistText_mobile}>PROMO NAME: {"\n"} { }</Text>
                  <Text style={Device.isTablet ? flats.flatlistTextCommon_tablet : flats.flatlistTextCommon_mobile}>BARCODE STORE: {"\n"} { } </Text>
                </View>
                <View style={flats.text}>
                  <Text style={Device.isTablet ? flats.flatlistTextCommon_tablet : flats.flatlistTextCommon_mobile} >DESCRIPTION: { } </Text>
                  <Text style={Device.isTablet ? flats.flatlistTextCommon_tablet : flats.flatlistTextCommon_mobile}>START DATE: {"\n"} { }</Text>
                  <Text style={Device.isTablet ? flats.flatlistTextCommon_tablet : flats.flatlistTextCommon_mobile}>END DATE: {"\n"} { }</Text>
                </View>
              </View>
            </View>
          )}
        />
        {this.props.flagFilterListPromotions && (
          <View>
            <Modal style={{ margin: 0 }} isVisible={this.props.modalVisible}>
              <View style={styles.filterMainContainer} >
                <View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5, height: Device.isTablet ? 60 : 50 }}>
                    <View>
                      <Text style={{ marginTop: 15, fontSize: Device.isTablet ? 22 : 17, marginLeft: 20 }} > Filter by </Text>
                    </View>
                    <View>
                      <TouchableOpacity style={{ width: Device.isTablet ? 60 : RW(50), height: Device.isTablet ? 60 : RW(50), marginTop: Device.isTablet ? 20 : RH(15), }} onPress={() => this.modelCancel()}>
                        <Image style={{ margin: RH(5) }} source={require('../assets/images/modelcancel.png')} />
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
                  <TouchableOpacity
                    style={Device.isTablet ? styles.filterDateButton_tablet : styles.filterDateButton_mobile}
                    testID="openModal"
                    onPress={() => this.datepickerClicked()}
                  >
                    <Text
                      style={Device.isTablet ? styles.filterDateButtonText_tablet : styles.filterDateButtonText_mobile}
                    >{this.state.startDate == "" ? 'START DATE' : this.state.startDate}</Text>
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
                      <DatePicker style={{ width: deviceWidth, height: RH(200), marginTop: RH(50), }}
                        date={this.state.date}
                        mode={'date'}
                        onDateChange={(date) => this.setState({ date })}
                      />
                    </View>
                  )}
                  <TouchableOpacity
                    style={Device.isTablet ? styles.filterDateButton_tablet : styles.filterDateButton_mobile}
                    testID="openModal"
                    onPress={() => this.enddatepickerClicked()}
                  >
                    <Text
                      style={Device.isTablet ? styles.filterDateButtonText_tablet : styles.filterDateButtonText_mobile}
                    >{this.state.endDate == "" ? 'END DATE' : this.state.endDate}</Text>
                    <Image style={{ position: 'absolute', top: RH(10), right: 0, }} source={require('../assets/images/calender.png')} />
                  </TouchableOpacity>
                  {this.state.datepickerendOpen && (
                    <View style={{ height: RH(280), width: deviceWidth, backgroundColor: '#ffffff' }}>
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
                      <DatePicker style={{ width: deviceWidth, height: RH(200), marginTop: RH(50), }}
                        date={this.state.enddate}
                        mode={'date'}
                        onDateChange={(enddate) => this.setState({ enddate })}
                      />
                    </View>
                  )}
                  <TextInput
                    style={[Device.isTablet ? styles.input_tablet : styles.input_mobile, { width: deviceWidth - RW(40) }]}
                    underlineColorAndroid="transparent"
                    placeholder="PROMO ID"
                    placeholderTextColor="#6F6F6F"
                    textAlignVertical="center"
                    autoCapitalize="none"
                    value={this.state.promoId}
                    onChangeText={this.handlePromoId}
                  />
                  <View style={[Device.isTablet ? styles.rnSelectContainer_tablet : styles.rnSelectContainer_mobile, { width: deviceWidth - RW(40) }]}>
                    <RNPickerSelect
                      placeholder={{
                        label: 'SELECT STORE'
                      }}
                      Icon={() => {
                        return <Chevron style={styles.imagealign} size={1.5} color="gray" />;
                      }}
                      items={this.state.sotres}
                      onValueChange={this.handleSelectStores}
                      style={Device.isTablet ? pickerSelectStyles_tablet : pickerSelectStyles_mobile}
                      value={this.state.selectedStore}
                      useNativeAndroidPickerStyle={false}
                    />
                  </View>
                  <TouchableOpacity style={Device.isTablet ? styles.filterApplyButton_tablet : styles.filterApplyButton_mobile}
                    onPress={() => this.applyListPromotions()}>
                    <Text style={Device.isTablet ? styles.filterButtonText_tablet : styles.filterButtonText_mobile} >APPLY</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={Device.isTablet ? styles.filterCancelButton_tablet : styles.filterCancelButton_mobile}
                    onPress={() => this.modelCancel()}>
                    <Text style={Device.isTablet ? styles.filterButtonCancelText_tablet : styles.filterButtonCancelText_mobile}>CANCEL</Text>
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
    fontSize: RF(15),
  },
  inputIOS: {
    justifyContent: 'center',
    height: RH(42),
    borderRadius: 3,
    borderWidth: 1,
    fontFamily: 'regular',
    //paddingLeft: -20,
    fontSize: RF(15),
    borderColor: '#FBFBFB',
    backgroundColor: '#FBFBFB',
  },

  inputAndroid: {
    justifyContent: 'center',
    height: RH(42),
    borderRadius: 3,
    borderWidth: 1,
    fontFamily: 'regular',
    //paddingLeft: -20,
    fontSize: RF(15),
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
    fontSize: RF(20),
  },
  inputIOS: {
    justifyContent: 'center',
    height: RH(52),
    borderRadius: 3,
    borderWidth: 1,
    fontFamily: 'regular',
    //paddingLeft: -20,
    fontSize: RF(20),
    borderColor: '#FBFBFB',
    backgroundColor: '#FBFBFB',
  },
  inputAndroid: {
    justifyContent: 'center',
    height: RH(52),
    borderRadius: 3,
    borderWidth: 1,
    fontFamily: 'regular',
    //paddingLeft: -20,
    fontSize: RF(20),
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
    marginTop: Device.isTablet ? RH(25) : RH(20),
    marginRight: Device.isTablet ? RW(30) : RW(20),
  },
  modelCloseImage: {
    fontFamily: 'regular',
    fontSize: RF(12),
    position: 'absolute',
    top: RH(10),
    right: Device.isTablet ? RW(15) : RW(30),
  },
  filterMainContainer: {
    // marginLeft: -40,
    // marginRight: -40,
    // paddingLeft: Device.isTablet ? 0 : 20,
    backgroundColor: '#ffffff',
    marginTop: Device.isTablet ? deviceheight - RH(550) : deviceheight - RH(450),
    height: Device.isTablet ? RH(550) : RH(450),
  },
  // Styles For Mobile

  filterMainContainer_mobile: {
    width: deviceWidth,
    alignItems: 'center',
    marginLeft: -RW(20),
    backgroundColor: "#ffffff",
    height: RH(400),
    position: 'absolute',
    bottom: -RH(20),
  },
  filterByTitle_mobile: {
    position: 'absolute',
    left: RW(20),
    top: RH(15),
    width: RW(300),
    height: RH(20),
    fontFamily: 'medium',
    fontSize: RF(16),
    color: '#353C40'
  },
  filterByTitleDecoration_mobile: {
    height: Device.isTablet ? 2 : 1,
    width: deviceWidth,
    backgroundColor: 'lightgray',
    marginTop: RH(50),
  },
  filterCloseButton_mobile: {
    position: 'absolute',
    right: RW(8),
    top: RH(15),
    width: RW(50), height: RH(50),
  },
  filterDateButton_mobile: {
    width: deviceWidth - RW(40),
    marginTop: RH(5),
    marginBottom: RH(10),
    marginLeft: RW(20),
    marginRight: RW(20),
    paddingLeft: RW(15),
    borderColor: '#8F9EB717',
    borderRadius: 3,
    height: RH(50),
    backgroundColor: "#F6F6F6",
    borderRadius: 5,
  },
  filterDateButtonText_mobile: {
    marginLeft: RW(16),
    marginTop: RH(20),
    color: "#6F6F6F",
    fontSize: RF(15),
    fontFamily: "regular"
  },
  datePickerContainer_mobile: {
    height: RH(280),
    width: deviceWidth,
    backgroundColor: '#ffffff'
  },
  datePickerButton_mobile: {
    position: 'absolute',
    left: RW(20),
    top: RH(10),
    height: RH(30),
    backgroundColor: "#ED1C24",
    borderRadius: 5,
  },
  datePickerEndButton_mobile: {
    position: 'absolute',
    right: RW(20),
    top: RH(10),
    height: RH(30),
    backgroundColor: "#ED1C24",
    borderRadius: 5,
  },
  datePickerButtonText_mobile: {
    textAlign: 'center',
    marginTop: RH(5),
    color: "#ffffff",
    fontSize: RF(15),
    fontFamily: "regular"
  },
  input_mobile: {
    justifyContent: 'center',
    marginLeft: RW(20),
    marginRight: RW(20),
    height: RH(44),
    marginTop: 5,
    marginBottom: RH(10),
    borderColor: '#8F9EB717',
    borderRadius: 3,
    backgroundColor: '#FBFBFB',
    borderWidth: 1,
    fontFamily: 'regular',
    paddingLeft: RW(15),
    fontSize: RF(14),
  },
  filterCloseImage_mobile: {
    color: '#ED1C24',
    fontFamily: 'regular',
    fontSize: RF(12),
    position: 'absolute',
    top: RH(10),
    right: 0,
  },
  filterApplyButton_mobile: {
    width: deviceWidth - RW(40),
    marginLeft: RW(20),
    marginRight: RW(20),
    marginTop: RH(20),
    height: RH(50),
    backgroundColor: "#ED1C24",
    borderRadius: 5,
  },
  filterButtonText_mobile: {
    textAlign: 'center',
    marginTop: RH(20),
    color: "#ffffff",
    fontSize: RF(15),
    fontFamily: "regular"
  },
  filterCancelButton_mobile: {
    width: deviceWidth - RF(40),
    marginLeft: RW(20),
    marginRight: RW(20),
    marginTop: RH(20),
    height: RH(50),
    backgroundColor: "#ffffff",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#353C4050",
  },
  filterButtonCancelText_mobile: {
    textAlign: 'center',
    marginTop: RH(20),
    color: "#000000",
    fontSize: RF(15),
    fontFamily: "regular"
  },
  rnSelect_mobile: {
    color: '#8F9EB7',
    fontSize: RF(15)
  },
  rnSelectContainer_mobile: {
    justifyContent: 'center',
    margin: RH(20),
    height: RH(44),
    marginTop: 5,
    marginBottom: RH(10),
    borderColor: '#8F9EB717',
    borderRadius: 3,
    backgroundColor: '#FBFBFB',
    borderWidth: 1,
    fontFamily: 'regular',
    paddingLeft: RW(15),
    fontSize: RF(14),
  },

  // Styles For Tablet
  filterMainContainer_tablet: {
    width: deviceWidth,
    alignItems: 'center',
    marginLeft: -40,
    backgroundColor: "#ffffff",
    height: 500,
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
    width: 60, height: 60,
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
    height: RH(150),
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
    paddingLeft: RW(10),
    paddingRight: RW(10),
    alignItems: 'center',
    height: RH(140)
  },
  flatlistTextAccent_mobile: {
    fontFamily: 'medium',
    fontSize: RF(16),
    color: '#ED1C24'
  },
  flatlistText_mobile: {
    fontFamily: 'regular',
    fontSize: RF(12),
    color: '#353c40'
  },
  flatlistTextCommon_mobile: {
    fontFamily: 'regular',
    fontSize: RF(12),
    color: '#808080'
  },
  editButton_mobile: {
    width: RW(30),
    height: RH(30),
    borderBottomLeftRadius: 5,
    borderTopLeftRadius: 5,
    borderWidth: 1,
    borderColor: "lightgray",
    // borderRadius:5,
  },
  deleteButton_mobile: {
    width: RW(30),
    height: RH(30),
    borderBottomRightRadius: 5,
    borderTopRightRadius: 5,
    borderWidth: 1,
    borderColor: "lightgray",
  },


  // flats for Tablet
  flatlistContainer_tablet: {
    height: RH(200),
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
    paddingLeft: RW(20),
    paddingRight: RH(20),
    alignItems: 'center',
    height: RH(160)
  },
  flatlistTextAccent_tablet: {
    fontFamily: 'medium',
    fontSize: RF(21),
    color: '#ED1C24'
  },
  flatlistText_tablet: {
    fontFamily: 'regular',
    fontSize: RF(21),
    color: '#353c40'
  },
  flatlistTextCommon_tablet: {
    fontFamily: 'regular',
    fontSize: RF(17),
    color: '#808080'
  },
  flatlstTextCommon_tablet: {
    fontFamily: 'regular',
    fontSize: RF(17),
    color: '#808080'
  },
  editButton_tablet: {
    width: RW(50),
    height: RH(50),
    borderBottomLeftRadius: 5,
    borderTopLeftRadius: 5,
    borderWidth: 1,
    borderColor: "lightgray",
    // borderRadius:5,
  },
  deleteButton_tablet: {
    width: RW(50),
    height: RH(50),
    borderBottomRightRadius: 5,
    borderTopRightRadius: 5,
    borderWidth: 1,
    borderColor: "lightgray",
  },




});
