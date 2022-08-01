import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { Component } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Device from 'react-native-device-detection';
import RNPickerSelect from 'react-native-picker-select';
import { Chevron } from 'react-native-shapes';
import Loader from '../../commonUtils/loader';
import InventoryService from '../services/InventoryService';
import LoginService from '../services/LoginService';
import I18n from 'react-native-i18n';
import { RH, RW, RF } from '../../Responsive';

var deviceWidth = Dimensions.get('window').width;

class EditBarcode extends Component {

  constructor(props) {
    super(props);
    this.state = {
      division: '',
      section: "",
      subSection: "",
      category: "",
      colour: "",
      batchNo: "",
      costPrice: 0,
      listPrice: 0,
      uomName: "",
      hsnCode: "",
      store: "",
      empId: "",
      quantity: "",
      divisionArray: [],
      divisions: [],
      divisionId: 0,
      secionArray: [],
      secions: [],
      sectionId: 0,
      subsecionArray: [],
      subsecions: [],
      subsectionId: 0,
      catogiriesArray: [],
      catogiries: [],
      catogirieId: 0,
      uom: [],
      uomArray: [],
      uomId: 0,
      hsncodes: [],
      hsncodesArray: [],
      hsnId: "",
      storeNamesArray: [],
      storeNames: [],
      storeId: 1,
      domainId: 1,
      item: [],
      storeName: "",
      productTextileId: 0,
      barcodeTextileId: 0,
      name: "",
    };
  }

  componentDidMount() {
    var domainStringId = "";
    var storeStringId = "";
    var storeName = "";

    AsyncStorage.getItem("storeId").then((value) => {
      storeStringId = value;
      this.setState({ storeId: parseInt(storeStringId) });
    }).catch(() => {
      this.setState({ loading: false });
      console.log('There is error getting storeId');
    });

    AsyncStorage.getItem("storeName").then((value) => {
      this.setState({ storeName: value });
    });

    const editBcode = this.props.route.params;
    console.log({ editBcode });
    this.setState({
      divisionId: this.props.route.params.item.division,
      sectionId: this.props.route.params.item.section,
      subsectionId: this.props.route.params.item.subSection,
      catogirieId: this.props.route.params.item.category,
      colour: this.props.route.params.item.colour,
      batchNo: this.props.route.params.item.batchNo,
      costPrice: String(this.props.route.params.item.costPrice),
      listPrice: String(this.props.route.params.item.itemMrp),
      uomName: this.props.route.params.item.uom,
      hsnCode: this.props.route.params.item.hsnCode,
      empId: this.props.route.params.item.empId,
      storeId: this.props.route.params.item.storeId,
      quantity: String(this.props.route.params.item.qty),
      productTextileId: this.props.route.params.item.productTextileId,
      barcodeTextileId: this.props.route.params.item.barcodeTextileId,
      name: this.props.route.params.item.name,
      reBar: this.props.route.params.item.reBar
    });
  }

  getAllDivisions() {
    var divisions = [];
    axios.get(InventoryService.getAllDivisions(),).then((res) => {
      if (res.data["result"]) {
        for (var i = 0; i < res.data["result"].length; i++) {

          this.state.divisionArray.push({ name: res.data["result"][i].name, id: res.data["result"][i].id });
          if (this.state.divisionArray[i].id === this.state.divisionId) {
            this.setState({ division: this.state.divisionArray[i].name });
            this.getAllSections();
          }

          divisions.push({
            value: this.state.divisionArray[i].name,
            label: this.state.divisionArray[i].name
          });
          // console.log(this.state.divisionArray)
        }
        this.setState({
          divisions: divisions,
        });

        this.setState({ divisionArray: this.state.divisionArray });
      }

    });

  }


  getAllSections() {
    const params = {
      "id": this.state.divisionId
    };
    var secions = [];
    axios.get(InventoryService.getAllSections(), { params }).then((res) => {
      if (res.data["result"]) {
        for (var i = 0; i < res.data["result"].length; i++) {

          this.state.secionArray.push({ name: res.data["result"][i].name, id: res.data["result"][i].id });
          if (this.state.secionArray[i].id === this.state.sectionId) {
            this.setState({ section: this.state.secionArray[i].name });
            this.getAllSubsections();
          }

          secions.push({
            value: this.state.secionArray[i].name,
            label: this.state.secionArray[i].name
          });
        }
        this.setState({
          secions: secions,
        });

        this.setState({ secionArray: this.state.secionArray });
      }

    });
  }

