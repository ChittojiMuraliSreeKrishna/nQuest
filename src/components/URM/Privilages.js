import React, { Component } from 'react';
import { Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import I18n from 'react-native-i18n';
import { Appbar, RadioButton } from 'react-native-paper';
import IconFa from 'react-native-vector-icons/FontAwesome';
import forms from "../../commonUtils/assets/styles/formFields.scss";
import scss from '../../commonUtils/assets/styles/Privileges.scss';
import Loader from '../../commonUtils/loader';
import UrmService from '../services/UrmService';
import RNPickerSelect from "react-native-picker-select";
import { Chevron } from 'react-native-shapes';
import Device from 'react-native-device-detection';
import { RW } from "../../Responsive";
import { rnPicker, rnPickerContainerHalf } from '../Styles/FormFields';
import { TRUE } from 'node-sass';

const data1 = [
  { value: "GOODS", label: "GOODS" },
  { value: "SERVICES", label: "SERVICES" }
]


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
      selected: false,
      isAllMobileChecked: false,
      selectedSubPrvlgs: [],
      selectedParentPrvlgs: [],
      selectedMobileSubPrvlgs: [],
      selectedMobileParentPrvlgs: [],
      editWebPrivileges: [],
      editMobilePrivileges: [],
      isEdit: false,
      service: "",
    };
  }

  // Handle Go Back
  handleBackButtonClick() {
    this.props.navigation.goBack(null);
    return true;
  }

  async componentDidMount() {
    const editPriv = this.props.route.params;
    this.setState({
      editWebPrivileges: editPriv.editParentPrivileges && editPriv.editParentPrivileges.web,
      editMobilePrivileges: editPriv.editParentPrivileges && editPriv.editParentPrivileges.mobile,
      isEdit: editPriv.isEdit,
    });
    this.state.selectedMobileSubPrvlgs;
  }

  // Mobile Privileges Functions
  getMobilePrivileges() {
    global.mobilePrivilages = [];
    this.setState({ loading: true });
    UrmService.getAllPrivillages().then((res) => {
      if (res) {
        if (res.data) {
          let existingPrivilages = this.state.editMobilePrivileges;
          let finalPrivileges = res.data.mobilePrivileges;
          const privileges = finalPrivileges.reduce((allPrives, { type, id, name, subPrivileges }) => {
            if (!allPrives[type]) allPrives[type] = [];
            allPrives[type].push({ "id": id, "name": name, "subPrivileges": subPrivileges })
            return allPrives
          })
          let totalPrivilages = this.state.service === "GOODS" ? privileges.GOODS : privileges.SERVICES
          let stateParentPrivilages = [];
          let stateSubPrivilages = [];
          for (let i = 0; i < totalPrivilages.length; i++) {
            for (let j = 0; existingPrivilages !== null && existingPrivilages !== undefined && j < existingPrivilages.length; j++) {
              if (totalPrivilages[i].id === existingPrivilages[j].id) {
                this.setState({ viewMobile: true });
                let obj = {
                  id: existingPrivilages[j].id
                };
                stateParentPrivilages.push(obj);
                totalPrivilages[i].selectedindex = 1;
                let totalSubPrvlgs = totalPrivilages[i].subPrivileges;
                let exisingSubPrvlgs = existingPrivilages[j].subPrivileges;
                for (let k = 0; totalSubPrvlgs !== null && k < totalSubPrvlgs.length; k++) {
                  for (let m = 0; exisingSubPrvlgs !== null && m < exisingSubPrvlgs.length; m++) {
                    if (totalSubPrvlgs[k].id === exisingSubPrvlgs[m].id) {
                      let temp = {
                        parentId: exisingSubPrvlgs[m].parentPrivilegeId,
                        id: exisingSubPrvlgs[m].id,
                      };
                      totalSubPrvlgs[k].selectedindex = 1;
                      let totalChildPrvlgs = totalSubPrvlgs[k].childPrivileges;
                      let exisingChildPrvlgs = exisingSubPrvlgs[m].childPrivileges;
                      let childPrivilages = [];
                      for (let g = 0; totalChildPrvlgs !== null && g < totalChildPrvlgs.length; g++) {
                        for (let h = 0; exisingChildPrvlgs !== null && h < exisingChildPrvlgs.length; h++) {
                          if (totalChildPrvlgs[g].id === exisingChildPrvlgs[h].id && exisingChildPrvlgs[h].isEnabeld === true) {
                            totalChildPrvlgs[g].selectedindex = 1;
                            childPrivilages.push({ id: exisingChildPrvlgs[h].id });
                          }
                        }
                      }
                      temp.childPrivillages = childPrivilages;
                      stateSubPrivilages.push(temp);
                    }
                  }
                }
              }
            }
            this.setState({ selectedMobileParentPrvlgs: stateParentPrivilages, selectedMobileSubPrvlgs: stateSubPrivilages });
          }
          this.setState({ mobilePrivileges: totalPrivilages });
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
      item.subPrivileges.map((subPrvlItem) => {
        var childIds = [];
        subPrvlItem.selectedindex = 1;
        subPrvlItem.childPrivileges !== null && subPrvlItem.childPrivileges.map((childItem) => {
          childItem.selectedindex = 1;
          var temp = { id: childItem.id };
          childIds.push(temp);
        });
        const selectedSubPrvlg = {
          id: subPrvlItem.id,
          parentId: subPrvlItem.parentPrivilegeId,
          childPrivillages: childIds
        };
        this.state.selectedMobileSubPrvlgs.push(selectedSubPrvlg);
      });
      const obj = {
        id: item.id
      };
      this.state.selectedMobileParentPrvlgs.push(obj);
    }
    //Before selected, now unselected
    else {
      item.selectedindex = 0;
      let parentPrvlgs = this.state.selectedMobileParentPrvlgs;
      for (let i = 0; i < parentPrvlgs.length; i++) {
        if (parentPrvlgs[i].id === item.id) {
          parentPrvlgs.splice(i, 1);
          break;
        }
      }
      item.subPrivileges.map((subPrvlItem) => {
        subPrvlItem.selectedindex = 0;
        subPrvlItem.childPrivileges !== null && subPrvlItem.childPrivileges.map((childItem) => {
          childItem.selectedindex = 0;
        });
        var sel = this.state.selectedSubPrvlgs;
        for (let i = 0; i < sel.length; i++) {
          if (sel[i].id === subPrvlItem.id) {
            sel.splice(i, 1);
          }
        }
        const list = this.state.subWebList;
        list.splice(index, 1);
        this.setState({ subWebList: list, isAllWebChecked: false, selectedMobileParentPrvlgs: parentPrvlgs, selectedMobileSubPrvlgs: sel });
      });
    }
    this.setState({ mobilePrivileges: this.state.mobilePrivileges });
  };

  selectedMobileSubPrivilage = (item, index, section) => {
    if (item.selectedindex === 0) {
      item.selectedindex = 1;
      var childIds = [];
      item.childPrivileges !== null && item.childPrivileges.map((childItem) => {
        childItem.selectedindex = 1;
        var temp = { id: childItem.id };
        childIds.push(temp);
      });
      const selectedSubPrvlg = {
        id: item.id,
        parentId: item.parentPrivilegeId,
        childPrivillages: childIds
      };
      this.state.selectedMobileSubPrvlgs.push(selectedSubPrvlg);
    }
    else {
      item.selectedindex = 0;
      item.childPrivileges !== null && item.childPrivileges.map((childItem) => {
        childItem.selectedindex = 0;
      });
      var sel = this.state.selectedMobileSubPrvlgs;
      for (let i = 0; i < sel.length; i++) {
        if (sel[i].id === item.id) {
          sel.splice(i, 1);
          break;
        }
      }
      const list = this.state.subMobileList;
      list.splice(index, 1);
      this.setState({ subMobileList: list, isAllMobileChecked: false, selectedMobileSubPrvlgs: sel });
    }
    this.setState({ mobilePrivileges: this.state.mobilePrivileges });
  };

  selectedMobileChildPrivilage = (childItem, index, item) => {
    if (childItem.selectedindex === 0) {
      childItem.selectedindex = 1;
      var sel = this.state.selectedMobileSubPrvlgs;
      if (sel.length > 0) {
        for (let i = 0; i < sel.length; i++) {
          if (sel[i].id == childItem.subPrivillageId) {
            //childIds = sel[i].childPrivillages;
            sel[i].childPrivillages.push({ id: childItem.id });
            //sel.
            break;
          }
        }
      }
      this.setState({ selectedSubPrvlgs: sel });
    }
    else {
      childItem.selectedindex = 0;
      var sel = this.state.selectedMobileSubPrvlgs;
      let found = false;
      //Looping subprivilages to remove the selected child privilage
      for (let i = 0; i < sel.length; i++) {
        //Checking for which Subprivilage unselected child Privilage belongs
        if (sel[i].id === childItem.subPrivillageId) {
          for (let j = 0; sel[i].childPrivillages && j < sel[i].childPrivillages.length; j++) {
            //Finding the unselected child privilage
            if (sel[i].childPrivillages[j].id === childItem.id) {
              // console.log("in else", sel[i].childPrivillages[j], childItem.id);
              //Removing  from the state
              sel[i].childPrivillages.splice(j, 1);
              found = true;
              break;
            }
          }

        }
        //Breaking the outer loop as childPrivilage  already found
        if (found) {
          break;
        }
      }
      const list = this.state.subMobileList;
      list.splice(index, 1);
      this.setState({ subMobileList: list, isAllMobileChecked: false, selectedMobileSubPrvlgs: sel });
    }
    this.setState({ mobilePrivileges: this.state.mobilePrivileges });
  };

  handleViewMobile() {
    this.setState({ viewMobile: !this.state.viewMobile, viewWeb: false });
  }


  // Web Privileges Functions
  getWebPrivileges() {
    global.webPrivilages = [];
    this.setState({ loading: true });
    UrmService.getAllPrivillages().then((res) => {
      if (res) {
        if (res.data) {
          this.setState({ loading: false });
          let existingPrivilages = this.state.editWebPrivileges;
          let finalPrivileges = res.data.webPrivileges;
          const privileges = finalPrivileges.reduce((allPrives, { type, id, name, subPrivileges }) => {
            if (!allPrives[type]) allPrives[type] = [];
            allPrives[type].push({ "id": id, "name": name, "subPrivileges": subPrivileges })
            return allPrives
          })
          let totalPrivilages = this.state.service === "GOODS" ? privileges.GOODS : privileges.SERVICES
          let stateParentPrivilages = [];
          let stateSubPrivilages = [];
          for (let i = 0; i < totalPrivilages.length; i++) {
            for (let j = 0; existingPrivilages !== null && existingPrivilages !== undefined && j < existingPrivilages.length; j++) {
              if (totalPrivilages[i].id === existingPrivilages[j].id) {
                this.setState({ viewWeb: true })
                let obj = {
                  id: existingPrivilages[j].id
                };
                stateParentPrivilages.push(obj);
                totalPrivilages[i].selectedindex = 1;
                let totalSubPrvlgs = totalPrivilages[i].subPrivileges;
                let exisingSubPrvlgs = existingPrivilages[j].subPrivileges;
                for (let k = 0; totalSubPrvlgs !== null && k < totalSubPrvlgs.length; k++) {
                  for (let m = 0; exisingSubPrvlgs !== null && m < exisingSubPrvlgs.length; m++) {
                    if (totalSubPrvlgs[k].id === exisingSubPrvlgs[m].id) {
                      let temp = {
                        parentId: exisingSubPrvlgs[m].parentPrivilegeId,
                        id: exisingSubPrvlgs[m].id,
                      };
                      totalSubPrvlgs[k].selectedindex = 1;
                      let totalChildPrvlgs = totalSubPrvlgs[k].childPrivileges;
                      let exisingChildPrvlgs = exisingSubPrvlgs[m].childPrivileges;
                      let childPrivilages = [];
                      for (let g = 0; totalChildPrvlgs !== null && g < totalChildPrvlgs.length; g++) {
                        for (let h = 0; exisingChildPrvlgs !== null && h < exisingChildPrvlgs.length; h++) {
                          if (totalChildPrvlgs[g].id === exisingChildPrvlgs[h].id && exisingChildPrvlgs[h].isEnabeld === true) {
                            totalChildPrvlgs[g].selectedindex = 1;
                            childPrivilages.push({ id: exisingChildPrvlgs[h].id });
                          }
                        }
                      }
                      temp.childPrivillages = childPrivilages;
                      stateSubPrivilages.push(temp);
                    }
                  }
                }
              }
            }
            this.setState({ selectedParentPrvlgs: stateParentPrivilages, selectedSubPrvlgs: stateSubPrivilages });
          }
          this.setState({ webPrivileges: totalPrivilages });
        }
      } else {
        this.setState({ loading: false });
      }
    }).catch(err => {
      console.log({ err });
    });
  }

  selectedWebParentPrivilage = (item, i) => {
    //Before not selected, now selected
    if (item.selectedindex === undefined || item.selectedindex === null || item.selectedindex === 0) {
      item.selectedindex = 1;
      item.subPrivileges.map((subPrvlItem) => {
        var childIds = [];
        subPrvlItem.selectedindex = 1;
        subPrvlItem.childPrivileges !== null && subPrvlItem.childPrivileges.map((childItem) => {
          childItem.selectedindex = 1;
          var temp = { id: childItem.id };
          childIds.push(temp);
        });
        const selectedWebSubPrvlg = {
          id: subPrvlItem.id,
          parentId: subPrvlItem.parentPrivilegeId,
          childPrivillages: childIds
        };
        this.state.selectedSubPrvlgs.push(selectedWebSubPrvlg);
      });
      const obj = {
        id: item.id
      };
      this.state.selectedParentPrvlgs.push(obj);
      // console.log("selected Sub Prvlgs in parent prvl select", JSON.stringify(this.state.selectedParentPrvlgs))
      //
    }
    //Before selected, now unselected
    else {
      item.selectedindex = 0;
      let index = -1;
      let parentPrvlgs = this.state.selectedParentPrvlgs;
      for (let i = 0; i < parentPrvlgs.length; i++) {
        if (parentPrvlgs[i].id === item.id) {
          parentPrvlgs.splice(i, 1);
          break;
        }
      }
      item.subPrivileges.map((subPrvlItem, i) => {
        subPrvlItem.selectedindex = 0;
        subPrvlItem.childPrivileges !== null && subPrvlItem.childPrivileges.map((childItem) => {
          childItem.selectedindex = 0;
        });
        var sel = this.state.selectedSubPrvlgs;
        for (let i = 0; i < sel.length; i++) {
          if (sel[i].id === subPrvlItem.id) {
            sel.splice(i, 1);
          }
        }
        const list = this.state.subWebList;
        list.splice(index, 1);
        this.setState({ subWebList: list, isAllWebChecked: false, selectedParentPrvlgs: parentPrvlgs, selectedSubPrvlgs: sel });
      });
    }
    this.setState({ mobilePrivileges: this.state.mobilePrivileges });
  };

  selectedWebSubPrivilage = (item, index, section) => {
    //Before not selected, now selected
    if (item.selectedindex === undefined || item.selectedindex === null || item.selectedindex === 0) {
      item.selectedindex = 1;
      var childIds = [];
      item.childPrivileges !== null && item.childPrivileges.map((childItem) => {
        childItem.selectedindex = 1;
        var temp = { id: childItem.id };
        childIds.push(temp);
      });
      const selectedWebSubPrvlg = {
        id: item.id,
        parentId: item.parentPrivilegeId,
        childPrivillages: childIds
      };
      this.state.selectedSubPrvlgs.push(selectedWebSubPrvlg);
    }
    //Before selected, now unselected
    else {
      item.selectedindex = 0;
      item.childPrivileges !== null && item.childPrivileges.map((childItem) => {
        childItem.selectedindex = 0;
      });
      var sel = this.state.selectedSubPrvlgs;
      for (let i = 0; i < sel.length; i++) {
        if (sel[i].id === item.id) {
          sel.splice(i, 1);
          break;
        }
      }
      const list = this.state.subWebList;
      list.splice(index, 1);
      this.setState({ subWebList: list, isAllWebChecked: false, selectedSubPrvlgs: sel });
    }
    this.setState({ mobilePrivileges: this.state.mobilePrivileges });
  };

  selectedWebChildPrivilage = (childItem, index, subPrvlItem) => {
    //changing "not selected" to "selected" state
    if (childItem.selectedindex === 0) {
      childItem.selectedindex = 1;
      var sel = this.state.selectedSubPrvlgs;
      if (sel.length > 0) {
        for (let i = 0; i < sel.length; i++) {
          if (sel[i].id == childItem.subPrivillageId) {
            //childIds = sel[i].childPrivillages;
            sel[i].childPrivillages.push({ id: childItem.id });
            //sel.
            break;
          }
        }
      }
      this.setState({ selectedSubPrvlgs: sel });
    }
    //changing "selected" to "not selected" state
    else {
      childItem.selectedindex = 0;
      var sel = this.state.selectedSubPrvlgs;
      let found = false;
      //Looping subprivilages to remove the selected child privilage
      for (let i = 0; i < sel.length; i++) {
        //Checking for which Subprivilage unselected child Privilage belongs
        if (sel[i].id === childItem.subPrivillageId) {
          for (let j = 0; sel[i].childPrivillages && j < sel[i].childPrivillages.length; j++) {
            //Finding the unselected child privilage
            if (sel[i].childPrivillages[j].id === childItem.id) {
              // console.log("in else", sel[i].childPrivillages[j], childItem.id);
              //Removing  from the state
              sel[i].childPrivillages.splice(j, 1);
              found = true;
              break;
            }
          }

        }
        //Breaking the outer loop as childPrivilage  already found
        if (found) {
          break;
        }
      }
      const list = this.state.subWebList;
      this.setState({ subWebList: list, isAllWebChecked: false, selectedSubPrvlgs: sel });
    }
    this.setState({ mobilePrivileges: this.state.mobilePrivileges });
  };

  handleViewWeb() {
    this.setState({ viewWeb: !this.state.viewWeb, viewMobile: false });
  }

  // Select All Functions
  handleWebSelectAll() {
    this.setState({ isAllWebChecked: true, viewWeb: true }, () => {
      this.state.webPrivileges.map((item) => {
        item.selectedindex = 1;
        var childIds = [];
        item.subPrivileges.map((privilegeItem) => {
          privilegeItem.selectedindex = 1;
          privilegeItem.childPrivileges !== null && privilegeItem.childPrivileges.map((childItem) => {
            childItem.selectedindex = 1;
            var temp = { id: childItem.id };
            childIds.push(temp);
          });
          const selectedWebSubPrvlg = {
            id: privilegeItem.id,
            parentId: privilegeItem.parentPrivilegeId,
            childPrivillages: childIds
          };

          this.state.selectedSubPrvlgs.push(selectedWebSubPrvlg);
        });
        const obj = {
          id: item.id
        };
        this.state.selectedParentPrvlgs.push(obj);
      });
      this.setState({ privilages: this.state.webPrivileges });
    });
  }

  handleWebUnSelectAll() {
    this.setState({ isAllWebChecked: false, viewWeb: false }, () => {
      this.state.webPrivileges.map((item) => {
        item.selectedindex = 0;
        item.subPrivileges.map((subPrivilegeItem) => {
          subPrivilegeItem.selectedindex = 0;
          subPrivilegeItem.childPrivileges !== null && subPrivilegeItem.childPrivileges.map((childItem) => {
            childItem.selectedindex = 0;
          });
        });
        this.setState({ selectedSubPrvlgs: [], selectedParentPrvlgs: [] });
      });
      this.setState({ privilages: this.state.webPrivileges, viewWeb: true });
    });
  }

  handleMobileSelectAll() {
    this.setState({ isAllMobileChecked: true, viewMobile: true }, () => {
      this.state.mobilePrivileges.map((item) => {
        item.selectedindex = 1;
        var childIds = [];
        item.subPrivileges.map((subPrivilegeItem) => {
          subPrivilegeItem.selectedindex = 1;
          subPrivilegeItem.childPrivileges !== null && subPrivilegeItem.childPrivileges.map((childItem) => {
            childItem.selectedindex = 1;
            var temp = { id: childItem.id };
            childIds.push(temp);
          });
          const selectedWebSubPrvlg = {
            id: subPrivilegeItem.id,
            parentId: subPrivilegeItem.parentPrivilegeId,
            childPrivillages: childIds
          };

          this.state.selectedMobileSubPrvlgs.push(selectedWebSubPrvlg);
        });
        const obj = {
          id: item.id
        };
        this.state.selectedMobileParentPrvlgs.push(obj);
      });
      this.setState({ privilages: this.state.mobilePrivileges });
    });
  }

  handleMobileUnSelectAll() {
    this.setState({ isAllMobileChecked: false, viewMobile: false }, () => {
      this.state.mobilePrivileges.map((item) => {
        item.selectedindex = 0;
        item.subPrivileges.map((subPrivilegeItem) => {
          subPrivilegeItem.selectedindex = 0;
          subPrivilegeItem.childPrivileges !== null && subPrivilegeItem.childPrivileges.map((childItem) => {
            childItem.selectedindex = 0;
          });
        });
        this.setState({ selectedMobileParentPrvlgs: [], selectedMobileSubPrvlgs: [] });
      });

      this.setState({ privilages: this.state.mobilePrivileges, viewMobile: true });
    });
  }

  handleChangeService(value) {
    this.setState({ service: value }, () => {
      this.getMobilePrivileges()
      this.getWebPrivileges()
      if (this.state.viewMobile === false && this.state.viewWeb === false) {
        this.setState({ viewWeb: true })
      }
    })
  }

  // Save Role
  saveRole() {
    global.selectedParentPrvlgs = this.state.selectedParentPrvlgs;
    global.selectedSubPrvlgs = this.state.selectedSubPrvlgs;
    global.selectedMobileParentPrvlgs = this.state.selectedMobileParentPrvlgs;
    global.selectedMobileSubPrvlgs = this.state.selectedMobileSubPrvlgs;
    this.props.route.params.onGoBack();
    this.props.navigation.goBack();
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
          <View style={rnPickerContainerHalf}>
            <RNPickerSelect
              placeholder={{
                label: "Select",
              }}
              Icon={() => {
                return (
                  <Chevron
                    style={styles.imagealign}
                    size={1.5}
                    color="grey"
                  />
                )
              }}
              items={data1}
              onValueChange={(value) => {
                this.handleChangeService(value);
              }}
              style={rnPicker}
            />
          </View>
        </Appbar>
        {/* Web Privileges */}
        <View style={[forms.privilegeheader]}>
          <TouchableOpacity onPress={() => this.handleViewWeb()} style={[forms.privilegestopbtns,
          this.state.viewWeb ? scss.webPrivActBtn : scss.webPrivInActBtn, { borderBottomWidth: this.state.viewWeb ? 0 : 1 }]}>
            <Text style={[forms.privilegesbtnstext, { color: this.state.viewWeb ? "#FFFFFF" : '#000000', }]}>Web</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.handleViewMobile()} style={[forms.privilegestopbtns,
          this.state.viewMobile ? scss.mobilePrivActBtn : scss.mobilePrivInActBtn, { borderBottomWidth: this.state.viewMobile ? 0 : 1 }]}>
            < Text style={[forms.privilegesbtnstext, { color: this.state.viewMobile ? "#FFFFFF" : "#000000" }]} > Mobile</Text>
          </TouchableOpacity>
        </View >
        {
          this.state.viewWeb && (
            <View style={{ height: 550, maxHeight: 550 }}>
              <View style={{
                display: 'flex', flexDirection:
                  'row', justifyContent: 'flex-start', alignItems: 'center'
              }}>
                <RadioButton
                  status={this.state.isAllWebChecked ? 'checked' : 'unchecked'}
                  onPress={() => { this.state.isAllWebChecked ? this.handleWebUnSelectAll() : this.handleWebSelectAll(); }}
                />
                <Text style={{
                  fontSize: 19,
                }}> {"Select-All"} </Text>
              </View>
              <FlatList
                data={this.state.webPrivileges}
                ListEmptyComponent={<Text style={{ fontSize: 20, color: '#000', textAlign: 'center', marginTop: 100 }}>Please Select the Service first</Text>}
                keyExtractor={(item, i) => i.toString()}
                renderItem={({ item, index }) => (
                  <View>
                    < View >
                      <TouchableOpacity onPress={() => this.selectedWebParentPrivilage(item, index)}>
                        <View style={{ flexDirection: 'row', padding: 4 }}>
                          {item.selectedindex === 1 && (
                            <Image source={require('../assets/images/selected.png')} style={{ left: 20, top: 5 }} />
                          )}
                          {(item.selectedindex === undefined || item.selectedindex === null || item.selectedindex === 0) && (
                            <Image source={require('../assets/images/langunselect.png')} style={{ left: 20, top: 5 }} />
                          )}
                          <Text style={scss.section_headers}>{item.name}</Text>
                        </View>
                      </TouchableOpacity>
                      {item.selectedindex === 1 &&
                        <>
                          {item.subPrivileges?.map((item, index) => {
                            return (
                              <View style={{ paddingLeft: 15, padding: 5 }}>
                                <TouchableOpacity onPress={() => this.selectedWebSubPrivilage(item, index)}>
                                  <View style={[{ flexDirection: 'row' }]}>
                                    {item.selectedindex === 1 && (
                                      <Image source={require('../assets/images/selected.png')} style={{ left: 20, top: 5 }} />
                                    )}
                                    {(item.selectedindex === undefined || item.selectedindex === null || item.selectedindex === 0) && (
                                      <Image source={require('../assets/images/langunselect.png')} style={{ left: 20, top: 5 }} />
                                    )}
                                    <Text style={{ marginLeft: 30 }}>{item.name}</Text>
                                  </View>
                                </TouchableOpacity>
                                {item.selectedindex === 1 &&
                                  item?.childPrivileges?.map((childItem, index) => {
                                    return (
                                      <View style={{ paddingLeft: 15, padding: 5 }}>
                                        <TouchableOpacity onPress={() => this.selectedWebChildPrivilage(childItem, index, item)}>
                                          <View style={{ flexDirection: 'row' }}>
                                            {childItem.selectedindex === 1 && (
                                              <Image source={require('../assets/images/selected.png')} style={{ left: 20, top: 5 }} />
                                            )}
                                            {(childItem.selectedindex === undefined || childItem.selectedindex === null || childItem.selectedindex === 0) && (
                                              <Image source={require('../assets/images/langunselect.png')} style={{ left: 20, top: 5 }} />
                                            )}
                                            <Text style={{ marginLeft: 30 }}>{childItem.name}</Text>
                                          </View>
                                        </TouchableOpacity>
                                      </View>
                                    );
                                  })}
                              </View>
                            );
                          })}
                        </>}
                    </View>
                  </View>
                )
                }
              />
            </View>
          )
        }
        {/* Mobile Privileges */}
        {
          this.state.viewMobile && (
            <View style={{ height: 550, maxHeight: 550 }}>
              <View style={{
                display: 'flex', flexDirection:
                  'row', justifyContent: 'flex-start', alignItems: 'center'
              }}>
                <RadioButton
                  status={this.state.isAllMobileChecked ? 'checked' : 'unchecked'}
                  onPress={() => { this.state.isAllMobileChecked ? this.handleMobileUnSelectAll() : this.handleMobileSelectAll(); }}
                />
                <Text style={{
                  fontSize: 19,
                }}> {"Select-All"} </Text>
              </View>
              <FlatList
                data={this.state.mobilePrivileges}
                keyExtractor={(item, i) => i.toString()}
                ListEmptyComponent={<Text style={{ fontSize: 20, color: '#000', textAlign: 'center', marginTop: 100 }}>Please Select the Service first</Text>}
                s renderItem={({ item, index }) => (
                  <View>
                    <View>
                      <TouchableOpacity onPress={() => this.selectedMobileParentPrivilage(item, index)}>
                        <View style={{ flexDirection: 'row', padding: 4 }}>
                          {item.selectedindex === 1 && (
                            <Image source={require('../assets/images/selected.png')} style={{ left: 20, top: 5 }} />
                          )}
                          {(item.selectedindex === undefined || item.selectedindex === null || item.selectedindex === 0) && (
                            <Image source={require('../assets/images/langunselect.png')} style={{ left: 20, top: 5 }} />
                          )}
                          <Text style={scss.section_headers}>{item.name}</Text>
                        </View>
                      </TouchableOpacity>
                      {item.selectedindex === 1 &&
                        <>
                          {item.subPrivileges?.map((item, index) => {
                            return (
                              <View style={{ paddingLeft: 8, padding: 2 }}>
                                <TouchableOpacity onPress={() => this.selectedMobileSubPrivilage(item, index)} style={scss.item}>
                                  <View style={[{ flexDirection: 'row' }]}>
                                    {item.selectedindex === 1 && (
                                      <Image source={require('../assets/images/selected.png')} style={{ left: 20, top: 5 }} />
                                    )}
                                    {(item.selectedindex === undefined || item.selectedindex === null || item.selectedindex === 0) && (<Image source={require('../assets/images/langunselect.png')} style={{ left: 20, top: 5 }} />
                                    )}
                                    <Text style={{ marginLeft: 30 }}>{item.name}</Text>
                                  </View>
                                </TouchableOpacity>
                                {item.selectedindex === 1 &&
                                  item?.childPrivileges?.map((childItem, index) => {
                                    return (
                                      <View style={{ paddingLeft: 35, padding: 3 }}>
                                        <TouchableOpacity onPress={() => this.selectedMobileChildPrivilage(childItem, index, item)}>
                                          <View style={{ flexDirection: 'row' }}>
                                            {childItem.selectedindex === 1 && (
                                              <Image source={require('../assets/images/selected.png')} style={{ left: 20, top: 5 }} />
                                            )}
                                            {(childItem.selectedindex === undefined || childItem.selectedindex === null || childItem.selectedindex === 0) && (
                                              <Image source={require('../assets/images/langunselect.png')} style={{ left: 20, top: 5 }} />
                                            )}
                                            <Text style={{ marginLeft: 30 }}>{childItem.name}</Text>
                                          </View>
                                        </TouchableOpacity>
                                      </View>
                                    );
                                  })}
                              </View>
                            );
                          })}
                        </>}
                    </View>
                  </View>
                )
                }
              />
            </View>
          )
        }
        <View style={[forms.action_buttons_container, forms.privilegesactionbtns]} >
          <TouchableOpacity style={[forms.action_buttons, forms.submit_btn]}
            onPress={() => this.saveRole()}>
            <Text style={forms.submit_btn_text} >{I18n.t("SAVE")}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[forms.action_buttons, forms.cancel_btn]}
            onPress={() => this.handleBackButtonClick()}>
            <Text style={forms.cancel_btn_text}>{I18n.t("CANCEL")}</Text>
          </TouchableOpacity>
        </View >

      </View >

    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  imagealign: {
    marginTop: Device.isTablet ? 25 : RW(20),
    marginRight: Device.isTablet ? 30 : RW(20),
  },
});
