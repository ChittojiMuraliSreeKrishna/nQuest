import AsyncStorage from "@react-native-async-storage/async-storage";
import { DrawerActions } from "@react-navigation/native";
import React, { Component } from "react";
import {
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import Device from "react-native-device-detection";
import scss from "../../commonUtils/assets/styles/HeaderStyles.scss";
import UrmService from "../services/UrmService";
import { GoodsReturn } from "./GoodsReturn";
import { ListOfBarcodes } from "./ListOfBarcodes";
import { ListOfEstimationSlip } from "./ListOfEstimationSlip";
import { ListOfPromotions } from "./ListOfPromotions";
import NewSaleReport from "./NewSaleReport";
import ReportsDashboard from "./ReportsDashboard";
import { SalesSumary } from "./SalesSumary";

var deviceWidth = Dimensions.get("window").width;
var deviceWidth = Dimensions.get("window").width;
var deviceheight = Dimensions.get("window").height;


const data = [true, false, false, false, false, false, false, false, false];

class Reports extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // Header Array
      headerNames: [],
      privilages: [],

      // Navigation Flags
      selectedcolor: "",
      subPrivilages: "",
      flagDashboard: false,
      flagNewSale: false,
      flagGoodsReturn: false,
      flagSalesSummary: false,
      flagListBarcodes: false,
      flagEstimationSlip: false,
      flagListPromotions: false,
      flagFilterDashboard: false,
      flagFilterEstimationSlip: false,
      flagFilterGoodsReturn: false,
      flagFilterListBarcodes: false,
      flagFilterListPromotions: false,
      flagFilterNewSale: false,
      flagFilterSalesSumary: false,
      modalVisible: true,
      filterButton: false,

      // Component Arrays
      estimationSlip: [],
      newSale: [],
      goodsReturn: [],
      salesSumary: [],
      salesSumaryObject: [],
      listBarcodes: [],
      listPromotions: [],
      sbList: [],
      storeId: 0,
      filterActive: false,
      refreshPage: false,
      headersNames: [],
    };
  }

  async componentDidMount() {
    AsyncStorage.getItem("rolename").then((value) => {
      console.log({ value });
      UrmService.getPrivillagesByRoleName(value).then((res) => {
        if (res) {
          if (res.data) {
            let len = res.data.parentPrivileges.length;
            for (let i = 0; i < len; i++) {
              let privilege = res.data.parentPrivileges[i];
              if (privilege.name === "Reports") {
                let privilegeId = privilege.id;
                let sublen = privilege.subPrivileges.length;
                let subPrivileges = privilege.subPrivileges;
                for (let i = 0; i < sublen; i++) {
                  if (privilegeId === subPrivileges[i].parentPrivilegeId) {
                    let routes = subPrivileges[i].name;
                    this.state.headerNames.push({ name: routes });
                    console.log("Header Names", this.state.headerNames);
                  }
                }
                this.setState({ headerNames: this.state.headerNames }, () => {
                  for (let j = 0; j < this.state.headerNames.length; j++) {
                    if (j === 0) {
                      this.state.privilages.push({
                        bool: true,
                        name: this.state.headerNames[j].name,
                      });
                    } else {
                      this.state.privilages.push({
                        bool: false,
                        name: this.state.headerNames[j].name,
                      });
                    }
                  }
                });
                this.initialNavigation();
              }
            }
          }
        }
      });
    });
  }

  initialNavigation() {
    this.setState({ privilages: this.state.privilages }, () => {
      console.log(this.state.privilages);
      if (this.state.privilages.length > 0) {
        if (this.state.privilages[0].name === "Dashboard") {
          this.setState({ filterButton: false, flagDashboard: true });
        } else {
          this.setState({ filterButton: true, flagDashboard: false });
        }
        if (this.state.privilages[0].name === "List of Estimation Slips") {
          this.setState({
            flagEstimationSlip: true,
            filterActive: false,
            estimationSlip: [],
          });
        } else {
          this.setState({ flagEstimationSlip: false });
        }
        if (this.state.privilages[0].name === "New Sale Report") {
          this.setState({
            newSale: [],
            flagNewSale: true,
            filterActive: false,
          });
        } else {
          this.setState({ flagNewSale: false });
        }
        if (this.state.privilages[0].name === "Goods Return") {
          this.setState({
            goodsReturn: [],
            flagGoodsReturn: true,
            filterActive: false,
          });
        } else {
          this.setState({ flagGoodsReturn: false });
        }
        if (this.state.privilages[0].name === "Sales Summary") {
          this.setState({
            salesSumaryObject: [],
            flagSalesSummary: true,
            filterActive: false,
          });
        } else {
          this.setState({ flagSalesSummary: false });
        }
        if (this.state.privilages[0].name === "List of Barcodes") {
          this.setState({
            listBarcodes: [],
            flagListBarcodes: true,
            filterActive: false,
          });
        } else {
          this.setState({ flagListBarcodes: false });
        }
        if (this.state.privilages[0].name === "List of Promotions") {
          this.setState({
            listPromotions: [],
            flagListPromotions: true,
            filterActive: false,
          });
        } else {
          this.setState({ flagListPromotions: false });
        }
      }
    });
  }

  topbarAction1 = (item, index) => {
    if (item.name === "Dashboard") {
      this.setState({ filterButton: false, flagDashboard: true });
    } else {
      this.setState({ filterButton: true, flagDashboard: false });
    }
    if (item.name === "List of Estimation Slips") {
      this.setState({
        estimationSlip: [],
        flagEstimationSlip: true,
        filterActive: false,
      });
    } else {
      this.setState({ flagEstimationSlip: false });
    }
    if (item.name === "New Sale Report") {
      this.setState({ newSale: [], flagNewSale: true, filterActive: false });
    } else {
      this.setState({ flagNewSale: false });
    }
    if (item.name === "Goods Return") {
      this.setState({
        goodsReturn: [],
        flagGoodsReturn: true,
        filterActive: false,
      });
    } else {
      this.setState({ flagGoodsReturn: false });
    }
    if (item.name === "Sales Summary") {
      this.setState({
        salesSumaryObject: [],
        flagSalesSummary: true,
        filterActive: false,
      });
    } else {
      this.setState({ flagSalesSummary: false });
    }
    if (item.name === "List of Barcodes") {
      this.setState({
        listBarcodes: [],
        flagListBarcodes: true,
        filterActive: false,
      });
    } else {
      this.setState({ flagListBarcodes: false });
    }
    if (item.name === "List of promotions") {
      this.setState({
        listPromotions: [],
        flagListPromotions: true,
        filterActive: false,
      });
    } else {
      this.setState({ flagListPromotions: false });
    }

    if (this.state.privilages[index].bool === true) {
      this.state.privilages[index].bool = false;
    } else {
      this.state.privilages[index].bool = true;
    }
    for (let i = 0; i < this.state.privilages.length; i++) {
      if (index != i) {
        this.state.privilages[i].bool = false;
      }
      this.setState({ privilages: this.state.privilages });
    }
  };

  filterAction() {
    if (this.state.flagDashboard === true) {
      this.setState({ flagFilterDashboard: true, modalVisible: true });
    } else {
      this.setState({ flagFilterDashboard: false });
    }
    if (this.state.flagEstimationSlip === true) {
      this.setState({ flagFilterEstimationSlip: true, modalVisible: true });
    } else {
      this.setState({ flagFilterEstimationSlip: false });
    }
    if (this.state.flagNewSale === true) {
      this.setState({ flagFilterNewSale: true, modalVisible: true });
    } else {
      this.setState({ flagFilterNewSale: false });
    }
    if (this.state.flagGoodsReturn === true) {
      this.setState({ flagFilterGoodsReturn: true, modalVisible: true });
    } else {
      this.setState({ flagFilterGoodsReturn: false });
    }
    if (this.state.flagSalesSummary === true) {
      this.setState({ flagFilterSalesSumary: true, modalVisible: true });
    } else {
      this.setState({ flagFilterSalesSumary: false });
    }
    if (this.state.flagListBarcodes === true) {
      this.setState({ flagFilterListBarcodes: true, modalVisible: true });
    } else {
      this.setState({ flagFilterListBarcodes: false });
    }
    if (this.state.flagListPromotions === true) {
      this.setState({ flagFilterListPromotions: true, modalVisible: true });
    } else {
      this.setState({ flagFilterListPromotions: false });
    }
    this.setState({ modalVisible: true });
  }

  statatics() {
    this.props.navigation.navigate("Statitics");
  }

  menuAction() {
    this.props.navigation.dispatch(DrawerActions.openDrawer());
  }

  handleMenuButtonClick() {
    this.props.navigation.openDrawer();
    // this.props.navigation.navigate('Home')
  }

  modelClose() {
    this.setState({ modalVisible: false });
  }

  modelCancel = () => {
    this.modelClose();
  };

  getDetails = (data) => {
    this.setState({ estimationSlip: [] });
    this.setState({ estimationSlip: data });
  };

  getNewsaleDetails = (data) => {
    this.setState({ newSale: [] });
    this.setState({ newSale: data });
  };

  getgoodsReturn = (data) => {
    this.setState({ goodsReturn: [] });
    this.setState({ goodsReturn: data });
  };

  getsalesSumary = (data) => {
    this.setState({ salesSumary: [] });
    this.setState({ salesSumary: data });
    console.log(this.state.salesSumary);
  };

  getsalesSumaryObject = (data) => {
    this.setState({ salesSumaryObject: [1, 2, 3] });
  };

  getlistBarcodes = (data) => {
    this.setState({ listBarcodes: [] });
    this.setState({ listBarcodes: data });
    console.log(this.state.listBarcodes);
  };

  getlistofPromotions = (data) => {
    this.setState({ listPromotions: [] });
    this.setState({ listPromotions: data });
    console.log(this.state.listPromotions);
  };

  filterCahngeAction() {
    // alert("hey");
    this.setState({ filterActive: true });
  }

  filterChange = () => {
    this.filterCahngeAction();
  };

  clearFilter() {
    alert("cleared Functions");
  }

  clearFilterAction() {
    if (this.state.flagEstimationSlip === true) {
      this.setState({ filterActive: false }, () => {
        this.setState({ flagEstimationSlip: true, estimationSlip: [] });
      });
    } else if (this.state.flagNewSale === true) {
      this.setState({ filterActive: false }, () => {
        this.setState({ flagNewSale: true, newSale: [] });
      });
    } else if (this.state.flagGoodsReturn === true) {
      this.setState({ filterActive: false }, () => {
        this.setState({ flagGoodsReturn: true, goodsReturn: [] });
      });
    } else if (this.state.flagSalesSummary === true) {
      this.setState({ filterActive: false }, () => {
        this.setState({
          flagSalesSummary: true,
          salesSumary: [],
          salesSumaryObject: [],
        });
      });
    } else if (this.state.flagListBarcodes === true) {
      this.setState({ filterActive: false }, () => {
        this.setState({ flagListBarcodes: true, listBarcodes: [] });
      });
    } else if (this.state.flagListPromotions === true) {
      this.setState({ filterActive: false }, () => {
        this.setState({ flagListPromotions: true, listPromotions: [] });
      });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.container}>
            <FlatList
              style={scss.pageNavigationContainer}
              horizontal
              data={this.state.privilages}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              ListEmptyComponent={
                <Text
                  style={{
                    color: "#cc241d",
                    textAlign: "center",
                    fontFamily: "bold",
                    fontSize: Device.isTablet ? 21 : 17,
                    marginTop: deviceheight / 3,
                    marginLeft: deviceWidth / 3.5,
                  }}
                >
                  &#9888; Privileges Not Found
                </Text>
              }
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  style={[
                    scss.pageNavigationBtn,
                    {
                      borderColor: item.bool ? "#ED1C24" : "#d7d7d7",
                      borderBottomWidth: item.bool ? 3 : 0
                    },
                  ]}
                  onPress={() => this.topbarAction1(item, index)}
                >
                  <Text
                    style={[
                      scss.pageNavigationBtnText,
                      { color: item.bool ? "#ED1C24" : "#00000073" },
                    ]}
                  >
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
              ListFooterComponent={<View style={{ width: 15 }}></View>}
            />

            {this.state.flagDashboard && <ReportsDashboard />}

            {this.state.flagEstimationSlip && (
              <ListOfEstimationSlip
                estimationSlip={this.state.estimationSlip}
                filterActiveCallback={this.filterChange}
                childParams={this.getDetails}
                clearFilter={this.state.refreshPage}
                modalVisible={this.state.modalVisible}
                flagFilterEstimationSlip={this.state.flagFilterEstimationSlip}
                modelCancelCallback={this.modelCancel}
              />
            )}

            {this.state.flagNewSale && (
              <NewSaleReport
                filterActiveCallback={this.filterChange}
                newSale={this.state.newSale}
                childParamNewsales={this.getNewsaleDetails}
                modalVisible={this.state.modalVisible}
                modelCancelCallback={this.modelCancel}
                flagFilterNewSale={this.state.flagFilterNewSale}
              />
            )}

            {this.state.flagGoodsReturn && (<GoodsReturn />)}

            {this.state.flagSalesSummary && (<SalesSumary />)}

            {this.state.flagListBarcodes && (
              <ListOfBarcodes
                filterActiveCallback={this.filterChange}
                listBarcodes={this.state.listBarcodes}
                childParamlistBarcodes={this.getlistBarcodes}
                modalVisible={this.state.modalVisible}
                modelCancelCallback={this.modelCancel}
                flagFilterListBarcodes={this.state.flagFilterListBarcodes}
              />
            )}

            {this.state.flagListPromotions && (<ListOfPromotions />)}
          </View>
        </ScrollView>
      </View>
    );
  }
}
export default Reports;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: '#FAFAFF'
  }
});
