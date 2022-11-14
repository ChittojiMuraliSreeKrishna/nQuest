import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { Dimensions, FlatList, StyleSheet, Text, View } from 'react-native';
import I18n from 'react-native-i18n';
import { Appbar, Button, RadioButton } from 'react-native-paper';
import forms from '../../commonUtils/assets/styles/formFields.scss';
import LoginService from '../services/LoginService';
var deviceWidth = Dimensions.get('window').width;
I18n.fallbacks = true;
I18n.defaultLocale = 'english';
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;

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
      userId: 0,
      storeId: 0,
    };
  }

  handleBackButtonClick() {
    this.props.navigation.goBack();
    return true;
  }

  async componentDidMount() {
    const userId = await AsyncStorage.getItem("userId");
    this.setState({ userId: userId }, () => {
      this.getstores();
    });

    const storeId = await AsyncStorage.getItem("storeId");
    this.setState({ storeId: storeId });
  }

  async getstores() {
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
        this.getSelected();
      }
    });
  }

  getSelected() {
    this.state.storesData.map((item, index) => {
      if (parseInt(item.id) === parseInt(this.state.storeId)) {
        this.setState({ selectedItem: index });
      }
    });
  }

  letsGoButtonAction() {
    if (this.state.selectedItem === null) {
      alert("Select Atleast one Store");
    } else {
      this.props.navigation.push("HomeNavigation");
    }
  }


  selectStoreName = (item, index) => {
    this.setState({ selectedItem: index });
    console.log({ item })
    AsyncStorage.setItem("storeName", String(item.name)).then((value) => {
    }).catch(() => {
      this.setState({ loading: false });
      console.log('There is error saving storeName');
    });
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


  render() {
    console.log(this.state.storesData);
    return (
      <View>
        <Appbar mode='center-aligned'>
          <Appbar.BackAction
            onPress={() => this.handleBackButtonClick()} />
          <Appbar.Content title="Select Store" />
        </Appbar>
        <View>
          <FlatList
            style={styles.container}
            data={this.state.storesData}
            keyExtractor={item => item}
            renderItem={({ item, index }) => (
              <View style={styles.buttonContainer}>
                <RadioButton
                  value={item.id}
                  status={this.state.selectedItem === index ? 'checked' : 'unchecked'}
                  onPress={() => this.selectStoreName(item, index)}
                />
                <View style={styles.button}>
                  <View>
                    <Text style={styles.btnText}>{item.name}</Text>
                  </View>
                </View>
              </View>
            )}
          />
          <Button mode='elevated' style={forms.continue_btn} onPress={() => this.letsGoButtonAction()}>
            <Text style={forms.submit_btn_text}>Continue</Text>
          </Button>
          <Button mode='elevated' style={forms.cancel_full_btn} onPress={() => this.props.navigation.goBack()}>
            <Text style={forms.cancel_btn_text}>Cancel</Text>
          </Button>
        </View>
      </View>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: deviceHeight / 4,
    marginBottom: deviceHeight / 4
  },

  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingLeft: 30,
    paddingRight: 40,
  },
  button: {
    backgroundColor: '#ED1C24',
    height: 40,
    borderColor: '#000',
    borderWidth: 1,
    margin: 2,
    width: '90%',
    marginLeft: '5%',
    marginRight: '5%',
    borderRadius: 6,
  },
  btnText: {
    textAlign: 'center',
    color: '#FFF',
    fontSize: 21,
    fontWeight: 'bold',
    margin: 0,
    padding: 0,
  }
});
