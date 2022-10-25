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
      selected: false,
      isAllMobileChecked: false,
      selectedSubPrvlgs: [],
      selectedParentPrvlgs: [],
      selectedMobileSubPrvlgs: [],
      selectedMobileParentPrvlgs: [],
      editWebPrivileges: [],
      editMobilePrivileges: [],
      isEdit: false
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
      isEdit: editPriv.isEdit
    });
    this.state.selectedMobileSubPrvlgs
    this.getWebPrivileges();
    this.getMobilePrivileges();
  }

  // Mobile Privileges Functions
  getMobilePrivileges() {
    global.mobilePrivilages = [];
    this.setState({ loading: true });
    UrmService.getAllPrivillages().then((res) => {
      if (res) {
        if (res.data) {
          if (this.state.isEdit === true) {
            let allMobilePrivilages = this.state.mobilePrivileges
            let mobileRes = this.state.editMobilePrivileges
            let len = mobileRes.length;
            if (len > 0) {
              this.setState({ loading: false });
              this.handleViewMobile()
              for (let i = 0; i < len; i++) {
                let privilege = mobileRes[i];
                let previlagename = mobileRes[i].name;
                if (privilege.subPrivileges !== null) {
                  let subPrivilegeRes = privilege.subPrivileges;
                  let subLen = subPrivilegeRes.length;
                  var subprivilagesArray = [];
                  if (subLen > 0) {
                    for (let j = 0; j < subLen; j++) {
                      var childIds = []
                      if (privilege.id === subPrivilegeRes[j].parentPrivilegeId) {
                        let subPrivilege = subPrivilegeRes[j];
                        if (subPrivilege.childPrivileges !== null) {
                          let childLen = subPrivilege.childPrivileges.length;
                          for (let p = 0; p < childLen; p++) {
                            if (subPrivilege.id === subPrivilege.childPrivileges[p].subPrivillageId) {
                              subPrivilege.childPrivileges[p].selectedindex = 1
                              var temp = { id: subPrivilege.childPrivileges[p].id };
                              childIds.push(temp);
                            }
                          }
                        }
                        const selectedMobileSubPrvlg = {
                          id: subPrivilege.id,
                          parentId: privilege.id,
                          childPrivillages: childIds
                        };
                        this.state.selectedMobileSubPrvlgs.push(selectedMobileSubPrvlg)
                        subprivilagesArray.push({ name: subPrivilege.name, selectedindex: 1, description: subPrivilege.description, subPrivilege: subPrivilege });
                      }
                    }
                  }
                }
                const obj = {
                  id: privilege.id
                }
                this.state.selectedMobileParentPrvlgs.push(obj)
                this.state.mobilePrivileges.push({ title: previlagename, selectedindex: 1, data: subprivilagesArray, id: privilege.id });
                this.setState({ mobilePrivileges: this.state.mobilePrivileges },
                );
              }
            }
          }
          else {
            let mobileRes = res.data.mobilePrivileges;
            let len = mobileRes.length;
            if (len > 0) {
              this.setState({ loading: false });
              for (let i = 0; i < len; i++) {
                let privilege = mobileRes[i];
                let previlagename = mobileRes[i].name;
                if (privilege.subPrivileges !== null) {
                  let subPrivilegeRes = privilege.subPrivileges;
                  let subLen = subPrivilegeRes.length;
                  var subprivilagesArray = [];
                  if (subLen > 0) {
                    for (let j = 0; j < subLen; j++) {
                      if (privilege.id === subPrivilegeRes[j].parentPrivilegeId) {
                        let subPrivilege = subPrivilegeRes[j];
                        if (subPrivilege.childPrivileges !== null) {
                          let childLen = subPrivilege.childPrivileges.length;
                          for (let p = 0; p < childLen; p++) {
                            if (subPrivilege.id === subPrivilege.childPrivileges[p].subPrivillageId) {
                              subPrivilege.childPrivileges[p].selectedindex = 0
                            }
                          }
                        }
                        subprivilagesArray.push({ name: subPrivilege.name, selectedindex: 0, description: subPrivilege.description, subPrivilege: subPrivilege });
                      }
                    }
                  }
                }
                this.state.mobilePrivileges.push({ title: previlagename, selectedindex: 0, data: subprivilagesArray, id: privilege.id });
                this.setState({ mobilePrivileges: this.state.mobilePrivileges },
                );
              }
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
        var childIds = [];
        subPrvlItem.selectedindex = 1
        subPrvlItem.subPrivilege.childPrivileges !== null && subPrvlItem.subPrivilege.childPrivileges.map((childItem) => {
          childItem.selectedindex = 1
          var temp = { id: childItem.id };
          childIds.push(temp);
        })
        const selectedSubPrvlg = {
          id: subPrvlItem.subPrivilege.id,
          parentId: subPrvlItem.subPrivilege.parentPrivilegeId,
          childPrivillages: childIds
        };
        this.state.selectedMobileSubPrvlgs.push(selectedSubPrvlg)
      })
      const obj = {
        id: item.id
      }
      this.state.selectedMobileParentPrvlgs.push(obj)
    }
    //Before selected, now unselected
    else {
      item.selectedindex = 0;
      let parentPrvlgs = this.state.selectedMobileParentPrvlgs
      for (let i = 0; i < parentPrvlgs.length; i++) {
        if (parentPrvlgs[i].id === item.id) {
          parentPrvlgs.splice(i, 1)
          break
        }
      }
      item.data.map((subPrvlItem) => {
        subPrvlItem.selectedindex = 0
        subPrvlItem.subPrivilege.childPrivileges !== null && subPrvlItem.subPrivilege.childPrivileges.map((childItem) => {
          childItem.selectedindex = 0
        })
        var sel = this.state.selectedSubPrvlgs;
        for (let i = 0; i < sel.length; i++) {
          if (sel[i].id === subPrvlItem.subPrivilege.id) {
            sel.splice(i, 1);
          }
        }
        const list = this.state.subWebList;
        list.splice(index, 1);
        this.setState({ subWebList: list, isAllWebChecked: false, selectedMobileParentPrvlgs: parentPrvlgs, selectedMobileSubPrvlgs: sel });
      })
    }
    this.setState({ mobilePrivileges: this.state.mobilePrivileges });
  };

  selectedMobileSubPrivilage = (item, index, section) => {
    if (item.selectedindex === 0) {
      item.selectedindex = 1;
      var childIds = [];
      item.subPrivilege.childPrivileges !== null && item.subPrivilege.childPrivileges.map((childItem) => {
        childItem.selectedindex = 1
        var temp = { id: childItem.id };
        childIds.push(temp);
      })
      const selectedSubPrvlg = {
        id: item.subPrivilege.id,
        parentId: item.subPrivilege.parentPrivilegeId,
        childPrivillages: childIds
      };
      this.state.selectedMobileSubPrvlgs.push(selectedSubPrvlg)
    }
    else {
      item.selectedindex = 0;
      item.subPrivilege.childPrivileges !== null && item.subPrivilege.childPrivileges.map((childItem) => {
        childItem.selectedindex = 0
      })
      var sel = this.state.selectedMobileSubPrvlgs;
      for (let i = 0; i < sel.length; i++) {
        if (sel[i].id === item.subPrivilege.id) {
          sel.splice(i, 1);
          break
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
      this.setState({ selectedSubPrvlgs: sel })
    }
    else {
      childItem.selectedindex = 0
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
        if (res.data) {
          if (this.state.isEdit === true) {
            //exising Privilages from API
            this.setState({ loading: false });
            let existingPrivilages = this.state.editWebPrivileges;
            let len = existingPrivilages.length;
            let totalPrivilages = res.data.webPrivileges;
            for (let i = 0; i < totalPrivilages.length; i++) {
              for (let j = 0; j < existingPrivilages.length; j++) {
                if (totalPrivilages[i].id == existingPrivilages[j].id) {
                  totalPrivilages[i].selectedindex = 1;
                  let totalSubPrvlgs = totalPrivilages[i].subPrivileges;
                  let exisingSubPrvlgs = existingPrivilages[j].subPrivileges
                  for (let k = 0; totalSubPrvlgs !== null && k < totalSubPrvlgs.length; k++) {
                    for (let m = 0; exisingSubPrvlgs !== null && m < exisingSubPrvlgs.length; m++) {
                      if (totalSubPrvlgs[k].id === exisingSubPrvlgs[m].id) {
                        totalSubPrvlgs[k].selectedindex = 1
                        let totalChildPrvlgs = totalSubPrvlgs[k].childPrivileges
                        let exisingChildPrvlgs = exisingSubPrvlgs[m].childPrivileges
                        for (let g = 0; totalChildPrvlgs !== null && g < totalChildPrvlgs.length; g++) {
                          for (let h = 0; exisingChildPrvlgs !== null && h < exisingChildPrvlgs.length; h++) {
                            if (totalChildPrvlgs[g].id === exisingChildPrvlgs[h].id) {
                              totalChildPrvlgs[g].selectedindex = 1
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
            // console.log("total Privilages:"+JSON.stringify(totalPrivilages))
            // existingPrivilages && existingPrivilages.map((parentPrvlgs) => {
            //   parentPrvlgs.selectedindex = 1
            //   var childIds = [];
            //   parentPrvlgs.subPrivileges !== null && parentPrvlgs.subPrivileges.map((subPrvlgs) => {
            //     subPrvlgs.selectedindex = 1
            //     subPrvlgs.childPrivileges !== null && subPrvlgs.childPrivileges.map((childPrvlgs) => {
            //       childPrvlgs.selectedindex = 1
            //     })
            //   })
            //   let merged = { ...existingPrivilages, ...totalPrivilages };
            //   console.log("Merged prvlgs : " + JSON.stringify(merged));
              // this.state.webPrivileges.push({ title: previlagename, selectedindex: 0, data: subprivilagesArray, id: privilege.id });
              this.setState({ webPrivileges: totalPrivilages })
              // parentPrvlgs.map((privilegeItem) => {
              //   privilegeItem.selectedindex = 1;
              //   privilegeItem.subPrivilege.childPrivileges !== null && privilegeItem.subPrivilege.childPrivileges.map((childItem) => {
              //     childItem.selectedindex = 1;
              //     var temp = { id: childItem.id };
              //     childIds.push(temp);
              //   })
              //   const selectedWebSubPrvlg = {
              //     id: privilegeItem.subPrivilege.id,
              //     parentId: privilegeItem.subPrivilege.parentPrivilegeId,
              //     childPrivillages: childIds
              //   };

              //   this.state.selectedSubPrvlgs.push(selectedWebSubPrvlg)
              // });
              // const obj = {
              //   id: item.id
              // }
              // this.state.selectedParentPrvlgs.push(obj)
            // });

          }
          // data creation for add privilage
          else {
            let webRes = res.data.webPrivileges;
            let len = webRes.length;
            if (len > 0) {
              this.setState({ loading: false });
              for (let i = 0; i < len; i++) {
                let privilege = webRes[i];
                let previlagename = webRes[i].name;
                if (privilege.subPrivileges !== null) {
                  let subPrivilegeRes = privilege.subPrivileges;
                  let subLen = subPrivilegeRes.length;
                  var subprivilagesArray = [];
                  if (subLen > 0) {
                    for (let j = 0; j < subLen; j++) {
                      if (privilege.id === subPrivilegeRes[j].parentPrivilegeId) {
                        let subPrivilege = subPrivilegeRes[j];
                        if (subPrivilege.childPrivileges !== null) {
                          let childLen = subPrivilege.childPrivileges.length;
                          for (let p = 0; p < childLen; p++) {
                            if (subPrivilege.id === subPrivilege.childPrivileges[p].subPrivillageId) {
                              subPrivilege.childPrivileges[p].selectedindex = 0
                            }
                          }
                        }
                        subprivilagesArray.push({ name: subPrivilege.name, selectedindex: 0, description: subPrivilege.description, subPrivilege: subPrivilege });
                      }
                    }
                  }
                }
                console.log("sub privilages Array",subprivilagesArray);
                this.state.webPrivileges.push({ title: previlagename, selectedindex: 0, data: subprivilagesArray, id: privilege.id });
                this.setState({ webPrivileges: this.state.webPrivileges });
                this.setState({ subWebList: this.state.subWebList });
              }
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

  selectedWebParentPrivilage = (item, i) => {
    //Before not selected, now selected
    if (item.selectedindex === 0) {
      item.selectedindex = 1;

      item.data.map((subPrvlItem) => {
        var childIds = [];
        subPrvlItem.selectedindex = 1
        subPrvlItem.subPrivilege.childPrivileges !== null && subPrvlItem.subPrivilege.childPrivileges.map((childItem) => {
          childItem.selectedindex = 1
          var temp = { id: childItem.id };
          childIds.push(temp);
        })
        const selectedWebSubPrvlg = {
          id: subPrvlItem.subPrivilege.id,
          parentId: subPrvlItem.subPrivilege.parentPrivilegeId,
          childPrivillages: childIds
        };
        this.state.selectedSubPrvlgs.push(selectedWebSubPrvlg)
      })
      const obj = {
        id: item.id
      }
      this.state.selectedParentPrvlgs.push(obj)
      // console.log("selected Sub Prvlgs in parent prvl select", JSON.stringify(this.state.selectedParentPrvlgs))
      //
    }
    //Before selected, now unselected
    else {
      item.selectedindex = 0;
      let index = -1;
      let parentPrvlgs = this.state.selectedParentPrvlgs
      for (let i = 0; i < parentPrvlgs.length; i++) {
        if (parentPrvlgs[i].id === item.id) {
          parentPrvlgs.splice(i, 1)
          break
        }
      }
      item.data.map((subPrvlItem, i) => {
        subPrvlItem.selectedindex = 0;
        subPrvlItem.subPrivilege.childPrivileges !== null && subPrvlItem.subPrivilege.childPrivileges.map((childItem) => {
          childItem.selectedindex = 0
        })
        var sel = this.state.selectedSubPrvlgs;
        for (let i = 0; i < sel.length; i++) {
          if (sel[i].id === subPrvlItem.subPrivilege.id) {
            sel.splice(i, 1);
          }
        }
        const list = this.state.subWebList;
        list.splice(index, 1);
        this.setState({ subWebList: list, isAllWebChecked: false, selectedParentPrvlgs: parentPrvlgs, selectedSubPrvlgs: sel })
      })
    }
    this.setState({ mobilePrivileges: this.state.mobilePrivileges });
  };

  selectedWebSubPrivilage = (item, index, section) => {
    //Before not selected, now selected
    if (item.selectedindex === 0) {
      item.selectedindex = 1;
      var childIds = [];
      item.subPrivilege.childPrivileges !== null && item.subPrivilege.childPrivileges.map((childItem) => {
        childItem.selectedindex = 1;
        var temp = { id: childItem.id };
        childIds.push(temp);
      })
      const selectedWebSubPrvlg = {
        id: item.subPrivilege.id,
        parentId: item.subPrivilege.parentPrivilegeId,
        childPrivillages: childIds
      };
      this.state.selectedSubPrvlgs.push(selectedWebSubPrvlg)
    }
    //Before selected, now unselected
    else {
      item.selectedindex = 0;
      item.subPrivilege.childPrivileges !== null && item.subPrivilege.childPrivileges.map((childItem) => {
        childItem.selectedindex = 0
      })
      var sel = this.state.selectedSubPrvlgs;
      for (let i = 0; i < sel.length; i++) {
        if (sel[i].id === item.subPrivilege.id) {
          sel.splice(i, 1);
          break
        }
      }
      const list = this.state.subWebList;
      list.splice(index, 1);
      this.setState({ subWebList: list, isAllWebChecked: false, selectedSubPrvlgs: sel })
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
      this.setState({ selectedSubPrvlgs: sel })
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
        var childIds = [];
        data.map((privilegeItem) => {
          privilegeItem.selectedindex = 1;
          privilegeItem.subPrivilege.childPrivileges !== null && privilegeItem.subPrivilege.childPrivileges.map((childItem) => {
            childItem.selectedindex = 1;
            var temp = { id: childItem.id };
            childIds.push(temp);
          })
          const selectedWebSubPrvlg = {
            id: privilegeItem.subPrivilege.id,
            parentId: privilegeItem.subPrivilege.parentPrivilegeId,
            childPrivillages: childIds
          };

          this.state.selectedSubPrvlgs.push(selectedWebSubPrvlg)
        });
        const obj = {
          id: item.id
        }
        this.state.selectedParentPrvlgs.push(obj)
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
        this.setState({ selectedSubPrvlgs: [], selectedParentPrvlgs: [] })
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
        var childIds = [];
        data.map((subPrivilegeItem) => {
          subPrivilegeItem.selectedindex = 1;
          subPrivilegeItem.subPrivilege.childPrivileges !== null && subPrivilegeItem.subPrivilege.childPrivileges.map((childItem) => {
            childItem.selectedindex = 1;
            var temp = { id: childItem.id };
            childIds.push(temp);
          })
          const selectedWebSubPrvlg = {
            id: subPrivilegeItem.subPrivilege.id,
            parentId: subPrivilegeItem.subPrivilege.parentPrivilegeId,
            childPrivillages: childIds
          };

          this.state.selectedMobileSubPrvlgs.push(selectedWebSubPrvlg)
        });
        const obj = {
          id: item.id
        }
        this.state.selectedMobileParentPrvlgs.push(obj)
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
        this.setState({ selectedMobileParentPrvlgs: [], selectedMobileSubPrvlgs: [] })
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
          webParentPrivileges.push({ id: this.state.webPrivileges[i].id })
          this.state.subWebList.push({
            parentId: this.state.webPrivileges[i].id,
            subPrivillages: this.state.webPrivileges[i].data[j].subPrivilege.id,
          });
          let subWebList = this.state.subWebList;
        }
      }
    }
    this.setState({ subWebList: this.state.subWebList });
    global.mobilePrivilages = this.state.subMobileList;
    global.webPrivilages = this.state.subWebList;
    global.selectedParentPrvlgs = this.state.selectedParentPrvlgs
    global.selectedSubPrvlgs = this.state.selectedSubPrvlgs
    global.selectedMobileParentPrvlgs = this.state.selectedMobileParentPrvlgs
    global.selectedMobileSubPrvlgs = this.state.selectedMobileSubPrvlgs
    this.props.route.params.onGoBack();
    this.props.navigation.goBack();
  }

  render() {
    // console.log("selected Parent Prvlgs in render", JSON.stringify(this.state.selectedParentPrvlgs), "select sub prvlgs : " + JSON.stringify(this.state.selectedSubPrvlgs));
    // console.log("selected mobile Parent Prvlgs in render", JSON.stringify(this.state.selectedMobileParentPrvlgs), "select Mobile sub prvlgs : " + JSON.stringify(this.state.selectedMobileSubPrvlgs));
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
          keyExtractor={(item, i) => i.toString()}
          renderItem={({ item, index }) => (
            <View>
              {this.state.viewWeb && (
                < View >
                  <TouchableOpacity onPress={() => this.selectedWebParentPrivilage(item, index)}>
                    <View style={{ flexDirection: 'row', padding: 4 }}>
                      {item.selectedindex === 1 && (
                        <Image source={require('../assets/images/selected.png')} style={{ left: 20, top: 5 }} />
                      )}
                      {item.selectedindex === 0 && (
                        <Image source={require('../assets/images/langunselect.png')} style={{ left: 20, top: 5 }} />
                      )}
                      <Text style={scss.section_headers}>{item.title ? item.title : item.name}</Text>
                    </View>
                  </TouchableOpacity>
                  {item.selectedindex === 1 &&
                    <>
                      {item.data?.map((item, index) => {
                        return (
                          <View style={{ paddingLeft: 15, padding: 5 }}>
                            <TouchableOpacity onPress={() => this.selectedWebSubPrivilage(item, index)}>
                              <View style={[{ flexDirection: 'row' }]}>
                                {item.selectedindex === 1 && (
                                  <Image source={require('../assets/images/selected.png')} style={{ left: 20, top: 5 }} />
                                )}
                                {item.selectedindex === 0 && (
                                  <Image source={require('../assets/images/langunselect.png')} style={{ left: 20, top: 5 }} />
                                )}
                                <Text style={{ marginLeft: 30 }}>{item.name}</Text>
                              </View>
                            </TouchableOpacity>
                            {item.selectedindex === 1 &&
                              item?.subPrivilege?.childPrivileges?.map((childItem, index) => {
                                return (
                                  <View style={{ paddingLeft: 15, padding: 5 }}>
                                    <TouchableOpacity onPress={() => this.selectedWebChildPrivilage(childItem, index, item)}>
                                      <View style={{ flexDirection: 'row' }}>
                                        {childItem.selectedindex === 1 && (
                                          <Image source={require('../assets/images/selected.png')} style={{ left: 20, top: 5 }} />
                                        )}
                                        {childItem.selectedindex === 0 && (
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
              )
              }
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
                    <View style={{ flexDirection: 'row', padding: 4 }}>
                      {item.selectedindex === 1 && (
                        <Image source={require('../assets/images/selected.png')} style={{ left: 20, top: 5 }} />
                      )}
                      {item.selectedindex === 0 && (
                        <Image source={require('../assets/images/langunselect.png')} style={{ left: 20, top: 5 }} />
                      )}
                      <Text style={scss.section_headers}>{item.title}</Text>
                    </View>
                  </TouchableOpacity>
                  {item.selectedindex === 1 &&
                    <>
                      {item.data?.map((item, index) => {
                        return (
                          <View style={{ paddingLeft: 8, padding: 2 }}>
                            <TouchableOpacity onPress={() => this.selectedMobileSubPrivilage(item, index)} style={scss.item}>
                              <View style={[{ flexDirection: 'row' }]}>
                                {item.selectedindex === 1 && (
                                  <Image source={require('../assets/images/selected.png')} style={{ left: 20, top: 5 }} />
                                )}
                                {item.selectedindex === 0 && (
                                  <Image source={require('../assets/images/langunselect.png')} style={{ left: 20, top: 5 }} />
                                )}
                                <Text style={{ marginLeft: 30 }}>{item.name}</Text>
                              </View>
                            </TouchableOpacity>
                            {item.selectedindex === 1 &&
                              item?.subPrivilege?.childPrivileges?.map((childItem, index) => {
                                return (
                                  <View style={{ paddingLeft: 35, padding: 3 }}>
                                    <TouchableOpacity onPress={() => this.selectedMobileChildPrivilage(childItem, index, item)}>
                                      <View style={{ flexDirection: 'row' }}>
                                        {childItem.selectedindex === 1 && (
                                          <Image source={require('../assets/images/selected.png')} style={{ left: 20, top: 5 }} />
                                        )}
                                        {childItem.selectedindex === 0 && (
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
              )}
            </View>
          )
          }
        />
        <View style={forms.action_buttons_container} >
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
});
