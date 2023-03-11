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
import { listEmptyMessage } from "../Styles/Styles";

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
      isFetching: false,
    };
  }

  componentDidMount() {
    this.getTaxMaster();
  }

  // Refreshing the taxMasters
  refresh() {
    this.setState({ taxList: [] }, () => {
      this.getTaxMaster();
    });
  }

  async getTaxMaster() {
    this.setState({ loading: true });
    AccountingService.getAllMasterTax()
      .then((res) => {
        if (res) {
          console.log(res.data);
          this.setState({ taxList: res.data.result }, () => {
            this.changeNavigation();
          });
        }
        this.setState({ loading: false });
      })
      .catch((err) => {
        this.setState({ loading: false });
        console.log(err);
      });
  }

  // for the flatlist to scroll back to index
  changeNavigation() {
    this.flatListRef.scrollToIndex({ animated: true, index: 0 });
  }

  modelCancel() {
    this.setState({ modalVisible: false });
  }

  handledeleteTax(item, index) {
    this.setState({ taxMasterDelete: true, modalVisible: true });
  }

  handleeditTax(item, index) {
    this.props.navigation.navigate("AddTaxMaster", {
      item: item,
      isEdit: true,
      onGoBack: () => this.refresh(),
      goBack: () => this.refresh(),
    });
  }

  navigateToAddTax() {
    this.props.navigation.navigate("AddTaxMaster", {
      isEdit: false,
      onGoBack: () => this.refresh(),
      goBack: () => this.refresh(),
    });
  }

  refresh() {
    this.getTaxMaster();
  }

  render() {
    return (
      <View>
        {this.state.loading && <Loader loading={this.state.loading} />}
        <FlatList
          ref={(ref) => this.flatListRef = ref}
          ListHeaderComponent={
            <View style={scss.headerContainer}>
              <Text style={scss.flat_heading}>List Of Taxes - <Text style={{ color: '#ed1c24' }}>{this.state.taxList.length}</Text></Text>
              <IconIA
                name="add-circle-outline"
                size={20}
                onPress={() => this.navigateToAddTax()}
              ></IconIA>
            </View>
          }
          refreshing={this.state.isFetching}
          onRefresh={() => this.refresh()}
          data={this.state.taxList}
          style={scss.flatListBody}
          ListEmptyComponent={<Text style={listEmptyMessage}>&#9888; Records Not Found</Text>
          }
          scrollEnabled={true}
          renderItem={({ item, index }) => (
            <ScrollView>
              <View style={scss.flatListContainer}>
                <View style={scss.flatListSubContainer}>
                  <View style={scss.textContainer}>
                    <Text style={scss.textStyleLight}>
                      <Text style={scss.highText}>Tax Label: {item.taxLabel}</Text></Text>
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
