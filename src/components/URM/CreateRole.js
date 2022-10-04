import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { Component } from "react";
import {
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,

  TouchableOpacity,
  View
} from "react-native";
import Device from "react-native-device-detection";
import I18n from "react-native-i18n";
import { Appbar, TextInput } from 'react-native-paper';
import forms from "../../commonUtils/assets/styles/formFields.scss";
import Loader from "../../commonUtils/loader";
import { RF, RH, RW } from "../../Responsive";
import { errorLength, urmErrorMessages } from "../Errors/errors";
import Message from "../Errors/Message";
import UrmService from "../services/UrmService";
import {
  inputField,
  inputHeading
} from "../Styles/FormFields";
import {
  flatListMainContainer,
  flatlistSubContainer, textContainer,
  textStyleLight,
  textStyleMedium
} from "../Styles/Styles";


var deviceWidth = Dimensions.get("window").width;

export default class CreateRole extends Component {
  constructor(props) {
    super(props);
    this.state = {
      role: "",
      description: "",
      domain: "",
      previlage: [],
      domains: [],
      domainsArray: [],
      clientId: 0,
      userId: 0,
      arrayData: [],
      domainId: 0,
      roles: [],
      parentlist: [],
      childlist: [],
      isEdit: false,
      roleId: 0,
      errors: {},
      roleValid: true,
      domainValid: true,
      descriptionValid: true,
    };
  }

  async componentDidMount () {
    // Client Id
    const clientId = await AsyncStorage.getItem("custom:clientId1");
    // User Id
    const userId = await AsyncStorage.getItem("userId");
    console.log({ clientId, userId });
    // check for Edit OR Create Roles
    this.setState({ isEdit: this.props.route.params.isEdit, userId: userId });
    if (this.state.isEdit === true) {
      let editItems = this.props.route.params;
      console.log({ editItems });
      this.setState({
        description: this.props.route.params.item.description,
        role: this.props.route.params.item.roleName,
        roles: this.props.route.params.item.subPrivilege,
        parentlist: this.props.route.params.item.parentPrivileges,
        roleId: this.props.route.params.item.id,
      });
      this.setState({ navtext: "Edit Role" });
    } else {
      this.setState({ navtext: "Add Role" });
    }
    this.setState({ clientId: clientId, userId: userId });
  }

  // Cancel Actions
  cancel () {
    global.privilages = [];
    this.props.navigation.goBack(null);
  }
  handleBackButtonClick () {
    global.privilages = [];
    this.props.navigation.goBack(null);
    return true;
  }

  // Reached End Flatlist
  onEndReached () {
    this.listRef.scrollToOffset({ offset: 0, animated: true });
  }

  // RoleName Actions
  handleRole = (value) => {
    this.setState({ role: value });
  };
  handleRoleValid = () => {
    if (this.state.role.length >= errorLength.name) {
      this.setState({ roleValid: true });
    }
  };

  // Description Actions
  handleDescriptionValid = () => {
    if (this.state.description.length > 0) {
      this.setState({ descriptionValid: true });
    }
  };

  // Validation Form
  validationForm () {
    let errors = {};
    let isFormValid = true;
    if (this.state.role.length < errorLength.name) {
      isFormValid = false;
      errors[ "role" ] = urmErrorMessages.roleName;
      this.setState({ roleValid: false });
    }
    if (this.state.description === "") {
      isFormValid = false;
      errors[ "description" ] = urmErrorMessages.description;
      this.setState({ descriptionValid: false });
    }
    this.setState({ errors: errors });
    return isFormValid;
  }

