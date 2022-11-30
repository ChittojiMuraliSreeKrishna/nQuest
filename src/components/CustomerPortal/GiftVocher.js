import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { Component } from 'react';
import { Dimensions, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Device from 'react-native-device-detection';
import I18n from 'react-native-i18n';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Modal from 'react-native-modal';
import { TextInput } from 'react-native-paper';
import { default as FilterIcon, default as IconFA } from 'react-native-vector-icons/FontAwesome';
import forms from '../../commonUtils/assets/styles/formFields.scss';
import scss from '../../commonUtils/assets/styles/style.scss';
import DateSelector from '../../commonUtils/DateSelector';
import { RF, RH, RW } from '../../Responsive';
import { customerErrorMessages } from '../Errors/errors';
import Message from '../Errors/Message';
import CustomerService from '../services/CustomerService';
import { color } from '../Styles/colorStyles';

import { dateSelector, dateText, inputField, submitBtn, submitBtnText } from '../Styles/FormFields';
import { filterBtn, flatListHeaderContainer, flatListMainContainer, flatlistSubContainer, flatListTitle, highText, textContainer, textStyleLight, textStyleMedium, textStyleMediumColor } from '../Styles/Styles';



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
      activeGVNumber: "",
      filterGvNumber: ""
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
    this.setState({ datepickerOpen: true });
  }

  enddatepickerClicked() {
    this.setState({ datepickerendOpen: true });
  }

  filterDatepickerClicked() {
    this.setState({ filterStartPickerOpen: true });
  }

  filterEnddatepickerClicked() {
    this.setState({ filterEndPickerOpen: true });
  }

  handleMobile = (value) => {
    this.setState({ mobile: value });
  };

  formatMonth(number) {
    if (number < 10) {
      return "-0" + number;
    } else {
      return "-" + number;
    }
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

  datepickerFilterCancelClicked = () => {
    this.setState({
      filterStartPickerOpen: false,
    });
  };

  datepickerFilterEndCancelClicked = () => {
    this.setState({
      filterEndPickerOpen: false,
    });
  };

  handleFilterStartDate = (value) => {
    this.setState({ filterStartDate: value });
  };

  handleFilterEndDate = (value) => {
    this.setState({ filterEndDate: value });
  };

  handleGvNumber(text) {
    this.setState({ gvNumber: text });
  }


  handleFilterGvNumber(text) {
    this.setState({ filterGvNumber: text });
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
    this.setState({ flagGiftVoucherAdd: true, modalVisible: true });
  }

  filterAction() {
    this.setState({ flagFilterOpen: true, modalVisible: true });
  }

  modelCancel() {
    this.setState({ modalVisible: false, flagFilterOpen: false, searchQuery: "", filterStartDate: "", filterEndDate: "", filterGvNumber: '' });
  }

  applyVoucherFilter() {
    const { filterStartDate, filterEndDate, filterGvNumber, searchQuery } = this.state;
    const obj = {
      fromDate: filterStartDate ? filterStartDate : null,
      toDate: filterEndDate ? filterEndDate : null,
      gvNumber: filterGvNumber ? filterGvNumber : searchQuery ? searchQuery : null,
      clientId: parseInt(this.state.clientId)
    };
    console.log("objjbjj", obj.fromDate, obj.toDate);
    if ((obj.fromDate !== null && obj.toDate !== null) || this.state.filterGvNumber !== "") {
      CustomerService.searchGiftVoucher(obj).then((res) => {
        this.setState({
          filterVouchersData: res.data.result,
          filterActive: true,
          flagFilterOpen: false
        });
      }).catch((err) => {
        this.setState({ modalVisible: false, flagFilterOpen: false, searchQuery: "", filterStartDate: "", filterEndDate: "" });
      });
    } else {
      alert("Please Provide Input Fields")
    }
  }


  clearFilter() {
    this.setState({ filterVouchersData: [], filterStartDate: "", filterEndDate: "", filterGvNumber: "", filterActive: false })
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
    });
    if (isFormValid) {
      this.applyVoucherFilter();
    }
  }

  activeGV = (item) => {
    this.setState({ isgvModel: true, activeGVNumber: item.gvNumber, gvModelVisible: true });
  };

  hideGVModel = () => {
    this.setState({ isgvModel: false, gvModelVisible: false, filterStartDate: "", filterEndDate: "", filterGvNumber: "" });
  };

  saveGvNumber() {
    const obj = [this.state.activeGVNumber];
    CustomerService.saveGvNumber(obj, true).then(res => {
      if (res) {
        alert(res.data.message);
        this.setState({ filterVouchersData: [] });
      }
    });
    this.hideGVModel();
  }

  render() {
    const { gvNumberValid, startDateValid, endDateValid, giftValueValid, searchQueryValid } = this.state;
    return (
      <View style={{ backgroundColor: "#FFFFFF", flex: 1 }}>
        <ScrollView>
          {this.state.flagFilterOpen &&
            <Modal style={{ margin: 0 }} isVisible={this.state.flagFilterOpen}
              onBackButtonPress={() => this.modelCancel()}
              onBackdropPress={() => this.modelCancel()} >
              <View style={forms.filterModelContainer}>
                <Text style={forms.popUp_decorator}>-</Text>
                <View style={forms.filterModelSub}>
                  <KeyboardAwareScrollView >
                    <View style={forms.filter_dates_container}>
                      <TouchableOpacity
                        style={forms.filter_dates}
                        testID="openModal"
                        onPress={() => this.filterDatepickerClicked()}
                      >
                        <Text
                          style={forms.filter_dates_text}
                        >{this.state.filterStartDate == "" ? 'START DATE' : this.state.filterStartDate}</Text>
                        <IconFA
                          name="calendar"
                          size={18}
                          style={forms.calender_image}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={forms.filter_dates}
                        testID="openModal"
                        onPress={() => this.filterEnddatepickerClicked()}
                      >
                        <Text
                          style={forms.filter_dates_text}
                        >{this.state.filterEndDate == "" ? 'END DATE' : this.state.filterEndDate}</Text>
                        <IconFA
                          name="calendar"
                          size={18}
                          style={forms.calender_image}
                        />
                      </TouchableOpacity>
                    </View>
                    {this.state.filterStartPickerOpen && (
                      <View style={styles.dateTopView}>
                        <DateSelector
                          dateCancel={this.datepickerFilterCancelClicked}
                          setDate={this.handleFilterStartDate}
                        />
                      </View>
                    )}

                    {this.state.filterEndPickerOpen && (
                      <View style={styles.dateTopView}>
                        <DateSelector
                          dateCancel={this.datepickerFilterEndCancelClicked}
                          setDate={this.handleFilterEndDate}
                        />
                      </View>
                    )}
                    <TextInput
                      mode="flat"
                      activeUnderlineColor='#000'
                      underlineColor={'#6f6f6f'}
                      label={('GV Number')}
                      style={[forms.input_fld, { borderColor: '#8F9EB717' }]}
                      value={this.state.filterGvNumber}
                      onChangeText={(text) => this.handleFilterGvNumber(text)}
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
              </View>
            </Modal>
          }
          <>
            <FlatList
              ListHeaderComponent={<View style={flatListHeaderContainer}>
                <Text style={[flatListTitle, { color: color.accent }]}>{I18n.t('Gift Vouchers')}</Text>
                <TouchableOpacity
                  style={filterBtn}
                  onPress={() => this.state.filterActive ? this.clearFilter() : this.filterAction()} >
                  <FilterIcon
                    name="sliders"
                    size={25}
                    color={this.state.filterActive ? '#ED1C24' : '#000'}
                  />
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
                      <Text style={textStyleMediumColor}>GV NUMBER: <Text selectable={true} style={textStyleMedium}>{item.gvNumber}</Text></Text>
                      <TouchableOpacity style={[forms.action_buttons, forms.submit_btn, { backgroundColor: item.isActivated === false && item.isApplied === false ? '#009900' : color.disableBackGround, width: "30%" }]} disabled={item.isActivated} onPress={() => this.activeGV(item)}>
                        <Text style={forms.submit_btn_text}>
                          {item.isActivated === false && item.isApplied === false ? "Assign" : "Assigned"}
                        </Text>
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
            <ScrollView style={{ padding: 10 }}>
              <Text style={[scss.highText, { fontSize: 18 }]}>{I18n.t('Generate Gift Voucher')}</Text>
              <View style={{ padding: 5 }}>
                <Text style={scss.textStyleLight}>{I18n.t('GV Number')}</Text>
                <TextInput
                  style={[forms.input_fld, { borderColor: gvNumberValid ? '#8F9EB717' : '#dd0000' }]}
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
                <Text style={scss.textStyleLight}>{I18n.t('From Date')}</Text>
                <TouchableOpacity
                  style={[dateSelector, { borderColor: startDateValid ? '#8F9EB717' : '#dd0000' }]}
                  testID="openModal"
                  onPress={() => this.datepickerClicked()}
                >
                  <Text style={dateText}>{this.state.startDate === "" ? 'DD/MM/YYYY' : this.state.startDate}</Text>
                  <IconFA
                    name="calendar"
                    size={25}
                    style={forms.calender_image}
                  />
                </TouchableOpacity>
                {this.state.datepickerOpen && (
                  <View style={styles.dateTopView}>
                    <DateSelector
                      dateCancel={this.datepickerCancelClicked}
                      setDate={this.handleDate}
                    />
                  </View>
                )}
                {!startDateValid && (
                  <Message imp={true} message={this.state.errors['startDate']} />
                )}
                <Text style={scss.textStyleLight}>{I18n.t('To Date')}</Text>
                <TouchableOpacity
                  style={[dateSelector, { borderColor: endDateValid ? '#8F9EB717' : '#dd0000' }]}
                  testID="openModal"
                  onPress={() => this.enddatepickerClicked()}
                >
                  <Text
                    style={dateText}
                  >{this.state.endDate === '' ? 'DD/MM/YYYY' : this.state.endDate}</Text>
                  <IconFA
                    name="calendar"
                    size={25}
                    style={forms.calender_image}
                  />
                </TouchableOpacity>

                {this.state.datepickerendOpen && (
                  <View style={styles.dateTopView}>
                    <DateSelector
                      dateCancel={this.datepickerEndCancelClicked}
                      setDate={this.handleEndDate}
                    />
                  </View>
                )}
                {!startDateValid && (
                  <Message imp={true} message={this.state.errors['endDate']} />
                )}
                <View >
                  <Text style={scss.textStyleLight}>{I18n.t('Amount')}</Text>
                  <TextInput
                    style={[forms.input_fld, { borderColor: giftValueValid ? '#8F9EB717' : '#dd0000' }]}
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
                  <Text style={scss.textStyleLight}>{I18n.t('Description')}</Text>
                  <TextInput
                    mode="flat"
                    activeUnderlineColor='#000'
                    underlineColor={'#6f6f6f'}
                    multiline
                    numberOfLines={5}
                    style={[forms.text_area, { borderColor: '#8F9EB717' }]}
                    label={I18n.t('Write')}
                    value={this.state.description}
                    onChangeText={(text) => this.handleDescription(text)}
                  />
                  <View style={forms.action_buttons_container}>
                    <TouchableOpacity
                      style={[forms.action_buttons, forms.submit_btn, { width: "90%" }]}
                      onPress={() => this.addGiftVocher()} >
                      <Text style={forms.submit_btn_text}>
                        {I18n.t("Add Gift Voucher")} </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </ScrollView>
          </>

          {this.state.isgvModel && (
            <Modal style={{ margin: 0 }} isVisible={this.state.gvModelVisible}
              onBackButtonPress={() => this.hideGVModel()}
              onBackdropPress={() => this.hideGVModel()} >
              <View style={forms.filterModelContainer}>
                <Text style={forms.popUp_decorator}>-</Text>
                <View style={forms.filterModelSub}>
                  <KeyboardAwareScrollView >
                    <TextInput
                      mode="flat"
                      activeUnderlineColor='#000'
                      underlineColor={'#6f6f6f'}
                      label={('GV Number')}
                      style={[forms.input_fld, { borderColor: '#8F9EB717' }]}
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
              </View>
            </Modal>
          )}
        </ScrollView>
      </View >

    );
  }
}

export default GiftVocher;

const styles = StyleSheet.create({
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
  }
});;
