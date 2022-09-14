import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { Component } from 'react';
import { Dimensions, FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import DatePicker from 'react-native-date-picker';
import Device from 'react-native-device-detection';
import I18n from 'react-native-i18n';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Modal from 'react-native-modal';
import { Appbar } from 'react-native-paper';
import RNPickerSelect from 'react-native-picker-select';
import { Chevron } from 'react-native-shapes';
import { RF, RH, RW } from '../../Responsive';
import ReportsService from '../services/ReportsService';
import FilterIcon from 'react-native-vector-icons/FontAwesome'
import { flatListMainContainer, flatlistSubContainer, highText, loadMoreBtn, loadmoreBtnText, textContainer, textStyleLight, textStyleMedium } from '../Styles/Styles';
import { emptyTextStyle } from '../Styles/FormFields';
import Loader from '../../commonUtils/loader';
import forms from '../../commonUtils/assets/styles/formFields.scss';

var deviceWidth = Dimensions.get("window").width;
var deviceheight = Dimensions.get("window").height;

export class ListOfPromotions extends Component {

  constructor(props) {
    super(props);
    this.state = {
      promoId: "",
      flagFilterListPromotions: false,
      modalVisible: true,
      listPromotions: [],
      promoType: '',
      promoStatus: '',
      clientId: null,
      loadMoreActive: false,
      totalPages: 0,
      pageNo: 0,
      loading: false,
      filterActive: false
    };
  }

  async componentDidMount() {
    const clientId = await AsyncStorage.getItem("custom:clientId1");
    this.setState({ clientId: clientId })
  }

  handlePromoId = (value) => {
    this.setState({ promoId: value });
  };

  applyListPromotions() {
    const obj = {
      isActive: this.state.promoStatus,
      applicability: this.state.promoType,
      clientId: this.state.clientId
    };
    ReportsService.promotionsList(obj, this.state.pageNo).then((res, err) => {
      console.log(res.data, err);
      if (res.data) {
        this.setState({
          listPromotions: res.data.result.content, totalPages: res.data.result.totalPages,
          filterActive: true, modalVisible: false
        })
        this.continuePagination()
      }
    }).catch(() => {
      alert('No Records Found');
      this.modelCancel()
      this.setState({ promoType: '', promoStatus: '' })
    });
  }

  // Pagination Function
  loadMoreList = () => {
    this.setState({ pageNo: this.state.pageNo + 1 }, () => {
      this.applyListPromotions();
    });
  };


  continuePagination() {
    if (this.state.pageNo < this.state.totalPages - 1) {
      this.setState({ loadMoreActive: true });
    } else {
      this.setState({ loadMoreActive: false });
    }
  }

  filterAction() {
    this.setState({ flagFilterListPromotions: true, modalVisible: true })
  }

  modelCancel() {
    this.setState({ flagFilterListPromotions: false, modalVisible: false })
  }

  handlePromoType = (value) => {
    this.setState({ promoType: value });
  }

  handlePromoStatus = (value) => {
    this.setState({ promoStatus: value });
  }

  clearFilterAction() {
    this.setState({
      filterActive: false, flagFilterListPromotions: false, modalVisible: false, promoType: '', promoStatus: ''
    })
  }


  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
        <Appbar>
          <Appbar.Content title="List Of Promotions" />
          {this.state.filterActive ?
            <FilterIcon
              name="sliders"
              size={25}
              style={{ marginRight: 10 }}
              color="#ed1c24"
              onPress={() => this.clearFilterAction()}
            /> :
            <FilterIcon
              name="sliders"
              size={25}
              style={{ marginRight: 10 }}
              onPress={() => this.filterAction()}
            />
          }
        </Appbar>
        {this.state.loading && <Loader loading={this.state.loading} />}
        <FlatList
          data={this.state.listPromotions}
          scrollEnabled={true}
          keyExtractor={(item, i) => i.toString()}
          ListEmptyComponent={<Text style={emptyTextStyle}>&#9888; {I18n.t("Results not loaded")}</Text>}
          removeClippedSubviews={false}
          // onEndReached={this.loadMoreList}
          // onEndReachedThreshold={200}
          renderItem={({ item, index }) => (
            <View style={[flatListMainContainer, { backgroundColor: "#FFF" }]} >
              <View style={flatlistSubContainer}>
                <View style={textContainer}>
                  <Text style={highText} >PROMO ID: {item.promoId}</Text>
                </View>
                <View style={textContainer}>
                  <Text style={textStyleMedium}>PROMO NAME: {"\n"} {item.promotionName}</Text>
                  <Text style={textStyleMedium} >DESCRIPTION: {"\n"}{item.description} </Text>
                </View>
                <View style={textContainer}>
                  <Text style={textStyleMedium}>PROMO APPLY TYPE: {"\n"} {item.promoApplyType}</Text>
                  <Text style={textStyleMedium}>APPLICABILITY: {"\n"} {item.applicability}</Text>
                </View>
              </View>
            </View>
          )}
          ListFooterComponent={
            this.state.loadMoreActive && (
              <TouchableOpacity
                style={loadMoreBtn}
                onPress={() => this.loadMoreList()}
              >
                <Text style={loadmoreBtnText}>Load More ?</Text>
              </TouchableOpacity>
            )
          }
        />

        {this.state.flagFilterListPromotions && (
          <View>
            <Modal style={{ margin: 0 }} isVisible={this.state.modalVisible}>
              <View style={styles.filterMainContainer} >
                <View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5, height: Device.isTablet ? 60 : 50 }}>
                    <View>
                      <Text style={{ marginTop: 15, fontSize: Device.isTablet ? 22 : 17, marginLeft: 20 }} > Filter by </Text>
                    </View>
                    <View>
                      <TouchableOpacity style={{ width: Device.isTablet ? 60 : RW(50), height: Device.isTablet ? 60 : RW(50), marginTop: Device.isTablet ? 20 : RH(15), }} onPress={() => this.modelCancel()}>
                        <Image style={{ margin: RH(5) }} source={require('../assets/images/modelcancel.png')} />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <Text style={{
                    height: Device.isTablet ? 2 : 1,
                    width: deviceWidth,
                    backgroundColor: 'lightgray',
                  }}></Text>
                </View>
                <KeyboardAwareScrollView enableOnAndroid={true} >
                  <Text style={styles.headings}>{I18n.t("Promo Type")}</Text>
                  <View style={[styles.rnSelectContainer, { width: deviceWidth - RW(40) }]}>
                    <RNPickerSelect
                      placeholder={{
                        label: 'Promo Type', value: ''
                      }}
                      Icon={() => {
                        return <Chevron style={styles.imagealign} size={1.5} color="gray" />;
                      }}
                      items={[{
                        label: "On Barcode",
                        value: "promotionForEachBarcode",
                      },
                      {
                        label: "On WholeBill",
                        value: "promotionForWholeBill",
                      }]}
                      onValueChange={this.handlePromoType}
                      style={pickerSelectStyles}
                      value={this.state.promoType}
                      useNativeAndroidPickerStyle={false}
                    />
                  </View>

                  <Text style={styles.headings}>{I18n.t("Promo Status")}</Text>
                  <View style={[styles.rnSelectContainer, { width: deviceWidth - RW(40) }]}>
                    <RNPickerSelect
                      placeholder={{
                        label: 'Promo Status ', value: ''
                      }}
                      Icon={() => {
                        return <Chevron style={styles.imagealign} size={1.5} color="gray" />;
                      }}
                      items={[{
                        label: "Active",
                        value: "true",
                      },
                      {
                        label: "In Active",
                        value: "false",
                      }]}
                      onValueChange={this.handlePromoStatus}
                      style={pickerSelectStyles}
                      value={this.state.promoStatus}
                      useNativeAndroidPickerStyle={false}
                    />
                  </View>

                  <View style={forms.action_buttons_container}>
                    <TouchableOpacity style={[forms.action_buttons, forms.submit_btn]}
                      onPress={() => this.applyListPromotions(this.state.pageNo)}>
                      <Text style={forms.submit_btn_text} >{I18n.t("APPLY")}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[forms.action_buttons, forms.cancel_btn]}
                      onPress={() => this.modelCancel()}>
                      <Text style={forms.cancel_btn_text}>{I18n.t("CANCEL")}</Text>
                    </TouchableOpacity>
                  </View>
                </KeyboardAwareScrollView>
              </View>
            </Modal>
          </View>
        )}
      </View>
    );
  }
}


