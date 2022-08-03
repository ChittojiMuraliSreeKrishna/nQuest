import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { Component } from 'react';
import { Dimensions, FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import DatePicker from 'react-native-date-picker';
import Device from 'react-native-device-detection';
import I18n from 'react-native-i18n';
import CustomerService from '../services/CustomerService';
import { filterCloseImage, filterHeading, filterMainContainer, filterSubContainer } from '../Styles/PopupStyles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { cancelBtn, cancelBtnText, datePicker, datePickerBtnText, datePickerButton1, datePickerButton2, dateSelector, dateText, inputField, inputHeading, submitBtn, submitBtnText } from '../Styles/FormFields';
import { RH, RF, RW } from '../../Responsive';
import { filterBtn, flatListHeaderContainer, flatListMainContainer, flatlistSubContainer, flatListTitle, highText, textContainer, textStyleLight, textStyleMedium } from '../Styles/Styles';
import Modal from 'react-native-modal'
import AddGiftVoucher from './AddGiftVoucher'

var deviceheight = Dimensions.get('window').height;
var deviceheight = Dimensions.get('window').height;
var deviceWidth = Dimensions.get("window").width;

class GiftVocher extends Component {

  constructor(props) {
    super(props);
    this.state = {
      gvNumber: '',
      description: '',
      giftValue: '',
      datepickerOpen: false,
      datepickerendOpen: false,
      date: new Date(),
      enddate: new Date(),
      fromDate: "",
      startDate: "",
      endDate: "",
      toDate: "",
      giftVochersList: [],
    };
  }

  async componentDidMount() {
    this.getGiftVocherList();
  }

  getGiftVocherList() {
    axios.get(CustomerService.getGiftVocher()).then(res => {
      if (res) {
        console.log(res.data);
        if (res.data.result != "Record not found") {
          this.setState({ giftVochersList: res.data.result, isGiftVocher: true });
        }
      }
    });
  }

  datepickerClicked() {
    this.setState({ datepickerOpen: true });
  }

  enddatepickerClicked() {
    this.setState({ datepickerendOpen: true });
  }

  handleMobile = (value) => {
    this.setState({ mobile: value });
  };

  datepickerDoneClicked() {
    // if (parseInt(this.state.date.getDate()) < 10) {
    //     this.setState({ fromDate: this.state.date.getFullYear() + "-" + (this.state.date.getMonth() + 1) + "-0" + this.state.date.getDate() });
    // }
    // else {
    this.setState({ startDate: this.state.date.getFullYear() + "-" + (this.state.date.getMonth() + 1) + "-" + this.state.date.getDate() });
    // }

    this.setState({ doneButtonClicked: true, datepickerOpen: false, datepickerendOpen: false });
  }

  datepickerendDoneClicked() {
    // if (parseInt(this.state.enddate.getDate()) < 10) {
    //     this.setState({ toDate: this.state.enddate.getFullYear() + "-" + (this.state.enddate.getMonth() + 1) + "-0" + this.state.enddate.getDate() });
    // }
    // else {
    this.setState({ endDate: this.state.enddate.getFullYear() + "-" + (this.state.enddate.getMonth() + 1) + "-" + this.state.enddate.getDate() });
    // }
    this.setState({ enddoneButtonClicked: true, datepickerOpen: false, datepickerendOpen: false });
  }


  datepickerCancelClicked() {
    this.setState({ date: new Date(), enddate: new Date(), datepickerOpen: false, datepickerendOpen: false });
  }

  handleGvNumber(text) {
    this.setState({ gvNumber: text });
  }

  handleDescription(text) {
    this.setState({ description: text });
  }

  handleValue(text) {
    this.setState({ giftValue: text });
  }

  async addGiftVocher() {
    if (this.state.gvNumber === "") {
      alert("Please Enter GV Number");
    } else if (this.state.startDate === "") {
      alert("Please Select the Start Date");
    } else if (this.state.endDate === "") {
      alert("Please Select the End Date");
    } else if (this.state.giftValue === "") {
      alert("Please Enter the Gift Value");
    }
    else {

      const clientId = await AsyncStorage.getItem("custom:clientId1");
      this.setState({ clientId: clientId });
      // const user = AsyncStorage.getItem("username");
      const obj = {
        "gvNumber": this.state.gvNumber,
        "description": this.state.description,
        "fromDate": this.state.date,
        "toDate": this.state.enddate,
        "clientId": this.state.clientId,
        "value": this.state.giftValue
      };
      console.log(obj);
      axios.post(CustomerService.saveGiftVocher(), obj).then(res => {
        if (res && res.data.isSuccess === "true") {
          this.setState({
            gvNumber: '',
            description: '',
            giftValue: '',
            datepickerOpen: false,
            datepickerendOpen: false,
            date: new Date(),
            enddate: new Date(),
            fromDate: "",
            startDate: "",
            endDate: "",
            toDate: "",
            giftVochersList: [],
            filterVouchersData: [],
            modalVisible: true,
            flagGiftVoucherAdd: false,
            flagFilterOpen: false
          });
          this.getGiftVocherList();
          console.log(res.data);
        }
        alert(res.data.message);
      });
    }
  }

  // Modal Flags

  flagAddGiftVoucher() {
    this.setState({ flagGiftVoucherAdd: true, modalVisible: true })
  }

  filterAction() {
    this.setState({ flagFilterOpen: true, modalVisible: true })
  }

  modelCancel() {
    this.setState({ modalVisible: false })
  }

  applyVoucherFilter() {
    const { startDate, endDate, gvNumber } = this.state
    const obj = {
      fromDate: startDate ? startDate : undefined,
      toDate: endDate ? endDate : undefined,
      gvNumber: gvNumber ? gvNumber : undefined
    }
    CustomerService.searchGiftVoucher(obj).then((res) => {
      this.setState({ filterVouchersData: res.data.result, filterActive: true })
    })
  }



  render() {
    return (
      <View>
        {this.state.flagFilterOpen &&
          <View>
            <Modal style={{ margin: 0 }} isVisible={this.state.modalVisible}>
              <View style={filterMainContainer}>
                <View style={filterSubContainer}>
                  <View>
                    <Text style={filterHeading}>Filter By</Text>
                  </View>
                  <View>
                    <TouchableOpacity style={filterCloseImage} onPress={() => this.modelCancel()}>
                      <Image style={{ margin: RH(5) }} source={require('../assets/images/modelcancel.png')} />
                    </TouchableOpacity>
                  </View>
                </View>
                <Text style={styles.spaceText}></Text>
                <KeyboardAwareScrollView enableOnAndroid={true}>
                  <TouchableOpacity
                    style={dateSelector}
                    testID="openModal"
                    onPress={() => this.datepickerClicked()}
                  >
                    <Text
                      style={dateText}
                    >{this.state.startDate === "" ? 'Start Date' : this.state.startDate}</Text>
                    <Image style={styles.calenderpng} source={require('../assets/images/calender.png')} />
                  </TouchableOpacity>
                  {this.state.datepickerOpen && (
                    <View style={styles.dateTopView}>
                      <View style={styles.dateTop2}>
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
                    <Image style={styles.calenderpng} source={require('../assets/images/calender.png')} />
                  </TouchableOpacity>

                  {this.state.datepickerendOpen && (
                    <View style={styles.dateTopView}>
                      <View style={styles.dateTop2}>
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
                    placeholder={('GV Number')}
                    style={inputField}
                    placeholderTextColor="#6f6f6f60"
                    textAlignVertical="center"
                    keyboardType={'default'}
                    autoCapitalize='none'
                    value={this.state.gvNumber}
                    onChangeText={(text) => this.handleGvNumber(text)}
                  />
                </KeyboardAwareScrollView>
                <TouchableOpacity style={submitBtn}
                  onPress={() => this.applyVoucherFilter()}>
                  <Text style={submitBtnText} >{I18n.t("APPLY")}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={cancelBtn}
                  onPress={() => this.modelCancel()}>
                  <Text style={cancelBtnText}>{I18n.t("CANCEL")}</Text>
                </TouchableOpacity>
              </View>
            </Modal>
          </View>
        }
        <View>
          <Text style={flats.titleStyle}>{I18n.t('Generate Gift Voucher')}</Text>
          <View>
            <TextInput
              style={inputField}
              placeholder={('GV NUMBER *')}
              placeholderTextColor="#6f6f6f60"
              textAlignVertical="center"
              keyboardType={'default'}
              autoCapitalize='none'
              value={this.state.gvNumber}
              onChangeText={(text) => this.handleGvNumber(text)}
            />
            <TextInput
              style={inputField}
              placeholder={I18n.t('DESCRIPTION')}
              placeholderTextColor="#6f6f6f60"
              textAlignVertical="center"
              keyboardType={'default'}
              autoCapitalize='none'
              value={this.state.description}
              onChangeText={(text) => this.handleDescription(text)}
            />
            <TouchableOpacity
              style={dateSelector}
              testID="openModal"
              onPress={() => this.datepickerClicked()}
            >
              <Text
                style={dateText}
              >{this.state.startDate === "" ? 'Start Date' : this.state.startDate}</Text>
              <Image style={styles.calenderpng} source={require('../assets/images/calender.png')} />
            </TouchableOpacity>
            {this.state.datepickerOpen && (
              <View style={styles.dateTopView}>
                <View style={styles.dateTop2}>
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
              <Image style={styles.calenderpng} source={require('../assets/images/calender.png')} />
            </TouchableOpacity>

            {this.state.datepickerendOpen && (
              <View style={styles.dateTopView}>
                <View style={styles.dateTop2}>
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
            <View >
              <TextInput
                style={inputField}
                placeholder={I18n.t('GIFT VALUE *')}
                placeholderTextColor="#6f6f6f60"
                textAlignVertical="center"
                keyboardType={'default'}
                autoCapitalize='none'
                value={this.state.giftValue}
                onChangeText={(text) => this.handleValue(text)}
              />
              <TouchableOpacity
                style={submitBtn}
                onPress={() => this.addGiftVocher()}
              >
                <Text style={submitBtnText}>{I18n.t("Add Gift Voucher")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <FlatList
          ListHeaderComponent={<View style={flatListHeaderContainer}>
            <Text style={flatListTitle}>{I18n.t('Gift Vouchers')}</Text>
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
          data={this.state.filterActive ? this.state.filterVouchersData : this.state.giftVochersList}
          scrollEnabled={true}
          renderItem={({ item, index }) => (
            <View style={flatListMainContainer} >
              <View style={flatlistSubContainer}>
                <View style={textContainer}>
                  <Text style={highText}>S.NO: {index + 1}</Text>
                  <Text style={textStyleMedium}>{I18n.t("VALUE")}: {item.value}</Text>
                </View>
                <View style={textContainer}>
                  <Text style={textStyleMedium} selectable={true}>GV NUMBER: {item.gvNumber}</Text>
                  {item.isActivated &&
                    <Text style={[textStyleMedium, { backgroundColor: '#009900', color: '#ffffff', padding: 5, alignSelf: 'flex-start', borderRadius: Device.isTablet ? 10 : 5, fontFamily: 'medium' }]}>{I18n.t("Active")} </Text>
                  }
                  {!item.isActivated &&
                    <Text style={[textStyleMedium, { backgroundColor: '#ee0000', color: '#ffffff', padding: 5, alignSelf: 'flex-start', borderRadius: 5, fontFamily: 'medium' }]}>{I18n.t("In-Active")}</Text>
                  }
                </View>
                <View style={textContainer}>
                  <Text style={textStyleLight}>{I18n.t("FROM DATE")}: {item.fromDate}</Text>
                  <Text style={textStyleLight}>{I18n.t("TO DATE")}: {item.toDate}</Text>
                </View>
              </View>
            </View>
          )}

        />
      </View>

    );
  }
}

export default GiftVocher;

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

  titleStyle: {
    fontSize: RF(15),
    fontFamily: 'medium',
    color: '#00000090',
    margin: 10
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
  },


});

const styles = StyleSheet.create({
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

  logoImage: {
    alignSelf: 'center',
    width: 300,
    height: 230,

  },
  containerForActivity: {
    flex: 1,
    backgroundColor: '#623FA0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: 'white',
    fontSize: 20,
    margin: 20
  },
  imagealign: {
    marginTop: 40,
    marginRight: 10,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    height: deviceheight + 40,
    backgroundColor: '#FFFFFF'
  },
  ytdImageValue: {
    alignSelf: 'center',
  },
  loading: {
    flex: 1,
    justifyContent: 'center'
    // alignItems: 'center',
  },

  // Mobile Styles
  hederText_mobile: {
    color: "#353C40",
    fontSize: 20,
    fontFamily: "bold",
    marginLeft: 10,
    marginTop: 10,
    flexDirection: 'column',
    justifyContent: 'center',
    fontSize: 28,
  },
  headerText2_mobile: {
    color: "#353C40",
    fontSize: 20,
    fontFamily: "bold",
    marginLeft: 10,
    marginTop: 0,
    flexDirection: 'column',
    justifyContent: 'center',
    height: 45,
    fontSize: 28,
  },
  bottomImage_mobile: {
    position: 'absolute',
    right: 0,
    bottom: 40,
    width: 162,
    height: 170
  },
  input_mobile: {
    justifyContent: 'center',
    marginLeft: 20,
    marginRight: 20,
    height: 44,
    marginTop: 5,
    marginBottom: 5,
    borderColor: '#8F9EB717',
    borderRadius: 3,
    backgroundColor: '#FBFBFB',
    borderWidth: 1,
    fontFamily: 'regular',
    paddingLeft: 15,
    fontSize: 14,
  },
  signInButton_mobile: {
    backgroundColor: '#ED1C24',
    justifyContent: 'center',
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10,
    marginBottom: 10,
    width: deviceWidth - 40,
    height: 50,
    borderRadius: 10,
    fontWeight: 'bold',
    // marginBottom:100,
  },
  signInButtonText_mobile: {
    color: 'white',
    alignSelf: 'center',
    fontSize: 15,
    fontFamily: "regular",
  },
  navigationText_mobile: {
    fontSize: 16,
    color: '#858585',
    fontFamily: "regular",
  },
  navigationButtonText_mobile: {
    color: '#353C40',
    fontSize: 16,
    fontFamily: "bold",
    textDecorationLine: 'underline'
  },
  rnSelect_mobile: {
    color: '#8F9EB7',
    fontSize: 15
  },
  rnSelectContainer_mobile: {
    justifyContent: 'center',
    height: 44,
    marginTop: 5,
    marginBottom: 10,
    marginLeft: 20,
    marginRight: 20,
    paddingLeft: 15,
    borderColor: '#8F9EB717',
    borderRadius: 3,
    backgroundColor: '#FBFBFB',
    borderWidth: 1,
    fontFamily: 'regular',
    fontSize: 14,
  },
  filterDateButton_mobile: {
    width: deviceWidth - 40,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 5,
    marginBottom: 5,
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

  // Tablet Styles
  headerText_tablet: {
    color: "#353C40",
    fontSize: 40,
    fontFamily: "bold",
    marginLeft: 10,
    marginTop: 10,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  headerText2_tablet: {
    color: "#353C40",
    fontSize: 40,
    fontFamily: "bold",
    marginLeft: 10,
    marginTop: 0,
    flexDirection: 'column',
    justifyContent: 'center',
    height: 55,
  },
  bottomImage_tablet: {
    position: 'absolute',
    right: 0,
    bottom: 40,
    width: 202,
    height: 230
  },
  input_tablet: {
    justifyContent: 'center',
    marginLeft: 20,
    marginRight: 20,
    height: 60,
    marginTop: 5,
    marginBottom: 10,
    borderColor: '#8F9EB717',
    borderRadius: 3,
    backgroundColor: '#FBFBFB',
    borderWidth: 1,
    fontFamily: 'regular',
    paddingLeft: 15,
    fontSize: 22,
  },
  signInButton_tablet: {
    backgroundColor: '#ED1C24',
    justifyContent: 'center',
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10,
    marginBottom: 10,
    width: deviceWidth - 40,
    height: 60,
    borderRadius: 10,
    fontWeight: 'bold',
    // marginBottom:100,
  },
  signInButtonText_tablet: {
    color: 'white',
    alignSelf: 'center',
    fontSize: 20,
    fontFamily: "regular",
  },
  navigationText_tablet: {
    fontSize: 22,
    color: '#858585',
    fontFamily: "regular",
  },
  navigationButtonText_tablet: {
    color: '#353C40',
    fontSize: 22,
    fontFamily: "bold",
    textDecorationLine: 'underline'
  },
  rnSelect_tablet: {
    color: '#8F9EB7',
    fontSize: 20
  },
  rnSelectContainer_tablet: {
    justifyContent: 'center',
    height: 54,
    marginTop: 5,
    marginBottom: 10,
    marginLeft: 20,
    marginRight: 20,
    paddingLeft: 15,
    borderColor: '#8F9EB717',
    borderRadius: 3,
    backgroundColor: '#FBFBFB',
    borderWidth: 1,
    fontFamily: 'regular',
    fontSize: 20,
  },
  filterDateButton_tablet: {
    width: deviceWidth / 2.4,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10,
    marginBottom: 10,
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
});;
