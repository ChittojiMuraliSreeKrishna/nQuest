import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { Component } from 'react';
import { Dimensions, FlatList, Text, View } from 'react-native';
import Device from 'react-native-device-detection';
import I18n from 'react-native-i18n';
import { formatDate } from '../../commonUtils/DateFormate';
import { RF, RH } from '../../Responsive';
import LoginService from '../services/LoginService';
import { flatListHeaderContainer, flatListMainContainer, flatlistSubContainer, flatListTitle, highText, textContainer, textStyleLight, textStyleMedium } from '../Styles/Styles';

var deviceWidth = Dimensions.get("window").width;
var deviceHeight = Dimensions.get("window").height;

export default class Domain extends Component {

  constructor(props) {
    super(props);
    this.state = {
      domainsList: [],
      channelsList: [],
      channelFull: false,
    };
  }

  componentDidMount () {
    this.getDomainsList();
  }


  async getDomainsList () {
    const clientId = await AsyncStorage.getItem("custom:clientId1");
    this.setState({ loading: true });
    axios.get(LoginService.getDomainsList() + clientId).then((res) => {
      if (res) {
        this.setState({ domainsList: res.data.result });
        this.getChannelsList();
      }
    }).catch(() => {
      this.setState({ loading: false });
      if (this.state.flagDomain === true) {
        this.setState({ domainError: "Records Not Found" });
        //    alert("There is an Error while getting Domains");
      }
    });
  }

  getChannelsList () {
    axios.get(LoginService.channelsList()).then(res => {
      if (res) {
        this.setState({ channelsList: res.data.result });
        if (this.state.domainsList.length === this.state.channelsList.length) {
          this.setState({ channelFull: true });
        }
      }
    });
  }

  render () {
    const { channelFull } = this.state;
    return (
      <View>
        <FlatList
          ListHeaderComponent={<View style={flatListHeaderContainer}>
            <Text style={flatListTitle}>Domain</Text>
          </View>}
          data={this.state.domainsList}
          style={{ marginTop: 20, }}
          scrollEnabled={true}
          keyExtractor={(item, i) => i.toString()}
          ListEmptyComponent={<Text style={domainEmpty}>&#9888; Records Not Found</Text>}
          renderItem={({ item, index }) => (
            <View style={flatListMainContainer}>
              <View style={flatlistSubContainer}>
                <View style={textContainer}>
                  <Text style={highText} >S NO: {index + 1} </Text>
                </View>
                <View style={textContainer}>
                  <Text style={textStyleMedium}>{I18n.t("DOMAIN")}: {item.domaiName}</Text>
                </View>
                <View style={textContainer}>
                  <Text style={textStyleMedium}>{I18n.t("CREATED BY")}: {item.createdBy}</Text>
                  <Text style={textStyleLight}>{I18n.t("CREATED DATE")}: {formatDate(item.createdDate)}  </Text>
                </View>
                <View style={textContainer}>
                  <Text style={textStyleLight}>{I18n.t("DESCRIPTION")}: {item.discription}  </Text>
                </View>
              </View>
            </View>
          )}
        />
        {channelFull &&
          <Text style={domainFull}>user have all the domains</Text>
        }
      </View>
    );
  }
}

const domainFull = {
  color: '#cc241d',
  textAlign: "center",
  fontFamily: "bold",
  fontSize: RF(17),
  marginTop: Device.isTablet ? RH(20) : RH(10)
};

const domainEmpty = {
  color: '#cc241d',
  textAlign: "center",
  fontFamily: "bold",
  fontSize: RF(17),
  marginTop: deviceHeight / 3
};
