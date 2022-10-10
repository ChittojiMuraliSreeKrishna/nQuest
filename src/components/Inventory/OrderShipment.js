import React, { Component } from 'react';
import { FlatList, Text, View } from 'react-native';
import Modal from "react-native-modal";
import IconFA from 'react-native-vector-icons/FontAwesome';
import forms from '../../commonUtils/assets/styles/formFields.scss';
import scss from '../../commonUtils/assets/styles/style.scss';
import Loader from '../../commonUtils/loader';

export class OrderShipment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filterActive: false,
      flagFilterOpen: false,
      loading: false,
      ordersList: []
    };
  }

  handleViewFilter () {
    this.setState({ flagFilterOpen: true });
  }

  modelCancel () {
    this.setState({ flagFilterOpen: false });
  }

  render () {
    return (
      <View>
        {this.state.loading && <Loader loading={this.state.loading} />}
        <View>
          <FlatList
            ListHeaderComponent={
              <View style={scss.headerContainer}>
                <Text style={scss.flat_heading}>Order Shipments
                  - <Text style={{ color: '#ED1C24' }}>{this.state.ordersList.length}</Text> </Text>
                <IconFA
                  name='sliders'
                  size={25}
                  style={scss.action_icons}
                  onPress={() => this.handleViewFilter()}
                />
              </View>
            }
            ListEmptyComponent={
              <Text style={{ fontSize: 25, fontWeight: 'bold', textAlign: 'center', marginTop: '50%' }}>Under Development</Text>
            }
          />
        </View>
        {this.state.flagFilterOpen && (
          <View>
            <Modal style={{ margin: 0 }} isVisible={this.state.flagFilterOpen}
              onBackButtonPress={() => this.modelCancel()}
              onBackdropPress={() => this.modelCancel()}
            >
              <View style={forms.filterModelContainer}>
                <Text style={forms.popUp_decorator}></Text>
                <View style={forms.filterModelSub}>
                  <Text style={{ textAlign: 'center', fontSize: 20 }}>Under Development</Text>
                </View>
              </View>
            </Modal>
          </View>
        )}
      </View>
    );
  }
}

export default OrderShipment;
