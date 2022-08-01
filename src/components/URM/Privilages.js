import axios from 'axios';
import React, { Component } from 'react';
import { Dimensions, Image, SectionList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Device from 'react-native-device-detection';
import Loader from '../../commonUtils/loader';
import UrmService from '../services/UrmService';
var deviceWidth = Dimensions.get('window').width;
import I18n from 'react-native-i18n';
import { backButton, backButtonImage, headerTitle, headerTitleContainer, headerTitleSubContainer, headerTitleSubContainer2, menuButton, sectionListBtn, sectionListBtnContainer, sectionListHeader } from '../Styles/Styles';
import { RF, RH } from '../../Responsive';
import { submitBtn, submitBtnText } from '../Styles/FormFields';

export default class Privilages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      domain: "",
      previlages: [],
      domain: "",
      parentlist: [],
      child: [],
      subList: [],
      childList: [],
      isselected: [],
    };
  }

  handleBackButtonClick() {
    this.props.navigation.goBack(null);
    return true;
  }

  async componentDidMount() {
    const editPriv = this.props.route.params;
    console.log({ editPriv });
    this.setState({
      parentlist: editPriv.parentlist,
      child: editPriv.child,
    });
    this.getPrivilages();
  }


  getPrivilages() {
    global.privilages = [];
    this.setState({ loading: true });
    UrmService.getAllPrivillages().then((res) => {
      if (res) {
        if (res.data) {
          let privilegesRes = res.data.result.mobilePrivileges;
          console.log({ privilegesRes });
          let len = privilegesRes.length;
          console.log({ len });
          if (len > 0) {
            this.setState({ loading: false });
            for (let i = 0; i < len; i++) {
              let privilege = privilegesRes[i];
              let previlagename = privilegesRes[i].name;
              console.log({ previlagename });
              // Sub Privileges
              if (privilege.subPrivilege !== null) {
                let subPrivilegeRes = privilege.subPrivilege;
                let subLen = subPrivilegeRes.length;
                console.log({ subPrivilegeRes });
                var subprivilagesArray = [];
                var childPrivillagesArray = [];
                var namesArray = [];
                var parentArray = [];
                if (subLen > 0) {
                  for (let j = 0; j < subLen; j++) {
                    if (privilege.id === subPrivilegeRes[j].parentPrivilegeId) {
                      let subPrivilege = subPrivilegeRes[j];
                      for (let k = 0; k < this.state.parentlist.length; k++) {
                        if (this.state.parentlist[k].name === privilege.name) {
                          if (this.state.parentlist.includes(privilege.name)) { }
                          else {
                            parentArray.push(privilege.name);
                          }
                        }
                      }
                      console.log({ parentArray });
                      // SubParent Privileges
                      if (parentArray.includes(privilege.name)) {
                        for (let m = 0; m < this.state.child.length; m++) {
                          if (subPrivilege.name === this.state.child[m].name) {
                            if (namesArray.includes(subPrivilege.name)) { }
                            else {
                              this.state.subList.push({ title: subPrivilege.name, description: subPrivilege.description, parent: privilege.name, id: privilege.id, subPrivileges: subPrivilege });
                              subprivilagesArray.push({ name: subPrivilege.name, selectedindex: 1, description: subPrivilege.description, subPrivilege: subPrivilege });
                              namesArray.push(subPrivilege.name);
                              console.log({ namesArray });
                            }
                          }
                        }
                      }
                      else { }
                      if (privilege.childPrivillages !== null) {
                        let childLen = privilege.childPrivillages.length;
                        for (let p = 0; p < childLen; p++) {
                          if (subPrivilegeRes[j].id === privilege.childPrivillages[p].subPrivillageId) {
                            childPrivillagesArray.push(privilege.childPrivillages[p]);
                          }
                        }
                      }
                      console.log({ childPrivillagesArray });
                      if (namesArray.includes(subPrivilege.name)) { }
                      else {
                        subprivilagesArray.push({ name: subPrivilege.name, selectedindex: 0, description: subPrivilege.description, subPrivilege: subPrivilege });
                      }
                    }
                  }
                }
              }
              this.state.previlages.push({ title: previlagename, data: subprivilagesArray, child: childPrivillagesArray, id: privilege.id });
              this.setState({ previlages: this.state.previlages },
                console.error(this.state.previlages)
              );
              this.setState({ subList: this.state.subList });
            }
          }
        }
      } else {
        this.setState({ loading: false });
      }
    }).catch(err => {
      console.log({ err });
    });
  }

  saveRole() {
    global.privilages = [];
    this.state.subList = [];
    let privileges = this.state.previlages;
    let len = privileges.length;
    console.log({ privileges, len });
    for (let i = 0; i < len; i++) {
      let sublen = privileges[i].data.length;
      console.log({ sublen });
      for (let j = 0; j < sublen; j++) {
        if (this.state.previlages[i].data[j].selectedindex === 1) {
          this.state.subList.push({
            title: this.state.previlages[i].data[j].name,
            description: this.state.previlages[i].data[j].description,
            parent: this.state.previlages[i].title,
            id: this.state.previlages[i].id,
            subPrivillages: this.state.previlages[i].data[j].subPrivilege
          });
          let subList = this.state.subList;
          console.log({ subList });
        }
      }

    }
    this.setState({ subList: this.state.subList });
    global.privilages = this.state.subList;
    this.props.route.params.onGoBack();
    this.props.navigation.goBack();
  }

  selectedPrivilage = (item, index, section) => {
    if (item.selectedindex === 0) {
      item.selectedindex = 1;
    }
    else {
      item.selectedindex = 0;
      const list = this.state.subList;
      list.splice(index, 1);
      this.setState({ subList: list });
    }
    this.setState({ previlages: this.state.previlages });
  };



  render() {
    return (
      <View style={styles.mainContainer}>
        {this.state.loading &&
          <Loader
            loading={this.state.loading} />
        }
        <View style={headerTitleContainer} >
          <View style={headerTitleSubContainer}>
            <TouchableOpacity style={[backButton]} onPress={() => this.handleBackButtonClick()}>
              <Image style={backButtonImage} source={require('../assets/images/backButton.png')} />
            </TouchableOpacity>
            <Text style={headerTitle}>
              {I18n.t("Privileges")}
            </Text>

          </View>
          <View style={headerTitleSubContainer2}></View>
        </View>

        <SectionList
          sections={this.state.previlages}
          renderSectionHeader={({ section }) => <Text style={sectionListHeader}>{section.title}</Text>}
          renderItem={({ item, index, section }) => (
            <TouchableOpacity onPress={() => this.selectedPrivilage(item, index, section)} style={sectionListBtn}>
              <View style={sectionListBtnContainer}>
                <Text style={{ fontSize: RF(11) }}>
                  {item.name}
                </Text>
                {item.selectedindex === 1 && (
                  <Image source={require('../assets/images/selected.png')} />
                )}
                {item.selectedindex === 0 && (
                  <Image source={require('../assets/images/langunselect.png')} />
                )}
              </View>


            </TouchableOpacity>
          )}
          ListFooterComponent={
            <View>
              <TouchableOpacity style={submitBtn}
                onPress={() => this.saveRole()}>
                <Text style={submitBtnText}>{I18n.t("SAVE")}</Text>
              </TouchableOpacity>
              <View style={{ margin: 20 }}></View>
            </View>
          }
        />


      </View>

    );
  }
}

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
  mainContainer: {
    flex: 1,
  },
  imagealign: {
    marginTop: Device.isTablet ? 25 : 20,
    marginRight: Device.isTablet ? 30 : 20,
  },
  bottomContainer: {
    margin: 50,
  },
  languageButtonText_tablet: {
    fontSize: 28,
    marginTop: 30,
    marginLeft: 20,
    fontFamily: 'medium',
  },
  sectionHeaderTablet: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    fontSize: 20,
    fontFamily: 'medium',
    color: "#828282",
    backgroundColor: '#F4F6FA',
  },
  sectionHeaderMobile: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    fontSize: 16,
    fontFamily: 'medium',
    color: "#828282",
    backgroundColor: '#F4F6FA',
  },
  item: {
    padding: 15,
    fontSize: 18,
    height: 44,
    backgroundColor: '#ffffff',
    fontSize: 18,
    fontFamily: 'medium',
    color: '#353C40',
  },

  // Styles For Mobile
  viewsWidth_mobile: {
    backgroundColor: '#ffffff',
    width: deviceWidth,
    textAlign: 'center',
    fontSize: 24,
    height: 84,
  },
  backButton_mobile: {
    position: 'absolute',
    left: 10,
    top: 30,
    width: 40,
    height: 40,
  },
  subheading_mobile: {
    fontFamily: 'medium',
    fontSize: 16,
    color: "red",
    marginLeft: 20,
  },
  headerTitle_mobile: {
    position: 'absolute',
    left: 70,
    top: 47,
    width: 300,
    // height: 20,
    fontFamily: 'bold',
    fontSize: 18,
    color: '#353C40'
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
  saveButton_mobile: {
    margin: 8,
    height: 50,
    backgroundColor: "#ED1C24",
    borderRadius: 5,
  },
  saveButtonText_mobile: {
    textAlign: 'center',
    marginTop: 15,
    color: "#ffffff",
    fontSize: 15,
    fontFamily: "regular"
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
    textAlign: 'center',
    marginTop: 15,
    color: "#353C4050",
    fontSize: 15,
    fontFamily: "regular"
  },

  // Styles For Tablet
  viewsWidth_tablet: {
    backgroundColor: '#ffffff',
    width: deviceWidth,
    textAlign: 'center',
    fontSize: 28,
    height: 90,
  },
  subheading_tablet: {
    fontFamily: 'medium',
    fontSize: 21,
    color: "red",
    marginLeft: 20,
  },
  backButton_tablet: {
    position: 'absolute',
    left: 10,
    top: 25,
    width: 90,
    height: 90,
  },
  headerTitle_tablet: {
    position: 'absolute',
    left: 70,
    top: 40,
    width: 300,
    // height: 60,
    fontFamily: 'bold',
    fontSize: 24,
    color: '#353C40'
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
  saveButton_tablet: {
    margin: 8,
    height: 60,
    backgroundColor: "#ED1C24",
    borderRadius: 5,
  },
  saveButtonText_tablet: {
    textAlign: 'center',
    marginTop: 15,
    color: "#ffffff",
    fontSize: 20,
    fontFamily: "regular"
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
    textAlign: 'center',
    marginTop: 15,
    color: "#353C4050",
    fontSize: 20,
    fontFamily: "regular"
  },

});
