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
import FilterIcon from 'react-native-vector-icons/FontAwesome'
import { flatListMainContainer, flatlistSubContainer, highText, textContainer, textStyleLight, textStyleMedium } from '../Styles/Styles';

var deviceWidth = Dimensions.get("window").width;
var deviceheight = Dimensions.get("window").height;

export class ListOfPromotions extends Component {

  constructor(props) {
    super(props);
    this.state = {
      promoId: "",
      flagFilterListPromotions: false,
      modalVisible: true,
      listPromotions: [],
      promoType: '',
      promoStatus: '',
      clientId: null
    };
  }

  async componentDidMount() {
    const clientId = await AsyncStorage.getItem("custom:clientId1");
    this.setState({ clientId: clientId })
  }

  handlePromoId = (value) => {
    this.setState({ promoId: value });
  };

  applyListPromotions() {
    const obj = {
      isActive: this.state.promoStatus,
      applicability: this.state.promoType,
      clientId: this.state.clientId
    };
    var pageNumber = 0
    ReportsService.promotionsList(obj, pageNumber).then((res,err) => {
      console.log(res.data,err);
      if (res.data) {
        this.setState({ listPromotions: res.data.result.content, filterActive: true, modalVisible: false, promoType: '', promoStatus: '' })
      }
      else {
        alert(res.data.message);
        this.setState({ promoType: '', promoStatus: '' })
      }
    }).catch(() => {
      alert('No Records Found');
      this.modelCancel()
      this.setState({ promoType: '', promoStatus: '' })
    });
  }

  filterAction() {
    this.setState({ flagFilterListPromotions: true, modalVisible: true })
  }

  modelCancel() {
    this.setState({ flagFilterListPromotions: false, modalVisible: false })
  }

  handlePromoType = (value) => {
    this.setState({ promoType: value });
  }

  handlePromoStatus = (value) => {
    this.setState({ promoStatus: value });
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
        <Appbar>
          <Appbar.Content title="List Of Promotions" />
          <FilterIcon
            name="sliders"
            size={25}
            onPress={() => this.filterAction()}
          />
        </Appbar>
        <FlatList
          data={this.state.listPromotions}
          scrollEnabled={true}
          keyExtractor={(item, i) => i.toString()}
          ListEmptyComponent={<Text style={{ fontSize: Device.isTablet ? RF(21) : RF(17), fontFamily: 'bold', color: '#000000', textAlign: 'center', marginTop: deviceheight / 3 }}>&#9888; {I18n.t("Results not loaded")}</Text>}
          renderItem={({ item, index }) => (
            <View style={[flatListMainContainer, , { backgroundColor: "#FFF" }]} >
              <View style={flatlistSubContainer}>
                <View style={textContainer}>
                  <Text style={highText} >PROMO ID: {item.promoId}</Text>
                </View>
                <View style={textContainer}>
                  <Text style={textStyleMedium}>PROMO NAME: {"\n"} {item.promotionName}</Text>
                  <Text style={textStyleMedium} >DESCRIPTION: {"\n"}{item.description} </Text>
                </View>
                <View style={textContainer}>
                  <Text style={textStyleMedium}>PROMO APPLY TYPE: {"\n"} {item.promoApplyType}</Text>
                  <Text style={textStyleMedium}>APPLICABILITY: {"\n"} {item.applicability}</Text>
                </View>
              </View>
            </View>
          )}
        />
        {this.state.flagFilterListPromotions && (
          <View>
            <Modal style={{ margin: 0 }} isVisible={this.state.modalVisible}>
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
                  <Text style={styles.headings}>{I18n.t("Promo Type")}</Text>
                  <View style={[Device.isTablet ? styles.rnSelectContainer_tablet : styles.rnSelectContainer_mobile, { width: deviceWidth - RW(40) }]}>
                    <RNPickerSelect
                      placeholder={{
                        label: 'Promo Type', value: ''
                      }}
                      Icon={() => {
                        return <Chevron style={styles.imagealign} size={1.5} color="gray" />;
                      }}
                      items={[{
                        label: "On Barcode",
                        value: "promotionForEachBarcode",
                      },
                      {
                        label: "On WholeBill",
                        value: "promotionForWholeBill",
                      }]}
                      onValueChange={this.handlePromoType}
                      style={Device.isTablet ? pickerSelectStyles_tablet : pickerSelectStyles_mobile}
                      value={this.state.promoType}
                      useNativeAndroidPickerStyle={false}
                    />
                  </View>

                  <Text style={styles.headings}>{I18n.t("Promo Status")}</Text>
                  <View style={[Device.isTablet ? styles.rnSelectContainer_tablet : styles.rnSelectContainer_mobile, { width: deviceWidth - RW(40) }]}>
                    <RNPickerSelect
                      placeholder={{
                        label: 'Promo Status ', value: ''
                      }}
                      Icon={() => {
                        return <Chevron style={styles.imagealign} size={1.5} color="gray" />;
                      }}
                      items={[{
                        label: "Active",
                        value: "true",
                      },
                      {
                        label: "In Active",
                        value: "false",
                      }]}
                      onValueChange={this.handlePromoStatus}
                      style={Device.isTablet ? pickerSelectStyles_tablet : pickerSelectStyles_mobile}
                      value={this.state.promoStatus}
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
  headings: {
    fontSize: Device.isTablet ? 20 : 15,
    marginLeft: 20,
    color: '#B4B7B8',
    marginTop: Device.isTablet ? 10 : 5,
    marginBottom: Device.isTablet ? 10 : 5,
  },
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
    marginTop: Device.isTablet ? deviceheight - RH(500) : deviceheight - RH(400),
    height: Device.isTablet ? RH(500) : RH(400),
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
