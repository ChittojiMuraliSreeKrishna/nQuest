import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { Component } from 'react';
import { Dimensions, FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BarChart, PieChart } from 'react-native-chart-kit';
import Device from 'react-native-device-detection';
import I18n from 'react-native-i18n';
import colors from '../../colors.json';
import { RF, RH, RW } from '../../Responsive';
import ReportsGraphsService from '../services/Graphs/ReportsGraphsService';

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

export default class ReportsDashboard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      invoicesGenerted: [],
      invoicesChart: [],
      salesSummaryData: [],
      salesSummaryChart: [],
      activeVsInactiveData: [],
      activeVsInactiveChart: [],
      topSalesData: [],
      topSalesChart: {
        labels: [],
        datasets: [
          {
            data: []
          }
        ]
      },
      storeId: '',
      domainId: 1,
      storeNames: [],
    };
  }

  componentDidMount () {
    AsyncStorage.getItem("storeId").then((value) => {
      let storeStringId = value;
      this.setState({ storeId: parseInt(storeStringId) },
        () => {
          this.getInvoicesGenerated();
          this.getActiveVsInactivePromos();
          this.getSalesSummary();
          this.getTopFiveSales();
        });
      console.log(this.state.storeId);
    }).catch((err) => {
      this.setState({ loading: false });
      console.log('There is error getting storeId');
      alert(err);
    });



    AsyncStorage.getItem("storeName").then((value) => {

      this.setState({ storeName: value });

    }).catch(() => {
      this.setState({ loading: false });

      console.log('There is error getting storeId');
      // alert('There is error getting storeId');


    });
  }

  getInvoicesGenerated () {
    const params = '?storeId=' + this.state.storeId + '&domainId=' + this.state.domainId;
    axios.get(ReportsGraphsService.getInvocesGenerated() + params).then(res => {
      if (res) {
        if (res.data.result !== "null" && res.data.result.length > 0) {
          this.setState({ invoicesGenerted: res.data.result },
            () => {
              let indexName = [];
              let indexCount = [];
              let indexColor = [];

              this.state.invoicesGenerted.forEach(data => {
                indexName.push(data.month);
                indexCount.push(data.amount);
                colors.forEach(data => {
                  indexColor.push(data.normalColorCode);
                });
              });

              for (var i = 0; i < this.state.invoicesGenerted.length; i++) {
                this.state.invoicesChart.push({
                  name: indexName[ i ],
                  count: indexCount[ i ],
                  color: indexColor[ i ]
                });
              }
              this.setState({ invoicesChart: this.state.invoicesChart });
            });
        }
      }
    }).catch(error => alert(error));
  }

  getSalesSummary () {
    const params = '?storeId=' + this.state.storeId + '&domainId=' + this.state.domainId;
    axios.get(ReportsGraphsService.getSaleSummary() + params).then(response => {
      console.warn("hello");
      if (response) {
        if (response.data.result !== "null" && response.data.result.length > 0) {
          this.setState({ salesSummaryData: response.data.result },
            () => {
              let indexName = [];
              let indexCount = [];
              let indexColor = [];

              this.state.salesSummaryData.forEach(data => {
                indexName.push(data.name);
                indexCount.push(data.amount);
                colors.forEach(data => {
                  indexColor.push(data.normalColorCode);
                });
              });

              for (var i = 0; i < this.state.salesSummaryData.length; i++) {
                this.state.salesSummaryChart.push({
                  name: indexName[ i ],
                  count: indexCount[ i ],
                  color: indexColor[ i ]
                });
              }

              this.setState({ salesSummaryChart: this.state.salesSummaryChart });
            });
        }
      }
      console.log("sales Summary" + this.state.salesSummaryChart);
    });
  }

  getActiveVsInactivePromos () {
    const params = '?storeId=' + this.state.storeId + '&domainId=' + this.state.domainId;
    axios.get(ReportsGraphsService.getActiveInactivePromos() + params).then(response => {
      if (response) {
        if (response.data.result !== "null" && response.data.result.length > 0) {
          console.log('Active Inactive Promos', response.data.result);
          this.setState({ activeVsInactiveData: response.data.result },
            () => {
              let indexName = [];
              let indexCount = [];
              let indexColor = [];

              this.state.activeVsInactiveData.forEach(data => {
                indexName.push(data.name);
                indexCount.push(data.count);
                colors.forEach(data => {
                  indexColor.push(data.normalColorCode);
                });
              });

              for (var i = 0; i < this.state.activeVsInactiveData.length; i++) {
                this.state.activeVsInactiveChart.push({
                  name: indexName[ i ],
                  count: indexCount[ i ],
                  color: indexColor[ i ]
                });
              }
              this.setState({ activeVsInactiveChart: this.state.activeVsInactiveChart });
            });
        }
      }
    });
  }

  getTopFiveSales () {
    const param = '?domainId=' + this.state.domainId;
    axios.get(ReportsGraphsService.getTopFiveSales() + param).then(response => {
      console.log('Top Five Sales', response.data);
      if (response) {
        if (response.data.result !== "null" && response.data.result.length > 0) {
          this.setState({ topSalesData: response.data.result },
            () => {
              let indexName = [];
              let indexCount = [];
              let indexColor = [];
              let indexLabels = [];

              this.state.topSalesData.forEach(datas => {
                indexName.push(datas.name);
                indexCount.push(datas.amount);
              });

              console.log("index", indexName, indexCount);
              this.setState({
                topSalesChart: {
                  labels: indexName,
                  datasets: [
                    {
                      data: indexCount
                    }
                  ]
                }
              });

              console.log("store Name", indexLabels);
              console.log("store Id", indexName);
            });
        }
      }
      console.log("top sales Chart", this.state.topSalesChart);
    });
  }

  render () {
    return (
      <View>
        <ScrollView>
          <View style={[ styles.chartMaincontainer, { height: RH(550) } ]}>
            <Text style={Device.isTablet ? styles.chartTitle_tablet : styles.chartTitle_mobile}>{I18n.t("Top 5 Sales")}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: deviceWidth - RW(160) }}>
              <BarChart
                style={{ paddingTop: 20 }}
                data={this.state.topSalesChart}
                width={deviceWidth - RW(60)}
                height={RH(450)}
                yLabelsOffset={20}
                xLabelsOffset={-20}
                yAxisLabel="₹"
                fromZero
                chartConfig={chartConfig}
                verticalLabelRotation={90}
              />
            </View>
          </View>

          <View style={styles.chartMaincontainer}>
            <Text style={Device.isTablet ? styles.chartTitle_tablet : styles.chartTitle_mobile}>{I18n.t("Invoices Generated")}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: Device.isTablet ? deviceWidth - 260 : deviceWidth - RW(160) }}>
              <PieChart
                data={this.state.invoicesChart}
                style={{ paddingTop: RW(20), paddingLeft: RW(20) }}
                width={Device.isTablet ? deviceWidth - 60 : deviceWidth - RW(20)}
                height={Device.isTablet ? 300 : RH(220)}
                chartConfig={chartConfig}
                accessor="count"
                backgroundColor={"transparent"}
                hasLegend={false}
              // paddingLeft={"15"}
              // center={[0, 0]}
              // absolute
              />
              <View style={{ marginTop: Device.isTablet ? 40 : RH(20) }}>
                <FlatList
                  style={{ paddingRight: RW(20) }}
                  data={this.state.invoicesChart}
                  showsVerticalScrollIndicator={false}
                  showsHorizontalScrollIndicator={false}
                  renderItem={({ item, index }) => (
                    <View style={{ flexDirection: 'column' }}>
                      <View style={{ flexDirection: 'column' }}>
                        <Text style={{ fontSize: Device.isTablet ? 20 : RF(15), fontFamily: 'medium', marginRight: RW(10), color: item.color }}>{item.name} : {item.count}</Text>
                      </View>
                    </View>
                  )}
                />
              </View>
            </View>
          </View>
          <View style={styles.chartMaincontainer}>
            <Text style={Device.isTablet ? styles.chartTitle_tablet : styles.chartTitle_mobile}>{I18n.t("Sales Summary")}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: Device.isTablet ? deviceWidth - 260 : deviceWidth - RW(160) }}>
              <PieChart
                data={this.state.salesSummaryChart}
                style={{ paddingTop: RW(20), paddingLeft: RW(20) }}
                width={Device.isTablet ? deviceWidth - 60 : deviceWidth - RW(20)} height={Device.isTablet ? 300 : RH(220)}
                chartConfig={chartConfig}
                accessor="count"
                backgroundColor={"transparent"}
                hasLegend={false}
              // paddingLeft={"15"}
              // center={[0, 0]}
              // absolute
              />
              <View style={{ marginTop: Device.isTablet ? 40 : RH(20) }}>
                <FlatList
                  style={{ paddingRight: RW(20) }}
                  data={this.state.salesSummaryChart}
                  showsVerticalScrollIndicator={false}
                  showsHorizontalScrollIndicator={false}
                  renderItem={({ item, index }) => (
                    <View style={{ flexDirection: 'column' }}>
                      <View style={{ flexDirection: 'column' }}>
                        <Text style={{ fontSize: Device.isTablet ? 20 : RF(15), fontFamily: 'medium', marginRight: RW(10), color: item.color }}>{item.name} : {item.count}</Text>
                      </View>
                    </View>
                  )}
                />
              </View>
            </View>
          </View>
          <View style={styles.chartMaincontainer}>
            <Text style={Device.isTablet ? styles.chartTitle_tablet : styles.chartTitle_mobile}>{I18n.t("Active vs Inactive Promos")}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: Device.isTablet ? deviceWidth - 260 : deviceWidth - RW(160) }}>
              <PieChart
                data={this.state.activeVsInactiveChart}
                style={{ paddingTop: RW(20), paddingLeft: RW(20) }}
                width={Device.isTablet ? deviceWidth - 60 : deviceWidth - RW(20)} height={Device.isTablet ? 300 : RH(220)}
                chartConfig={chartConfig}
                accessor="count"
                backgroundColor={"transparent"}
                hasLegend={false}
              // paddingLeft={"15"}
              // center={[0, 0]}
              // absolute
              />
              <View style={{ marginTop: Device.isTablet ? 40 : RH(20) }}>
                <FlatList
                  style={{ paddingRight: RW(20) }}
                  data={this.state.activeVsInactiveChart}
                  showsVerticalScrollIndicator={false}
                  showsHorizontalScrollIndicator={false}
                  renderItem={({ item, index }) => (
                    <View style={{ flexDirection: 'column' }}>
                      <View style={{ flexDirection: 'column' }}>
                        <Text style={{ fontSize: Device.isTablet ? 20 : RF(15), fontFamily: 'medium', marginRight: RW(10), color: item.color }}>{item.name} : {item.count}</Text>
                      </View>
                    </View>
                  )}
                />
              </View>
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
    height: Device.isTablet ? 350 : RH(300),
    width: deviceWidth - RW(40),
    margin: RH(20),
    borderRadius: 20,
  },
  chartTitle_tablet: {
    fontSize: RF(25),
    fontFamily: 'bold',
    marginTop: RH(20),
    marginLeft: RW(20),
    position: 'absolute',
    top: 0,
    left: RW(20)
  },
  chartTitle_mobile: {
    fontSize: RF(20),
    fontFamily: 'bold',
    marginTop: RH(20),
    marginLeft: RW(20),
    position: 'absolute',
    top: 0,
    left: RW(20)
  },
});
