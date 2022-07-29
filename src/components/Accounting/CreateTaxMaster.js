import React, { Component } from 'react';
import { Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Device from 'react-native-device-detection';
import Modal from 'react-native-modal';
import { deleteCloseBtn, deleteContainer, deleteHeader, deleteHeading, deleteText, filterCloseImage, filterHeading, filterMainContainer, filterSubContainer } from '../Styles/PopupStyles';
import { buttonContainer, buttonImageStyle, buttonStyle, buttonStyle1, flatListHeaderContainer, flatListMainContainer, flatlistSubContainer, flatListTitle, highText, textContainer, textStyleLight, textStyleMedium } from '../Styles/Styles';
import AccountingService from '../services/AccountingService';
var deviceHeight = Dimensions.get('window').height;
var deviceWidth = Dimensions.get("window").width;
import Loader from '../../commonUtils/loader';

export default class CreateTaxMaster extends Component {

  constructor(props) {
    super(props);
    this.state = {
      taxMasterDelete: false,
      modalVisible: true,
      taxList: [],
      loading: false,
    };
  }

  componentDidMount() {
    this.getTaxMaster();
    this.props.onRef(this);
  }

  async getTaxMaster() {
    this.setState({ loading: true });
    AccountingService.getAllMasterTax().then(res => {
      if (res) {
        console.log(res.data);
        this.setState({ taxList: res.data.result });
      }
      this.setState({ loading: false });
    }).catch(err => {
      this.setState({ loading: false });
      console.log(err);
    });
  }

  modelCancel() {
    this.setState({ modalVisible: false });
  }

  handledeleteTax(item, index) {
    this.setState({ taxMasterDelete: true, modalVisible: true });
  };

  handleeditTax(item, index) {
    this.props.navigation.navigate('AddTaxMaster',
      {
        item: item, isEdit: true,
      });
  };

  navigateToAddTax() {
    this.props.navigation.navigate('AddTaxMaster', {
      isEdit: false,
      onGoBack: () => {
        this.child.getTaxMaster();
        alert("hey");
      },
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
          ListHeaderComponent={<View style={flatListHeaderContainer}>
            <Text style={flatListTitle}>Create Tax Master</Text>
            <TouchableOpacity onPress={() => this.navigateToAddTax()}><Text style={{ fontSize: 20 }}>+</Text></TouchableOpacity>
          </View>}
          data={this.state.taxList}
          style={{ marginTop: 20 }}
          scrollEnabled={true}
          renderItem={({ item, index }) => (
            <View style={flatListMainContainer} >
              <View style={flatlistSubContainer}>
                <View style={textContainer}>
                  <Text style={highText}>TAX Label: {item.taxLabel}</Text>
                  <Text style={textStyleMedium}>CGST: {item.cgst}</Text>
                </View>
                <View style={textContainer}>
                  <Text style={textStyleLight}>SGST: {item.sgst}</Text>
                  <Text style={textStyleLight}>IGST: {item.igst}</Text>
                </View>
                <View style={textContainer}>
                  <Text style={textStyleLight}>CESS: {item.cess}</Text>
                  <View style={buttonContainer}>
                    {/* <TouchableOpacity style={buttonStyle1} onPress={() => this.handleeditTax(item, index)}>
                      <Image style={buttonImageStyle} source={require('../assets/images/edit.png')} />
                    </TouchableOpacity>

                    <TouchableOpacity style={buttonStyle} onPress={() => this.handledeleteTax(item, index)}>
                      <Image style={buttonImageStyle} source={require('../assets/images/delete.png')} />
                    </TouchableOpacity> */}
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
