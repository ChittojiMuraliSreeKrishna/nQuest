import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { Component } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import Device from 'react-native-device-detection';
import I18n from 'react-native-i18n';
import AccountingPortalGraphsService from '../services/Graphs/AccountingPortalGraphsService';

var deviceWidth = Dimensions.get('window').width;

const chartConfig = {
  backgroundGradientFrom: "#fff",
  backgroundGradientTo: "#fff",
  barPercentage: Device.isTablet ? 1 : 0.5,
  height: 5000,
  fillShadowGradient: `#25f1d5`,
  fillShadowGradientOpacity: 1,
  decimalPlaces: 0, // optional, defaults to 2dp
  color: (opacity = 1) => `#25f1d5`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, 1)`,

  style: {
    borderRadius: 16,
    fontFamily: "regular",
  },
  propsForBackgroundLines: {
    strokeWidth: 1,
    stroke: "#e3e3e3",
    // strokeDasharray: "0",
  },
  propsForLabels: {
    fontFamily: "regular",
    fontSize: Device.isTablet ? 17 : 12,
  },
};

const balancedChartConfig = {
  backgroundGradientFrom: "#fff",
  backgroundGradientTo: "#fff",
  barPercentage: Device.isTablet ? 1 : 0.5,
  height: 5000,
  fillShadowGradient: `#ffb93f`,
  fillShadowGradientOpacity: 1,
  decimalPlaces: 0, // optional, defaults to 2dp
  color: (opacity = 1) => `#ffb93f`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, 1)`,

  style: {
    borderRadius: 16,
    fontFamily: "regular",
  },
  propsForBackgroundLines: {
    strokeWidth: 1,
    stroke: "#e3e3e3",
    // strokeDasharray: "0",
  },
  propsForLabels: {
    fontFamily: "regular",
    fontSize: Device.isTablet ? 17 : 12,
  },
};



export default class AccountingDashboard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      debitNotesByStoreData: [],
      usedAmountByStoreData: [],
      usedBalancedAmountData: [],
      balncedAmountByStoreData: [],
      debitNotesByStoreGraph: {
        labels: [],
        datasets: [
          {
            data: []
          }
        ]
      },
      usedAmountByStoreGraph: {
        labels: [],
        datasets: [
          {
            data: []
          }
        ]
      },
      balncedAmountByStoreGraph: {
        labels: [],
        datasets: [
          {
            data: []
          }
        ]
      },
      storeId: "",
      debitNotesByStoreValues: [],
    };

  }

  componentDidMount () {
    AsyncStorage.getItem("storeId").then((value) => {
      storeStringId = value;
      this.setState({ storeId: parseInt(storeStringId) },
        () => {
        });
      console.log(this.state.storeId);
    }).catch(() => {
      this.setState({ loading: false });
      console.log('There is error getting storeId');
      // alert('There is error getting storeId');
    });
    this.usedBalanced();
    this.debitNotesByStore();
  }

  debitNotesByStore () {
    axios.get(AccountingPortalGraphsService.getDebitnNotesByStores()).then(res => {
      if (res) {
        console.log("debit notes by store", res.data);
        if (res.data.result !== "null" && res.data.result.length > 0) {
          this.setState({ debitNotesByStoreData: res.data.result },
            () => {
              let indexName = [];
              let indexCount = [];
              let indexColor = [];
              let indexHoverColor = [];

              this.state.debitNotesByStoreData.forEach(data => {
                indexName.push(data.name);
                indexCount.push(data.damount);
              });

              // colors.forEach(data => {
              //     indexColor.push(data.normalColorCode);
              //     indexHoverColor.push(data.hoverColorCode);
              // });
              this.state.debitNotesByStoreValues.push({
                name: indexName,
                value: indexCount,
                color: '#25f1d5',
              });
              this.setState({
                debitNotesByStoreGraph: {
                  labels: indexName,
                  datasets: [
                    {
                      data: indexCount,
                    }
                  ]
                },
                debitNotesByStoreValues: this.state.debitNotesByStoreValues
              });

            });
        }
      }
      console.log("Debit Notes By Store", this.state.debitNotesByStoreGraph);
    });
  }

  usedBalanced () {
    axios.get(AccountingPortalGraphsService.getUsedBalancedAmmounts()).then(res => {
      console.log("Used Balanced", res.data.result);
      if (res) {
        if (res.data.result !== "null" && res.data.result.length > 0) {
          this.setState({ usedBalancedAmountData: res.data.result },
            () => {
              let indexName = [];
              let indexCount = [];
              let indexCount2 = [];

              this.state.usedBalancedAmountData.forEach(data => {
                indexName.push(data.name);
                indexCount.push(data.actualAmount);
                indexCount2.push(data.transactionAmount);
              });

              this.setState({
                usedAmountByStoreGraph: {
                  labels: indexName,
                  datasets: [
                    {
                      data: indexCount,
                    }
                  ]
                },
                balncedAmountByStoreGraph: {
                  labels: indexName,
                  datasets: [
                    {
                      data: indexCount2,
                    }
                  ]
                }
              });
            });
        }
      }
    });
  }

  render () {
    return (
      <View>
        <ScrollView>
          <View style={[ styles.chartMaincontainer, { height: Device.isTablet ? 400 : 550 } ]}>
            <Text style={Device.isTablet ? styles.chartTitle_tablet : styles.chartTitle_mobile}>{I18n.t("Debit Notes By Store")}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: Device.isTablet ? deviceWidth - 260 : deviceWidth - 160 }}>
              <BarChart
                style={{ paddingTop: 20 }}
                data={this.state.debitNotesByStoreGraph}
                width={Device.isTablet ? deviceWidth - 120 : deviceWidth - 60}
                yLabelsOffset={Device.isTablet ? -10 : 20} xLabelsOffset={Device.isTablet ? 0 : -20}
                height={Device.isTablet ? 300 : 450}
                yAxisLabel="₹"
                fromZero
                chartConfig={chartConfig}
                verticalLabelRotation={Device.isTablet ? 0 : 90}
              />
            </View>
          </View>

          <View style={[ styles.chartMaincontainer, { height: Device.isTablet ? 400 : 550 } ]}>
            <Text style={Device.isTablet ? styles.chartTitle_tablet : styles.chartTitle_mobile}>{I18n.t("Used Amount By Store")}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: Device.isTablet ? deviceWidth - 160 : deviceWidth - 160 }}>
              <BarChart
                style={{ paddingTop: 20 }}
                data={this.state.usedAmountByStoreGraph}
                width={Device.isTablet ? deviceWidth - 150 : deviceWidth - 60}
                height={Device.isTablet ? 300 : 450}
                yLabelsOffset={Device.isTablet ? -10 : 20} xLabelsOffset={Device.isTablet ? 0 : -20}
                yAxisLabel="₹"
                fromZero
                chartConfig={chartConfig}
                verticalLabelRotation={Device.isTablet ? 0 : 90}
              />
            </View>
          </View>

          <View style={[ styles.chartMaincontainer, { height: Device.isTablet ? 400 : 550 } ]}>
            <Text style={Device.isTablet ? styles.chartTitle_tablet : styles.chartTitle_mobile}>{I18n.t("Balanced Amount By Store")}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: Device.isTablet ? deviceWidth - 260 : deviceWidth - 160 }}>
              <BarChart
                style={{ paddingTop: 20 }}
                data={this.state.balncedAmountByStoreGraph}
                width={Device.isTablet ? deviceWidth - 120 : deviceWidth - 60}
                height={Device.isTablet ? 300 : 450}
                yLabelsOffset={Device.isTablet ? -10 : 20} xLabelsOffset={Device.isTablet ? 0 : -20}
                yAxisLabel="₹"
                fromZero
                chartConfig={balancedChartConfig}
                verticalLabelRotation={Device.isTablet ? 0 : 90}
              />
            </View>
          </View>
        </ScrollView>
      </View>

    );
  }
}


const styles = StyleSheet.create({
  chartMaincontainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    height: Device.isTablet ? 350 : 300,
    width: deviceWidth - 40,
    margin: 20,
    borderRadius: 20,
  },
  chartTitle_tablet: {
    fontSize: 25,
    fontFamily: 'bold',
    marginTop: 20,
    marginLeft: 20,
    position: 'absolute',
    top: 0,
    left: 20
  },
  chartTitle_mobile: {
    fontSize: 20,
    fontFamily: 'bold',
    marginTop: 20,
    marginLeft: 20,
    position: 'absolute',
    top: 0,
    left: 20
  },
});
