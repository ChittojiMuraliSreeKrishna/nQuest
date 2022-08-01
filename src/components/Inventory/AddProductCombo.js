import { FlatList, Text, TextInput, Image, TouchableOpacity, View } from 'react-native';
import React, { Component } from 'react';
import { backButton, headerTitleContainer, headerTitleSubContainer, backButtonImage, headerTitle, flatListMainContainer, flatlistSubContainer, textContainer, highText, textStyleMedium, textStyleLight, buttonContainer, buttonStyle, buttonImageStyle } from '../Styles/Styles';
import { cancelBtn, cancelBtnText, inputField, inputHeading, submitBtn, submitBtnText } from '../Styles/FormFields';
import axios from 'axios';
import InventoryService from '../services/InventoryService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Message from '../Errors/Message';
import { inventoryErrorMessages } from '../Errors/errors';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Device from 'react-native-device-detection';

export default class AddProductCombo extends Component {

  constructor(props) {
    super(props);
    this.state = {
      comboName: "",
      comboQty: "",
      comboPrice: "",
      barCodeId: "",
      storeId: 0,
      domainId: 0,
      selectedDomainId: 0,
      listOfProducts: [],
      comboDescription: "",
      errors: {},
      isEdit: false,
      comboDescription: ''
    };
  }

  async componentDidMount() {
    const domainId = await AsyncStorage.getItem("domainDataId");
    const storeId = await AsyncStorage.getItem("storeId");
    console.log("storeId");
    let selectedDomain = 0;
    if (global.domainName === "Textile") {
      selectedDomain = 1;
    } else {
      selectedDomain = 2;
    }
    this.setState({ storeId: parseInt(storeId), domainId: parseInt(domainId), selectedDomainId: selectedDomain });
  }


  // Back Functions
  cancel() {
    this.props.navigation.goBack(null);
  }
  handleBackButtonClick() {
    this.props.navigation.goBack(null);
  }

  // Validation Form
  validationForm() {
    let isValid = true;
    let errors = {};
    const { listOfProducts, comboName, comboQty, comboPrice } = this.state;
    if (listOfProducts.length < 1) {
      isValid = false;
      errors["product"] = inventoryErrorMessages.products;
    }
    if (comboPrice === "") {
      isValid = false;
      errors["comboPrice"] = inventoryErrorMessages.comboPrice;
    }
    if (comboName.length < 1) {
      isValid = false;
      errors["comboName"] = inventoryErrorMessages.comboName;
      console.log("error");
    }
    if (comboQty.length < 1) {
      isValid = false;
      errors["comboQty"] = inventoryErrorMessages.comboQty;
    }
    this.setState({ errors: errors });
    return isValid;
  }

  // Getting Barcode Details
  getBarcodeDetails() {
    const { selectedDomainId, storeId, barCodeId, listOfProducts } = this.state;
    InventoryService.getBarcodesDetails(storeId, selectedDomainId, barCodeId).then(res => {
      if (res?.data) {
        const { barcode, name, itemMrp, qty, id } = res.data;
        const Details = { barcode, name, itemMrp, qty, id };
        console.log({ Details });
        let count = false;
        console.log(listOfProducts.length);
        if (listOfProducts.length === 0) {
          listOfProducts.push(Details);
        } else {
          for (let i = 0; i < listOfProducts.length; i++) {
            if (listOfProducts[i].barcode === Details.barcode) {
              count = true;
              var items = [...this.state.listOfProducts];
              if (items[i].quantity < items[i].qty) {
                items[i].quantity = items[i].quantity + 1;
                break;
              } else {
                alert("Insufficient quantity");
                break;
              }
            }
          } if (count === false) {
            listOfProducts.push(Details);
          }
        }
        this.setState({ listOfProducts: listOfProducts, barCodeId: '' }, () => {
          listOfProducts.forEach((ele) => {
            if (ele.quantity > 1) { }
            else {
              ele.quantity = parseInt("1");
            }
          });
        });
      }
    });
  }

