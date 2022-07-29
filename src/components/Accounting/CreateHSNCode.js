import React, { Component } from 'react';
import { Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Device from 'react-native-device-detection';
import Modal from 'react-native-modal';
import { deleteCloseBtn, deleteContainer, deleteHeader, deleteHeading, deleteText, filterCloseImage, filterHeading, filterMainContainer, filterSubContainer } from '../Styles/PopupStyles';
import { buttonContainer, buttonImageStyle, buttonStyle, buttonStyle1, flatListHeaderContainer, flatListMainContainer, flatlistSubContainer, flatListTitle, highText, textContainer, textStyleLight, textStyleMedium } from '../Styles/Styles';
import AccountingService from '../services/AccountingService';
var deviceWidth = Dimensions.get("window").width;
import Loader from '../../commonUtils/loader';
import scss from '../../assets/styles/style.scss';

export default class CreateHSNCode extends Component {

  constructor(props) {
    super(props);
    this.state = {
      modalVisible: true,
      deleteHsnCode: false,
      hsnList: [],
      loading: false,
    };
  }


  async componentDidMount() {
    this.getAllHsnCode();
  }

  // Getting All HsnCodes
  async getAllHsnCode() {
    this.setState({ loading: true });
    AccountingService.getAllHsnCodes().then(res => {
      if (res) {
        console.log(res.data);
        this.setState({ hsnList: res.data.result });
      }
      this.setState({ loading: false });
    }).catch(err => {
      this.setState({ loading: false });
      console.log(err);
    });
  }

  // Filter Model Actions
  modelCancel() {
    this.setState({ modalVisible: false });
  }

  // Edit Hsn
  handleeditHsn(item, index) {
    this.props.navigation.navigate('AddHsnCode', {
      item: item, isEdit: true,
    });
  }

  // Add Hsn
  navigateToAddHsnCode() {
    this.props.navigation.navigate('AddHsnCode', {
      isEdit: false,
      onGoBack: () => this.getAllHsnCode()
    });
  }

  render() {
    return (
      <View>
        {this.state.loading &&
          <Loader
            loading={this.state.loading} />
        }
        <FlatList
          ListHeaderComponent={<View style={scss.headerContainer}>
            <Text style={flatListTitle}>Create HSN Code</Text>
            <TouchableOpacity onPress={() => this.navigateToAddHsnCode()}><Text style={{ fontSize: 20 }}>+</Text></TouchableOpacity>
          </View>}
          data={this.state.hsnList}
          style={{ marginTop: 20 }}
          scrollEnabled={true}
          renderItem={({ item, index }) => (
            <View style={flatListMainContainer}>
              <View style={flatlistSubContainer}>
                <View style={textContainer}>
                  <Text style={highText}>HSN CODE: {item.hsnCode}</Text>
                </View>
                <View style={textContainer}>
                  <Text style={textStyleMedium}>GOODS/SERVICES: {"\n"}{item.description}</Text>
                  <Text style={textStyleLight}>TAX APPLICABLE: {"\n"}{item.taxAppliesOn}</Text>
                </View>
                <View style={textContainer}>
                  <Text style={textStyleLight}>SLAB: {item.slabBased}</Text>
                  <View style={buttonContainer}>
                    <TouchableOpacity style={buttonStyle1} onPress={() => this.handleeditHsn(item, index)}>
                      <Image style={buttonImageStyle} source={require('../assets/images/edit.png')} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          )}
        />
      </View>
    );
  }
}
