import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import Device from 'react-native-device-detection';
import RNPickerSelect from "react-native-picker-select";
import { Chevron } from "react-native-shapes";
import { rnPicker, rnPickerContainer } from '../components/Styles/FormFields';
import { RW } from "../Responsive";


export class RnPicker extends Component {

  constructor(props) {
    super(props)
    this.state = {
      data: [],
      selectedValue: ""
    }
  }

  componentDidMount() {
    let value = this.props
    console.log({ value }, "CommonRN")
  }

  handleChangeData = (value) => {
    this.setState({ selectedValue: value }, () => {
      this.props.setValue(this.state.selectedValue)
    })
  }

  render() {
    return (
      <View style={rnPickerContainer}>
        <RNPickerSelect
          placeholder={{
            label: "Select",
          }}
          Icon={() => {
            return (
              <Chevron
                style={styles.imagealign}
                size={1.5}
                color="grey"
              />
            );
          }}
          items={this.props.items}
          onValueChange={(value) => {
            this.handleChangeData(value);
          }}
          style={rnPicker}
          value={this.state.selectedValue}
          useNativeAndroidPickerStyle={false}
        />
      </View>
    )
  }
}

export default RnPicker

const styles = StyleSheet.create({
  imagealign: {
    marginTop: Device.isTablet ? 25 : RW(20),
    marginRight: Device.isTablet ? 30 : RW(20),
  },
})
