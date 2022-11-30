import Clipboard from '@react-native-clipboard/clipboard';
import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import IconMA from 'react-native-vector-icons/MaterialCommunityIcons';
import scss from '../commonUtils/assets/styles/style.scss';
class Clipbrd extends Component {

  constructor(props) {
    super(props)
    this.state = {
      copy: false
    }
  }

  componentDidMount() {
    this.setState({ copy: false })
  }

  copyToClip(value) {
    Clipboard.setString(value)
    this.setState({ copy: true }, () => {
      setTimeout(() => {
        this.setState({ copy: false })
      }, 4000);
    })
  }

  render() {
    return (
      <TouchableOpacity onPress={() => this.copyToClip(this.props.data)}
        style={scss.Clipboard}>
        <IconMA
          size={20}
          name="content-copy"
          color={this.state.copy ? "#0d0" : "#000"}
        />
      </TouchableOpacity>
    )
  }
}

export default Clipbrd
