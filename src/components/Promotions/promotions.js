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
import scss from "../../commonUtils/assets/styles/HeaderStyles.scss";
import { RH, RW } from "../../Responsive";
import UrmService from "../services/UrmService";
import ListOfPromo from "./listOfPromotions";
import ManagePromo from "./managePromo";
import Promo from "./Promo";


var deviceWidth = Dimensions.get("window").width;
var deviceheight = Dimensions.get("window").height;

export default class Promotions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      storeId: 1,
      storeName: "",
      privilages: [],
      subPrivilages: "",
      headerNames: [],
      error: "",
    };
    this.onEndReachedCalledDuringMomentum = true;
  }

  handleBackButtonClick() {
    this.props.navigation.openDrawer();
  }

  async componentDidMount() {
    var storeStringId = "";
    var storeName = "";

    AsyncStorage.getItem("storeId")
      .then((value) => {
        storeStringId = value;
        this.setState({ storeId: parseInt(storeStringId) });
        console.log(this.state.storeId);
      })
      .catch(() => {
        this.setState({ loading: false });
        console.log("There is error getting storeId");
      });

    AsyncStorage.getItem("storeName")
      .then((value) => {
        storeName = value;
        this.setState({ storeName: storeName });
      })
      .catch(() => {
        this.setState({ loading: false });
        console.log("There is error getting storeId");
      });

    AsyncStorage.getItem("rolename").then((value) => {
      console.log({ value });
      UrmService.getPrivillagesByRoleName(value).then((res) => {
        if (res) {
          if (res.data) {
            let len = res.data.parentPrivileges.length;
            for (let i = 0; i < len; i++) {
              let privilege = res.data.parentPrivileges[i];
              if (privilege.name === "Promotions & Loyalty") {
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

  // Initial Routing
  initialNavigation() {
    if (this.state.privilages.length > 0) {
      this.setState({ privilages: this.state.privilages }, () => {
        const { privilages } = this.state;
        if (privilages[0].name === "List of Pools") {
          this.setState({ flagBarcode: true });
        } else if (privilages[0].name === "List Of Promotions") {
          this.setState({ flagRebarCode: true });
        } else if (privilages[0] === "Manage Promotions") {
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
    if (item.name === "List of Pools") {
      this.setState({ flagBarcode: true, filterActive: false });
    } else {
      this.setState({ flagBarcode: false });
    }
    if (item.name === "List Of Promotions") {
      this.setState({ flagRebarCode: true, filterActive: false });
    } else {
      this.setState({ flagRebarCode: false });
    }
    if (item.name === "Manage Promotions") {
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
      this.setState({ privilages: this.state.privilages });
    }
  };

  // navigateToAddBarcode() {
  //   this.props.navigation.navigate('AddBarcode', {
  //     isEdit: false,
  //     onGoBack: () => this.child.getAllBarcodes(),
  //   });
  // }

  // navigateToAddProductCombo() {
  //   this.props.navigation.navigate('AddProduct', {
  //     isEdit: false,
  //     onGoBack: () => null
  //   })
  // }

  render() {
    return (
      <View>
        {/* <View style={styles.viewsWidth_tablet}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity style={styles.menuButton_mobile} onPress={() => this.handleBackButtonClick()}>
            <Image source={require('../assets/images/menu.png')} />
          </TouchableOpacity>
          <Text style={styles.headerTitle_mobile}> Promotions & Loyalty </Text>
        </View>
        <TouchableOpacity
          style={{ right: 20, bottom: 5, backgroundColor: '#ffffff', borderRadius: 5, width: 30, height: 32, }}
          onPress={() => this.filterAction()} >
          <Image style={{ alignSelf: 'center', top: 5 }} source={require('../assets/images/promofilter.png')} />
        </TouchableOpacity>
      </View> */}
        <ScrollView>
          <View style={styles.container}>
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
                      borderColor: item.bool ? "#ED1C24" : "#858585",
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

            {this.state.flagBarcode && (
              <View>
                <Promo
                  ref={(instance) => {
                    this.child = instance;
                  }}
                  navigation={this.props.navigation}
                />
              </View>
            )}
            {this.state.flagRebarCode && (
              <View>
                <ListOfPromo
                  ref={(instance) => {
                    this.child = instance;
                  }}
                  navigation={this.props.navigation}
                />
              </View>
            )}
            {this.state.flagProductCombo && (
              <ManagePromo
                ref={(instance) => {
                  this.child = instance;
                }}
                navigation={this.props.navigation}
              />
            )}
          </View>
        </ScrollView>
        <View></View>
      </View>
      // <View style={styles.mainContainer}>
      //   {this.state.loading &&
      //     <Loader
      //       loading={this.state.loading} />
      //   }
      //   <View style={headerTitleContainer} >
      //     <View style={headerTitleSubContainer}>
      //       <TouchableOpacity style={menuButton} onPress={() => this.handleBackButtonClick()}>
      //         <Image source={require('../assets/images/menu.png')} />
      //       </TouchableOpacity>
      //       <Text style={headerTitle}>
      //         {I18n.t("Inventory Portal")}
      //       </Text>
      //     </View>
      //     <View style={headerTitleSubContainer2}>
      //       {this.state.flagBarcode && (
      //         <TouchableOpacity style={headerNavigationBtn} onPress={() => this.navigateToAddBarcode()}>
      //           <Text style={headerNavigationBtnText}>{I18n.t("Add BarCode")}</Text>
      //         </TouchableOpacity>
      //       )}
      //       {this.state.flagProductCombo && (
      //         <TouchableOpacity style={headerNavigationBtn} onPress={() => this.navigateToAddProductCombo()}>
      //           <Text style={headerNavigationBtnText}>Product Combo</Text>
      //         </TouchableOpacity>
      //       )}
      //     </View>
      //   </View>

      //   <ScrollView>
      //     <View style={styles.container}>
      //       <FlatList
      //         style={pageNavigationBtnContainer}
      //         horizontal
      //         data={this.state.privilages}
      //         showsVerticalScrollIndicator={false}
      //         showsHorizontalScrollIndicator={false}
      //         keyExtractor={(item, i) => i.toString()}
      //         renderItem={({ item, index }) => (
      //           <TouchableOpacity style={[pageNavigationBtn, {
      //             backgroundColor: item.bool ? '#ED1C24' : '#FFFFFF',
      //             borderColor: item.bool ? '#ED1C24' : '#858585',
      //           }]} onPress={() => this.topbarAction1(item, index)} >

      //             <Text style={[pageNavigationBtnText, { color: item.bool ? "#FFFFFF" : '#858585', }]}>
      //               {item.name}
      //             </Text>
      //           </TouchableOpacity>
      //         )}
      //       />

      //       {this.state.flagBarcode && (
      //         <Barcode
      //           ref={instance => { this.child = instance }}
      //           navigation={this.props.navigation}
      //         />
      //       )}

      //       {this.state.flagRebarCode && (
      //         <View>
      //           <ReBarcode
      //             ref={instance => { this.child = instance }}
      //             navigation={this.props.navigation}
      //           />
      //         </View>
      //       )}
      //       {this.state.flagProductCombo && (
      //         <ProductCombo
      //           ref={instance => { this.child = instance }}
      //           navigation={this.props.navigation}
      //         />
      //       )}
      //     </View>
      //   </ScrollView>
      // </View>
    );
  }
}

const styles = StyleSheet.create({
  spaceText: {
    height: Device.isTablet ? 2 : 1,
    width: deviceWidth,
    backgroundColor: "lightgray",
  },
  viewsWidth_tablet: {
    backgroundColor: "#ffffff",
    width: deviceWidth,
    textAlign: "center",
    alignItems: "center",
    fontSize: 28,
    height: 90,
    flexDirection: "row",
    padding: 10,
    justifyContent: "space-between",
  },
  headerTitle_mobile: {
    position: "absolute",
    left: 40,
    bottom: 10,
    width: 300,
    height: 25,
    fontFamily: "bold",
    fontSize: 18,
    color: "#353C40",
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