  // Saving Role
  saveRole () {
    console.log(this.state.parentlist);
    console.log(this.state.childlist);
    const isFormValid = this.validationForm();
    if (isFormValid) {
      if (this.state.isEdit === false) {
        // Create Role
        const saveObj = {
          roleName: this.state.role,
          description: this.state.description,
          clientId: parseInt(this.state.clientId),
          createdBy: parseInt(this.state.userId),
          parentPrivileges: this.state.parentlist,
          subPrivileges: this.state.childlist,
        };

        console.log("role saveObj", saveObj);
        UrmService.saveRole(saveObj)
          .then((res) => {
            console.log({ res });
            if (res) {
              let rolesMessage = res;
              console.log({ rolesMessage });
              alert("Role Created Successfully");
              this.props.navigation.goBack();
              this.props.route.params.onGoBack();
            }
          })
          .catch((err) => {
            console.log({ err });
          });
      } else {
        // Edit Roles
        const saveObj = {
          roleName: this.state.role,
          description: this.state.description,
          clientId: this.state.clientId,
          createdBy: this.state.userId,
          parentPrivileges: this.state.parentlist,
          subPrivileges: this.state.roles,
          roleId: this.state.roleId,
        };

        console.log({ saveObj });
        this.setState({ loading: true });
        UrmService.editRole(saveObj)
          .then((res) => {
            if (res) {
              let rolesMessage = res.data.message;
              console.log({ rolesMessage });
              alert(rolesMessage ? rolesMessage : "Role Updated Successfully");
            }
            this.props.navigation.goBack();
            this.props.route.params.onGoBack();
            this.setState({ loading: false });
          })
          .catch((err) => {
            console.log({ err });
            this.setState({ loading: false });
          });
      }
    }
  }

  // Privileges Mapping Action
  privilageMapping () {
    global.privilages = [];
    this.props.navigation.navigate("Privilages", {
      domain: this.state.domain,
      child: this.state.roles,
      parentlist: this.state.parentlist,
      onGoBack: () => this.refresh(),
    });
  }

  // Refresh Privileges
  refresh () {
    this.setState({ parentlist: [] });
    this.setState({ childlist: [] });
    this.state.roles = [];
    for (let i = 0; i < global.privilages.length; i++) {
      this.state.parentlist.push({
        name: global.privilages[ i ].parent,
        id: global.privilages[ i ].id,
      });
      this.state.childlist.push(global.privilages[ i ].subPrivillages);
      this.state.roles.push(global.privilages[ i ].subPrivillages);
    }
    const newArrayList = [];
    this.state.parentlist.forEach((obj) => {
      if (!newArrayList.some((o) => o.name === obj.name)) {
        newArrayList.push({ ...obj });
      }
    });

    const newArraychildList = [];
    this.state.childlist.forEach((obj) => {
      if (!newArraychildList.some((o) => o.name === obj.name)) {
        newArraychildList.push({ ...obj });
      }
    });
    const newArrayrolesList = [];
    this.state.roles.forEach((obj) => {
      if (!newArrayrolesList.some((o) => o.name === obj.name)) {
        newArrayrolesList.push({ ...obj });
      }
    });
    this.setState({
      parentlist: newArrayList,
      childlist: newArraychildList,
      roles: newArrayrolesList,
    });
  }

  handleDomain = (value) => {
    for (let i = 0; i < this.state.domainsArray.length; i++) {
      if (this.state.domainsArray[ i ].name === value) {
        this.setState({ domainId: this.state.domainsArray[ i ].id });
      }
    }
    this.setState({ domain: value });
    if (this.state.domain !== "") {
      this.setState({ domainValid: true });
    }
  };

  handleDescription = (value) => {
    this.setState({ description: value });
  };

