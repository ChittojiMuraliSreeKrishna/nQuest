import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { Component } from 'react';
import { Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
import { color } from '../Styles/colorStyles';
import { Searchbar, TextInput } from 'react-native-paper';
import { customerErrorMessages } from '../Errors/errors';
import Message from '../Errors/Message';

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
      flagFilterOpen: false,
      filterActive: false,
      searchQuery: '',
      errors: {},
      gvNumberValid: true,
      startDateValid: true,
      endDateValid: true,
      giftValueValid: true,
      searchQueryValid: true,
      searchQueryError: ''
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

  validationForm() {
    let isFormValid = true;
    let errors = {};

    if (this.state.gvNumber === '') {
      isFormValid = false;
      errors["gvNumber"] = customerErrorMessages.gvNumber;
      this.setState({ gvNumberValid: false });
    }
    if (this.state.startDate === '') {
      isFormValid = false;
      errors["startDate"] = customerErrorMessages.startDate;
      this.setState({ startDateValid: false });
    }
    if (this.state.endDate === '') {
      isFormValid = false;
      errors["endDate"] = customerErrorMessages.endDate;
      this.setState({ endDateValid: false });
    }
    if (this.state.giftValue === "") {
      isFormValid = false;
      errors["giftValue"] = customerErrorMessages.giftValue;
      this.setState({ giftValueValid: false });
    }
    this.setState({ errors: errors });
    return isFormValid;
  }

  async addGiftVocher() {
    const isFormValid = this.validationForm();
    if (isFormValid) {
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
  }

  // Modal Flags

  flagAddGiftVoucher() {
    this.setState({ flagGiftVoucherAdd: true, modalVisible: true })
  }

  filterAction() {
    this.setState({ flagFilterOpen: true, modalVisible: true, filterActive: true })
  }

  modelCancel() {
    this.setState({ modalVisible: false })
  }

  applyVoucherFilter() {
    const { startDate, endDate, gvNumber ,searchQuery} = this.state
    const obj = {
      fromDate: startDate ? startDate : undefined,
      toDate: endDate ? endDate : undefined,
      gvNumber: gvNumber ? gvNumber : searchQuery?searchQuery:undefined
    }
    CustomerService.searchGiftVoucher(obj).then((res) => {
      this.setState({ filterVouchersData: res.data.result, filterActive: true })
    })
  }

  validationField() {
    let isFormValid = true;
    let errors = '';
    if (this.state.searchQuery < 2) {
      isFormValid = false;
      errors = customerErrorMessages.searchQuery;
      this.setState({ searchQueryValid: false });
    }
    this.setState({ searchQueryError: errors });
    return isFormValid;
  }

  async onChangeSearch(text) {
    const isFormValid = this.validationField();
    await this.setState({
      searchQuery: text
    })
    if (isFormValid) {
      this.applyVoucherFilter()
    }
  }


  render() {
    const { gvNumberValid, startDateValid, endDateValid, giftValueValid, searchQueryValid } = this.state
    return (
      <View style={{ backgroundColor: "#FFFFFF" }}>
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
                    style={[inputField, { borderColor: '#8F9EB717' }]}
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
          <View style={{ flexDirection: 'row' }}>
            <View style={styles.searchBarStyles}>
              <Searchbar
                placeholder="Search"
                onChangeText={(text) => this.onChangeSearch(text)}
                value={this.state.searchQuery}
              />
            </View>
            <TouchableOpacity
              style={styles.filterBtnStyle}
              onPress={() => this.filterAction()} >
              <Image source={
                // this.state.filterActive ? 
                // require('../assets/images/clearFilterSearch.png') : 
                require('../assets/images/promofilter.png')} />
            </TouchableOpacity>
          </View>
          {!searchQueryValid && (
            <Message imp={true} message={this.state.searchQueryError} />
          )}

          <Text style={styles.titleStyle}>{I18n.t('Generate Gift Voucher')}</Text>
          <View>
            <Text style={styles.inputFieldText}>{I18n.t('GV Number')}</Text>
            <TextInput
              style={[inputField, { borderColor: gvNumberValid ? '#8F9EB717' : '#dd0000' }]}
              placeholder={('Enter GV')}
              placeholderTextColor="#6f6f6f60"
              textAlignVertical="center"
              keyboardType={'default'}
              autoCapitalize='none'
              value={this.state.gvNumber}
              onChangeText={(text) => this.handleGvNumber(text)}
            />
            {!gvNumberValid && (
              <Message imp={true} message={this.state.errors['gvNumber']} />
            )}
            <Text style={styles.inputFieldText}>{I18n.t('From Date')}</Text>
            <TouchableOpacity
              style={[dateSelector, { borderColor: startDateValid ? '#8F9EB717' : '#dd0000' }]}
              testID="openModal"
              onPress={() => this.datepickerClicked()}
            >
              <Text style={dateText}>{this.state.startDate === "" ? 'DD/MM/YYYY' : this.state.startDate}</Text>
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
            {!startDateValid && (
              <Message imp={true} message={this.state.errors['startDate']} />
            )}
            <Text style={styles.inputFieldText}>{I18n.t('To Date')}</Text>
            <TouchableOpacity
              style={[dateSelector, { borderColor: endDateValid ? '#8F9EB717' : '#dd0000' }]}
              testID="openModal"
              onPress={() => this.enddatepickerClicked()}
            >
              <Text
                style={dateText}
              >{this.state.endDate === '' ? 'DD/MM/YYYY' : this.state.endDate}</Text>
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
            {!startDateValid && (
              <Message imp={true} message={this.state.errors['endDate']} />
            )}
            <View >
              <Text style={styles.inputFieldText}>{I18n.t('Amount')}</Text>
              <TextInput
                style={[inputField, { borderColor: giftValueValid ? '#8F9EB717' : '#dd0000' }]}
                placeholder={I18n.t('Enter Amount')}
                placeholderTextColor="#6f6f6f60"
                textAlignVertical="center"
                keyboardType={'default'}
                autoCapitalize='none'
                value={this.state.giftValue}
                onChangeText={(text) => this.handleValue(text)}
              />
              {!startDateValid && (
                <Message imp={true} message={this.state.errors['giftValue']} />
              )}
              <Text style={styles.inputFieldText}>{I18n.t('Description')}</Text>
              <TextInput
                multiline
                numberOfLines={5}
                style={[styles.textArea, { borderColor: '#8F9EB717' }]}
                placeholder={I18n.t('Write')}
                placeholderTextColor="#6f6f6f60"
                keyboardType={'default'}
                value={this.state.description}
                onChangeText={(text) => this.handleDescription(text)}
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
      </View >

    );
  }
}

export default GiftVocher;

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
  titleStyle: {
    fontSize: RF(20),
    fontFamily: "bold",
    color: color.accent,
    margin: RF(10)
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
  searchBarStyles: {
    width: Device.isTablet ? deviceWidth / 1.35 : deviceWidth / 1.3,
    paddingTop: RF(10),
    paddingBottom: RF(10),
    paddingLeft: RF(10)
  },
  filterBtnStyle: {
    padding: RF(10),
    alignSelf: 'center',
    backgroundColor: "#353C40",
    width: Device.isTablet ? 100 : 50,
    height: Device.isTablet ? 55 : 45
  },
  inputFieldText: {
    justifyContent: "center",
    marginLeft: RW(20),
    // marginRight: RW(20),
    marginTop: RH(5),
    fontFamily: "regular",
    paddingLeft: RW(15),
    fontSize: RF(15),
    color: '#B4B7B8'
  },
  textArea: {
    justifyContent: "center",
    marginLeft: RW(20),
    marginRight: RW(20),
    marginTop: RH(5),
    marginBottom: RH(5),
    borderColor: color.border,
    borderRadius: 3,
    backgroundColor: color.light,
    borderWidth: 1,
    fontFamily: "regular",
    paddingLeft: RW(15),
    fontSize: RF(14),
  }
});;