  getAllSubsections() {
    const params = {
      "id": this.state.sectionId
    };
    var subsecions = [];
    axios.get(InventoryService.getAllSections(), { params }).then((res) => {
      if (res.data["result"]) {
        for (var i = 0; i < res.data["result"].length; i++) {

          this.state.subsecionArray.push({ name: res.data["result"][i].name, id: res.data["result"][i].id });
          if (this.state.subsecionArray[i].id === this.state.subsectionId) {
            this.setState({ subSection: this.state.subsecionArray[i].name });
            this.getAllSubsections();
          }

          subsecions.push({
            value: this.state.subsecionArray[i].name,
            label: this.state.subsecionArray[i].name
          });
          //  console.log(this.state.subsecionArray)
        }
        this.setState({
          subsecions: subsecions,
        });

        this.setState({ subsecionArray: this.state.subsecionArray });
      }

    });
  }

  getAllCatogiries() {
    var catogiries = [];
    axios.get(InventoryService.getAllCategories()).then((res) => {
      if (res.data["result"]) {
        for (var i = 0; i < res.data["result"].length; i++) {

          this.state.catogiriesArray.push({ name: res.data["result"][i].name, id: res.data["result"][i].id });
          if (this.state.catogiriesArray[i].id === this.state.catogirieId) {
            this.setState({ category: this.state.catogiriesArray[i].name });
            this.getAllSections();
          }
          catogiries.push({
            value: this.state.catogiriesArray[i].name,
            label: this.state.catogiriesArray[i].name
          });

        }
        this.setState({
          catogiries: catogiries,
        });

        this.setState({ catogiriesArray: this.state.catogiriesArray });
      }

    });

  }

  getAllUOM() {
    var uom = [];
    axios.get(InventoryService.getUOM()).then((res) => {
      if (res.data["result"]) {
        for (var i = 0; i < res.data["result"].length; i++) {
          this.state.uomArray.push({ name: res.data["result"][i].uomName, id: res.data["result"][i].id });
          if (this.state.uomArray[i].name === this.state.uomName) {
            this.setState({ uomName: this.state.uomArray[i].uomName });
          }

          //   console.log(this.state.uomArray)
          uom.push({
            value: this.state.uomArray[i].name,
            label: this.state.uomArray[i].name
          });
        }
        this.setState({
          uom: uom,
        });

        this.setState({ uomArray: this.state.uomArray });
      }

    });
  }

  getAllHSNCodes() {
    var hsncodes = [];
    axios.get(InventoryService.getAllHsnList()).then((res) => {
      if (res.data["result"]) {
        for (var i = 0; i < res.data["result"].length; i++) {
          this.state.hsncodesArray.push({ name: res.data["result"][i].hsnCode, id: res.data["result"][i].id });
          if (this.state.hsncodesArray[i].id === this.state.hsnId) {
            this.setState({ hsnCode: this.state.hsncodesArray[i].name });
            this.getAllSubsections();
          }
          //  console.log(res.data["result"])
          hsncodes.push({
            value: this.state.hsncodesArray[i].name,
            label: this.state.hsncodesArray[i].name
          });

        }
        this.setState({
          hsncodes: hsncodes,
        });

        this.setState({ hsncodesArray: this.state.hsncodesArray });
      }

    });
  }

  async getAllstores() {
    const username = await AsyncStorage.getItem("username");
    var storeNames = [];
    axios.get(LoginService.getUserStores() + username).then((res) => {
      if (res.data["result"]) {
        for (var i = 0; i < res.data["result"].length; i++) {
          let number = res.data.result[i];
          const myArray = [];
          myArray = number.split(":");
          this.state.storeNamesArray.push({ name: myArray[0], id: myArray[1] });
          //  console.log(this.state.storeNamesArray)

          storeNames.push({
            value: this.state.storeNamesArray[i].name,
            label: this.state.storeNamesArray[i].name
          });
          this.setState({
            storeNames: storeNames,
          });
          this.setState({ storeNamesArray: this.state.storeNamesArray });
          if (this.state.storeNamesArray[i].id === this.state.storeId) {
            this.setState({ store: this.state.storeNamesArray[i].name });
          }
        }

      }
    });
  }

