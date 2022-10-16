import React, { Component } from 'react';
import { Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import I18n from 'react-native-i18n';
import { Appbar } from 'react-native-paper';
import IconFa from 'react-native-vector-icons/FontAwesome';
import scss from '../../commonUtils/assets/styles/Privileges.scss';
import Loader from '../../commonUtils/loader';
import UrmService from '../services/UrmService';
var deviceWidth = Dimensions.get('window').width;
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
export default class Privilages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      domain: "",
      mobilePrivileges: [],
      webPrivileges: [],
      domain: "",
      parentlist: [],
      child: [],
      subMobileList: [],
      subWebList: [],
      isselected: [],
      isAllChecked: false,
      selectedItem: null,
      childSelectedItem: null,
      webSelectedItem: null,
      webChildSelectedItem: null,
      viewWeb: false,
      viewMobile: false
    };
  }

  // Handle Go Back
  handleBackButtonClick () {
    this.props.navigation.goBack(null);
    return true;
  }

  async componentDidMount () {
    const editPriv = this.props.route.params;
    console.log({ editPriv });
    this.setState({
      parentlist: editPriv.parentlist,
      child: editPriv.child,
    });
    this.getMobilePrivileges();
    this.getWebPrivileges();
  }

  // Mobile Privileges Functions
  getMobilePrivileges () {
    global.mobilePrivilages = [];
    this.setState({ loading: true });
    UrmService.getAllPrivillages().then((res) => {
      if (res) {
        console.log(res.data);
        if (res.data) {
          let mobileRes = res.data.mobilePrivileges;
          console.log({ mobileRes });
          let len = mobileRes.length;
          console.log({ len });
          if (len > 0) {
            this.setState({ loading: false });
            for (let i = 0; i < len; i++) {
              let privilege = mobileRes[ i ];
              let previlagename = mobileRes[ i ].name;
              console.log({ previlagename });
              // Sub Privileges
              if (privilege.subPrivileges !== null) {
                let subPrivilegeRes = privilege.subPrivileges;
                let subLen = subPrivilegeRes.length;
                console.log({ subPrivilegeRes });
                var subprivilagesArray = [];
                var childPrivillagesArray = [];
                var namesArray = [];
                var parentArray = [];
                if (subLen > 0) {
                  for (let j = 0; j < subLen; j++) {
                    if (privilege.id === subPrivilegeRes[ j ].parentPrivilegeId) {
                      let subPrivilege = subPrivilegeRes[ j ];
                      for (let k = 0; k < this.state.parentlist.length; k++) {
                        if (this.state.parentlist[ k ].name === privilege.name) {
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
                          if (subPrivilege.name === this.state.child[ m ].name) {
                            if (namesArray.includes(subPrivilege.name)) { }
                            else {
                              this.state.subMobileList.push({ title: subPrivilege.name, description: subPrivilege.description, parent: privilege.name, id: privilege.id, subPrivileges: subPrivilege });
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
                          if (subPrivilegeRes[ j ].id === privilege.childPrivillages[ p ].subPrivillageId) {
                            childPrivillagesArray.push(privilege.childPrivillages[ p ]);
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
              this.state.mobilePrivileges.push({ title: previlagename, data: subprivilagesArray, child: childPrivillagesArray, id: privilege.id });
              this.setState({ mobilePrivileges: this.state.mobilePrivileges },
                console.error(this.state.mobilePrivileges)
              );
              this.setState({ subMobileList: this.state.subMobileList });
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

  selectedMobilePrivilage = (item, index, section) => {
    if (item.selectedindex === 0) {
      item.selectedindex = 1;
    }
    else {
      item.selectedindex = 0;
      const list = this.state.subMobileList;
      list.splice(index, 1);
      this.setState({ subMobileList: list, isAllChecked: false });
    }
    this.setState({ mobilePrivileges: this.state.mobilePrivileges });
  };

  handleViewMobile () {
    this.setState({ viewMobile: !this.state.viewMobile });
  }

  // Web Privileges Functions
  getWebPrivileges () {
    global.webPrivilages = [];
    this.setState({ loading: true });
    UrmService.getAllPrivillages().then((res) => {
      if (res) {
        console.log(res.data);
        if (res.data) {
          let webRes = res.data.webPrivileges;
          console.log({ webRes });
          let len = webRes.length;
          console.log({ len });
          if (len > 0) {
            this.setState({ loading: false });
            for (let i = 0; i < len; i++) {
              let privilege = webRes[ i ];
              let previlagename = webRes[ i ].name;
              console.log({ previlagename });
              // Sub Privileges
              if (privilege.subPrivileges !== null) {
                let subPrivilegeRes = privilege.subPrivileges;
                let subLen = subPrivilegeRes.length;
                console.log({ subPrivilegeRes });
                var subprivilagesArray = [];
                var childPrivillagesArray = [];
                var namesArray = [];
                var parentArray = [];
                if (subLen > 0) {
                  for (let j = 0; j < subLen; j++) {
                    if (privilege.id === subPrivilegeRes[ j ].parentPrivilegeId) {
                      let subPrivilege = subPrivilegeRes[ j ];
                      for (let k = 0; k < this.state.parentlist.length; k++) {
                        if (this.state.parentlist[ k ].name === privilege.name) {
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
                          if (subPrivilege.name === this.state.child[ m ].name) {
                            if (namesArray.includes(subPrivilege.name)) { }
                            else {
                              this.state.subWebList.push({ title: subPrivilege.name, description: subPrivilege.description, parent: privilege.name, id: privilege.id, subPrivileges: subPrivilege });
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
                          if (subPrivilegeRes[ j ].id === privilege.childPrivillages[ p ].subPrivillageId) {
                            childPrivillagesArray.push(privilege.childPrivillages[ p ]);
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
              this.state.webPrivileges.push({ title: previlagename, data: subprivilagesArray, child: childPrivillagesArray, id: privilege.id });
              this.setState({ webPrivileges: this.state.webPrivileges },
                console.error(this.state.webPrivileges)
              );
              this.setState({ subWebList: this.state.subWebList });
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

  selectedWebPrivilage = (item, index, section) => {
    if (item.selectedindex === 0) {
      item.selectedindex = 1;
    }
    else {
      item.selectedindex = 0;
      const list = this.state.subWebList;
      list.splice(index, 1);
      this.setState({ subWebList: list, isAllChecked: false });
    }
    this.setState({ mobilePrivileges: this.state.mobilePrivileges });
  };

  handleViewWeb () {
    this.setState({ viewWeb: !this.state.viewWeb });
  }

  // Select All Functions
  handleSelectAll () {
    this.setState({ isAllChecked: true }, () => {
      this.state.mobilePrivileges.map((item, index) => {
        let data = item.data;
        console.log({ data });
        data.map((child, index) => {
          child.selectedindex = 1;
        });
      });
      this.setState({ privilages: this.state.mobilePrivileges });
    });
  }

  handleUnSelectAll () {
    this.setState({ isAllChecked: false }, () => {
      this.state.mobilePrivileges.map((item, index) => {
        let data = item.data;
        console.log({ data });
        data.map((child, index) => {
          child.selectedindex = 0;
        });
      });
      this.setState({ privilages: this.state.mobilePrivileges });
    });
  }

  // Save Role
  saveRole () {
    global.privilages = [];
    this.state.subMobileList = [];
    this.state.subWebList = [];
    let mobilePrivileges = this.state.mobilePrivileges;
    let mobileLen = mobilePrivileges.length;
    console.log({ mobilePrivileges, len });
    for (let i = 0; i < mobileLen; i++) {
      let sublen = mobilePrivileges[ i ].data.length;
      console.log({ sublen });
      for (let j = 0; j < sublen; j++) {
        if (this.state.mobilePrivileges[ i ].data[ j ].selectedindex === 1) {
          this.state.subMobileList.push({
            title: this.state.mobilePrivileges[ i ].data[ j ].name,
            description: this.state.mobilePrivileges[ i ].data[ j ].description,
            parent: this.state.mobilePrivileges[ i ].title,
            id: this.state.mobilePrivileges[ i ].id,
            subPrivillages: this.state.mobilePrivileges[ i ].data[ j ].subPrivilege
          });
          let subMobileList = this.state.subMobileList;
          console.log({ subMobileList });
        }
      }
    }
    let webLen = this.state.webPrivileges.length;
    for (let i = 0; i < webLen; i++) {
      let sublen = webPrivileges[ i ].data.length;
      console.log({ sublen });
      for (let j = 0; j < sublen; j++) {
        if (this.state.webPrivileges[ i ].data[ j ].selectedindex === 1) {
          this.state.subWebList.push({
            title: this.state.webPrivileges[ i ].data[ j ].name,
            description: this.state.webPrivileges[ i ].data[ j ].description,
            parent: this.state.webPrivileges[ i ].title,
            id: this.state.webPrivileges[ i ].id,
            subPrivillages: this.state.webPrivileges[ i ].data[ j ].subPrivilege
          });
          let subMobileList = this.state.subWebList;
          console.log({ subWebList });
        }
      }
    }
    this.setState({ subWebList: this.state.subWebList });
    global.mobilePrivilages = this.state.subMobileList;
    global.webPrivilages = this.state.subWebList;
    this.props.route.params.onGoBack();
    this.props.navigation.goBack();
  }



  render () {
    return (
      <View style={styles.mainContainer}>
        {this.state.loading &&
          <Loader
            loading={this.state.loading} />
        }
        <Appbar mode="center-aligned">
          <Appbar.BackAction onPress={() => this.handleBackButtonClick()} />
          <Appbar.Content title={I18n.t("Privileges")} />
        </Appbar>
        <TouchableOpacity style={scss.handle_btns} onPress={() => this.handleViewWeb()}>
          <Text style={scss.handle_btns_text}>Web Privileges</Text>
          <IconFa
            name={this.state.viewWeb ? 'minus-square-o' : 'plus-square-o'}
            size={25}
            color="#000"
          />
        </TouchableOpacity>
        <FlatList
          data={this.state.webPrivileges}
          renderItem={({ item, index }) => (
            <View>
              {this.state.viewWeb && (
                <View>
                  <Text style={scss.section_headers}>{item.title}</Text>
                  {item.data?.map((item, index) => {
                    return (
                      <View>
                        <TouchableOpacity onPress={() => this.selectedWebPrivilage(item, index)}>
                          <View style={scss.item}>
                            <Text>{item.name}</Text>
                            {item.selectedindex === 1 && (
                              <Image source={require('../assets/images/selected.png')} style={{ position: 'absolute', right: 20, top: 15 }} />
                            )}
                            {item.selectedindex === 0 && (
                              <Image source={require('../assets/images/langunselect.png')} style={{ position: 'absolute', right: 20, top: 15 }} />
                            )}
                          </View>
                        </TouchableOpacity>
                        {item.selectedindex === 1 &&
                          item?.subPrivilege?.childPrivileges?.map((item, index) => {
                            return (
                              <View style={scss.sub_item}>
                                <Text>{item.name}</Text>
                                {item.selectedindex === 1 && (
                                  <Image source={require('../assets/images/selected.png')} style={{ position: 'absolute', right: 20, top: 15 }} />
                                )}
                                {item.selectedindex === 0 && (
                                  <Image source={require('../assets/images/langunselect.png')} style={{ position: 'absolute', right: 20, top: 15 }} />
                                )}
                              </View>
                            );
                          })}
                      </View>
                    );
                  })}
                </View>
              )}
            </View>
          )}
        />
        <TouchableOpacity style={scss.handle_btns} onPress={() => this.handleViewMobile()}>
          <Text style={scss.handle_btns_text}>Mobile Privileges</Text>
          <IconFa
            name={this.state.viewMobile ? 'minus-square-o' : 'plus-square-o'}
            size={25}
            color="#000"
          />
        </TouchableOpacity>
        <FlatList
          data={this.state.mobilePrivileges}
          renderItem={({ item, index }) => (
            <View>
              {this.state.viewMobile && (
                <View>
                  <Text style={scss.section_headers}>{item.title}</Text>
                  {item.data?.map((item, index) => {
                    return (
                      <View>
                        <TouchableOpacity onPress={() => this.selectedMobilePrivilage(item, index)} style={scss.item}>
                          <Text>{item.name}</Text>
                          {item.selectedindex === 1 && (
                            <Image source={require('../assets/images/selected.png')} style={{ position: 'absolute', right: 20, top: 15 }} />
                          )}
                          {item.selectedindex === 0 && (
                            <Image source={require('../assets/images/langunselect.png')} style={{ position: 'absolute', right: 20, top: 15 }} />
                          )}
                        </TouchableOpacity>
                        {item.selectedindex === 1 &&
                          item?.subPrivilege?.childPrivileges?.map((item, index) => {
                            return (
                              <View style={scss.sub_item}>
                                <Text>{item.name}</Text>
                                {item.selectedindex === 1 && (
                                  <Image source={require('../assets/images/selected.png')} style={{ position: 'absolute', right: 20, top: 15 }} />
                                )}
                                {item.selectedindex === 0 && (
                                  <Image source={require('../assets/images/langunselect.png')} style={{ position: 'absolute', right: 20, top: 15 }} />
                                )}
                              </View>
                            );
                          })}
                      </View>
                    );
                  })}
                </View>
              )}
            </View>
          )}
        />

      </View>

    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
});
