import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Device from 'react-native-device-detection';
import I18n from 'react-native-i18n';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Appbar, TextInput } from 'react-native-paper';
import RNPickerSelect from 'react-native-picker-select';
import RazorpayCheckout from 'react-native-razorpay';
import { Chevron } from 'react-native-shapes';
import AccountingService from '../services/AccountingService';
import { cancelBtn, cancelBtnText, inputArea, inputField, inputFieldDisabled, inputHeading, rnPicker, rnPickerContainer, submitBtn, submitBtnText } from '../Styles/FormFields';


var deviceWidth = Dimensions.get('window').width;

export default class AddDebitNotes extends Component {

  constructor(props) {
    super(props);
    this.state = {
      customerName: "",
      customerId: "",
      mobileNumber: "",
      storeName: "",
      approvedBy: "",
      transanctionMode: "",
      debitAmount: 0,
      payableAmount: 0,
      comments: "",
      trasanctionTypes: [
        { label: 'Cash', value: 'Cash' }
      ],
    };
  }

  async componentDidMount() {
    const userName = await AsyncStorage.getItem("username")
    const storeId = await AsyncStorage.getItem("storeId")
    const storeName = await AsyncStorage.getItem("storeName")
    this.setState({
      storeId: storeId,
      storeName: storeName,
      approvedBy: userName,
      customerName: this.props.route.params.item.customerName,
      customreId: this.props.route.params.item.customerId,
      debitAmount: this.props.route.params.item.amount.toString(),
      mobileNumber: this.props.route.params.item.mobileNumber,
    })
    console.log("items", this.props.route.params.item)
  }


  handleBackButtonClick() {
    this.props.navigation.goBack();
    // return true;
  }

  handleCustomerName = (value) => {
    this.setState({ customerName: value });
  };

  handleMobileNumber = (value) => {
    this.setState({ mobileNumber: value });
  };

  handleApprovedBy = (value) => {
    this.setState({ approvedBy: value });
  };

  handleComments = (value) => {
    this.setState({ comments: value })
  }

  handletransactionType = (value) => {
    this.setState({ transanctionMode: value })
  }

  handleStoreName = (value) => {
    this.setState({ storeName: value })
  }

  handledebitAmount = (value) => {
    this.setState({ debitAmount: value })
  }

  handlePayableAmount = (value) => {
    this.setState({ payableAmount: value })
    console.log(this.state.payableAmount)
  }

  saveDebit() {
    const { customreId, comments, storeId, mobileNumber, payableAmount, transanctionMode } = this.state
    const obj = {
      comments: comments,
      amount: payableAmount,
      customerId: customreId,
      storeId: storeId,
      transactionType: "DEBIT",
      accountType: "DEBIT",
      paymentType: transanctionMode
    }
    console.log("params", obj)
    AccountingService.saveDebit(obj).then(res => {
      if (res) {
        if (transanctionMode === 'Card') {
          this.savePayment(res.data.amount, res.data.referenceNumber);
        } else if (transanctionMode === 'Cash') {
          this.props.route.params.onGoBack()
          this.props.navigation.goBack()
        }
        console.log(res.data)
        // alert(res.data.message)
      } else {
        this.props.route.params.onGoBack()
        this.props.navigation.goBack()
      }
    }).catch(err => {
      console.log(err)
      this.props.route.params.onGoBack()
      this.props.navigation.goBack()
    })
  }

  savePayment = (cardAmount, referenceNumber) => {
    const reqObj = {
      amount: cardAmount,
      type: "C",
      referenceNumber: referenceNumber
    }
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
          toast.success("Payment Done Successfully");
          let status = true
          const param = '?razorPayId=' + response.razorpay_order_id + '&payStatus=' + status;
          const result = axios.post(BASE_URL + NEW_SALE_URL.saveSale + param, {});
        },
        prefill: {
          name: "Kadali",
          email: "kadali@gmail.com",
          contact: "9999999999",
        },
      };
      RazorpayCheckout.open(options).then((data) => {
        this.setState({ tableData: [] });
        alert(`Success: ${data.razorpay_payment_id}`);
        this.props.navigation.goBack();
      }).catch(err => {
        console.log(err)
        alert(`Error: ${JSON.stringify(err.code)} | ${JSON.stringify(err.description)}`);
      })
    })
  }

  cancel() {
    this.props.navigation.goBack(null);
    return true;
  }

  render() {
    return (
      <View>
        <Appbar mode="center-aligned" style={styles.mainContainer}>
          <Appbar.BackAction
            onPress={() => this.handleBackButtonClick()}
          />
          <Appbar.Content title={I18n.t("Add Debit Notes")} />
        </Appbar>
        <KeyboardAwareScrollView>
          <Text style={inputHeading}>{I18n.t("Mobile Number")}</Text>
          <TextInput
            style={inputFieldDisabled}
            mode='flat'
            label={I18n.t("Mobile Number")}
            disabled
            value={this.state.mobileNumber}
            onChangeText={this.handleMobileNumber}
          />
          <Text style={inputHeading}>{I18n.t("Customer Name")}</Text>
          <TextInput
            style={inputFieldDisabled}
            mode='flat'
            label={I18n.t("Customer Name")}
            disabled
            value={this.state.customerName}
            onChangeText={this.handleCustomerName}
          />
          <Text style={inputHeading}>{I18n.t("Debit Amount")}</Text>
          <TextInput
            style={inputFieldDisabled}
            mode='flat'
            label={I18n.t("Debit Amount")}
            disabled
            value={this.state.debitAmount}
            onChangeText={this.handledebitAmount}
          />
          <Text style={inputHeading}>{I18n.t("Store")}</Text>
          <TextInput
            style={inputFieldDisabled}
            mode='flat'
            label={I18n.t("Store Name")}
            disabled
            value={this.state.storeName}
            onChangeText={this.handleStoreName}
          />
          <Text style={inputHeading}>{I18n.t("Approved By")}</Text>
          <TextInput
            style={inputFieldDisabled}
            mode='flat'
            label={I18n.t("Approved By")}
            disabled
            value={this.state.approvedBy}
            onChangeText={this.handleApprovedBy}
          />
          <Text style={inputHeading}>{I18n.t("Payment Type")}</Text>
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
          {this.state.transanctionMode === "Cash" &&
            (<View>
              <Text style={inputHeading}>{I18n.t("Payable Cash")}</Text>
              <TextInput
                style={inputField}
                mode='flat'
                keyboardType='phone-pad'
                activeUnderlineColor='#000'
                underlineColor={'#6f6f6f'}
                label={I18n.t("Payable Cash")}
                value={this.state.payableAmount}
                onChangeText={this.handlePayableAmount}
              />
            </View>)
          }
          <Text style={inputHeading}>{I18n.t("Comments")}</Text>
          <TextInput
            style={inputArea}
            label={I18n.t('Comments')}
            activeUnderlineColor='#000'
            underlineColor={'#6f6f6f'}
            multiline
            numberOfLines={5}
            mode="flat"
            value={this.state.comments}
            onChangeText={this.handleComments}
          />
          <TouchableOpacity style={submitBtn}
            onPress={() => this.saveDebit()}>
            <Text style={submitBtnText}>{I18n.t("SAVE")}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={cancelBtn}
            onPress={() => this.cancel()}>
            <Text style={cancelBtnText}>{I18n.t("CANCEL")}</Text>
          </TouchableOpacity>
        </KeyboardAwareScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  imagealign: {
    marginTop: Device.isTablet ? 25 : 20,
    marginRight: Device.isTablet ? 30 : 20,
  },
  mainContainer: {
    backgroundColor: "#FFFFFF"
  }
})