  // Save Product Combo
  saveProduct() {
    const { listOfProducts, comboQty, storeId, comboName, comboPrice, isEdit, comboDescription, domainId } = this.state;
    const isValid = this.validationForm();
    if (isValid) {
      const comboProductList = listOfProducts.map((item) => {
        const obj = {};
        obj.id = item.id;
        obj.barcode = item.barcode;
        obj.qty = item.quantity;
        obj.mrp = item.itemMrp;
        return obj;
      });

      const requestObj = {
        bundleQuantity: comboQty,
        storeId: storeId,
        description: comboDescription,
        domainId: domainId,
        name: comboName,
        isEdit: isEdit,
        productTextiles: comboProductList,
        itemMrp: comboPrice
      };

      console.log({ requestObj });

      if (listOfProducts.length > 0) {
        InventoryService.addProductCombo(requestObj).then((res) => {
          if (res?.data.isSuccess === "true") {
            alert(res.data.message);
            this.setState({
              listOfProducts: [],
              comboName: '',
              comboPrice: '',
              comboQty: '',
            });
          } else {
            alert(res.data.message);
          }
          this.props.navigation.goBack(null);
        });
      } else {
        alert("please atleast one combo");
      }

    }
  }

  // Delete Barcode
  handleProductDeleteAction(item, index) {
    const listOfProducts = [...this.state.listOfProducts];
    listOfProducts.splice(index, 1);
    this.setState({ listOfProducts });
  }

  // Updating Barcodes quantity
  updateQty = (text, index, item) => {
    const Qty = /^[0-9\b]+$/;
    const { listOfProducts } = this.state;
    const qtyarr = [...listOfProducts];
    console.log("barcode Qty", qtyarr[index].quantity);
    let addItem = '';
    let value = text === '' ? 1 : text;
    if (value !== '' && Qty.test(value) === false) {
      addItem = 1;
      qtyarr[index].quantity = addItem.toString();
    } else {
      if (parseInt(value) < parseInt(qtyarr[index].qty)) {
        addItem = value;
        qtyarr[index].quantity = addItem.toString();
      } else {
        addItem = qtyarr[index].qty;
        qtyarr[index].quantity = addItem.toString();
      }
    }
    this.setState({ listOfProducts: qtyarr });
  };

  // Decrement Table
  decreamentForTable(item, index) {
    const qtyrr = [...this.state.listOfProducts];
    if (qtyrr[index].quantity > 1) {
      var additem = parseInt(qtyrr[index].quantity) - 1;
      qtyrr[index].quantity = additem.toString();
    } else {
      this.state.listOfProducts.splice(index, 1);
    }
    this.setState({ listOfProducts: qtyrr });
  }

  // Increment Table
  incrementForTable(item, index) {
    const qtyrr = [...this.state.listOfProducts];
    if (parseInt(qtyrr[index].quantity) < parseInt(qtyrr[index].qty)) {
      var addItem = parseInt(qtyrr[index].quantity) + 1;
      qtyrr[index].quantity = addItem.toString();
    } else {
      var addItem = parseInt(qtyrr[index].qty);
      qtyrr[index].quantity = addItem.toString();
      alert(`Only ${addItem} items are in this barcode`);
    }
    this.setState({ listOfProducts: qtyrr });
  }

  // Barcode Actions
  handleBarcodeId = (value) => {
    this.setState({ barCodeId: value });
  };

  // Combo name Actions
  handleComboName = (value) => {
    this.setState({ comboName: value });
  };

  // Combo Qty Actions
  handleComboQty = (value) => {
    this.setState({ comboQty: value });
  };

  // Combo Price Actions
  handleComboPrice = (value) => {
    this.setState({ comboPrice: value });
  };


