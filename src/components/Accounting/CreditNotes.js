import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import { Dimensions, FlatList, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import DatePicker from 'react-native-date-picker';
import Device from 'react-native-device-detection';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Modal from 'react-native-modal';
import RNPickerSelect from 'react-native-picker-select';
import { Chevron } from 'react-native-shapes';
import AccountingService from '../services/AccountingService';
import { cancelBtn, cancelBtnText, datePickerBtnText, datePickerButton1, datePickerButton2, dateSelector, dateText, inputField, rnPicker, rnPickerContainer, submitBtn, submitBtnText } from '../Styles/FormFields';
import { deleteCloseBtn, deleteContainer, deleteHeader, deleteHeading, deleteText, filterCloseImage, filterHeading, filterMainContainer, filterSubContainer } from '../Styles/PopupStyles';
import { buttonContainer, buttonImageStyle, buttonStyle, buttonStyle1, filterBtn, flatListHeaderContainer, flatListMainContainer, flatlistSubContainer, flatListTitle, highText, textContainer, textStyleLight, textStyleMedium } from '../Styles/Styles';
var deviceWidth = Dimensions.get("window").width;
import { RH, RF, RW } from '../../Responsive';
import Loader from '../../commonUtils/loader';

export default class CreditNotes extends Component {

  constructor(props) {
    super(props);
    this.state = {
      deleteCreditNotes: false,
      modalVisible: true,
      filterCreditData: [],
      creditNotes: [],
      storeId: 0,
      userId: 0,
      fromDate: "",
      toDate: "",
      mobileNumber: "",
      customerId: "",
      mobile: "",
      date: new Date(),
      enddate: new Date(),
      storeName: "",
      stores: [],
      fromDate: "",
      startDate: "",
      endDate: "",
      toDate: "",
      datepickerOpen: false,
      datepickerendOpen: false,
      isShowAllTransactions: false,
      transactionHistory: [],
      loading: false,
      filterActive: false,
      flagFilterOpen: false,
    };
  }

  modelCancel() {
    this.setState({ modalVisible: false, flagFilterOpen: false, isShowAllTransactions: false })
  }


  async componentDidMount() {
    const storeId = await AsyncStorage.getItem("storeId")
    const userId = await AsyncStorage.getItem('custom:userId')
    this.setState({ storeId: storeId, userId: userId })
    this.getAllCreditNotes()
  }

  async getAllCreditNotes() {
    this.setState({ loading: true })
    const accountType = 'CREDIT';
    const { storeId } = this.state
    console.log(storeId)
    const reqOb = {
      fromDate: null,
      mobileNumber: null,
      storeId: storeId,
      toDate: null,
      accountType: accountType,
      customerId: null
    }
    AccountingService.getCreditNotes(reqOb).then(res => {
      if (res) {
        console.log(res.data.content)
        this.setState({ creditNotes: res.data.content, })
      }
      this.setState({ loading: false })
    })
  }


  applyCreditNotesFilter() {
    this.setState({ loading: true })
    const accountType = 'CREDIT';
    const { storeId, startDate, endDate, mobileNumber } = this.state
    const reqOb = {
      fromDate: startDate,
      toDate: endDate,
      mobileNumber: mobileNumber ? `+91${mobileNumber}` : null,
      storeId: storeId,
      accountType: accountType,
      customerId: null
    }
    console.log(reqOb)
    AccountingService.getCreditNotes(reqOb).then(res => {
      if (res) {
        // console.log(res.data)
        this.setState({ filterCreditData: res.data.content, filterActive: true })
      }
      this.setState({ loading: false, modalVisible: false, flagFilterOpen: false })
    }).catch(err => {
      console.log(err)
      this.setState({ loading: false, modalVisible: false, flagFilterOpen: false })
    })
  }

  handleStoreName = (value) => {
    this.setState({ storeName: value });
  };

  datepickerClicked() {
    this.setState({ datepickerOpen: true });
  }

  enddatepickerClicked() {
    this.setState({ datepickerendOpen: true });
  }

  handleMobile = (value) => {
    this.setState({ mobileNumber: value });
  };

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


  handleViewCredit(item, index) {
    const reqOb = {
      fromDate: null,
      mobileNumber: null,
      storeId: item.storeId,
      toDate: null,
      accountType: item.accountType,
      customerId: item.customerId
    }
    AccountingService.getAllLedgerLogs(reqOb).then(res => {
      if (res) {
        this.setState({
          isShowAllTransactions: true,
          modalVisible: true,
          transactionHistory: res.data.content
        })
      }
    })
  }

  handleAddCredit(item, index) {
    this.props.navigation.navigate('AddCreditNotes', {
      item: item, isEdit: true,
      onGoBack: () => this.getAllCreditNotes(),
    });
  }

  // Filter Actions
  filterAction() {
    this.setState({ flagFilterOpen: true, modalVisible: true })
  }

  clearFilterAction() {
    this.setState({ filterActive: false, mobileNumber: "", startDate: "", endDate: "", date: new Date(), enddate: new Date() })
    this.getAllCreditNotes()
  }


  render() {
    return (
      <View>
        {this.state.loading &&
          <Loader
            loading={this.state.loading} />
        }
        <FlatList
          ListHeaderComponent={<View style={flatListHeaderContainer}>
            <Text style={flatListTitle}>Credit Notes</Text>
            {!this.state.filterActive &&
              <TouchableOpacity
                style={filterBtn}
                onPress={() => this.filterAction()} >
                <Image style={{ alignSelf: 'center', top: 5 }} source={require('../assets/images/promofilter.png')} />
              </TouchableOpacity>

            }
            {this.state.filterActive &&
              <TouchableOpacity
                style={filterBtn}
                onPress={() => this.clearFilterAction()} >
                <Image style={{ alignSelf: 'center', top: 5 }} source={require('../assets/images/clearFilterSearch.png')} />
              </TouchableOpacity>
            }
          </View>}
          data={this.state.filterActive ? this.state.filterCreditData : this.state.creditNotes}
          style={{ marginTop: 10 }}
          scrollEnabled={true}
          // ListEmptyComponent={<Text style={listEmptyMessage}>&#9888; Records Not Found</Text>}
          renderItem={({ item, index }) => (
            <View style={flatListMainContainer} >
              <View style={flatlistSubContainer}>
                <View style={textContainer}>
                  <Text style={highText}>#CRM ID: {item.customerId}</Text>
                  <Text style={textStyleLight}>DATE: {item.createdDate ? item.createdDate.toString().split(/T/)[0] : item.createdDate}</Text>
                </View>
                <View style={textContainer}>
                  <Text style={textStyleMedium}>STORE: {item.storeId}</Text>
                  <Text style={textStyleLight}>APPROVED BY: {"\n"}{item.createdBy}</Text>
                </View>
                <View style={textContainer}>
                  <Text style={textStyleLight}>USED AMMOUNT: {item.usedAmount}</Text>
                  <Text style={textStyleLight}>BALANCE: {item.amount}</Text>
                </View>
                <View style={textContainer}>
                  <Text style={textStyleMedium}>Name: {item.customerName}</Text>
                  <View style={buttonContainer}>
                    <TouchableOpacity style={buttonStyle1} onPress={() => this.handleViewCredit(item, index)}>
                      <Image style={buttonImageStyle} source={require('../assets/images/eye.png')} />
                    </TouchableOpacity>

                    <TouchableOpacity style={buttonStyle} onPress={() => this.handleAddCredit(item, index)}>
                      <Text style={{ fontSize: RF(20), textAlign: 'center', color: '#00000050' }}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          )}
        />
        {this.state.flagFilterOpen && (
          <View>
            <Modal isVisible={this.state.modalVisible} style={{ margin: 0 }}>
              <View style={filterMainContainer} >
                <KeyboardAwareScrollView enableOnAndroid={true} >
                  <View style={filterSubContainer}>
                    <View>
                      <Text style={filterHeading} > Filter by </Text>
                    </View>
                    <View>
                      <TouchableOpacity style={filterCloseImage} onPress={() => this.modelCancel()}>
                        <Image style={{ margin: RH(5) }} source={require('../assets/images/modelcancel.png')} />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={dateSelector}
                    testID="openModal"
                    onPress={() => this.datepickerClicked()}
                  >
                    <Text
                      style={dateText}
                    >{this.state.startDate == "" ? 'START DATE' : this.state.startDate}</Text>
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
                      <DatePicker style={styles.date}
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
                    >{this.state.endDate == "" ? 'END DATE' : this.state.endDate}</Text>
                    <Image style={styles.calenderpng} source={require('../assets/images/calender.png')} />
                  </TouchableOpacity>
                  {this.state.datepickerendOpen && (
                    <View style={styles.dateTopView}>
                      <View style={styles.dateTop2}>
                        <TouchableOpacity
                          style={datePickerButton1} onPress={() => this.datepickerCancelClicked()}
                        >
                          <Text style={datePickerBtnText}  > Cancel </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={datePickerButton2} onPress={() => this.datepickerendDoneClicked()}
                        >
                          <Text style={datePickerBtnText}  > Done </Text>
                        </TouchableOpacity>
                      </View>
                      <DatePicker style={styles.date}
                        date={this.state.enddate}
                        mode={'date'}
                        onDateChange={(enddate) => this.setState({ enddate })}
                      />
                    </View>
                  )}
                  <TextInput
                    style={inputField}
                    underlineColorAndroid="transparent"
                    placeholder="MOBILE"
                    maxLength={10}
                    keyboardType={'numeric'}
                    textContentType='telephoneNumber'
                    placeholderTextColor="#6F6F6F"
                    textAlignVertical="center"
                    autoCapitalize="none"
                    value={this.state.mobileNumber}
                    onChangeText={this.handleMobile}
                  />

                  <TouchableOpacity style={submitBtn}
                    onPress={() => this.applyCreditNotesFilter()}>
                    <Text style={submitBtnText} >APPLY</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={cancelBtn}
                    onPress={() => this.modelCancel()}>
                    <Text style={cancelBtnText}>CANCEL</Text>
                  </TouchableOpacity>

                </KeyboardAwareScrollView>
              </View>
            </Modal>
          </View>
        )}
        {this.state.isShowAllTransactions && (
          <View>
            <Modal style={{ margin: 0 }} isVisible={this.state.modalVisible}>
              <View style={filterMainContainer}>
                <View>
                  <View style={filterSubContainer}>
                    <View>
                      <Text style={filterHeading}>Transaction History</Text>
                    </View>
                    <View>
                      <TouchableOpacity style={filterCloseImage} onPress={() => this.modelCancel()}>
                        <Image style={{ margin: RH(5) }} source={require('../assets/images/modelcancel.png')} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                <ScrollView>
                  <FlatList
                    data={this.state.transactionHistory}
                    scrollEnabled={true}
                    renderItem={({ item, index }) => (
                      <View style={flatListMainContainer}>
                        <View style={flatlistSubContainer}>
                          <View style={textContainer}>
                            <Text style={highText}>#CRM ID: {item.customerId}</Text>
                            <Text style={textStyleMedium}>STORE: {item.storeId}</Text>
                          </View>
                          <View style={textContainer}>
                            <Text style={textStyleLight}>TRANSACTION TYPE: {"\n"}{item.transactionType}</Text>
                            <Text style={textStyleLight}>ACCOUNT TYPE: {"\n"}{item.accountType}</Text>
                          </View>
                          <View style={textContainer}>
                            <Text style={textStyleLight}>AMOUNT: {item.amount}</Text>
                            <Text style={textStyleLight}>DATE: {item.createdDate ? item.createdDate.toString().split(/T/)[0] : item.createdDate}</Text>
                          </View>
                        </View>
                      </View>
                    )}
                  />
                </ScrollView>
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

  // Styles For Mobile

  filterMainContainer_mobile: {
    width: deviceWidth,
    alignItems: 'center',
    marginLeft: -20,
    backgroundColor: "#ffffff",
    height: 400,
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
    width: 50, height: 50,
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
  },




});