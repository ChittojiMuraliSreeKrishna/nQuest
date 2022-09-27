import React, { Component } from "react";
import {
  Dimensions,
  FlatList,
  ScrollView,
  Text, View
} from "react-native";
import IconIA from 'react-native-vector-icons/Ionicons';
import scss from "../../commonUtils/assets/styles/style.scss";
import Loader from "../../commonUtils/loader";
import AccountingService from "../services/AccountingService";
import { flatListTitle } from "../Styles/Styles";

var deviceHeight = Dimensions.get("window").height;
var deviceWidth = Dimensions.get("window").width;

export default class CreateTaxMaster extends Component {
  constructor(props) {
    super(props);
    this.state = {
      taxMasterDelete: false,
      modalVisible: true,
      taxList: [],
      loading: false,
    };
  }

  componentDidMount () {
    this.getTaxMaster();
  }

  // Refreshing the taxMasters
  refresh () {
    this.setState({ taxList: [] }, () => {
      this.getTaxMaster();
    });
  }

  async getTaxMaster () {
    this.setState({ loading: true });
    AccountingService.getAllMasterTax()
      .then((res) => {
        if (res) {
          console.log(res.data);
          this.setState({ taxList: res.data.result });
        }
        this.setState({ loading: false });
      })
      .catch((err) => {
        this.setState({ loading: false });
        console.log(err);
      });
  }

  modelCancel () {
    this.setState({ modalVisible: false });
  }

  handledeleteTax (item, index) {
    this.setState({ taxMasterDelete: true, modalVisible: true });
  }

  handleeditTax (item, index) {
    this.props.navigation.navigate("AddTaxMaster", {
      item: item,
      isEdit: true,
      onGoBack: () => this.refresh(),
      goBack: () => this.refresh(),
    });
  }

  navigateToAddTax () {
    this.props.navigation.navigate("AddTaxMaster", {
      isEdit: false,
      onGoBack: () => this.refresh(),
      goBack: () => this.refresh(),
    });
  }

  render () {
    return (
      <View>
        {this.state.loading && <Loader loading={this.state.loading} />}
        <FlatList
          ListHeaderComponent={
            <View style={scss.headerContainer}>
              <Text style={flatListTitle}>Create Tax Master - <Text style={{ color: '#ed1c24' }}>{this.state.taxList.length}</Text></Text>
              <IconIA
                name="add-circle-outline"
                size={30}
                onPress={() => this.navigateToAddTax()}
              ></IconIA>
            </View>
          }
          data={this.state.taxList}
          style={{ backgroundColor: '#FFF' }}
          scrollEnabled={true}
          renderItem={({ item, index }) => (
            <ScrollView>
              <View style={scss.flatListContainer}>
                <View style={scss.flatListSubContainer}>
                  <View style={scss.textContainer}>
                    <Text style={scss.textStyleLight}>
                      <Text style={scss.highText}>{item.taxLabel}</Text></Text>
                    <Text style={scss.textStyleMedium}>CGST: {item.cgst}</Text>
                  </View>
                  <View style={scss.textContainer}>
                    <Text style={scss.textStyleMedium}>SGST: {item.sgst}</Text>
                    <Text style={scss.textStyleLight}>IGST: {item.igst}</Text>
                  </View>
                  <View style={scss.textContainer}>
                    <Text style={scss.textStyleLight}>CESS: {item.cess}</Text>
                  </View>
                </View>
              </View>
            </ScrollView>
          )}
        />
      </View>
    );
  }
}