  render() {
    const { errors, listOfProducts } = this.state;
    console.log({ listOfProducts });
    return (
      <View>
        <View style={headerTitleContainer}>
          <View style={headerTitleSubContainer}>
            <TouchableOpacity style={backButton} onPress={() => this.handleBackButtonClick()}>
              <Image style={backButtonImage} source={require('../assets/images/backButton.png')} />
            </TouchableOpacity>
            <Text style={headerTitle}> Add Product Combo </Text>
          </View>
        </View>
        <KeyboardAwareScrollView>
          <View>
            <Text style={inputHeading}>Combo Name</Text>
            <TextInput
              style={inputField}
              underlineColorAndroid="transparent"
              placeholder='Combo Name'
              placeholderTextColor={"#6f6f6f17"}
              textAlignVertical="center"
              autoCapitalize='none'
              value={this.state.comboName}
              onChangeText={this.handleComboName}
            />
            <Message imp={false} message={errors["comboName"]} />
            <Text style={inputHeading}>Combo Price</Text>
            <TextInput
              style={inputField}
              underlineColorAndroid="transparent"
              placeholder='Combo Name'
              placeholderTextColor={"#6f6f6f17"}
              textAlignVertical="center"
              autoCapitalize='none'
              value={this.state.comboPrice}
              onChangeText={this.handleComboPrice}
            />
            <Message imp={false} message={errors["comboPrice"]} />
            <Text style={inputHeading}>Combo Qty</Text>
            <TextInput
              style={inputField}
              underlineColorAndroid="transparent"
              placeholder='Combo Qty'
              placeholderTextColor={"#6f6f6f17"}
              textAlignVertical="center"
              autoCapitalize='none'
              value={this.state.comboQty}
              onChangeText={this.handleComboQty}
            />
            <Message imp={false} message={errors["comboQty"]} />
            <Text style={inputHeading}>Barcode</Text>
            <TextInput
              style={inputField}
              underlineColorAndroid="transparent"
              placeholder='Barcode'
              placeholderTextColor={"#6f6f6f17"}
              textAlignVertical="center"
              autoCapitalize='none'
              value={this.state.barCodeId}
              onChangeText={this.handleBarcodeId}
              onEndEditing={() => { this.getBarcodeDetails(); }}
            />
            <Message imp={false} message={errors["product"]} />
          </View>
          <View>
            <FlatList
              data={this.state.listOfProducts}
              style={{ marginTop: 20 }}
              scrollEnabled={true}
              ListEmptyComponent={<Text style={{ textAlign: 'center', color: '#cc241d', fontSize: 18 }}>Products List is empty</Text>}
              renderItem={({ item, index }) => (
                <View style={flatListMainContainer}>
                  <View style={flatlistSubContainer}>
                    <View style={textContainer}>
                      <Text style={highText}>S.No {index + 1}</Text>
                      <View style={buttonContainer}>
                        <TouchableOpacity style={buttonStyle} onPress={() => this.handleProductDeleteAction(item, index)}>
                          <Image style={buttonImageStyle} source={require('../assets/images/delete.png')} />
                        </TouchableOpacity>
                      </View>
                    </View>
                    <View style={textContainer}>
                      <Text style={textStyleMedium}>Barcode: {item.barcode}</Text>
                      <Text style={textStyleLight}>Product Name: {item.name}</Text>
                    </View>
                    <View style={textContainer}>
                      <Text style={textStyleLight}>Unit Price: {item.itemMrp}</Text>
                      <View style={buttonContainer}>
                        <Text style={textStyleLight}>Unit Qty: </Text>
                        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                          <TouchableOpacity style={{
                            borderColor: '#d7d7d7',
                            height: 20,
                            width: 20,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                          }}
                            onPress={() => this.decreamentForTable(item, index)}>
                            <Image style={{ height: 20, width: 20 }} source={require('../../commonUtils/assets/Images/decrease_qty.png')} />
                          </TouchableOpacity>
                          <TextInput
                            style={{
                              justifyContent: 'center',
                              height: 25,
                              width: 25,
                              borderColor: '#d7d7d7',
                              backgroundColor: 'white',
                              color: '#d7d7d7',
                              borderWidth: 1,
                              borderRadius: 8,
                              fontFamily: 'regular',
                              fontSize: 14,
                              paddingLeft: 9,
                            }}
                            value={item.quantity}
                            placeholder='1'
                            placeholderTextColor={'#d7d7d7'}
                            keyboardType='number-pad'
                            underlineColorAndroid="transparent"
                            onChangeText={(text) => this.updateQty(text, index, item)}
                          />
                          <TouchableOpacity style={{
                            borderColor: '#d7d7d7',
                            height: 20,
                            width: 20,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                          }}
                            onPress={() => this.incrementForTable(item, index)}>
                            <Image style={{ height: 20, width: 20 }} source={require('../../commonUtils/assets/Images/increase_quantity.png')} />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              )}
            />
          </View>
          <TouchableOpacity style={submitBtn} onPress={() => { this.saveProduct(); }}>
            <Text style={submitBtnText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={cancelBtn} onPress={() => { this.cancel(); }}>
            <Text style={cancelBtnText}>Cancel</Text>
          </TouchableOpacity>
          <View style={{ margin: 50 }}></View>
        </KeyboardAwareScrollView>
      </View>
    );
  }
}