  handleBackButtonClick() {
    this.props.navigation.goBack(null);
    return true;
  }

  handleDivision = (value) => {
    // this.getAllSections()
    this.setState({ division: value });
  };

  handleSection = (value) => {
    for (let i = 0; i < this.state.secionArray.length; i++) {
      if (this.state.secionArray[i].name === value) {
        this.setState({ sectionId: this.state.secionArray[i].id });
      }
    }
    this.getAllSubsections();
    this.setState({ section: value });
  };

  handleSubSection = (value) => {
    for (let i = 0; i < this.state.subsecionArray.length; i++) {
      if (this.state.subsecionArray[i].name === value) {
        this.setState({ subsectionId: this.state.subsecionArray[i].id });
      }
    }
    this.setState({ subSection: value });
  };
  handleCateory = (value) => {
    for (let i = 0; i < this.state.catogiriesArray.length; i++) {
      if (this.state.catogiriesArray[i].name === value) {
        this.setState({ catogirieId: this.state.catogiriesArray[i].id });
      }
    }
    this.setState({ category: value });
  };

  handleUOM = (value) => {
    for (let i = 0; i < this.state.uomArray.length; i++) {
      if (this.state.uomArray[i].name === value) {
        this.setState({ uomId: this.state.uomArray[i].id });
      }
    }
    this.setState({ uomName: value });
  };

  handleHSNCode = (value) => {
    for (let i = 0; i < this.state.hsncodesArray.length; i++) {
      if (this.state.hsncodesArray[i].name === value) {
        this.setState({ hsnId: this.state.hsncodesArray[i].id });
      }
    }
    this.setState({ hsnCode: value });
  };

  handleColour = (value) => {
    this.setState({ colour: value });
  };

  handleName = (value) => {
    this.setState({ name: value });
  };

  handleBatchNo = (value) => {
    this.setState({ batchNo: value });
  };

  handleCostPrice = (value) => {
    this.setState({ costPrice: value });
  };

  handleListPrice = (value) => {
    this.setState({ listPrice: value });
  };



  handleStore = (value) => {
    for (let i = 0; i < this.state.storeNamesArray.length; i++) {
      if (this.state.storeNamesArray[i].name === value) {
        this.setState({ selectedstoreId: this.state.storeNamesArray[i].id });
      }
    }

    this.setState({ store: value });
  };

  handleEMPId = (value) => {
    this.setState({ empId: value });
  };

  handleQuantity = (value) => {
    this.setState({ quantity: value });
  };

  saveBarcode() {
    if (String(this.state.listPrice).length === 0) {
      alert("please enter the List price");
    }
    else if (String(this.state.quantity) === 0) {
      alert("please enter the Qty");
    }
    else {
      const params = {
        "productTextileId": this.state.productTextileId,
        "division": this.state.divisionId,
        "section": this.state.sectionId,
        "subSection": this.state.subsectionId,
        "name": "",
        "category": this.state.catogirieId,
        "batchNo": this.state.batchNo,
        "colour": this.state.colour,
        "costPrice": this.state.costPrice,
        "empId": this.state.empId,
        "hsnCode": this.state.hsnCode,
        "itemMrp": this.state.listPrice,
        "domainId": 1,
        "qty": this.state.quantity,
        "storeId": this.state.storeId,
        "uom": this.state.uomName,
      };
      console.log('params are' + JSON.stringify(params));
      this.setState({ loading: true });
      axios.put(InventoryService.updatTextileBarcodes(), params).then((res) => {
        if (res.data && res.data["isSuccess"] === "true") {
          this.setState({ loading: false });
          this.props.route.params.onGoBack();
          this.props.navigation.goBack();
        }
        else {
          this.setState({ loading: false });
          alert("duplicate record already exists");
        }
      }
      );

    }
  }

