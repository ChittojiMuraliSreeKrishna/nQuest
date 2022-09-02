import React, { Component } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import Device from "react-native-device-detection";
import { TextInput, Appbar } from "react-native-paper";
import AccountingService from "../services/AccountingService";
import {
  cancelBtn,
  cancelBtnText,
  inputField,
  submitBtn,
  submitBtnText
} from "../Styles/FormFields";
import {
  backButton,
  backButtonImage,
  headerTitle,
  headerTitleContainer,
  headerTitleSubContainer
} from "../Styles/Styles";

var deviceWidth = Dimensions.get("window").width;

export default class AddTaxMaster extends Component {
  constructor(props) {
    super(props);
    this.state = {
      taxRate: "",
      cgst: "",
      sgst: "",
      igst: "",
      cess: "",
      taxLabel: "",
      proiorities: [],
      priority: "",
      id: "",
      isTaxEdit: false,
    };
  }
  componentDidMount() {
    this.setState({ isEdit: this.props.route.params.isEdit });

    if (this.state.isEdit) {
      this.setState({
        cess: JSON.stringify(this.props.route.params.item.cess),
        cgst: JSON.stringify(this.props.route.params.item.cgst),
        igst: JSON.stringify(this.props.route.params.item.igst),
        sgst: JSON.stringify(this.props.route.params.item.sgst),
        taxRate: this.props.route.params.item.taxLabel,
        isTaxEdit: JSON.stringify(this.props.route.params.isEdit),
        id: JSON.stringify(this.props.route.params.item.id),
      });
      console.log("oooo", this.props.route.params.item);
    }
  }
  handleBackButtonClick() {
    this.props.navigation.goBack(null);
    this.props.route.params.onGoBack(null);
    return true;
  }

  handleTaxRate = (value) => {
    this.setState({ taxRate: value });
  };

  handleCgst = (value) => {
    this.setState({ cgst: value });
  };

  handleSgst = (value) => {
    this.setState({ sgst: value });
  };

  handleIgst = (value) => {
    this.setState({ igst: value });
  };

  handleCess = (value) => {
    this.setState({ cess: value });
  };

  handlePriority = (value) => {
    this.setState({ priority: value });
  };

  saveTax() {
    const { cess, cgst, igst, sgst, taxRate, isTaxEdit } = this.state;
    let obj = {
      cess: parseInt(cess),
      cgst: parseInt(cgst),
      sgst: parseInt(sgst),
      igst: parseInt(igst),
      taxLabel: taxRate,
    };
    if (!isTaxEdit) {
      AccountingService.saveMasterTax(obj)
        .then((res) => {
          if (res) {
            console.log(res.data);
            alert("success");
            this.props.navigation.goBack();
            this.props.route.params.onGoBack();
          }
        })
        .catch((err) => {
          alert(err);
        });
    }
  }
  updateTax() {
    const { cess, cgst, igst, sgst, taxRate, isTaxEdit, id } = this.state;
    let obj = {
      cess: parseInt(cess),
      cgst: parseInt(cgst),
      sgst: parseInt(sgst),
      igst: parseInt(igst),
      taxLabel: taxRate,
      id: parseInt(id),
    };
    console.log("OBJ", obj);
    if (isTaxEdit) {
      AccountingService.updateMasterTax(obj)
        .then((res) => {
          console.log("RESS", res);
          if (res) {
            console.log(res.data);
            alert("success");
            this.props.route.params.onGoBack();
            this.props.navigation.goBack();
          }
        })
        .catch((err) => {
          alert("KKKK", err);
        });
    }
  }
  cancel() {
    this.props.route.params.onGoBack(null);
    this.props.navigation.goBack(null);
    return true;
  }