const pickerSelectStyles = StyleSheet.create({
  placeholder: {
    color: "#6F6F6F",
    fontSize: Device.isTablet ? RF(20) : RF(15),
  },
  inputIOS: {
    justifyContent: 'center',
    height: RH(42),
    borderRadius: 3,
    borderWidth: 1,
    //paddingLeft: -20,
    fontSize: Device.isTablet ? RF(20) : RF(15),
    borderColor: '#FBFBFB',
    backgroundColor: '#FBFBFB',
  },

  inputAndroid: {
    justifyContent: 'center',
    height: Device.isTablet ? RH(52) : RH(42),
    borderRadius: 3,
    borderWidth: 1,
    //paddingLeft: -20,
    fontSize: Device.isTablet ? RF(20) : RF(15),
    borderColor: '#FBFBFB',
    backgroundColor: '#FBFBFB',
    color: '#001B4A'
  },
});

const styles = StyleSheet.create({
  headings: {
    fontSize: Device.isTablet ? 20 : 15,
    marginLeft: 20,
    color: '#B4B7B8',
    marginTop: Device.isTablet ? 10 : 5,
    marginBottom: Device.isTablet ? 10 : 5,
  },
  imagealign: {
    marginTop: Device.isTablet ? RH(25) : RH(20),
    marginRight: Device.isTablet ? RW(30) : RW(20),
  },
  modelCloseImage: {
    fontFamily: 'regular',
    fontSize: RF(12),
    position: 'absolute',
    top: RH(10),
    right: Device.isTablet ? RW(15) : RW(30),
  },
  filterMainContainer: {
    backgroundColor: '#ffffff',
    marginTop: Device.isTablet ? deviceheight - RH(500) : deviceheight - RH(400),
    height: Device.isTablet ? RH(500) : RH(400),
  },
  rnSelectContainer: {
    justifyContent: 'center',
    margin: RH(20),
    height: Device.isTablet ? RH(54) : RH(44),
    marginTop: 5,
    marginBottom: RH(10),
    borderColor: '#8F9EB717',
    borderRadius: 3,
    backgroundColor: '#FBFBFB',
    borderWidth: 1,
    fontFamily: 'regular',
    paddingLeft: RW(15),
    fontSize: Device.isTablet ? RF(20) : RF(14),
  }
});