  cancel() {
    this.props.navigation.goBack(null);
  }


  render() {
    return (
      <View style={styles.mainContainer}>
        {this.state.loading &&
          <Loader
            loading={this.state.loading} />
        }
        <View style={Device.isTablet ? styles.viewsWidth_tablet : styles.viewsWidth_mobile}>
          <TouchableOpacity style={Device.isTablet ? styles.backButton_tablet : styles.backButton_mobile} onPress={() => this.handleBackButtonClick()}>
            <Image source={require('../assets/images/backButton.png')} />
          </TouchableOpacity>
          <Text style={Device.isTablet ? styles.headerTitle_tablet : styles.headerTitle_mobile}> Edit Barcode </Text>
        </View>
        <ScrollView>
          <Text style={styles.titleText}>{I18n.t("Division")} <Text style={{ color: '#aa0000' }}>*</Text> </Text>
          <View style={Device.isTablet ? styles.rnSelectContainer_tablet : styles.rnSelectContainer_mobile}>
            <RNPickerSelect
              placeholder={{
                label: 'Division'
              }}
              Icon={() => {
                return <Chevron style={styles.imagealign} size={1.5} color="gray" />;
              }}
              disabled={true}
              items={this.state.divisions}
              onValueChange={this.handleDivision}
              style={Device.isTablet ? pickerSelectStyles_tablet : pickerSelectStyles_mobile}
              value={this.state.division}
              useNativeAndroidPickerStyle={false}
            />

          </View>
          <Text style={styles.titleText}>{I18n.t("Section")} <Text style={{ color: '#aa0000' }}>*</Text> </Text>
          <View style={Device.isTablet ? styles.rnSelectContainer_tablet : styles.rnSelectContainer_mobile}>
            <RNPickerSelect
              placeholder={{
                label: 'Section'
              }}
              Icon={() => {
                return <Chevron style={styles.imagealign} size={1.5} color="gray" />;
              }}
              disabled={true}
              items={this.state.secions}
              onValueChange={this.handleSection}
              style={Device.isTablet ? pickerSelectStyles_tablet : pickerSelectStyles_mobile}
              value={this.state.section}
              useNativeAndroidPickerStyle={false}
            />
          </View>
          <Text style={styles.titleText}>{I18n.t("Sub Section")} <Text style={{ color: '#aa0000' }}>*</Text> </Text>
          <View style={Device.isTablet ? styles.rnSelectContainer_tablet : styles.rnSelectContainer_mobile}>
            <RNPickerSelect
              placeholder={{
                label: 'Sub Section'
              }}
              Icon={() => {
                return <Chevron style={styles.imagealign} size={1.5} color="gray" />;
              }}
              disabled={true}
              items={this.state.subsecions}
              onValueChange={this.handleSubSection}
              style={Device.isTablet ? pickerSelectStyles_tablet : pickerSelectStyles_mobile}
              value={this.state.subSection}
              useNativeAndroidPickerStyle={false}
            />
          </View>
          <Text style={styles.titleText}>{I18n.t("Category")} <Text style={{ color: '#aa0000' }}>*</Text> </Text>
          <View style={Device.isTablet ? styles.rnSelectContainer_tablet : styles.rnSelectContainer_mobile}>
            <RNPickerSelect
              placeholder={{
                label: 'Category'
              }}
              Icon={() => {
                return <Chevron style={styles.imagealign} size={1.5} color="gray" />;
              }}
              disabled={true}
              items={this.state.catogiries}
              onValueChange={this.handleCateory}
              style={Device.isTablet ? pickerSelectStyles_tablet : pickerSelectStyles_mobile}
              value={this.state.category}
              useNativeAndroidPickerStyle={false}
            />
          </View>
          <Text style={styles.titleText}> {I18n.t("Colour")} <Text style={{ color: '#aa0000' }}>*</Text> </Text>
          <TextInput style={Device.isTablet ? styles.input_tablet : styles.input_mobile}
            underlineColorAndroid="transparent"
            placeholder="Colour"
            placeholderTextColor="#6F6F6F"
            textAlignVertical="center"
            autoCapitalize="none"
            value={this.state.colour}
            editable={false} selectTextOnFocus={false}
            onChangeText={this.handleColour}
          />
          <Text style={styles.titleText}> {I18n.t("Name")} <Text style={{ color: '#aa0000' }}>*</Text> </Text>
          <TextInput style={Device.isTablet ? styles.input_tablet : styles.input_mobile}
            underlineColorAndroid="transparent"
            placeholder="Name"
            placeholderTextColor="#6F6F6F"
            textAlignVertical="center"
            autoCapitalize="none"
            value={this.state.name}
            editable={false} selectTextOnFocus={false}
            onChangeText={this.handleName}
          />
          <Text style={styles.titleText}>{I18n.t("Batch No")} <Text style={{ color: '#aa0000' }}>*</Text> </Text>
          <TextInput style={Device.isTablet ? styles.input_tablet : styles.input_mobile}
            underlineColorAndroid="transparent"
            placeholder="Batch No"
            placeholderTextColor="#6F6F6F"
            textAlignVertical="center"
            autoCapitalize="none"
            value={this.state.batchNo}
            editable={false} selectTextOnFocus={false}
            onChangeText={this.handleBatchNo}
          />
          <Text style={styles.titleText}>{I18n.t("Cost Price")} <Text style={{ color: '#aa0000' }}>*</Text> </Text>
          <TextInput style={Device.isTablet ? styles.input_tablet : styles.input_mobile}
            underlineColorAndroid="transparent"
            placeholder="Cost Price"
            placeholderTextColor="#6F6F6F"
            textAlignVertical="center"
            autoCapitalize="none"
            value={this.state.costPrice}
            editable={false} selectTextOnFocus={false}
            onChangeText={this.handleCostPrice}
          />
          <Text style={styles.titleText}>{I18n.t("List Price")} <Text style={{ color: '#aa0000' }}>*</Text> </Text>
          <TextInput style={Device.isTablet ? styles.input_tablet_edit : styles.input_mobile_edit}
            underlineColorAndroid="transparent"
            placeholder="List Price"
            placeholderTextColor="#6F6F6F"
            textAlignVertical="center"
            autoCapitalize="none"
            value={this.state.listPrice}
            onChangeText={this.handleListPrice}
          />
          <Text style={styles.titleText}>{I18n.t("UOM")} <Text style={{ color: '#aa0000' }}>*</Text> </Text>
          <TextInput style={Device.isTablet ? styles.input_tablet : styles.input_mobile}
            underlineColorAndroid="transparent"
            placeholder="UOM"
            placeholderTextColor="#6F6F6F"
            textAlignVertical="center"
            autoCapitalize="none"
            value={this.state.uomName}
            editable={false} selectTextOnFocus={false}

          />
          <Text style={styles.titleText}>{I18n.t("HSN Code")} <Text style={{ color: '#aa0000' }}>*</Text> </Text>
          <View style={Device.isTablet ? styles.rnSelectContainer_tablet : styles.rnSelectContainer_mobile}>
            <RNPickerSelect
              placeholder={{
                label: 'HSN Code'
              }}
              Icon={() => {
                return <Chevron style={styles.imagealign} size={1.5} color="gray" />;
              }}
              disabled={true}
              items={this.state.hsncodes}
              onValueChange={this.handleHSNCode}
              style={Device.isTablet ? pickerSelectStyles_tablet : pickerSelectStyles_mobile}
              value={this.state.hsnCode}
              useNativeAndroidPickerStyle={false}
            />
          </View>
          <Text style={styles.titleText}>{I18n.t("EMP ID")} <Text style={{ color: '#aa0000' }}>*</Text> </Text>
          <TextInput style={Device.isTablet ? styles.input_tablet : styles.input_mobile}
            underlineColorAndroid="transparent"
            placeholder="EMP ID"
            placeholderTextColor="#6F6F6F"
            textAlignVertical="center"
            autoCapitalize="none"
            value={this.state.empId}
            editable={false} selectTextOnFocus={false}
            onChangeText={this.handleEMPId}
          />
          <Text style={styles.titleText}>{I18n.t("Store")} <Text style={{ color: '#aa0000' }}>*</Text> </Text>
          <TextInput style={Device.isTablet ? styles.input_tablet : styles.input_mobile}
            underlineColorAndroid="transparent"
            placeholder="Store"
            placeholderTextColor="#6F6F6F"
            textAlignVertical="center"
            autoCapitalize="none"
            value={this.state.storeName}
            editable={false} selectTextOnFocus={false}
            onChangeText={this.handleStore}
          />
          <Text style={styles.titleText}>QTY <Text style={{ color: '#aa0000' }}>*</Text> </Text>
          <TextInput style={Device.isTablet ? styles.input_tablet_edit : styles.input_mobile_edit}
            underlineColorAndroid="transparent"
            placeholder="QTY"
            placeholderTextColor="#6F6F6F"
            textAlignVertical="center"
            autoCapitalize="none"
            value={this.state.quantity}
            onChangeText={this.handleQuantity}
          />
          <TouchableOpacity style={Device.isTablet ? styles.saveButton_tablet : styles.saveButton_mobile}
            onPress={() => this.saveBarcode()}>
            <Text style={Device.isTablet ? styles.saveButtonText_tablet : styles.saveButtonText_mobile}>SAVE</Text>
          </TouchableOpacity>
          <TouchableOpacity style={Device.isTablet ? styles.cancelButton_tablet : styles.cancelButton_mobile}
            onPress={() => this.cancel()}>
            <Text style={Device.isTablet ? styles.cancelButtonText_tablet : styles.cancelButtonText_mobile}>CANCEL</Text>
          </TouchableOpacity>
          <View style={styles.bottomContainer} ></View>
        </ScrollView>
      </View>
    );
  }
}

