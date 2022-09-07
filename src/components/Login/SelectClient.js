import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import { Dimensions, FlatList, StyleSheet, Text, View } from 'react-native';
import { Button, RadioButton } from 'react-native-paper';
import LoginService from '../services/LoginService';
import { submitBtn, submitBtnText } from '../Styles/FormFields';
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;


export class SelectClient extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedClient: "",
      clientsList: [],
      selectedItem: null
    }
  }

  async componentDidMount() {
    let userId = await AsyncStorage.getItem("userId")
    console.log({ userId })
    this.getAllClients(userId)
  }

  getAllClients(userId) {
    LoginService.getAllClient(userId).then(res => {
      let response = res?.data
      let clientsRes = []
      if (response) {
        console.log("clients", response.result)
        for (let i = 0; i < response.result.length; i++) {
          clientsRes.push({
            id: response.result[i].id,
            name: response.result[i].name,
            checked: false
          })
        }
        this.setState({ clientsList: clientsRes })
      }
      console.log(this.state.clientsList)
    })
  }

  handleChecked = (item, index) => {
    this.setState({ selectedItem: index })
    AsyncStorage.setItem("custom:clientId1", String(item.id)).then((value) => { console.log({ value }) }).catch(() => { alert('There is an error saving clientId') })

  }


  continueAction() {
    if (this.state.selectedItem === null) {
      alert("Select Atleast one client")
    } else {
      this.props.navigation.navigate('BottomBar')
    }
  }

  render() {
    return (
      <View>
        <FlatList
          style={styles.container}
          data={this.state.clientsList}
          renderItem={({ item, index }) => (
            <View style={styles.buttonContainer}>
              <RadioButton
                value={item.id}
                status={this.state.selectedItem === index ? 'checked' : 'unchecked'}
                onPress={() => this.handleChecked(item, index)}
              />
              <View style={styles.button}>
                <View>
                  <Text style={styles.btnText}>{item.name}</Text>
                </View>
              </View>
            </View>
          )}
        />
        <Button mode='elevated' style={submitBtn} onPress={() => this.continueAction()}>
          <Text style={submitBtnText}>Continue</Text>
        </Button>
      </View>
    )
  }
}

export default SelectClient

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
})
