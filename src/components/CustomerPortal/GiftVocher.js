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
import forms from '../../commonUtils/assets/styles/formFields.scss';
import FilterIcon from 'react-native-vector-icons/FontAwesome';


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
      searchQueryError: '',
      filterStartDate: "",
      filterEndDate: "",
      filterStartPickerOpen: false,
      filterEndPickerOpen: false,
      clientId: 0,
      isgvModel: false,
      gvModelVisible: false,
      activeGVNumber: ""
    };
  }

  async componentDidMount() {
    const clientId = await AsyncStorage.getItem("custom:clientId1");
    this.setState({ clientId: clientId });
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
    this.setState({ datepickerOpen: true, filterStartPickerOpen: true });
  }

  enddatepickerClicked() {
    this.setState({ datepickerendOpen: true, filterEndPickerOpen: false });
  }

  handleMobile = (value) => {
    this.setState({ mobile: value });
  };

  formatMonth(number) {
    if (number < 10) {
      return "-0" + number
    } else {
      return "-" + number
    }
  }

  datepickerDoneClicked() {
    // if (parseInt(this.state.date.getDate()) < 10) {
    //     this.setState({ fromDate: this.state.date.getFullYear() + "-" + (this.state.date.getMonth() + 1) + "-0" + this.state.date.getDate() });
    // }
    // else {
    this.setState({ startDate: this.state.date.getFullYear() + this.formatMonth(this.state.date.getMonth() + 1) + "-" + this.state.date.getDate() });
    // }
    this.setState({ doneButtonClicked: true, datepickerOpen: false, datepickerendOpen: false });
  }

  filterStartDatePickerDoneClicked() {
    // if (parseInt(this.state.date.getDate()) < 10) {
    //     this.setState({ fromDate: this.state.date.getFullYear() + "-" + (this.state.date.getMonth() + 1) + "-0" + this.state.date.getDate() });
    // }
    // else {
    this.setState({ filterStartDate: this.state.date.getFullYear() + this.formatMonth(this.state.date.getMonth() + 1) + "-" + this.state.date.getDate() });
    // }
    this.setState({ doneButtonClicked: true, filterStartPickerOpen: false, datepickerendOpen: false });
  }

  datepickerendDoneClicked() {
    // if (parseInt(this.state.enddate.getDate()) < 10) {
    //     this.setState({ toDate: this.state.enddate.getFullYear() + "-" + (this.state.enddate.getMonth() + 1) + "-0" + this.state.enddate.getDate() });
    // }
    // else {
    this.setState({ endDate: this.state.enddate.getFullYear() + this.formatMonth(this.state.enddate.getMonth() + 1) + "-" + this.state.enddate.getDate() });
    // }
    this.setState({ enddoneButtonClicked: true, datepickerOpen: false, datepickerendOpen: false });
  }


  filterEndDatePickerDoneClicked() {
    // if (parseInt(this.state.enddate.getDate()) < 10) {
    //     this.setState({ toDate: this.state.enddate.getFullYear() + "-" + (this.state.enddate.getMonth() + 1) + "-0" + this.state.enddate.getDate() });
    // }
    // else {
    this.setState({ filterEndDate: this.state.enddate.getFullYear() + this.formatMonth(this.state.enddate.getMonth() + 1) + "-" + this.state.enddate.getDate() });
    // }
    this.setState({ enddoneButtonClicked: true, datepickerOpen: false, datepickerendOpen: false });
  }

  datepickerCancelClicked() {
    this.setState({ date: new Date(), enddate: new Date(), datepickerOpen: false, datepickerendOpen: false, filterStartPickerOpen: false, filterEndPickerOpen: false });
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
        const obj = {
          gvNumber: this.state.gvNumber,
          description: this.state.description,
          fromDate: this.state.startDate + "T00:00:00.000Z",
          toDate: this.state.endDate + "T00:00:00.000Z",
          clientId: this.state.clientId,
          value: this.state.giftValue,
          isApplied: false,
        };
        console.log("fsgfg", obj);
        CustomerService.saveGiftVoucher(obj).then(res => {
          if (res && res.data) {
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
    const { filterStartDate, filterEndDate, gvNumber, searchQuery } = this.state
    const obj = {
      fromDate: filterStartDate ? filterStartDate : undefined,
      toDate: filterEndDate ? filterEndDate : undefined,
      gvNumber: gvNumber ? gvNumber : searchQuery ? searchQuery : undefined,
      clientId: parseInt(this.state.clientId)
    }
    CustomerService.searchGiftVoucher(obj).then((res) => {
      this.setState({
        filterVouchersData: res.data.result,
        filterActive: true, searchQuery: "", modalVisible: false,
        flagFilterOpen: false, filterStartDate: "", filterEndDate: ""
      })
    }).catch((err) => {
      this.setState({ modalVisible: false, flagFilterOpen: false, searchQuery: "", filterStartDate: "", filterEndDate: "" })
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

  activeGV = (item) => {
    this.setState({ isgvModel: true, activeGVNumber: item.gvNumber, gvModelVisible: true })
  }

  hideGVModel = () => {
    this.setState({ isgvModel: false, gvModelVisible: false });
  }

  saveGvNumber() {
    const obj = [this.state.activeGVNumber]
    CustomerService.saveGvNumber(obj, true).then(res => {
      if (res) {
        console.log("responsee", res);
        this.setState({ filterVouchersData: [] })
        alert(res.data.message)
      }
    })
    this.hideGVModel()
  }

  render() {
    const { gvNumberValid, startDateValid, endDateValid, giftValueValid, searchQueryValid } = this.state
    return (
      <View style={{ backgroundColor: "#FFFFFF" }}>
        {this.state.flagFilterOpen &&
          <View>
            <Modal style={{ margin: 0 }} isVisible={this.state.modalVisible}
              onBackButtonPress={() => this.modelCancel()}
              onBackdropPress={() => this.modelCancel()} >
              <View style={[filterMainContainer, { minHeight: Device.isTablet ? RH(400) : RH(300), maxHeight: Device.isTablet ? RH(600) : RH(500), }]}>
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
                  <View style={forms.filter_dates_container}>
                    <TouchableOpacity
                      style={forms.filter_dates}
                      testID="openModal"
                      onPress={() => this.datepickerClicked()}
                    >
                      <Text
                        style={forms.filter_dates_text}
                      >{this.state.filterStartDate == "" ? 'START DATE' : this.state.filterStartDate}</Text>
                      <Image style={forms.calender_image} source={require('../assets/images/calender.png')} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={forms.filter_dates}
                      testID="openModal"
                      onPress={() => this.enddatepickerClicked()}
                    >
                      <Text
                        style={forms.filter_dates_text}
                      >{this.state.filterEndDate == "" ? 'END DATE' : this.state.filterEndDate}</Text>
                      <Image style={forms.calender_image} source={require('../assets/images/calender.png')} />
                    </TouchableOpacity>
                  </View>
                  {this.state.filterStartPickerOpen && (
                    <View style={styles.dateTopView}>
                      <View style={styles.dateTop2}>
                        <TouchableOpacity
                          style={datePickerButton1} onPress={() => this.datepickerCancelClicked()}
                        >
                          <Text style={datePickerBtnText}  > Cancel </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={datePickerButton2} onPress={() => this.filterStartDatePickerDoneClicked()}
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
                            style={datePickerButton2} onPress={() => this.filterEndDatePickerDoneClicked()}
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
                    mode="flat"
                    activeUnderlineColor='#000'
                    underlineColor={'#6f6f6f'}
                    label={('GV Number')}
                    style={[inputField, { borderColor: '#8F9EB717' }]}
                    value={this.state.gvNumber}
                    onChangeText={(text) => this.handleGvNumber(text)}
                  />
                </KeyboardAwareScrollView>
                <View style={forms.action_buttons_container}>
                  <TouchableOpacity style={[forms.action_buttons, forms.submit_btn]}
                    onPress={() => this.applyVoucherFilter()}>
                    <Text style={forms.submit_btn_text} >{I18n.t("APPLY")}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[forms.action_buttons, forms.cancel_btn]}
                    onPress={() => this.modelCancel()}>
                    <Text style={forms.cancel_btn_text}>{I18n.t("CANCEL")}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>
        }
        <View>
          {/* <View style={{ flexDirection: 'row' }}>
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
              <FilterIcon
                name="sliders"
                size={25} />
            </TouchableOpacity>
          </View>
          {!searchQueryValid && (
            <Message imp={true} message={this.state.searchQueryError} />
          )} */}


          <FlatList
            ListHeaderComponent={<View style={flatListHeaderContainer}>
              <Text style={[flatListTitle, { color: color.accent }]}>{I18n.t('Gift Vouchers')}</Text>
              <TouchableOpacity
                style={styles.filterBtnStyle}
                onPress={() => this.filterAction()} >
                <FilterIcon
                  name="sliders"
                  size={25} />
              </TouchableOpacity>
            </View>}
            data={this.state.filterVouchersData}
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
                    <TouchableOpacity onPress={() => this.activeGV(item)}>
                      <Text style={[textStyleMedium, { backgroundColor: item.isActivated ? '#009900' : '#ee0000', color: '#ffffff', padding: 5, alignSelf: 'flex-start', borderRadius: Device.isTablet ? 10 : 5, fontFamily: 'medium' }]}>{I18n.t("Activate")} </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={textContainer}>
                    <Text style={textStyleLight}>{I18n.t("FROM DATE")}: {item.fromDate}</Text>
                    <Text style={textStyleLight}>{I18n.t("TO DATE")}: {item.toDate}</Text>
                  </View>
                </View>
              </View>
            )}
          />

          <Text style={styles.titleStyle}>{I18n.t('Generate Gift Voucher')}</Text>
          <View>
            <Text style={styles.inputFieldText}>{I18n.t('GV Number')}</Text>
            <TextInput
              style={[inputField, { borderColor: gvNumberValid ? '#8F9EB717' : '#dd0000' }]}
              mode="flat"
              activeUnderlineColor='#000'
              underlineColor={'#6f6f6f'}
              label={('Enter GV')}
              maxLength={8}
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
                label={I18n.t('Enter Amount')}
                mode="flat"
                activeUnderlineColor='#000'
                keyboardType='numeric'
                underlineColor={'#6f6f6f'}
                value={this.state.giftValue}
                onChangeText={(text) => this.handleValue(text)}
              />
              {!startDateValid && (
                <Message imp={true} message={this.state.errors['giftValue']} />
              )}
              <Text style={styles.inputFieldText}>{I18n.t('Description')}</Text>
              <TextInput
                mode="flat"
                activeUnderlineColor='#000'
                underlineColor={'#6f6f6f'}
                multiline
                numberOfLines={5}
                style={[styles.textArea, { borderColor: '#8F9EB717' }]}
                label={I18n.t('Write')}
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

        {this.state.isgvModel && (
          <View>
            <Modal style={{ margin: 0 }} isVisible={this.state.gvModelVisible}
              onBackButtonPress={() => this.hideGVModel()}
              onBackdropPress={() => this.hideGVModel()} >
              <View style={[filterMainContainer, { minHeight: Device.isTablet ? RH(200) : RH(100), maxHeight: Device.isTablet ? RH(400) : RH(200) }]}>
                <View style={filterSubContainer}>
                  <View>
                    <Text style={filterHeading}>Issue GV Number </Text>
                  </View>
                  <View>
                    <TouchableOpacity style={filterCloseImage} onPress={() => this.hideGVModel()}>
                      <Image style={{ margin: RH(5) }} source={require('../assets/images/modelcancel.png')} />
                    </TouchableOpacity>
                  </View>
                </View>
                <Text style={styles.spaceText}></Text>
                <KeyboardAwareScrollView enableOnAndroid={true}>
                  <TextInput
                    mode="flat"
                    activeUnderlineColor='#000'
                    underlineColor={'#6f6f6f'}
                    label={('GV Number')}
                    style={[inputField, { borderColor: '#8F9EB717' }]}
                    value={this.state.activeGVNumber}
                    disabled
                  />
                </KeyboardAwareScrollView>
                <View style={forms.action_buttons_container}>
                  <TouchableOpacity style={[forms.action_buttons, forms.submit_btn]}
                    onPress={() => this.saveGvNumber()}>
                    <Text style={forms.submit_btn_text} >{I18n.t("SAVE")}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[forms.action_buttons, forms.cancel_btn]}
                    onPress={() => this.hideGVModel()}>
                    <Text style={forms.cancel_btn_text}>{I18n.t("CANCEL")}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>
        )}
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
    fontSize: RF(15),
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
