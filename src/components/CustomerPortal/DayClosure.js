import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import moment from 'moment';
import React, { Component } from 'react';
import { Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Device from 'react-native-device-detection';
import scss from '../../commonUtils/assets/styles/style.scss';
import Loader from '../../commonUtils/loader';
import { RF, RH, RW } from '../../Responsive';
import CustomerService from '../services/CustomerService';
import { flatListTitle, textContainer } from '../Styles/Styles';

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
      loading: false,
      isFetching: false
    };
  }

  async componentDidMount () {
    const storeId = await AsyncStorage.getItem("storeId");
    this.setState({ storeId: storeId });
    this.getAllDayCloser();
  }

  refresh () {
    this.setState({ dayClosureList: [] }, () => {
      this.getAllDayCloser();
    });
  }

  getAllDayCloser () {
    this.setState({ loading: true });
    const param = "?storeId=" + this.state.storeId;
    axios.get(CustomerService.getAllDayClosure() + param).then(res => {
      if (res?.data) {
        if (res.data.result.deliverySlips.length > 0) {
          console.log(res.data.result);
          this.setState({ dayClosureList: res.data.result.deliverySlips });
          if (this.state.dayClosureList.length > 0) {
            this.setState({ enableButton: true });
          }
        }
      }
      this.setState({ loading: false });
    }).catch(err => {
      this.setState({ loading: false });
      console.log(err);
    });
  }

  closeDay () {
    const param = "?storeId=" + this.state.storeId;
    axios.put(CustomerService.dayCloseActivity() + param).then(res => {
      if (res) {
        alert(res.data.result);
        this.getAllDayCloser();
      }
    });
  }

  deleteEstimationSlip (dsNumber) {
    CustomerService.deleteEstimationSlip(dsNumber).then((res) => {
      if (res.data.result) {
        alert(res.data.result);
        this.getAllDayCloser(0);
      } else {
        alert(res.data.message);
      }

    });
  }

  render () {
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
              <Text style={flatListTitle}>List of Pending DL slips - <Text style={{ color: '#ED1C24' }}>{this.state.dayClosureList.length}</Text> </Text>
              {this.state.enableButton && (
                <TouchableOpacity style={styles.closeBtn} onPress={() => this.closeDay()}>
                  <Text style={styles.closeBtnText}>Day Closure</Text>
                </TouchableOpacity>
              )}
            </View>}
            data={this.state.dayClosureList}
            scrollEnabled={true}
            refreshing={this.state.isFetching}
            onRefresh={() => this.refresh()}
            removeClippedSubviews={false}
            ListEmptyComponent={<Text style={styles.emptyText}>No Pending Delivery Slips</Text>}
            renderItem={({ item, index }) => (
              <View style={scss.flatListContainer}>
                <View style={scss.flatListSubContainer}>
                  <View style={scss.textContainer}>
                    <Text style={scss.highText}>S.No: {index + 1}</Text>
                    <Text style={scss.textStyleLight}>Created Date :
                      <Text style={scss.textStyleMedium}>{"\n"}
                        {moment.utc(item.createdDate, "YYYY-MM-DDTHH:mm:ss Z").format('DD-MM-YYYY hh:mm:ss')}
                      </Text>
                    </Text>
                  </View>
                  <View style={scss.textContainer}>
                    <Text selectable={true} style={scss.textStyleLight}>ESNumber:
                      <Text style={scss.textStyleMedium}>{"\n"}{item.dsNumber}</Text>
                    </Text>
                    <Text style={scss.textStyleLight}>SalesMan: {item.salesMan}</Text>
                  </View>
                  <View style={[ textContainer, { justifyContent: 'flex-end' } ]}>
                    <View style={styles.buttons}>
                      <TouchableOpacity style={styles.deleteButton} onPress={() => this.deleteEstimationSlip(item.dsNumber)}>
                        <Image style={{ alignSelf: 'center', top: 5, height: Device.isTablet ? 30 : 20, width: Device.isTablet ? 30 : 20 }} source={require('../assets/images/delete.png')} />
                      </TouchableOpacity>
                    </View>
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
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  deleteButton: {
    width: Device.isTablet ? 50 : 30,
    height: Device.isTablet ? 50 : 30,
    borderBottomRightRadius: 5,
    borderTopRightRadius: 5,
    borderWidth: 1,
    borderColor: "lightgray",
  }
});
