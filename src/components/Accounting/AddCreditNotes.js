import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { Component } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Device from 'react-native-device-detection';
import RNPickerSelect from 'react-native-picker-select';
import RazorpayCheckout from 'react-native-razorpay';
import { Chevron } from 'react-native-shapes';
import { ACCOUNTING_PORTAL } from '../../commonUtils/ApiConstants';
import { BASE_URL } from '../../commonUtils/Base';
import AccountingService from '../services/AccountingService';
import NewSaleService from '../services/NewSaleService';
import { cancelBtn, cancelBtnText, inputArea, inputField, inputFieldDisabled, inputHeading, rnPicker, rnPickerContainer, submitBtn, submitBtnText } from '../Styles/FormFields';
import { backButton, backButtonImage, headerTitle, headerTitleContainer, headerTitleSubContainer } from '../Styles/Styles';
var deviceWidth = Dimensions.get('window').width;

export default class AddCreditNotes extends Component {

  constructor(props) {
    super(props);
    this.state = {
      customerName: "",
      customerId: "",
      mobileNumber: "",
      empId: "",
      creditAmmount: "",
      storeName: "",
      approves: [],
      approvedBy: "",
      datepickerOpen: false,
      date: new Date(),
      fromDate: "",
      createdDate: "",
      createdBy: "",
      comments: "",
      trasanctionTypes: [
        { label: 'Card', value: 'Card' },
        { label: 'Cash', value: 'Cash' }
      ],
      transanctionMode: '',
      isEdit: false,
    };
  }

  async componentDidMount() {
    const userName = await AsyncStorage.getItem("username");
    const storeId = await AsyncStorage.getItem("storeId");
    const storeName = await AsyncStorage.getItem("storeName");
    this.setState({ createdBy: userName, storeId: storeId, storeName: storeName, isEdit: this.props.route.params.isEdit });
    if (this.state.isEdit === true) {
      this.setState({
        isCredit: true,
        isAddMore: true,
        customerId: this.props.route.params.item.customerId,
        storeId: this.props.route.params.item.storeId,
        customerName: this.props.route.params.item.customerName,
        mobileNumber: this.props.route.params.item.mobileNumber
      });
    }
  }


  handleBackButtonClick() {
    this.props.navigation.goBack(null);
    return true;
  }

  handleCustomerName = (value) => {
    this.setState({ customerName: value });
  };

  handleMobileNumber = (value) => {
    this.setState({ mobileNumber: value });
  };

  handleEmpId = (value) => {
    this.setState({ empId: value });
  };

  handleCreditAmmount = (value) => {
    this.setState({ creditAmmount: value });
  };

  handleStore = (value) => {
    this.setState({ storeName: value });
  };


  handleComments = (value) => {
    this.setState({ comments: value });
  };

  handleCretedBy = (value) => {
    this.setState({ createdBy: value });
  };

  handletransactionType = (value) => {
    this.setState({ transanctionMode: value });
  };

  cancel() {
    this.props.navigation.goBack(null);
    return true;
  }

  getCustomerDetails = () => {
    NewSaleService.getMobileData(this.state.isEdit ? "" : "+91" + this.state.mobileNumber).then(res => {
      if (res && res.data.result) {
        this.setState({ customerName: res.data.result.userName, customerId: res.data.result.userId });
      }
    });
  };

  saveCredit() {
    const { comment, storeId, creditAmmount, transanctionMode, customerId } = this.state;
    const obj = {
      comments: comment ? comment : "",
      amount: creditAmmount,
      customerId: customerId,
      storeId: storeId,
      transactionType: "CREDIT",
      accountType: "CREDIT",
      paymentType: transanctionMode
    };
    console.log({ obj });
    AccountingService.saveCredit(obj).then(res => {
      console.log({ res });
      if (res) {
        if (transanctionMode === "Card") {
          console.log('\n')
          this.savePayment(res.data.amount, res.data.referenceNumber);
          console.log('\n')
        } else {
          this.props.route.params.onGoBack();
          this.props.navigation.goBack();
        }
        if (res.status === 200) {
          alert("credit notes created successfully");
        }
      } else {
        this.props.route.params.onGoBack();
        this.props.navigation.goBack();
      }
      console.log(res);
    }).catch(err => {
      console.log(err);
      this.props.route.params.onGoBack();
      this.props.navigation.goBack();
    });
  }

