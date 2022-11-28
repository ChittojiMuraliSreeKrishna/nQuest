import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { Component } from 'react';
import { Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Device from 'react-native-device-detection';
import scss from '../../commonUtils/assets/styles/style.scss';
import { formatDate } from '../../commonUtils/DateFormate';
import Loader from '../../commonUtils/loader';
import { RF, RH, RW } from '../../Responsive';
import CustomerService from '../services/CustomerService';
import { flatListTitle, listEmptyMessage, textContainer, textStyleMedium } from '../Styles/Styles';
import Modal from "react-native-modal";
import { Chevron } from 'react-native-shapes';
import RNPickerSelect from 'react-native-picker-select';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import forms from '../../commonUtils/assets/styles/formFields.scss';
import I18n from 'react-native-i18n';
import moment from 'moment';
import { TextInput } from 'react-native-paper';
import { color } from '../Styles/colorStyles';


var deviceheight = Dimensions.get('window').height;
var deviceheight = Dimensions.get('window').height;
var deviceWidth = Dimensions.get("window").width;

export default class DayClosure extends Component {

  constructor(props) {
    super(props);
    this.state = {
      storeId: "",
      dayClosureList: [],
      enableButton: false,
      loading: false,
      isFetching: false,
      isdayCloser: false,
      ystDayCloser: false,
      daycheckCloseDates: [],
      isDates: false,
      dayCloseDates: [],
      toDay: moment(new Date()).format("YYYY-MM-DD").toString(),
      toadayValue: '',
      toadaydeskValue: '',
      penlitydeskValue: 0,
      daycheckCloseDates: [],
      selectedDate: "",
      isEnabeldDayCloser: false
    };
  }

  async componentWillMount() {
    const storeId = await AsyncStorage.getItem("storeId");
    this.setState({ storeId: storeId });
    this.getAllDayCloser();
    this.getallPendingDate()
    this.getalltoDates();
  }

  refresh() {
    this.setState({ dayClosureList: [] }, () => {
      this.getAllDayCloser();
    });
  }

  getalltoDates() {
    CustomerService.getDates(this.state.storeId).then(res => {
      if (res.data.length > 0) {
        this.setState({ daycheckCloseDates: res.data });
        if (this.state.daycheckCloseDates.length === 0) {
          this.setState({ isdayCloser: true });
        } else if (this.state.daycheckCloseDates.length > 1 && this.state.daycheckCloseDates[0].dayClose.split("T")[0] !== this.state.toDay) {
          this.setState({ ystDayCloser: true });
        }
      }
    });
  }

  getAllDayCloser() {
    this.setState({ loading: true });
    CustomerService.getAllDayClosr(this.state.storeId).then((res) => {
      if (res?.data) {
        if (res.data.result.deliverySlips && res.data.result.deliverySlips.length > 0) {
          this.setState({ dayClosureList: res.data.result.deliverySlips });
          if (this.state.dayClosureList.length > 0) {
            this.setState({ enableButton: true });
          }
        }
      }
      this.setState({ loading: false });
    }).catch(err => {
      this.setState({ loading: false });
      console.log(err);
    });
  }

  closeDay() {
    // const param = "?storeId=" + this.state.storeId;
    // axios.put(CustomerService.dayCloseActivity() + param).then(res => {
    //   if (res) {
    //     alert(res.data.result);
    //     this.getAllDayCloser();
    //   }
    // });
    this.setState({ isCloseDay: true });
    if (this.state.daycheckCloseDates.length === 1) {
      this.setState({ isDayClose: true, ystDayCloser: false })
    }
    else if (this.state.daycheckCloseDates.length > 1) {
      this.setState({ isDates: true })
    }
  }

  deleteEstimationSlip(dsNumber) {
    console.log(dsNumber);
    CustomerService.deleteEstimationSlip(dsNumber).then((res) => {
      if (res.data.result) {
        alert(res.data.result);
        this.getAllDayCloser(0);
      } else {
        alert(res.data.message);
      }
    });
  }

  getallPendingDate() {
    CustomerService.getDates(this.state.storeId).then(res => {
      if (res && res.data.length > 1) {
        if (res.data.length > 1) {
          this.setState({ datesDaycloser: res.data })
          this.state.datesDaycloser.pop();
          this.setState({ dateClose: true, isEnabeldDayCloser: true })
          const dayCloseRes = this.state.datesDaycloser.map((item) => {
            const obj = {};
            obj.label = item.dayClose;
            obj.value = item.dayClose;
            return obj;
          });
          dayCloseRes.forEach((item, index) => {
            if (index === 0) {
              item.isDisabled = false;
            } else {
              item.isDisabled = true;
            }
          });
          // eventBus.dispatch("dayClose", { message: res.data });
          this.setState({ isDayClose: false, dayCloseDates: (dayCloseRes) }, () => this.setState({ indexDate: this.state.datesDaycloser[0] }));
        } else {
          this.hidedayModel();
        }
      }
    });
    this.hidedayModel();
    this.hideModal();
  }

  pendingConfirmDayCloser() {
    this.setState({ isView: true, isDates: false }, () => this.getPendingDeliverySlips(this.state.applicability));
  }

  getPendingDeliverySlips(selectedDate) {
    const selectdate = selectedDate ? selectedDate.split("T")[0] : ''
    CustomerService.getPendingDeliverySlips(selectdate, this.state.storeId).then(res => {
      if (res) {
        this.setState({ pendingDayCloserList: res.data.result.deliverySlips, toadayValue: res.data.result.saleValue, dayCloserList: res.data.result.deliverySlips });
        // if(this.state.pendingDayCloserList){
        //   this.setState({isView:true})
        // } 
      }
    });
  }

  hideModal() {
    this.setState({ isCloseDay: false, isDayClose: false, applicability: '' });
  }

  hidedayModel() {
    this.setState({ isDates: false, applicability: '' })
  }

  hideClosePop() {
    this.setState({ isView: false, applicability: '' })
  }

  handleSelectPendingDates = selecteddate => {
    this.setState({ applicability: selecteddate })
  }

  confirmDayCloser() {
    this.setState({ isView: true }, () => this.getPendingDeliverySlips(moment(new Date()).format("YYYY-MM-DD").toString()));
  }

  saveDayCloser() {
    const obj = {
      storeId: this.state.storeId,
      dayClose: this.state.applicability,
      startedBy: this.state.startedBy,
      closedBy: this.state.closeBy,
      collectedAmount: this.state.toadaydeskValue,
      saleAmount: this.state.toadayValue,
      penality: this.state.penlitydeskValue,
    }
    if (this.state.daycheckCloseDates.length > 1) {
      CustomerService.saveDayCloser(obj).then(res => {
        if (res) {
          this.getalltoDates();
          this.closePendingDeliverySlips();
          alert("DayClosed Successfully");
          this.setState({
            isView: false,
            isEnabeldDayCloser: false,
            ystDayCloser: false,
            startedBy: '',
            closeBy: '',
            toadaydeskValue: '',
            toadayValue: '',
            penlitydeskValue: '',
            applicability: ''
          }, () => {
            this.getPendingDeliverySlips();
          });
        }
      });
    } else if (this.state.daycheckCloseDates.length <= 1) {
      this.hidedayModel();
    }
    this.hidedayModel();
  }

  closePendingDeliverySlips() {
    const date = this.state.applicability ? this.state.applicability.split("T")[0] : moment(new Date()).format("YYYY-MM-DD").toString();
    CustomerService.closePendingDeliverySlips(date, this.state.storeId).then(res => {
      if (res) {
        this.refresh()
        this.setState({ isView: false, applicability: "" }, () =>
          this.getallPendingDate(),
          this.getAllDayCloser()
        )
      }
    });
    this.hidedayModel()
  }

  saveDay() {
    const obj = {
      storeId: this.state.storeId,
      dayClose: this.state.toDay,
      startedBy: this.state.startedBy,
      closedBy: this.state.closeBy,
      collectedAmount: this.state.toadaydeskValue,
      saleAmount: this.state.toadayValue,
      penality: this.state.penlitydeskValue,
    }
    CustomerService.saveDayCloser(obj).then(res => {
      if (res) {
        this.getalltoDates();
        this.closePendingDeliverySlips();
      }
      alert("Today closed Successfully");
      this.setState({
        startedBy: '',
        closeBy: '',
        toadaydeskValue: '',
        toadayValue: '',
        penlitydeskValue: '',
        applicability: '',
        dayCloserList: []
      }, () => {
        this.getPendingDeliverySlips();
      });
    });
    this.hideModal();
  }

  render() {
    return (
      <View style={scss.container}>
        {this.state.loading &&
          <Loader
            loading={this.state.loading} />
        }
        <FlatList
          ListHeaderComponent={<View style={scss.headerContainer}>
            <Text style={flatListTitle}>List of Pending DL slips - <Text style={{ color: '#ED1C24' }}>{this.state.dayClosureList.length}</Text> </Text>
            {/* {this.state.isdayCloser && ( */}
            <TouchableOpacity
              style={[forms.action_buttons, forms.submit_btn, { width: "40%", backgroundColor: this.state.isdayCloser ? color.disableBackGround : color.accent }]}
              disabled={this.state.isdayCloser}
              onPress={() => this.closeDay()} >
              <Text style={forms.submit_btn_text}> Day Closure </Text>
            </TouchableOpacity>
          </View>}
          data={this.state.dayClosureList}
          scrollEnabled={true}
          refreshing={this.state.isFetching}
          onRefresh={() => this.refresh()}
          removeClippedSubviews={false}
          ListEmptyComponent={
            <Text style={listEmptyMessage}>
              {this.state.isdayCloser && <Text>Day Alreday Closed</Text>}
              {this.state.ystDayCloser && <Text >Yesterday Day Closer Not Done </Text>}
            </Text>
          }
          renderItem={({ item, index }) => (
            <View style={scss.flatListContainer}>
              <View style={scss.flatListSubContainer}>
                <View style={scss.textContainer}>
                  <Text style={scss.highText}>S.No: {index + 1}</Text>
                  <Text style={scss.textStyleLight}>Created Date :
                    <Text style={scss.textStyleMedium}>{"\n"}
                      {formatDate(item.createdDate)}
                    </Text>
                  </Text>
                </View>
                <View style={scss.textContainer}>
                  <Text selectable={true} style={scss.textStyleLight}>ESNumber:
                    <Text style={scss.textStyleMedium}>{"\n"}{item.dsNumber}</Text>
                  </Text>
                  <Text style={scss.textStyleLight}>SalesMan: {item.salesMan}</Text>
                </View>
                <View style={[textContainer, { justifyContent: 'flex-end' }]}>
                  <TouchableOpacity
                    onPress={() => this.deleteEstimationSlip(item.dsNumber)}>
                    <Image style={scss.deleteButton}
                      source={require('../assets/images/delete.png')} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        />
        <>
          <Modal style={{ margin: 0 }} isVisible={this.state.isDates}
            onBackButtonPress={() => this.hidedayModel()}
            onBackdropPress={() => this.hidedayModel()} >
            <View style={forms.filterModelContainer} >
              <Text style={forms.popUp_decorator}>-</Text>
              <View style={forms.filterModelSub}>
                <KeyboardAwareScrollView>
                  <View style={[Device.isTablet ? styles.rnSelectContainer_tablet : styles.rnSelectContainer_mobile, { width: "92%" }]}>
                    <RNPickerSelect
                      placeholder={{ label: 'Pending Dates *', value: '' }}
                      Icon={() => {
                        return <Chevron style={styles.imagealign} size={1.5} color="gray" />;
                      }}
                      items={this.state.dayCloseDates}
                      onValueChange={this.handleSelectPendingDates}
                      style={Device.isTablet ? pickerSelectStyles_tablet : pickerSelectStyles_mobile}
                      value={this.state.applicability}
                      useNativeAndroidPickerStyle={false}
                    />
                  </View>
                  <View style={forms.action_buttons_container}>
                    <TouchableOpacity style={[forms.action_buttons, forms.submit_btn]}
                      onPress={() => this.pendingConfirmDayCloser()}>
                      <Text style={forms.submit_btn_text} >{I18n.t("CONFIRM")}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[forms.action_buttons, forms.cancel_btn]}
                      onPress={() => this.hidedayModel()}>
                      <Text style={forms.cancel_btn_text}>{I18n.t("CANCEL")}</Text>
                    </TouchableOpacity>
                  </View>
                </KeyboardAwareScrollView>
              </View>
            </View>
          </Modal>
        </>

        <>
          <Modal style={{ margin: 0 }} isVisible={this.state.isDayClose}
            onBackButtonPress={() => this.hideModal()}
            onBackdropPress={() => this.hideModal()} >
            <View style={forms.filterModelContainer} >
              <Text style={forms.popUp_decorator}>-</Text>
              <View style={forms.filterModelSub}>
                <Text style={textStyleMedium}>Are you sure you want to close for the day</Text>
                <View style={forms.action_buttons_container}>
                  <TouchableOpacity style={[forms.action_buttons, forms.submit_btn]}
                    onPress={() => this.confirmDayCloser()}>
                    <Text style={forms.submit_btn_text} >{I18n.t("CONFIRM")}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[forms.action_buttons, forms.cancel_btn]}
                    onPress={() => this.hideModal()}>
                    <Text style={forms.cancel_btn_text}>{I18n.t("CANCEL")}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </>

        <>
          <Modal style={{ margin: 0 }} isVisible={this.state.isView}
            onBackButtonPress={() => this.hideClosePop()}
            onBackdropPress={() => this.hideClosePop()} >
            <View style={[forms.filterModelContainer, { height: '60%' }]} >
              <Text style={forms.popUp_decorator}>-</Text>
              <View style={forms.filterModelSub}>
                <KeyboardAwareScrollView>
                  <Text style={textStyleMedium}>Previous Day Close : ₹2000</Text>
                  <Text style={scss.textStyleLight}>Started By</Text>
                  <TextInput
                    style={forms.input_fld}
                    underlineColor="transparent"
                    activeUnderlineColor='#000'
                    value={this.state.startedBy}
                    onChangeText={(text) => this.setState({ startedBy: text })}
                  />
                  <Text style={scss.textStyleLight}>Today Value</Text>
                  <TextInput
                    style={forms.input_fld}
                    underlineColor="transparent"
                    activeUnderlineColor='#000'
                    value={this.state.toadayValue}
                    disabled={this.state.isView}
                  // onChangeText={(text) => this.setState({ toadayValue: text })}
                  />
                  <Text style={scss.textStyleLight}>Desk Value</Text>
                  <TextInput
                    style={forms.input_fld}
                    underlineColor="transparent"
                    activeUnderlineColor='#000'
                    value={this.state.toadaydeskValue}
                    onChangeText={(text) => this.setState({ toadaydeskValue: text })}
                  />
                  <Text style={scss.textStyleLight}>Manager Value</Text>
                  <TextInput
                    style={forms.input_fld}
                    underlineColor="transparent"
                    activeUnderlineColor='#000'
                    value={this.state.penlitydeskValue}
                    onChangeText={(text) => this.setState({ penlitydeskValue: text })}
                  />
                  <Text style={scss.textStyleLight}>Closed By</Text>
                  <TextInput
                    style={forms.input_fld}
                    underlineColor="transparent"
                    activeUnderlineColor='#000'
                    value={this.state.closeBy}
                    onChangeText={(text) => this.setState({ closeBy: text })}
                  />

                  <FlatList
                    style={{ backgroundColor: '#FFF' }}
                    ListHeaderComponent={<View style={scss.headerContainer}>
                      <Text style={flatListTitle}>Estimation Slips </Text>
                    </View>}
                    data={this.state.pendingDayCloserList}
                    scrollEnabled={true}
                    removeClippedSubviews={false}
                    renderItem={({ item, index }) => (
                      <View style={scss.flatListContainer}>
                        <View style={scss.flatListSubContainer}>
                          <View style={scss.textContainer}>
                            <Text style={scss.highText}>S.No: {index + 1}</Text>
                            <Text selectable={true} style={scss.textStyleLight}>ESNumber:
                              <Text style={scss.textStyleMedium}>{"\n"}{item.dsNumber}</Text>
                            </Text>
                            <Text selectable={true} style={scss.textStyleLight}>MRP:
                              <Text style={scss.textStyleMedium}>{"\n"}{item.mrp}</Text>
                            </Text>
                            <Text selectable={true} style={scss.textStyleLight}>Sales Man:
                              <Text style={scss.textStyleMedium}>{"\n"}{item.salesMan}</Text>
                            </Text>
                          </View>
                        </View>
                      </View>
                    )}
                  />

                  <View style={forms.action_buttons_container}>
                    {this.state.isEnabeldDayCloser ?
                      <TouchableOpacity style={[forms.action_buttons, forms.submit_btn]}
                        onPress={() => this.saveDayCloser()}>
                        <Text style={forms.submit_btn_text} >{I18n.t("Day Close")}</Text>
                      </TouchableOpacity>
                      :
                      <TouchableOpacity style={[forms.action_buttons, forms.submit_btn]}
                        onPress={() => this.saveDay()}>
                        <Text style={forms.submit_btn_text} >{I18n.t("Day Close")}</Text>
                      </TouchableOpacity>}
                  </View>
                </KeyboardAwareScrollView>
              </View>
            </View>
          </Modal>
        </>

      </View>
    );
  }
}

const styles = StyleSheet.create({
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
  imagealign: {
    marginTop: Device.isTablet ? 25 : 20,
    marginRight: Device.isTablet ? 30 : 20,
  }
});


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
  },
});