  render () {
    const roleValid = this.state.roleValid;
    const descriptionValid = this.state.descriptionValid;
    const domainValid = this.state.domainValid;
    return (
      <View style={styles.mainContainer}>
        {this.state.loading && <Loader loading={this.state.loading} />}
        <Appbar mode="center-aligned" >
          <Appbar.BackAction onPress={() => this.handleBackButtonClick()} />
          <Appbar.Content title={this.state.navtext} />
        </Appbar>
        <ScrollView>
          <Text style={inputHeading}>
            {I18n.t("Role")} <Text style={{ color: "#aa0000" }}>*</Text>{" "}
          </Text>
          <TextInput
            style={[
              inputField,
              { borderColor: roleValid ? "#8F9EB717" : "#dd0000" },
            ]}
            underlineColorAndroid="transparent"
            placeholder={I18n.t("Role")}
            placeholderTextColor={roleValid ? "#6F6F6F" : "#dd0000"}
            maxLength={25}
            disabled={this.state.isEdit ? true : false}
            textAlignVertical="center"
            autoCapitalize="none"
            onBlur={this.handleRoleValid}
            value={this.state.role}
            onChangeText={this.handleRole}
          />
          {!roleValid && (
            <Message imp={true} message={this.state.errors[ "role" ]} />
          )}
          <Text style={inputHeading}>
            {I18n.t("Description")} <Text style={{ color: "#aa0000" }}>*</Text>{" "}
          </Text>
          <TextInput
            style={[
              inputField,
              { borderColor: descriptionValid ? "#8F9EB717" : "#dd0000" },
            ]}
            underlineColorAndroid="transparent"
            placeholder={I18n.t("Description")}
            placeholderTextColor={descriptionValid ? "#6F6F6F" : "#dd0000"}
            textAlignVertical="center"
            autoCapitalize="none"
            value={this.state.description}
            onBlur={this.handleDescriptionValid}
            onChangeText={this.handleDescription}
          />
          {!descriptionValid && (
            <Message imp={true} message={this.state.errors[ "description" ]} />
          )}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              height: 50,
            }}
          >
            <Text style={inputHeading}>{I18n.t("Privileges")}</Text>
            <TouchableOpacity
              style={styles.privilageBtn}
              onPress={() => this.privilageMapping()}
            >
              <Text style={styles.privilageBtnText}>
                {" "}
                {I18n.t("Privilege Mapping")}{" "}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView>
            <FlatList
              data={this.state.roles}
              style={{ marginTop: 20 }}
              onEndReached={this.onEndReached.bind(this)}
              ref={(ref) => {
                this.listRef = ref;
              }}
              keyExtractor={(item) => item}
              renderItem={({ item, index }) => (
                <View style={flatListMainContainer}>
                  <View style={flatlistSubContainer}>
                    <View style={textContainer}>
                      <Text style={textStyleLight}>PRIVILEGE</Text>
                      <Text style={textStyleMedium}>{item.name}</Text>
                    </View>
                    <View style={textContainer}>
                      <Text style={textStyleLight}>DESCRIPTION</Text>
                      <Text style={textStyleLight}>{item.description}</Text>
                    </View>
                  </View>
                </View>
              )}
            />
            <View style={styles.messageContainer}>
              <Text style={styles.message}>
                {I18n.t(
                  "add more privileges by clicking on Privilege Mapping button",
                )}
              </Text>
            </View>
          </ScrollView>
          <View style={forms.action_buttons_container}>
            <TouchableOpacity style={[ forms.action_buttons, forms.submit_btn ]}
              onPress={() => this.saveRole()}>
              <Text style={forms.submit_btn_text} >{I18n.t("SAVE")}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[ forms.action_buttons, forms.cancel_btn ]}
              onPress={() => this.cancel()}>
              <Text style={forms.cancel_btn_text}>{I18n.t("CANCEL")}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.bottomContainer}></View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  imagealign: {
    marginTop: Device.isTablet ? RH(25) : RH(20),
    marginRight: Device.isTablet ? RW(30) : RW(20),
  },
  bottomContainer: {
    margin: RH(50),
  },
  messageContainer: {
    flexDirection: "column",
    width: deviceWidth,
    backgroundColor: "#F6F6F6",
    marginTop: RH(20),
  },
  message: {
    fontSize: RF(14),
    marginTop: RH(50),
    height: RH(100),
    fontFamily: "regular",
    paddingLeft: RW(15),
    fontSize: RF(14),
  },
  privilageBtn: {
    borderRadius: Device.isTablet ? 10 : 5,
    borderColor: "#ED1C24",
    backgroundColor: "#ffffff",
    width: Device.isTablet ? RW(190) : RW(140),
    height: Device.isTablet ? RH(38) : RH(28),
    borderWidth: 1,
    marginTop: RH(7),
    marginRight: RW(20),
  },

  privilageBtnText: {
    fontSize: RF(12),
    fontFamily: "regular",
    color: "#ED1C24",
    textAlign: "center",
    marginTop: RH(5),
  },
});

const poolflats = StyleSheet.create({
  valueHeader: {
    fontSize: RF(12),
    fontFamily: "medium",
    color: "#353C40",
  },
  operatorValue: {
    fontSize: RF(12),
    fontFamily: "regular",
    color: "#808080",
  },
  subContainer: {
    display: "flex",
    flexDirection: "column",
    width: deviceWidth,
    height: Device.isTablet ? RH(100) : RH(90),
    marginLeft: RW(10),
    paddingTop: RH(10),
  },
  container: {
    height: Device.isTablet ? RH(130) : RH(100),
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 5,
    borderBottomColor: "#FFFFFF",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: Device.isTablet ? 2 : 1,
    borderBottomColor: "#808080",
  },
});
