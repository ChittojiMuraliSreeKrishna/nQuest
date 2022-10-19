import React, { Component } from 'react';
import { Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import I18n from 'react-native-i18n';
import { Appbar, RadioButton } from 'react-native-paper';
import IconFa from 'react-native-vector-icons/FontAwesome';
import scss from '../../commonUtils/assets/styles/Privileges.scss';
import Loader from '../../commonUtils/loader';
import UrmService from '../services/UrmService';
import forms from "../../commonUtils/assets/styles/formFields.scss";

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
      isAllWebChecked: false,
      selectedItem: null,
      childSelectedItem: null,
      webSelectedItem: null,
      webChildSelectedItem: null,
      viewWeb: false,
      viewMobile: false,
      webChildSelectedItems: [],
      mobileChildSelectedItems: [],
      selected: false,
      isAllMobileChecked: false,
      selectedSubPrvlgs: {}
    };
  }

  // Handle Go Back
  handleBackButtonClick() {
    this.props.navigation.goBack(null);
    return true;
  }

  async componentDidMount() {
    const editPriv = this.props.route.params;
    // console.log({ editPriv });
    this.setState({
      parentlist: editPriv.parentlist,
      child: editPriv.child,
    });
    this.getMobilePrivileges();
    this.getWebPrivileges();
  }

  // Mobile Privileges Functions
  getMobilePrivileges() {
    global.mobilePrivilages = [];
    this.setState({ loading: true });
    UrmService.getAllPrivillages().then((res) => {
      if (res) {
        // console.log(res.data);
        if (res.data) {
          let mobileRes = res.data.mobilePrivileges;
          // console.log({ mobileRes });
          let len = mobileRes.length;
          // console.log({ len });
          if (len > 0) {
            this.setState({ loading: false });
            for (let i = 0; i < len; i++) {
              let privilege = mobileRes[i];
              let previlagename = mobileRes[i].name;
              // console.log({ previlagename });
              // Sub Privileges
              if (privilege.subPrivileges !== null) {
                let subPrivilegeRes = privilege.subPrivileges;
                let subLen = subPrivilegeRes.length;
                // console.log({ subPrivilegeRes });
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
                      // SubParent Privileges
                      if (parentArray.includes(privilege.name)) {
                        for (let m = 0; m < this.state.child.length; m++) {
                          if (subPrivilege.name === this.state.child[m].name) {
                            if (namesArray.includes(subPrivilege.name)) { }
                            else {
                              this.state.subMobileList.push({ title: subPrivilege.name, description: subPrivilege.description, parent: privilege.name, id: privilege.id, subPrivileges: subPrivilege });
                              subprivilagesArray.push({ name: subPrivilege.name, selectedindex: 1, description: subPrivilege.description, subPrivilege: subPrivilege });
                              namesArray.push(subPrivilege.name);
                              // console.log({ namesArray });
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
                      // console.log({ childPrivillagesArray });
                      if (namesArray.includes(subPrivilege.name)) { }
                      else {
                        if (subPrivilege.childPrivileges !== null) {
                          let childLen = subPrivilege.childPrivileges.length;
                          for (let p = 0; p < childLen; p++) {
                            if (subPrivilege.id === subPrivilege.childPrivileges[p].subPrivillageId) {
                              //  subPrivilege.childPrivileges[p].push({selectedindex:1})
                              subPrivilege.childPrivileges[p].selectedindex = 1;
                            }
                          }
                        }
                        // console.log("child privilage dataa", subPrivilege.childPrivileges);
                        subprivilagesArray.push({ name: subPrivilege.name, selectedindex: 0, description: subPrivilege.description, subPrivilege: subPrivilege });
                      }
                    }
                  }
                }
              }
              this.state.mobilePrivileges.push({ title: previlagename, selectedindex: 0, data: subprivilagesArray, child: childPrivillagesArray, id: privilege.id });
              this.setState({ mobilePrivileges: this.state.mobilePrivileges },
                // console.error(this.state.mobilePrivileges)
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

  selectedMobileParentPrivilage = (item, index, section) => {
    //Before not selected, now selected
    if (item.selectedindex === 0) {
      item.selectedindex = 1;
      item.data.map((subPrvlItem) => {
        subPrvlItem.selectedindex = 1
        subPrvlItem.subPrivilege.childPrivileges !== null && subPrvlItem.subPrivilege.childPrivileges.map((childItem) => {
          childItem.selectedindex = 1
        })
        var selectedWebSubPrvlg = {};
        selectedWebSubPrvlg[subPrvlItem.subPrivilege.id] = subPrvlItem;
        this.setState({ selectedSubPrvlgs: Object.assign(this.state.selectedSubPrvlgs, selectedWebSubPrvlg) });
      })
      //
    }
    //Before selected, now unselected
    else {
      item.selectedindex = 0;
      item.data.map((subPrvlItem) => {
        subPrvlItem.selectedindex = 0
        subPrvlItem.subPrivilege.childPrivileges !== null && subPrvlItem.subPrivilege.childPrivileges.map((childItem) => {
          childItem.selectedindex = 0
        })
        var sel = this.state.selectedSubPrvlgs;
        delete sel[subPrvlItem.subPrivilege.id];
        const list = this.state.subWebList;
        list.splice(index, 1);
        this.setState({ subWebList: list, isAllWebChecked: false, selectedSubPrvlgs: Object.assign({}, sel) });
      })
    }
    this.setState({ mobilePrivileges: this.state.mobilePrivileges });
  };

  selectedMobilePrivilage = (item, index, section) => {
    if (item.selectedindex === 0) {
      item.selectedindex = 1;
      item.subPrivilege.childPrivileges !== null && item.subPrivilege.childPrivileges.map((childItem) => {
        childItem.selectedindex = 1
      })
    }
    else {
      item.selectedindex = 0;
      item.subPrivilege.childPrivileges !== null && item.subPrivilege.childPrivileges.map((childItem) => {
        childItem.selectedindex = 0
      })
      item.selectedindex = 0;
      const list = this.state.subMobileList;
      list.splice(index, 1);
      this.setState({ subMobileList: list, isAllMobileChecked: false });
    }
    this.setState({ mobilePrivileges: this.state.mobilePrivileges });
  };

  selectedMobileSubPrivilage = (childItem, index, item) => {
    if (childItem.selectedindex === 0) {
      childItem.selectedindex = 1;
      const obj = {
        id: childItem.id
      }
      this.state.mobileChildSelectedItems.push(obj)
    }
    else {
      childItem.selectedindex = 0
      const list = this.state.subMobileList;
      list.splice(index, 1);
      this.setState({ subMobileList: list, isAllMobileChecked: false });
    }
    this.setState({ mobilePrivileges: this.state.mobilePrivileges });
  }

  handleViewMobile() {
    this.setState({ viewMobile: !this.state.viewMobile });
  }

  // Web Privileges Functions
  getWebPrivileges() {
    global.webPrivilages = [];
    this.setState({ loading: true });
    UrmService.getAllPrivillages().then((res) => {
      if (res) {
        // console.log(res.data);
        if (res.data) {
          let webRes = res.data.webPrivileges;
          // console.log({ webRes });
          let len = webRes.length;
          // console.log({ len });
          if (len > 0) {
            this.setState({ loading: false });
            for (let i = 0; i < len; i++) {
              let privilege = webRes[i];
              let previlagename = webRes[i].name;
              //console.log({ previlagename });
              // Sub Privileges
              if (privilege.subPrivileges !== null) {
                let subPrivilegeRes = privilege.subPrivileges;
                let subLen = subPrivilegeRes.length;
                //console.log({ subPrivilegeRes });
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
                      }//parent list computation completed
                      //console.log({ parentArray });
                      // SubParent Privileges
                      if (parentArray.includes(privilege.name)) {
                        for (let m = 0; m < this.state.child.length; m++) {
                          if (subPrivilege.name === this.state.child[m].name) {
                            if (namesArray.includes(subPrivilege.name)) { }
                            else {
                              subPrivilege.childPrivileges.map((item) => {
                              })
                              this.state.subWebList.push({ title: subPrivilege.name, description: subPrivilege.description, parent: privilege.name, id: privilege.id, subPrivileges: subPrivilege });
                              subprivilagesArray.push({ name: subPrivilege.name, selectedindex: 1, description: subPrivilege.description, subPrivilege: subPrivilege });
                              namesArray.push(subPrivilege.name);
                            }
                          }
                        }
                      }
                      else { }
                      if (privilege.subPrivileges[j].childPrivileges !== null) {
                        let childLen = privilege.subPrivileges[j].childPrivileges.length;
                        for (let p = 0; p < childLen; p++) {
                          // console.log("child length :" + childLen + "sub privileage  : " + subPrivilegeRes[j].id + " child privilage : " + JSON.stringify(subPrivilegeRes[j].childPrivileges[p].subPrivillageId))
                          if (subPrivilegeRes[j].id === subPrivilegeRes[j].childPrivileges[p].subPrivillageId) {
                            childPrivillagesArray.push({
                              name: subPrivilegeRes[j].childPrivileges[p].name, selectedindex: 1,
                              description: subPrivilegeRes[j].childPrivileges[p].description,
                              id: subPrivilegeRes[j].childPrivileges[p].id
                            });
                          }
                        }
                      }
                      // console.log({ childPrivillagesArray });
                      if (namesArray.includes(subPrivilege.name)) { }
                      else {
                        if (subPrivilege.childPrivileges !== null) {
                          let childLen = subPrivilege.childPrivileges.length;
                          for (let p = 0; p < childLen; p++) {
                            if (subPrivilege.id === subPrivilege.childPrivileges[p].subPrivillageId) {
                              //  subPrivilege.childPrivileges[p].push({selectedindex:1})
                              subPrivilege.childPrivileges[p].selectedindex = 0;
                            }
                          }
                        }
                        subprivilagesArray.push({ name: subPrivilege.name, selectedindex: 0, description: subPrivilege.description, subPrivilege: subPrivilege });
                      }
                    }
                  }
                }
              }
              this.state.webPrivileges.push({ title: previlagename, selectedindex: 0, data: subprivilagesArray, child: childPrivillagesArray, id: privilege.id });
              this.setState({ webPrivileges: this.state.webPrivileges });
              // console.log("web privilages array", JSON.stringify(this.state.webPrivileges[0].child));
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

  selectedWebParentPrivilage = (item, index, section) => {
    //Before not selected, now selected
    if (item.selectedindex === 0) {
      item.selectedindex = 1;
      item.data.map((subPrvlItem) => {
        subPrvlItem.selectedindex = 1
        subPrvlItem.subPrivilege.childPrivileges !== null && subPrvlItem.subPrivilege.childPrivileges.map((childItem) => {
          childItem.selectedindex = 1
        })
        var selectedWebSubPrvlg = {};
        selectedWebSubPrvlg[subPrvlItem.subPrivilege.id] = subPrvlItem;
        this.setState({ selectedSubPrvlgs: Object.assign(this.state.selectedSubPrvlgs, selectedWebSubPrvlg) });
      })
      //
    }
    //Before selected, now unselected
    else {
      item.selectedindex = 0;
      item.data.map((subPrvlItem) => {
        subPrvlItem.selectedindex = 0
        subPrvlItem.subPrivilege.childPrivileges !== null && subPrvlItem.subPrivilege.childPrivileges.map((childItem) => {
          childItem.selectedindex = 0
        })
        var sel = this.state.selectedSubPrvlgs;
        delete sel[subPrvlItem.subPrivilege.id];
        const list = this.state.subWebList;
        list.splice(index, 1);
        this.setState({ subWebList: list, isAllWebChecked: false, selectedSubPrvlgs: Object.assign({}, sel) });
      })
      //   item.subPrivilege.childPrivileges !== null && item.subPrivilege.childPrivileges.map((childItem) => {
      //     childItem.selectedindex = 0
      //   })
    }
    this.setState({ mobilePrivileges: this.state.mobilePrivileges });
  };

  selectedWebPrivilage = (item, index, section) => {
    //Before not selected, now selected
    if (item.selectedindex === 0) {
      item.selectedindex = 1;
      item.subPrivilege.childPrivileges !== null && item.subPrivilege.childPrivileges.map((childItem) => {
        childItem.selectedindex = 1
      })
      //var selectedWebSubPrvlgs = this.state.selectedSubPrvlgs;
      //var selectedWebSubPrvlg = this.state.selectedSubPrvlgs==null?{}:this.state.selectedSubPrvlgs;
      var selectedWebSubPrvlg = {};
      selectedWebSubPrvlg[item.subPrivilege.id] = item;
      // selectedWebSubPrvlgs[item.id]=item;
      // console.log("item id : "+ item.id);
      //console.log("seleted Web Sub Prvls", selectedWebSubPrvlg);
      this.setState({ selectedSubPrvlgs: Object.assign(this.state.selectedSubPrvlgs, selectedWebSubPrvlg) });
    }
    //Before selected, now unselected
    else {
      item.selectedindex = 0;
      item.subPrivilege.childPrivileges !== null && item.subPrivilege.childPrivileges.map((childItem) => {
        childItem.selectedindex = 0
      })
      var sel = this.state.selectedSubPrvlgs;
      delete sel[item.subPrivilege.id];
      const list = this.state.subWebList;
      list.splice(index, 1);
      this.setState({ subWebList: list, isAllWebChecked: false, selectedSubPrvlgs: Object.assign({}, sel) });
    }
    this.setState({ mobilePrivileges: this.state.mobilePrivileges });
  };

  selectedWebSubPrivilage = (childItem, index, item) => {
    if (childItem.selectedindex === 0) {
      childItem.selectedindex = 1;
      const obj = {
        id: childItem.id
      }
      this.state.webChildSelectedItems.push(obj)
    }
    else {
      childItem.selectedindex = 0;
      const list = this.state.subWebList;
      list.splice(index, 1);
      this.setState({ subWebList: list, isAllWebChecked: false });
    }
    this.setState({ mobilePrivileges: this.state.mobilePrivileges });
  }

  handleViewWeb() {
    this.setState({ viewWeb: !this.state.viewWeb });
  }

  // Select All Functions
  handleWebSelectAll() {
    this.setState({ isAllWebChecked: true }, () => {
      this.handleViewWeb()
      this.state.webPrivileges.map((item) => {
        item.selectedindex = 1
        let data = item.data;
        data.map((subPrivilegeItem) => {
          subPrivilegeItem.selectedindex = 1;
          subPrivilegeItem.subPrivilege.childPrivileges !== null && subPrivilegeItem.subPrivilege.childPrivileges.map((childItem) => {
            childItem.selectedindex = 1;
          })
          var selectedWebSubPrvlg = {};
          selectedWebSubPrvlg[subPrivilegeItem.subPrivilege.id] = subPrivilegeItem;
          this.setState({ selectedSubPrvlgs: Object.assign(this.state.selectedSubPrvlgs, selectedWebSubPrvlg) });
        });
      });
      this.setState({ privilages: this.state.webPrivileges });
    });
  }

  handleWebUnSelectAll() {
    this.setState({ isAllWebChecked: false }, () => {
      this.handleViewWeb()
      this.state.webPrivileges.map((item) => {
        let data = item.data;
        item.selectedindex = 0
        data.map((subPrivilegeItem) => {
          subPrivilegeItem.selectedindex = 0;
          subPrivilegeItem.subPrivilege.childPrivileges !== null && subPrivilegeItem.subPrivilege.childPrivileges.map((childItem) => {
            childItem.selectedindex = 0;
          })
        });
      });

      this.setState({ privilages: this.state.webPrivileges });
    });
  }

  handleMobileSelectAll() {
    this.setState({ isAllMobileChecked: true }, () => {
      this.handleViewMobile()
      this.state.mobilePrivileges.map((item) => {
        item.selectedindex = 1
        let data = item.data;
        data.map((subPrivilegeItem) => {
          subPrivilegeItem.selectedindex = 1;
          subPrivilegeItem.subPrivilege.childPrivileges !== null && subPrivilegeItem.subPrivilege.childPrivileges.map((childItem) => {
            childItem.selectedindex = 1;
          })
        });
      });
      this.setState({ privilages: this.state.mobilePrivileges });
    });
  }

  handleMobileUnSelectAll() {
    this.setState({ isAllMobileChecked: false }, () => {
      this.handleViewMobile()
      this.state.mobilePrivileges.map((item) => {
        item.selectedindex = 0
        let data = item.data;
        data.map((subPrivilegeItem) => {
          subPrivilegeItem.selectedindex = 0;
          subPrivilegeItem.subPrivilege.childPrivileges !== null && subPrivilegeItem.subPrivilege.childPrivileges.map((childItem) => {
            childItem.selectedindex = 0;
          })
        });
      });

      this.setState({ privilages: this.state.mobilePrivileges });
    });
  }

  // Save Role
  saveRole() {
    global.privilages = [];
    this.state.subMobileList = [];
    this.state.subWebList = [];
    let mobilePrivileges = this.state.mobilePrivileges;
    let mobileLen = mobilePrivileges.length;
    // console.log({ mobilePrivileges });
    for (let i = 0; i < mobileLen; i++) {
      let sublen = mobilePrivileges[i].data.length;
      // console.log({ sublen });
      for (let j = 0; j < sublen; j++) {
        if (this.state.mobilePrivileges[i].data[j].selectedindex === 1) {
          this.state.subMobileList.push({
            // title: this.state.mobilePrivileges[i].data[j].name,
            // description: this.state.mobilePrivileges[i].data[j].description,
            // parent: this.state.mobilePrivileges[i].title,
            id: this.state.mobilePrivileges[i].id,
            subPrivillages: this.state.mobilePrivileges[i].data[j].subPrivilege
          });
          let subMobileList = this.state.subMobileList;
          // console.log({ subMobileList });
        }
      }
    }
    let webPrivileges = this.state.webPrivileges;
    let webLen = this.state.webPrivileges.length;
    let webParentPrivileges = []
    for (let i = 0; i < webLen; i++) {
      let sublen = webPrivileges[i].data.length;
      for (let j = 0; j < sublen; j++) {
        if (this.state.webPrivileges[i].data[j].selectedindex === 1) {
          console.log("jth index value", this.state.webPrivileges[i]);
          webParentPrivileges.push({ id: this.state.webPrivileges[i].id })
          this.state.subWebList.push({
            // title: this.state.webPrivileges[i].data[j].name,
            // description: this.state.webPrivileges[i].data[j].description,
            // parent: this.state.webPrivileges[i].title,
            parentId: this.state.webPrivileges[i].id,
            // id:this.state.webPrivileges[i].data[j].subPrivilege
            subPrivillages: this.state.webPrivileges[i].data[j].subPrivilege.id,
            // childPrivillages: this.state.webChildPrivillages
          });
          let subWebList = this.state.subWebList;
          console.log({ subWebList });
        }
      }
    }
    console.log("webParentPrivileges ids", JSON.stringify(webParentPrivileges));
    this.setState({ subWebList: this.state.subWebList });
    global.mobilePrivilages = this.state.subMobileList;
    global.webPrivilages = this.state.subWebList;
    // this.props.route.params.onGoBack();
    // this.props.navigation.goBack();
  }



  render() {
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
        {/* Web Privileges */}
        <TouchableOpacity style={scss.handle_btns} onPress={() => this.handleViewWeb()}>
          <Text style={scss.handle_btns_text}>Web Privileges</Text>
          <IconFa
            name={this.state.viewWeb ? 'minus-square-o' : 'plus-square-o'}
            size={25}
            color="#000"
          />
        </TouchableOpacity>
        <View style={{
          display: 'flex', flexDirection:
            'row', justifyContent: 'flex-end', alignItems: 'center'
        }}>
          <Text style={{
            fontSize: 19,
          }}> {this.state.isAllWebChecked ? "UnSelect-All" : "Select-All"} </Text>
          <RadioButton
            status={this.state.isAllWebChecked ? 'checked' : 'unchecked'}
            onPress={() => { this.state.isAllWebChecked ? this.handleWebUnSelectAll() : this.handleWebSelectAll(); }}
          />
        </View>
        <FlatList
          data={this.state.webPrivileges}
          renderItem={({ item, index }) => (
            <View>
              {this.state.viewWeb && (
                < View >
                  <TouchableOpacity onPress={() => this.selectedWebParentPrivilage(item, index)}>
                    <View style={{ padding: 8 }}>
                      <Text style={scss.section_headers}>{item.title}</Text>
                      {item.selectedindex === 1 && (
                        <Image source={require('../assets/images/selected.png')} style={{ position: 'absolute', right: 20, top: 15 }} />
                      )}
                      {item.selectedindex === 0 && (
                        <Image source={require('../assets/images/langunselect.png')} style={{ position: 'absolute', right: 20, top: 15 }} />
                      )}
                    </View>
                  </TouchableOpacity>
                  {item.selectedindex === 1 &&
                    <>
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
                              item?.subPrivilege?.childPrivileges?.map((childItem, index) => {
                                return (
                                  <TouchableOpacity onPress={() => this.selectedWebSubPrivilage(childItem, index, item)}>
                                    <View style={scss.sub_item}>
                                      <Text>{childItem.name}</Text>
                                      {childItem.selectedindex === 1 && (
                                        <Image source={require('../assets/images/selected.png')} style={{ position: 'absolute', right: 20, top: 15 }} />
                                      )}
                                      {childItem.selectedindex === 0 && (
                                        <Image source={require('../assets/images/langunselect.png')} style={{ position: 'absolute', right: 20, top: 15 }} />
                                      )}
                                    </View>
                                  </TouchableOpacity>
                                );
                              })}
                          </View>
                        );
                      })}
                    </>}
                </View>
              )}
            </View>
          )
          }
        />
        {/* Mobile Privileges */}
        < TouchableOpacity style={scss.handle_btns} onPress={() => this.handleViewMobile()}>
          <Text style={scss.handle_btns_text}>Mobile Privileges</Text>
          <IconFa
            name={this.state.viewMobile ? 'minus-square-o' : 'plus-square-o'}
            size={25}
            color="#000"
          />
        </TouchableOpacity >
        <View style={{
          display: 'flex', flexDirection:
            'row', justifyContent: 'flex-end', alignItems: 'center'
        }}>
          <Text style={{
            fontSize: 19,
          }}> {this.state.isAllMobileChecked ? "UnSelect-All" : "Select-All"} </Text>
          <RadioButton
            status={this.state.isAllMobileChecked ? 'checked' : 'unchecked'}
            onPress={() => { this.state.isAllMobileChecked ? this.handleMobileUnSelectAll() : this.handleMobileSelectAll(); }}
          />
        </View>
        <FlatList
          data={this.state.mobilePrivileges}
          renderItem={({ item, index }) => (
            <View>
              {this.state.viewMobile && (
                <View>
                  <TouchableOpacity onPress={() => this.selectedMobileParentPrivilage(item, index)}>
                    <View style={{ padding: 8 }}>
                      <Text style={scss.section_headers}>{item.title}</Text>
                      {item.selectedindex === 1 && (
                        <Image source={require('../assets/images/selected.png')} style={{ position: 'absolute', right: 20, top: 15 }} />
                      )}
                      {item.selectedindex === 0 && (
                        <Image source={require('../assets/images/langunselect.png')} style={{ position: 'absolute', right: 20, top: 15 }} />
                      )}
                    </View>
                  </TouchableOpacity>
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
                          item?.subPrivilege?.childPrivileges?.map((childItem, index) => {
                            return (
                              <TouchableOpacity onPress={() => this.selectedMobileSubPrivilage(childItem, index, item)}>
                                <View style={scss.sub_item}>
                                  <Text>{childItem.name}</Text>
                                  {childItem.selectedindex === 1 && (
                                    <Image source={require('../assets/images/selected.png')} style={{ position: 'absolute', right: 20, top: 15 }} />
                                  )}
                                  {childItem.selectedindex === 0 && (
                                    <Image source={require('../assets/images/langunselect.png')} style={{ position: 'absolute', right: 20, top: 15 }} />
                                  )}
                                </View>
                              </TouchableOpacity>
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
        <View style={forms.action_buttons_container}>
          <TouchableOpacity style={[forms.action_buttons, forms.submit_btn]}
            onPress={() => this.saveRole()}>
            <Text style={forms.submit_btn_text} >{I18n.t("SAVE")}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[forms.action_buttons, forms.cancel_btn]}
            onPress={() => this.handleBackButtonClick()}>
            <Text style={forms.cancel_btn_text}>{I18n.t("CANCEL")}</Text>
          </TouchableOpacity>
        </View>

      </View >

    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
});
