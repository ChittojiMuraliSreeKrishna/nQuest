import AsyncStorage from "@react-native-async-storage/async-storage";
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
import Loader from "../../commonUtils/loader";
import { RH, RW } from "../../Responsive";
import UrmService from "../services/UrmService";
import Barcode from "./Barcode";
import ProductCombo from "./ProductCombo";
import ReBarcode from "./ReBarcode";

import scss from "../../commonUtils/assets/styles/HeaderStyles.scss";

var deviceWidth = Dimensions.get("window").width;
var deviceheight = Dimensions.get("window").height;

export default class Inventory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      storeId: 1,
      storeName: "",
      privilages: [],
      subPrivilages: "",
      headerNames: [],
      error: "",
      openModel: false,
    };
    this.onEndReachedCalledDuringMomentum = true;
  }

  async componentDidMount() {
    // Store Details
    const storeId = AsyncStorage.getItem("storeId");
    const storeName = AsyncStorage.getItem("storeName");
    this.setState({ storeId: storeId, storeName: storeName });
    console.log({ storeId, storeName });

    // Getting Privileges
    AsyncStorage.getItem("rolename").then((value) => {
      console.log({ value });
      UrmService.getPrivillagesByRoleName(value).then((res) => {
        if (res) {
          if (res.data) {
            let len = res.data.parentPrivileges.length;
            for (let i = 0; i < len; i++) {
              let privilege = res.data.parentPrivileges[i];
              if (privilege.name === "Inventory Portal") {
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
                this.setState({ privilages: this.state.privilages });
                this.initialNavigation();
              }
            }
          }
        }
      });
    });
  }

  // Initial Routing
  initialNavigation() {
    if (this.state.privilages.length > 0) {
      this.setState({ privilages: this.state.privilages }, () => {
        const { privilages } = this.state;
        if (privilages[0].name === "Barcode List") {
          this.setState({ flagBarcode: true });
        } else if (privilages[0].name === "Re-Barcode List") {
          this.setState({ flagRebarCode: true });
        } else if (privilages[0] === "Product Combo") {
          this.setState({ flagProductCombo: true });
        } else {
          this.setState({
            flagBarcode: false,
            flagRebarCode: false,
            flagProductCombo: true,
          });
        }
      });
    }
  }

  // Navigation Functions
  topbarAction1 = (item, index) => {
    if (item.name === "Barcode List") {
      this.setState({ flagBarcode: true, filterActive: false });
    } else {
      this.setState({ flagBarcode: false });
    }
    if (item.name === "Re-Barcode List") {
      this.setState({ flagRebarCode: true, filterActive: false });
    } else {
      this.setState({ flagRebarCode: false });
    }
    if (item.name === "Product Combo") {
      this.setState({ flagProductCombo: true, filterActive: false });
    } else {
      this.setState({ flagProductCombo: false });
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
      this.setState({ privilages: this.state.privilages }, () => {
        const { privilages } = this.state;
        console.log({ privilages });
      });
    }
  };

  render() {
    const { privilages } = this.state;
    console.log({ privilages });
    return (
      <View style={styles.mainContainer}>
        {this.state.loading && <Loader loading={this.state.loading} />}
        <ScrollView>
          <View style={styles.container}>
            <View>
              <FlatList
                style={scss.pageNavigationContainer}
                horizontal
                data={this.state.privilages}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, i) => i.toString()}
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
              />
            </View>
            {this.state.flagBarcode && (
              <Barcode
                ref={(instance) => {
                  this.child = instance;
                }}
                navigation={this.props.navigation}
              />
            )}

            {this.state.flagRebarCode && (
              <View>
                <ReBarcode
                  ref={(instance) => {
                    this.child = instance;
                  }}
                  navigation={this.props.navigation}
                />
              </View>
            )}
            {this.state.flagProductCombo && (
              <ProductCombo
                ref={(instance) => {
                  this.child = instance;
                }}
                navigation={this.props.navigation}
              />
            )}
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  spaceText: {
    height: Device.isTablet ? 2 : 1,
    width: deviceWidth,
    backgroundColor: "lightgray",
  },
  date: {
    width: deviceWidth,
    height: RH(200),
    marginTop: RH(50),
  },
  calenderpng: {
    position: "absolute",
    top: RH(10),
    right: 0,
  },
  dateTopView: {
    height: RW(280),
    width: deviceWidth,
    backgroundColor: "#ffffff",
  },
  dateTop2: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: Device.isTablet ? 15 : RH(10),
    marginLeft: Device.isTablet ? 20 : RW(10),
    marginRight: Device.isTablet ? 20 : RW(10),
  },
  mainContainer: {
    flex: 1,
  },
});