  render() {
    const { cess, cgst, igst, sgst, taxRate, isTaxEdit } = this.state;
    console.log("oooo", isTaxEdit);
    return (
      <View style={styles.mainContainer}>
        {/* {this.state.loading &&
                    <Loader
                        loading={this.state.loading} />
                } */}
        <Appbar mode="center-aligned">
          <Appbar.BackAction onPress={() => this.handleBackButtonClick()}  />
          <Appbar.Content title={isTaxEdit ? "Edit Tax Master" : "Add Tax Master"} />
        </Appbar>
        <TextInput
          style={inputField}
          underlineColorAndroid="transparent"
          placeholder="TAX RATE %"
          placeholderTextColor="#6F6F6F"
          textAlignVertical="center"
          autoCapitalize="none"
          value={this.state.taxRate}
          onChangeText={this.handleTaxRate}
        />
        <TextInput
          style={inputField}
          underlineColorAndroid="transparent"
          placeholder="CGST %"
          placeholderTextColor="#6F6F6F"
          textAlignVertical="center"
          autoCapitalize="none"
          value={this.state.cgst}
          onChangeText={this.handleCgst}
        />
        <TextInput
          style={inputField}
          underlineColorAndroid="transparent"
          placeholder="SGST %"
          placeholderTextColor="#6F6F6F"
          textAlignVertical="center"
          autoCapitalize="none"
          value={this.state.sgst}
          onChangeText={this.handleSgst}
        />
        <TextInput
          style={inputField}
          underlineColorAndroid="transparent"
          placeholder="IGST %"
          placeholderTextColor="#6F6F6F"
          textAlignVertical="center"
          autoCapitalize="none"
          value={this.state.igst}
          onChangeText={this.handleIgst}
        />
        <TextInput
          style={inputField}
          underlineColorAndroid="transparent"
          placeholder="CESS %"
          placeholderTextColor="#6F6F6F"
          textAlignVertical="center"
          autoCapitalize="none"
          value={cess}
          onChangeText={this.handleCess}
        />
        <TouchableOpacity
          style={submitBtn}
          onPress={() => (isTaxEdit ? this.updateTax() : this.saveTax())}
        >
          <Text style={submitBtnText}>{isTaxEdit ? "Update" : "SAVE"}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={cancelBtn} onPress={() => this.cancel()}>
          <Text style={cancelBtnText}>CANCEL</Text>
        </TouchableOpacity>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  imagealign: {
    marginTop: Device.isTablet ? 25 : 20,
    marginRight: Device.isTablet ? 30 : 20,
  },
  bottomContainer: {
    margin: 50,
  },

  // Styles For Mobile

  viewsWidth_mobile: {
    backgroundColor: "#ffffff",
    width: deviceWidth,
    textAlign: "center",
    fontSize: 24,
    height: 84,
  },
  backButton_mobile: {
    position: "absolute",
    left: 10,
    top: 30,
    width: 40,
    height: 40,
  },
  headerTitle_mobile: {
    position: "absolute",
    left: 70,
    top: 47,
    width: 300,
    height: 20,
    fontFamily: "bold",
    fontSize: 18,
    color: "#353C40",
  },
  input_mobile: {
    justifyContent: "center",
    marginLeft: 20,
    marginRight: 20,
    height: 44,
    marginTop: 5,
    marginBottom: 10,
    borderColor: "#8F9EB717",
    borderRadius: 3,
    backgroundColor: "#FBFBFB",
    borderWidth: 1,
    fontFamily: "regular",
    paddingLeft: 15,
    fontSize: 14,
  },
  saveButton_mobile: {
    margin: 8,
    height: 50,
    backgroundColor: "#ED1C24",
    borderRadius: 5,
  },
  saveButtonText_mobile: {
    textAlign: "center",
    marginTop: 15,
    color: "#ffffff",
    fontSize: 15,
    fontFamily: "regular",
  },
  cancelButton_mobile: {
    margin: 8,
    height: 50,
    backgroundColor: "#ffffff",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#353C4050",
  },
  cancelButtonText_mobile: {
    textAlign: "center",
    marginTop: 15,
    color: "#353C4050",
    fontSize: 15,
    fontFamily: "regular",
  },
  flatlistContainer_mobile: {
    height: 140,
    backgroundColor: "#FBFBFB",
    borderBottomWidth: 5,
    borderBottomColor: "#FFFFFF",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  flatlistSubContainer_mobile: {
    flexDirection: "column",
    width: "100%",
    height: 140,
  },
  rnSelect_mobile: {
    color: "#8F9EB7",
    fontSize: 15,
  },
  rnSelectContainer_mobile: {
    justifyContent: "center",
    height: 44,
    marginTop: 5,
    marginBottom: 10,
    marginLeft: 20,
    marginRight: 20,
    borderColor: "#8F9EB717",
    borderRadius: 3,
    backgroundColor: "#FBFBFB",
    borderWidth: 1,
    fontFamily: "regular",
    fontSize: 14,
  },

  // Styles For Tablet
  viewsWidth_tablet: {
    backgroundColor: "#ffffff",
    width: deviceWidth,
    textAlign: "center",
    fontSize: 28,
    height: 90,
  },
  backButton_tablet: {
    position: "absolute",
    left: 10,
    top: 25,
    width: 90,
    height: 90,
  },
  headerTitle_tablet: {
    position: "absolute",
    left: 70,
    top: 40,
    width: 300,
    height: 40,
    fontFamily: "bold",
    fontSize: 24,
    color: "#353C40",
  },
  input_tablet: {
    justifyContent: "center",
    marginLeft: 20,
    marginRight: 20,
    height: 54,
    marginTop: 5,
    marginBottom: 10,
    borderColor: "#8F9EB717",
    borderRadius: 3,
    backgroundColor: "#FBFBFB",
    borderWidth: 1,
    fontFamily: "regular",
    paddingLeft: 15,
    fontSize: 20,
  },
  saveButton_tablet: {
    margin: 8,
    height: 60,
    backgroundColor: "#ED1C24",
    borderRadius: 5,
  },
  saveButtonText_tablet: {
    textAlign: "center",
    marginTop: 15,
    color: "#ffffff",
    fontSize: 20,
    fontFamily: "regular",
  },
  cancelButton_tablet: {
    margin: 8,
    height: 60,
    backgroundColor: "#ffffff",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#353C4050",
  },
  cancelButtonText_tablet: {
    textAlign: "center",
    marginTop: 15,
    color: "#353C4050",
    fontSize: 20,
    fontFamily: "regular",
  },
  flatlistContainer_tablet: {
    height: 160,
    backgroundColor: "#FBFBFB",
    borderBottomWidth: 5,
    borderBottomColor: "#FFFFFF",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  flatlistSubContainer_tablet: {
    flexDirection: "column",
    width: "100%",
    height: 160,
  },
  rnSelect_tablet: {
    color: "#8F9EB7",
    fontSize: 20,
  },
  rnSelectContainer_tablet: {
    justifyContent: "center",
    height: 54,
    marginTop: 5,
    marginBottom: 10,
    marginLeft: 20,
    marginRight: 20,
    borderColor: "#8F9EB717",
    borderRadius: 3,
    backgroundColor: "#FBFBFB",
    borderWidth: 1,
    fontFamily: "regular",
    fontSize: 20,
  },
});
