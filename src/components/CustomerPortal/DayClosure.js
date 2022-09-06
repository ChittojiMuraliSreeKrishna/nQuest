import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { Component } from 'react';
import { Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Device from 'react-native-device-detection';
import scss from '../../commonUtils/assets/styles/style.scss';
import Loader from '../../commonUtils/loader';
import { RF, RH, RW } from '../../Responsive';
import CustomerService from '../services/CustomerService';
import { flatListTitle } from '../Styles/Styles';
var deviceheight = Dimensions.get('window').height;
var deviceheight = Dimensions.get('window').height;
var deviceWidth = Dimensions.get("window").width;
export default class DayClosure extends Component {

  constructor(props) {
    super(props);
    this.state = {
      storeId: "",
      dayClosureList: [],
      enableButton: false,
      loading: false
    };
  }

  async componentDidMount() {
    const storeId = await AsyncStorage.getItem("storeId");
    this.setState({ storeId: storeId });
    this.getAllDayCloser();
  }

  getAllDayCloser() {
    this.setState({ loading: true });
    const param = "?storeId=" + this.state.storeId;
    axios.get(CustomerService.getAllDayClosure() + param).then(res => {
      if (res) {
        this.setState({ dayClosureList: res.data.result });
        if (this.state.dayClosureList.length > 0) {
          this.setState({ enableButton: true });
        }
      }
      this.setState({ loading: false });
    }).catch(err => {
      this.setState({ loading: false });
      console.log(err);
    });
  }

  closeDay() {
    const param = "?storeId=" + this.state.storeId;
    axios.put(CustomerService.dayCloseActivity() + param).then(res => {
      if (res) {
        alert(res.data.result);
        this.getAllDayCloser();
      }
    });
  }

  render() {
    return (
      <View>
        {this.state.loading &&
          <Loader
            loading={this.state.loading} />
        }
        <View>
          <FlatList
            style={{ backgroundColor: '#FFF' }}
            ListHeaderComponent={<View style={scss.headerContainer}>
              <Text style={flatListTitle}>List of Pending Dl slips - <Text style={{ color: '#ED1C24' }}>{this.state.dayClosureList.length}</Text> </Text>
              {this.state.enableButton && (
                <TouchableOpacity style={styles.closeBtn} onPress={() => this.closeDay()}>
                  <Text style={styles.closeBtnText}>Day Closure</Text>
                </TouchableOpacity>
              )}
            </View>}
            data={this.state.dayClosureList}
            scrollEnabled={true}
            ListEmptyComponent={<Text style={styles.emptyText}>No Pending Delivery Slips</Text>}
            renderItem={({ item, index }) => (
              <View style={scss.flatListContainer}>
                <View style={scss.flatListSubContainer}>
                  <View style={scss.textContainer}>
                    <Text style={scss.highText}>S.No: {index + 1}</Text>
                    <Text style={scss.textStyleLight}>M.R.P: {item.mrp}</Text>
                  </View>
                  <View style={scss.textContainer}>
                    <Text style={scss.textStyleMedium}>DsNumber: {"\n"}{item.dsNumber}</Text>
                    <Text style={scss.textStyleLight}>SalesMan: {item.salesMan}</Text>
                  </View>
                </View>
              </View>
            )}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  titleContainer: {
    backgroundColor: '#686868',
    marginTop: 30,
    display: 'flex',
    flexDirection: 'row',
    width: deviceWidth,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: RW(20),
    paddingRight: RW(20)

  },
  title: {
    fontSize: RF(16),
    fontFamily: 'medium',
    color: '#ffffff90',
    textAlign: 'center',
    marginTop: RH(20),
    marginBottom: RH(20)
  },
  closeBtn: {
    width: RW(150),
    height: RH(40),
    backgroundColor: '#ED1C24',
    borderRadius: Device.isTablet ? 10 : 5,
  },
  closeBtnText: {
    color: '#fff',
    fontSize: RF(14),
    textAlign: 'center',
    fontFamily: 'medium',
    marginTop: 5
  },
  emptyText: {
    fontSize: RF(14),
    fontFamily: 'medium',
    marginTop: deviceheight / 3,
    textAlign: 'center',
    color: '#ED1C24'
  }
});