  savePayment = (cardAmount, referenceNumber) => {
      let self = this;
    const reqObj = {
      amount: cardAmount,
      type: "C",
      referenceNumber: referenceNumber
    };
    AccountingService.creditDebitOrder(reqObj).then((res) => {
      const options = {
        // process.env.RAZORPAY_KEY_ID
        key: "rzp_test_z8jVsg0bBgLQer",
        currency: "INR",
        amount: res.data.result.amount,
        name: "OTSI",
        description: "Transaction",
        image: 'https://i.imgur.com/3g7nmJC.png',
        order_id: res.data.result.razorPayId,
        handler: function (response) {
          alert("Payment Done Successfully");
          console.log('++++++++++Rayanna+++++++', self);
          let status = true;
          const param = '?razorPayId=' + response.razorpay_order_id + '&payStatus=' + status;
          const result = axios.post(BASE_URL + ACCOUNTING_PORTAL.saveSale + param, {});
          console.log('++++++++++Rayanna+++++++', result);
        },
        prefill: {
          name: "Kadali",
          email: "kadali@gmail.com",
          contact: "9999999999",
        },
      };
      const paymentObject = new RazorpayCheckout.open(options)
      paymentObject.open()
      //   .then((data) => {
      //   this.setState({ tableData: [] });
      //   alert(`Success: ${data.razorpay_payment_id}`);
      //   this.props.navigation.goBack();
      // }).catch(err => {
      //   console.log(err);
      //   alert(`Error: ${JSON.stringify(err.code)} | ${JSON.stringify(err.description)}`);
      // });
    });
  };

  render() {
    const { isEdit } = this.state;
    return (
      <View style={styles.mainContainer}>
        {this.state.loading &&
          <Loader
            loading={this.state.loading} />
        }
        <View style={headerTitleContainer} >
          <View style={headerTitleSubContainer}>
            <TouchableOpacity style={backButton} onPress={() => this.handleBackButtonClick()}>
              <Image style={backButtonImage} source={require('../assets/images/backButton.png')} />
            </TouchableOpacity>
            <Text style={headerTitle}>
              Add Credit Notes
            </Text>
          </View>
        </View>
        <ScrollView>
          <Text
            style={{
              color: "#ED1C24",
              fontSize: Device.isTablet ? 19 : 14,
              fontFamily: 'medium',
              margin: 15,
            }}
          >Credit information</Text>
          <Text style={inputHeading}>Mobile Number</Text>
          <TextInput
            style={inputField}
            underlineColorAndroid="transparent"
            placeholder="MOBILE NUMBER"
            placeholderTextColor="#6F6F6F"
            textAlignVertical="center"
            maxLength={isEdit ? 13 : 10}
            autoCapitalize="none"
            value={this.state.mobileNumber}
            onChangeText={this.handleMobileNumber}
            onBlur={this.getCustomerDetails}
          />
          <Text style={inputHeading}>Customer Name</Text>
          <TextInput
            style={inputFieldDisabled}
            underlineColorAndroid="transparent"
            placeholder="CUSTOMER NAME"
            editable={false}
            placeholderTextColor="#000000"
            textAlignVertical="center"
            autoCapitalize="none"
            value={this.state.customerName}
            onChangeText={this.handleCustomerName}
          />
          <Text style={inputHeading}>Credit Amount</Text>
          <TextInput
            style={inputField}
            underlineColorAndroid="transparent"
            placeholder="CREDIT AMOUNT"
            placeholderTextColor="#6F6F6F"
            textAlignVertical="center"
            autoCapitalize="none"
            value={this.state.creditAmmount}
            onChangeText={this.handleCreditAmmount}
          />
          <Text style={inputHeading}>Store</Text>
          <TextInput
            style={inputFieldDisabled}
            underlineColorAndroid="transparent"
            placeholder="STORE"
            editable={false}
            placeholderTextColor="#000000"
            textAlignVertical="center"
            autoCapitalize="none"
            value={this.state.storeName}
            onChangeText={this.handleStore}
          />
          <Text style={inputHeading}>Created By</Text>
          <TextInput
            style={inputFieldDisabled}
            underlineColorAndroid="transparent"
            placeholder="CREATED BY"
            editable={false}
            placeholderTextColor="#000000"
            textAlignVertical="center"
            autoCapitalize="none"
            value={this.state.createdBy}
            onChangeText={this.handleCretedBy}
          />
          <Text style={inputHeading}>Payment Type</Text>
          <View style={rnPickerContainer}>
            <RNPickerSelect
              placeholder={{
                label: 'Payment Type',
                value: "",
              }}
              Icon={() => {
                return <Chevron style={styles.imagealign} size={1.5} color="gray" />;
              }}
              items={this.state.trasanctionTypes}
              onValueChange={this.handletransactionType}
              style={rnPicker}
              value={this.state.transanctionMode}
              useNativeAndroidPickerStyle={false}
            />
          </View>
          <Text style={inputHeading}>Comments</Text>
          <TextInput
            style={inputArea}
            underlineColorAndroid="transparent"
            placeholder="COMMENTS"
            editable={false}
            placeholderTextColor="#6F6F6F"
            textAlignVertical="center"
            autoCapitalize="none"
            value={this.state.comments}
            onChangeText={this.handleComments}
          />
          <TouchableOpacity style={submitBtn}
            onPress={() => this.saveCredit()}>
            <Text style={submitBtnText}>SAVE</Text>
          </TouchableOpacity>
          <TouchableOpacity style={cancelBtn}
            onPress={() => this.cancel()}>
            <Text style={cancelBtnText}>CANCEL</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imagealign: {
    marginTop: Device.isTablet ? 25 : 20,
    marginRight: Device.isTablet ? 30 : 20,
  },
  bottomContainer: {
    margin: 50,
  },


});
