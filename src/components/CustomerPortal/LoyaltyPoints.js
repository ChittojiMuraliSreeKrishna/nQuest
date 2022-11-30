import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { Component } from "react";
import {
  FlatList, ScrollView, TouchableOpacity,
  View
} from "react-native";
import I18n from "react-native-i18n";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Modal from "react-native-modal";
import { Text, TextInput } from "react-native-paper";
import IconFA from 'react-native-vector-icons/FontAwesome';
import IconMA from 'react-native-vector-icons/MaterialCommunityIcons';
import IconMAA from 'react-native-vector-icons/MaterialIcons';
import forms from '../../commonUtils/assets/styles/formFields.scss';
import scss from "../../commonUtils/assets/styles/style.scss";
import Loader from "../../commonUtils/loader";
import CustomerService from "../services/CustomerService";
import {
  listEmptyMessage
} from "../Styles/Styles";

export default class LoyaltyPoints extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listAllLoyaltyPoints: [],
      filteredLoyaltyPoints: [],
      filterActive: false,
      flagFilterOpen: false,
      modalVisible: false,
      filteredInvoiceNumber: '',
      filteredMobileNumber: '',
      flagAdd: false,
      addModelVisible: false,
      invoiceNumber: '',
      mobileNumber: '',
      amountPaid: '',
      name: '',
      userId: '',
      invoiceCreatedDate: '',
      clientId: '',
      isFetching: false
    }
  }

  async componentDidMount() {
    const clientId = await AsyncStorage.getItem("custom:clientId1")
    this.setState({ clientId: clientId })
    this.getAllLoyaltyPoints();
  }

  getAllLoyaltyPoints() {
    CustomerService.getAllLoyaltyPoints().then((res) => {
      if (res.data.isSuccess === 'true') {
        this.setState({
          listAllLoyaltyPoints: res.data['result']
        });
      } else {
        alert(res.data.message);
      }
    });
  }

  filterAction() {
    this.setState({ flagFilterOpen: true, modalVisible: true, filteredLoyaltyPoints: [] });
  }

  clearFilterAction() {
    this.setState({ flagFilterOpen: false, filterActive: false, filteredLoyaltyPoints: [] });
    this.getAllLoyaltyPoints();
  }

  modelCancel() {
    this.setState({ modalVisible: false, flagFilterOpen: false });
  }

  handleFilteredInvoice = (value) => {
    this.setState({ filteredInvoiceNumber: value })
  }

  handleFilteredMobile = (value) => {
    this.setState({ filteredMobileNumber: value })
  }

  searchLoyaltyPoints() {
    const { filteredInvoiceNumber, filteredMobileNumber } = this.state;
    const obj = {
      invoiceNumber: filteredInvoiceNumber,
      mobileNumber: filteredMobileNumber
    }
    CustomerService.searchLoyaltyPoints(obj).then((res) => {
      if (res.data.isSuccess === 'true') {
        this.setState({
          filteredInvoiceNumber: '',
          filteredMobileNumber: '',
          listAllLoyaltyPoints: res.data['result'],
          filterActive: true
        });
      } else {
        alert(res.data.message);
      }
    })
    this.modelCancel()
  }

  handleAddLoyalityPoints() {
    this.setState({ flagAdd: true, modalVisible: true })
  }

  addModelCancel() {
    this.setState({ modalVisible: false, flagAdd: false });
  }

  getInvoiceDetails = (e) => {
    CustomerService.getInvoiceDetails(this.state.invoiceNumber).then(res => {
      if (res.data.isSuccess === 'true') {
        const result = res.data['result'];
        this.setState({
          mobileNumer: result.mobileNumber,
          amountPaid: result.netPayableAmount,
          name: result.customerName,
          userId: result.userId,
          invoiceCreatedDate: result.createdDate
        });
      } else {
        alert(res.data.message);
      }
    });
  }

  handleInvoiceNumber = (value) => {
    this.setState({ invoiceNumber: value })
  }

  handleName = (value) => {
    this.setState({ name: value })
  }

  handleMobileNumber = (value) => {
    this.setState({ mobileNumber: value })
  }

  getTodaysDate() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd;
    return today;
  }

  saveLoyalyatyPoints() {
    const { mobileNumber, name, invoiceNumber, amountPaid, clientId, userId, createdDate } = this.state;
    const obj = {
      userId: userId,
      domainId: clientId,
      mobileNumber: mobileNumber,
      customerName: name,
      invoiceNumber: invoiceNumber,
      invoiceCreatedDate: createdDate === undefined ? this.getTodaysDate() : createdDate,
      invoiceAmount: amountPaid
    }
    CustomerService.saveLoyaltyPoints(obj).then(res => {
      if (res.data.isSuccess === 'true') {
        alert(res.data.message);
        this.setState({
          isAdd: false,
          userId: '',
          domainId: '',
          saveMobileNumer: '',
          amountPaid: '',
          name: '',
          saveInvoiceNumber: '',
        });
      } else {
        alert(res.data.message);
      }
      this.addModelCancel()
      this.getAllLoyaltyPoints();
    });
  }

  refresh() {
    this.setState({ listAllLoyaltyPoints: [] }, () => {
      this.getAllLoyaltyPoints();
    });
  }

  render() {
    return (
      <View>
        {this.state.loading && <Loader loading={this.state.loading} />}
        <View>
          <FlatList
            style={scss.flatListBody}
            refreshing={this.state.isFetching}
            onRefresh={() => this.refresh()}
            ListHeaderComponent={
              <View style={scss.headerContainer}>
                <Text style={[scss.flat_heading]}>
                  List Of LC -{" "}
                  <Text style={{ color: "#ED1C24" }}>(100 POINTS = ₹ 10)</Text>
                </Text>
                <View style={scss.headerContainer}>
                  <IconMAA
                    size={30}
                    name="playlist-add"
                    style={{ marginRight: 10 }}
                    color="#ED1C24"
                    onPress={() => { this.handleAddLoyalityPoints() }}
                  >
                  </IconMAA>
                  {!this.state.filterActive && (
                    <IconFA
                      name="sliders"
                      size={25}
                      style={scss.action_icons}
                      onPress={() => this.filterAction()}
                    >
                    </IconFA>
                  )}
                  {this.state.filterActive && (
                    <IconFA
                      name="sliders"
                      size={25}
                      color="#ED1C24"
                      onPress={() => { this.clearFilterAction() }}
                    >
                    </IconFA>
                  )}
                </View>
              </View>
            }
            data={this.state.listAllLoyaltyPoints}
            scrollEnabled={true}
            ListEmptyComponent={
              <Text style={listEmptyMessage}>&#9888; Records Not Found</Text>
            }
            keyExtractor={(item, i) => i.toString()}
            removeClippedSubviews={false}
            renderItem={({ item, index }) => (
              <View style={{ flex: 1 }}>
                <ScrollView>
                  <View style={scss.flatListContainer}>
                    <View style={scss.flatListSubContainer}>
                      <View style={scss.textContainer}>
                        <Text style={scss.highText}>S.NO: {item.loyaltyId}</Text>
                      </View>
                      <View style={scss.textContainer}>
                        <Text style={scss.textStyleLight}> {I18n.t("NAME")}:
                          <Text style={scss.textStyleMedium}>
                            {" " + item.customerName}
                          </Text>
                        </Text>
                        <Text style={scss.textStyleLight}>
                          {I18n.t("MOBILE NUMBER")}: ₹{item.mobileNumber}
                        </Text>
                      </View>
                      <View style={scss.textContainer}>
                        <Text style={scss.textStyleLight}>
                          {I18n.t("LOYALTY POINTS	")}: ₹{item.loyaltyPoints}
                        </Text>
                        <Text style={scss.textStyleLight}>
                          {I18n.t("POINTS VALUE")}: 0
                        </Text>
                      </View>
                      {/* <View style={scss.textContainer}>
                                                <Text style={scss.textStyleMedium} selectable={true}>
                                                    {item.barcode}
                                                </Text>
                                            </View> */}
                      <View style={scss.flatListFooter}>
                        <Text style={scss.footerText}>
                          EXPIRY DATE	:{" "}
                          {item.expiredDate
                            ? item.expiredDate.toString().split(/T/)[0]
                            : item.expiredDate}
                        </Text>
                      </View>
                    </View>
                  </View>
                </ScrollView>
              </View>
            )}
            ListFooterComponent={
              this.state.loadMoreActive && (
                <View style={scss.page_navigation_container}>
                  <View style={scss.page_navigation_subcontainer}>
                    <Text style={scss.page_nav_text}>{`Page: ${this.state.pageNo + 1} - ${this.state.totalPages}`}</Text>
                  </View>
                  <View style={scss.page_navigation_subcontainer}>
                    {this.state.loadPrevActive && (
                      <View style={scss.page_navigation_subcontainer}>
                        <IconMA
                          style={[scss.pag_nav_btn]}
                          color={this.state.loadPrevActive === true ? "#353c40" : "#b9b9b9"}
                          onPress={() => this.loadMoreList(0)}
                          name="chevron-double-left"
                          size={25}
                        />
                        <IconMA
                          style={[scss.pag_nav_btn]}
                          color={this.state.loadPrevActive === true ? "#353c40" : "#b9b9b9"}
                          onPress={() => this.loadMoreList(this.state.pageNo - 1)}
                          name="chevron-left"
                          size={25}
                        />
                      </View>
                    )}
                    <Text style={scss.page_nav_pageno}>{this.state.pageNo + 1}</Text>
                    {this.state.loadNextActive && (
                      <View style={scss.page_navigation_subcontainer}>
                        <IconMA
                          style={[scss.pag_nav_btn]}
                          onPress={() => this.loadMoreList(this.state.pageNo + 1)}
                          name="chevron-right"
                          size={25}
                        />
                        <IconMA
                          style={[scss.pag_nav_btn]}
                          onPress={() => this.loadMoreList(this.state.totalPages - 1)}
                          name="chevron-double-right"
                          size={25}
                        />
                      </View>
                    )}
                  </View>
                </View>
              )
            }
          />
        </View>
        {this.state.flagFilterOpen && (
          <View>
            <Modal style={{ margin: 0 }} isVisible={this.state.modalVisible}
              onBackButtonPress={() => this.modelCancel()}
              onBackdropPress={() => this.modelCancel()}
            >
              <View style={forms.filterModelContainer}>
                <Text style={forms.popUp_decorator}>-</Text>
                <View style={forms.filterModelSub}>
                  <KeyboardAwareScrollView>
                    <TextInput
                      mode="flat"
                      activeUnderlineColor="#b9b9b9"
                      outlineColor="#b9b9b9"
                      style={forms.input_fld}
                      underlineColorAndroid="transparent"
                      placeholder={I18n.t("Invoice Number")}
                      placeholderTextColor="#6f6f6f"
                      textAlignVertical="center"
                      autoCapitalize="none"
                      value={this.state.filteredInvoiceNumber}
                      onChangeText={this.handleFilteredInvoice}
                    />
                    <TextInput
                      mode="flat"
                      activeUnderlineColor="#b9b9b9"
                      outlineColor="#b9b9b9"
                      style={forms.input_fld}
                      underlineColorAndroid="transparent"
                      placeholder={I18n.t("Mobile Number")}
                      placeholderTextColor="#6f6f6f"
                      textAlignVertical="center"
                      autoCapitalize="none"
                      maxLength={10}
                      value={this.state.filteredMobileNumber}
                      onChangeText={this.handleFilteredMobile}
                    />
                    <View style={forms.action_buttons_container}>
                      <TouchableOpacity style={[forms.action_buttons, forms.submit_btn]}
                        onPress={() => { this.searchLoyaltyPoints() }}>
                        <Text style={forms.submit_btn_text} >{I18n.t("APPLY")}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[forms.action_buttons, forms.cancel_btn]}
                        onPress={() => this.modelCancel()}>
                        <Text style={forms.cancel_btn_text}>{I18n.t("CANCEL")}</Text>
                      </TouchableOpacity>
                    </View>
                  </KeyboardAwareScrollView>
                </View>
              </View>
            </Modal >
          </View >
        )}

        {this.state.flagAdd && (
          <View>
            <Modal style={{ margin: 0 }} isVisible={this.state.modalVisible}
              onBackButtonPress={() => this.addModelCancel()}
              onBackdropPress={() => this.addModelCancel()}
            >
              <View style={forms.filterModelContainer}>
                <Text style={forms.popUp_decorator}>-</Text>
                <View style={forms.filterModelSub}>
                  <KeyboardAwareScrollView>
                    <TextInput
                      mode="flat"
                      activeUnderlineColor="#b9b9b9"
                      outlineColor="#b9b9b9"
                      style={forms.input_fld}
                      underlineColorAndroid="transparent"
                      placeholder={I18n.t("Invoice Number")}
                      placeholderTextColor="#6f6f6f"
                      textAlignVertical="center"
                      autoCapitalize="none"
                      value={this.state.invoiceNumber}
                      onChangeText={this.handleInvoiceNumber}
                      onEndEditing={this.getInvoiceDetails}
                    />
                    <TextInput
                      mode="flat"
                      activeUnderlineColor="#b9b9b9"
                      outlineColor="#b9b9b9"
                      style={forms.input_fld}
                      underlineColorAndroid="transparent"
                      placeholder={I18n.t("Name")}
                      placeholderTextColor="#6f6f6f"
                      textAlignVertical="center"
                      autoCapitalize="none"
                      maxLength={10}
                      value={this.state.name}
                      onChangeText={this.handleName}
                    />
                    <TextInput
                      mode="flat"
                      activeUnderlineColor="#b9b9b9"
                      outlineColor="#b9b9b9"
                      style={forms.input_fld}
                      underlineColorAndroid="transparent"
                      placeholder={I18n.t("Amount Paid")}
                      placeholderTextColor="#6f6f6f"
                      disabled={true}
                      value={"₹" + this.state.amountPaid}
                    />
                    <TextInput
                      mode="flat"
                      activeUnderlineColor="#b9b9b9"
                      outlineColor="#b9b9b9"
                      style={forms.input_fld}
                      underlineColorAndroid="transparent"
                      placeholder={I18n.t("Mobile Number")}
                      placeholderTextColor="#6f6f6f"
                      textAlignVertical="center"
                      autoCapitalize="none"
                      maxLength={10}
                      value={this.state.mobileNumber}
                      onChangeText={this.handleMobileNumber}
                    />
                    <View style={forms.action_buttons_container}>
                      <TouchableOpacity style={[forms.action_buttons, forms.submit_btn]}
                        onPress={() => { this.saveLoyalyatyPoints() }}>
                        <Text style={forms.submit_btn_text} >{I18n.t("APPLY")}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[forms.action_buttons, forms.cancel_btn]}
                        onPress={() => this.addModelCancel()}>
                        <Text style={forms.cancel_btn_text}>{I18n.t("CANCEL")}</Text>
                      </TouchableOpacity>
                    </View>
                  </KeyboardAwareScrollView>
                </View>
              </View>
            </Modal >
          </View >
        )}

      </View>
    )
  }
}  
