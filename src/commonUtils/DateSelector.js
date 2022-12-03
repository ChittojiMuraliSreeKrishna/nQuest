import React, { Component } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import DatePicker from 'react-native-date-picker';
import forms from './assets/styles/formFields.scss';
import { dateFormat, formatMonth } from './DateFormate';

export class DateSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
      newDate: "",
    };
  }


  cancelDate() {
    this.props.dateCancel();
    this.setState({
      date: new Date()
    });
  }

  async saveDate() {
    const { date } = this.state;
    await this.setState({ newDate: this.state.date.getFullYear() + formatMonth(this.state.date.getMonth() + 1) + dateFormat(this.state.date.getDate()) });
    this.handleSave();
    this.props.dateCancel();
  }

  handleSave() {
    this.props.setDate(this.state.newDate);
  }

  render() {
    return (
      <View>
        <View style={forms.datePickerContainer}>
          <View>
            <TouchableOpacity
              style={forms.datePickerBtns}
              onPress={() => this.cancelDate()}
            >
              <Text style={forms.datePickerBtnText}> Cancel </Text>
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity
              style={forms.datePickerBtns}
              onPress={() => this.saveDate()}
            >
              <Text style={forms.datePickerBtnText}> Done </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={forms.dateSelector}>
          <DatePicker
            style={forms.datePicker}
            date={this.state.date}
            mode={"date"}
            onDateChange={(date) => this.setState({ date })}
          />
        </View>
      </View>
    );
  }
}

export default DateSelector;
