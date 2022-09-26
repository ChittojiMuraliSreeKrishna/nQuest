import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Device from 'react-native-device-detection';
import I18n from 'react-native-i18n';
import { Appbar } from 'react-native-paper';
import { RF, RH, RW } from '../../Responsive';
import LoginService from '../services/LoginService';
var deviceWidth = Dimensions.get('window').width;
I18n.fallbacks = true;
I18n.defaultLocale = 'english';
const data = [ { key: "Vijayawada" }, { key: "Kakinada" }, { key: "Anakapalli" } ];

export default class SelectStore extends React.Component {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.state = {
      language: 'English',
      languages: [],
      selectedItem: null,
      storeNames: [],
      storesData: [],
      isFromDomain: false,
      userId: 0
    };
  }

  handleBackButtonClick () {
    this.props.navigation.goBack();
    return true;
  }

  async componentDidMount () {
    const userId = await AsyncStorage.getItem("userId");
    this.setState({ userId: userId }, () => {
      this.getstores();
    });
  }

  async getstores () {
    LoginService.getSelectStores(this.state.userId).then(res => {
      if (res?.data) {
        let stores = [];
        res?.data.forEach((item) => {
          const obj = {
            id: item.id,
            name: item.name,
          };
        });
        this.setState({ storesData: res.data });
      }
    });
  }

  letsGoButtonAction () {
    if (this.state.selectedItem === null) {
      alert("Select Atleast one Store");
    } else {
      this.props.navigation.push("HomeNavigation");
    }
  }


  selectStoreName = (item, index) => {
    this.setState({ selectedItem: index });
    AsyncStorage.setItem("storeId", String(item.id)).then((value) => {
    }).catch(() => {
      this.setState({ loading: false });
      console.log('There is error saving storeId');
    });
    global.storeId = String(item.id);
    global.storeName = String(item.name);
    console.log("selected Store:", global.storeId, global.storeName);
    AsyncStorage.setItem("storeName", item.name).then(() => {
    }).catch(() => {
      this.setState({ loading: false });
      console.log('There is error saving token');
    });

  };


  render () {
    console.log(this.state.storesData);
    return (
      <View style={styles.container}>
        <View>

          <FlatList
            style={{ width: deviceWidth, marginTop: RH(10) }}
            ListHeaderComponent={
              <Appbar mode='center-aligned'>
                <Appbar.BackAction
                  onPress={() => this.handleBackButtonClick()} />
                <Appbar.Content title="Select Store" />
              </Appbar>
            }
            data={this.state.storesData}
            keyExtractor={item => item}
            renderItem={({ item, index }) => (
              <TouchableOpacity onPress={() => this.selectStoreName(item, index)}>
                <View style={{
                  borderBottomColor: 'lightgray', borderBottomWidth: 0.6, marginLeft: this.state.selectedItem === index ? 0 : 0, marginRight: this.state.selectedItem === index ? 0 : 0, backgroundColor: this.state.selectedItem === index ? '#ED1C24' : '#ffffff'
                }}>
                  <View style={Device.isTablet ? styles.domainButton_tablet : styles.domainButton_mobile}>
                    <Text style={[ Device.isTablet ? styles.domainButtonText_tablet : styles.domainButtonText_mobile, {
                      color: this.state.selectedItem === index ? '#ffffff' : '#353C40'
                    } ]}>
                      {item.name}
                    </Text>
                    <Image source={this.state.selectedItem === index ? require('../assets/images/langselect.png') : require('../assets/images/langunselect.png')} style={{ position: 'absolute', right: 20, top: 30 }} />
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
        <View style={styles.continueButtonContainer}>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={() => this.letsGoButtonAction()} >
            <Text style={styles.continueButtonText}> {I18n.t('continue').toUpperCase()} </Text>
          </TouchableOpacity>
        </View>
      </View>

    );
  }
}

const styles = StyleSheet.create({
  imagealign: {
    marginTop: RH(14),
    marginRight: RH(10),
  },
  logoImage: {
    width: RW(302),
    height: RH(275),
    position: 'absolute',
    top: RH(130)
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  continueButtonContainer: {
    width: deviceWidth,
    backgroundColor: '#8F9EB7',
    position: 'absolute',
    bottom: RH(0),
    height: Device.isTablet ? RH(100) : RH(70),
  },
  continueButton: {
    backgroundColor: '#ED1C24',
    justifyContent: 'center',
    marginLeft: RW(20),
    width: deviceWidth - RW(40),
    height: Device.isTablet ? RH(60) : RH(44),
    borderRadius: 10,
    fontWeight: 'bold',
    marginTop: 10,
  },
  continueButtonText: {
    color: 'white',
    justifyContent: 'center',
    alignSelf: 'center',
    fontSize: RF(14),
    fontFamily: "regular",
  },

  // Styles For Mobile
  headerTitle_mobile: {
    color: "#353C40",
    fontSize: RF(30),
    fontFamily: "bold",
    marginLeft: RW(20),
    // marginTop: RH(100),
    flexDirection: 'column',
    justifyContent: 'center',
  },
  domainButton_mobile: {
    flexDirection: 'column',
    width: '100%',
    height: RH(80)
  },
  domainButtonText_mobile: {
    fontSize: RF(15),
    marginTop: RH(30),
    marginLeft: RW(20),
    fontFamily: 'medium',
  },


  // Styles For Tablet
  headerTitle_tablet: {
    color: "#353C40",
    fontSize: RF(30),
    fontFamily: "bold",
    marginLeft: RW(20),
    // marginTop: RH(100),
    flexDirection: 'column',
    justifyContent: 'center',
  },
  domainButton_tablet: {
    flexDirection: 'column',
    width: '100%',
    height: RH(100)
  },
  domainButtonText_tablet: {
    fontSize: RF(20),
    marginTop: RH(30),
    marginLeft: RW(20),
    fontFamily: 'medium',
  },
  continueButton_tablet: {
    backgroundColor: '#ED1C24',
    justifyContent: 'center',
    marginLeft: RW(20),
    width: deviceWidth - RW(40),
    height: RH(60),
    borderRadius: 10,
    fontWeight: 'bold',
    // marginBottom:100,
  },
  continueButtonText_tablet: {
    color: 'white',
    justifyContent: 'center',
    alignSelf: 'center',
    fontSize: 20,
    fontFamily: "regular",
  },

});