export default EditBarcode;

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
    borderColor: '#DCE3F2',
    backgroundColor: '#DCE3F2',
  },
  inputAndroid: {
    justifyContent: 'center',
    height: 42,
    borderRadius: 3,
    borderWidth: 1,
    fontFamily: 'regular',
    //paddingLeft: -20,
    fontSize: 15,
    borderColor: '#DCE3F2',
    backgroundColor: '#DCE3F2',
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
    borderColor: '#DCE3F2',
    backgroundColor: '#DCE3F2',
  },
  inputAndroid: {
    justifyContent: 'center',
    height: 52,
    borderRadius: 3,
    borderWidth: 1,
    fontFamily: 'regular',
    //paddingLeft: -20,
    fontSize: 20,
    borderColor: '#DCE3F2',
    backgroundColor: '#DCE3F2',

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
  titleText: {
    marginTop: RH(10),
    marginBottom: RH(10),
    marginLeft: RW(20),
    fontSize: Device.isTablet ? 20 : RF(15)
  },
  mainContainer: {
    backgroundColor: '#ffffff'
  },
  imagealign: {
    marginTop: Device.isTablet ? 25 : RH(20),
    marginRight: Device.isTablet ? 30 : RW(20),
  },
  bottomContainer: {
    margin: RH(50),
  },

  // Styles For Mobiles
  viewsWidth_mobile: {
    backgroundColor: '#ffffff',
    width: deviceWidth,
    textAlign: 'center',
    fontSize: RF(24),
    height: RH(70),
  },
  backButton_mobile: {
    position: 'absolute',
    left: (10),

    top: RH(10),
    width: RW(40),
    height: RW(40),
  },
  headerTitle_mobile: {
    position: 'absolute',
    left: RW(70),
    top: RH(27),
    width: RW(300),
    height: RH(20),
    fontFamily: 'bold',
    fontSize: RF(18),
    color: '#353C40'
  },
  input_mobile: {
    justifyContent: 'center',
    marginLeft: RW(20),
    marginRight: RW(20),
    height: RH(44),
    marginTop: 5,
    marginBottom: RH(10),
    borderColor: '#DCE3F2',
    borderRadius: 3,
    backgroundColor: '#DCE3F2',
    borderWidth: 1,
    fontFamily: 'regular',
    paddingLeft: RW(15),
    fontSize: RF(14),
  },
  input_mobile_edit: {
    justifyContent: 'center',
    marginLeft: RW(20),
    marginRight: RW(20),
    height: RH(44),
    marginTop: 5,
    marginBottom: 10,
    borderColor: '#8F9EB717',
    borderRadius: 3,
    backgroundColor: '#FBFBFB',
    borderWidth: 1,
    fontFamily: 'regular',
    paddingLeft: RW(15),
    fontSize: RF(14),
  },
  rnSelect_mobile: {
    color: '#8F9EB7',
    fontSize: 15
  },
  rnSelectContainer_mobile: {
    justifyContent: 'center',
    margin: RH(20),
    height: RH(44),
    marginTop: 5,
    marginBottom: RH(10),
    borderColor: '#8F9EB717',
    borderRadius: 3,
    backgroundColor: '#DCE3F2',
    borderWidth: 1,
    fontFamily: 'regular',
    paddingLeft: RW(15),
    fontSize: RF(14),
  },
  saveButton_mobile: {
    margin: RH(8),
    height: RH(50),
    backgroundColor: "#ED1C24",
    borderRadius: 5,
  },
  saveButtonText_mobile: {
    textAlign: 'center',
    marginTop: RH(15),
    color: "#ffffff",
    fontSize: RH(15),
    fontFamily: "regular"
  },
  cancelButton_mobile: {
    margin: RH(8),
    height: RH(50),
    backgroundColor: "#ffffff",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#353C4050",
  },
  cancelButtonText_mobile: {
    textAlign: 'center',
    marginTop: RH(15),
    color: "#353C4050",
    fontSize: RF(15),
    fontFamily: "regular"
  },

  // Styles For Tablet
  viewsWidth_tablet: {
    backgroundColor: '#ffffff',
    width: deviceWidth,
    textAlign: 'center',
    fontSize: RF(28),
    height: RH(90),
  },
  backButton_tablet: {
    position: 'absolute',
    left: RW(10),
    top: RW(20),
    width: RW(90),
    height: RH(90),
  },
  headerTitle_tablet: {
    position: 'absolute',
    left: RW(70),
    top: RH(32),
    width: RW(300),
    height: RH(40),
    fontFamily: 'bold',
    fontSize: RF(24),
    color: '#353C40'
  },
  input_tablet: {
    justifyContent: 'center',
    color: '#000000',
    marginLeft: RW(20),
    marginRight: RF(20),
    height: RH(54),
    marginTop: 5,
    marginBottom: RH(10),
    borderColor: '#DCE3F2',
    borderRadius: 3,
    backgroundColor: '#DCE3F2',
    borderWidth: 1,
    fontFamily: 'regular',
    paddingLeft: RW(15),
    fontSize: RF(19),
  },
  input_tablet_edit: {
    justifyContent: 'center',
    marginLeft: RW(20),
    marginRight: RW(20),
    height: RH(54),
    marginTop: 5,
    marginBottom: RH(10),
    borderColor: '#8F9EB717',
    borderRadius: 3,
    backgroundColor: '#FBFBFB',
    borderWidth: 1,
    fontFamily: 'regular',
    paddingLeft: RH(15),
    fontSize: RF(19),
  },
  rnSelect_tablet: {
    color: '#8F9EB7',
    fontSize: RF(20)
  },
  rnSelectContainer_tablet: {
    justifyContent: 'center',
    margin: RH(20),
    height: RH(54),
    marginTop: 5,
    marginBottom: RH(10),
    borderColor: '#8F9EB717',
    borderRadius: 3,
    backgroundColor: '#DCE3F2',
    borderWidth: 1,
    fontFamily: 'regular',
    paddingLeft: RW(15),
    fontSize: RF(20),
  },
  saveButton_tablet: {
    margin: RH(8),
    height: RH(60),
    backgroundColor: "#ED1C24",
    borderRadius: 5,
  },
  saveButtonText_tablet: {
    textAlign: 'center',
    marginTop: RH(15),
    color: "#ffffff",
    fontSize: RF(20),
    fontFamily: "regular"
  },
  cancelButton_tablet: {
    margin: RH(8),
    height: RH(60),
    backgroundColor: "#ffffff",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#353C4050",
  },
  cancelButtonText_tablet: {
    textAlign: 'center',
    marginTop: RH(15),
    color: "#353C4050",
    fontSize: RF(20),
    fontFamily: "regular"
  },
});
