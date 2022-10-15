import React, { Component } from 'react';
import { Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import I18n from 'react-native-i18n';
import { Appbar } from 'react-native-paper';
import IconFa from 'react-native-vector-icons/FontAwesome';
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
      subList: [],
      childList: [],
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


  getMobilePrivileges () {
    global.privilages = [];
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

  getWebPrivileges () {
    global.privilages = [];
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
  saveRole () {
    global.privilages = [];
    this.state.subList = [];
    let privileges = this.state.mobilePrivileges;
    let len = privileges.length;
    console.log({ privileges, len });
    for (let i = 0; i < len; i++) {
      let sublen = privileges[ i ].data.length;
      console.log({ sublen });
      for (let j = 0; j < sublen; j++) {
        if (this.state.mobilePrivileges[ i ].data[ j ].selectedindex === 1) {
          this.state.subList.push({
            title: this.state.mobilePrivileges[ i ].data[ j ].name,
            description: this.state.mobilePrivileges[ i ].data[ j ].description,
            parent: this.state.mobilePrivileges[ i ].title,
            id: this.state.mobilePrivileges[ i ].id,
            subPrivillages: this.state.mobilePrivileges[ i ].data[ j ].subPrivilege
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
      this.setState({ subList: list, isAllChecked: false });
    }
    this.setState({ mobilePrivileges: this.state.mobilePrivileges });
  };

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

  handleViewWeb () {
    this.setState({ viewWeb: !this.state.viewWeb });
  }
  handleViewMobile () {
    this.setState({ viewMobile: !this.state.viewMobile });
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
        <TouchableOpacity style={styles.handleBtns} onPress={() => this.handleViewWeb()}>
          <Text style={styles.handleBtnsText}>Web Privileges</Text>
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
                  <View style={styles.titleContainer}>
                    <Text style={styles.titleText}>{item.title}</Text>
                  </View>
                  {item.data?.map((item, index) => {
                    return (
                      <View>
                        <View style={styles.buttonContainer}>
                          <View style={styles.button}>
                            <View>
                              <Text style={styles.btnText}>{item.name}</Text>
                            </View>
                          </View>
                        </View>
                        {item?.subPrivilege?.childPrivileges?.map((item, index) => {
                          return (
                            <View style={styles.buttonContainer}>
                              <View style={styles.childButton}>
                                <View>
                                  <Text style={styles.childBtnText}>{item.name}</Text>
                                </View>
                              </View>
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
        <TouchableOpacity style={styles.handleBtns} onPress={() => this.handleViewMobile()}>
          <Text style={styles.handleBtnsText}>Mobile Privileges</Text>
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
                  <View style={styles.titleContainer}>
                    <Text style={styles.titleText}>{item.title}</Text>
                  </View>
                  {item.data?.map((item, index) => {
                    return (
                      <View>
                        <View style={styles.buttonContainer}>
                          <View style={styles.button}>
                            <View>
                              <Text style={styles.btnText}>{item.name}</Text>
                            </View>
                          </View>
                        </View>
                        {item?.subPrivilege?.childPrivileges?.map((item, index) => {
                          return (
                            <View style={styles.buttonContainer}>
                              <View style={styles.childButton}>
                                <View>
                                  <Text style={styles.childBtnText}>{item.name}</Text>
                                </View>
                              </View>
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
  container: {
    marginTop: deviceHeight / 4,
    marginBottom: deviceHeight / 4
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingLeft: 30,
    paddingRight: 40,
  },
  button: {
    backgroundColor: '#ED1C24',
    height: 30,
    borderColor: '#000',
    borderWidth: 1,
    margin: 2,
    width: '90%',
    marginLeft: '5%',
    marginRight: '5%',
    borderRadius: 6,
  },
  childButton: {
    backgroundColor: '#b9b9b9',
    height: 30,
    borderColor: '#000',
    borderWidth: 1,
    margin: 2,
    width: '90%',
    marginLeft: '5%',
    marginRight: '5%',
    borderRadius: 6,
  },
  btnText: {
    textAlign: 'center',
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    margin: 0,
    padding: 0,
  },
  childBtnText: {
    textAlign: 'center',
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    margin: 0,
    padding: 0,
  },
  titleContainer: {
    backgroundColor: '#ddd',
    height: 40,
    width: '100%'
  },
  titleText: {
    color: '#000',
    fontSize: 21,
    fontWeight: 'bold',
    textAlign: 'justify',
    marginLeft: 10
  },
  handleBtns: {
    height: 40,
    width: '100%',
    backgroundColor: '#bbb',
    marginTop: 10,
    marginBottom: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10
  },
  handleBtnsText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'justify',
  }
});
