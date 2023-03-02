import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import { Dimensions, FlatList, ScrollView, Text, View } from 'react-native';
import { Appbar } from 'react-native-paper';
import ReportsService from '../services/ReportsService';
import Device from 'react-native-device-detection';
import I18n from 'react-native-i18n';
import { RF, RH, RW } from '../../Responsive';
var deviceWidth = Dimensions.get("window").width;
var deviceheight = Dimensions.get("window").height;
import forms from '../../commonUtils/assets/styles/formFields.scss';
import scss from '../../commonUtils/assets/styles/style.scss';
import { formatDate } from '../../commonUtils/DateFormate';
import IconMA from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomerService from '../services/CustomerService';


export class OrderHistory extends Component {

    constructor(props) {
        super(props);
        this.state = {
            storeId: 0,
            historyList: [],
            viewDetails: [],
            viewModel: false,
        };
    }

    async componentDidMount () {
        const storeId = await AsyncStorage.getItem("storeId");
        this.setState({ storeId: storeId }, () => {
            this.getAllHistory(this.state.storeId);
        });
    }

    getAllHistory (storeId) {
        ReportsService.getOrderHistory(storeId).then((res) => {
            console.log(res.data);
            if (res?.data) {
                this.setState({ historyList: res?.data });
            }
        });
    }

    async handleViewOrder (item, index) {
        console.log({ item });
        let orderId = parseInt(item.id);
        const { storeId } = this.state;
        await CustomerService.viewOrder(orderId, storeId).then((res) => {
            if (res?.data) {
                this.setState({ viewDetails: res.data, viewModel: true });
            }
        }).catch((err) => {
            console.log({ err });
        });
    }

    render () {
        return (
            <View>
                <FlatList
                    data={this.state.historyList}
                    ListHeaderComponent={
                        <Appbar>
                            <Appbar.Content title="Order History" />
                        </Appbar>
                    }
                    scrollEnabled={true}
                    keyExtractor={(item, i) => i.toString()}
                    ListEmptyComponent={<Text style={{ fontSize: Device.isTablet ? 21 : 17, fontFamily: 'bold', color: '#000000', textAlign: 'center', marginTop: deviceheight / 3 }}>&#9888; {I18n.t("Results not loaded")}</Text>}
                    renderItem={({ item, index }) => (
                        <ScrollView>
                            <View style={scss.flatListContainer} >
                                <View style={scss.flatListSubContainer}>
                                    <View style={scss.textContainer}>
                                        <Text style={scss.highText} >S.NO: {index + 1} </Text>
                                    </View>
                                    <View style={scss.textContainer}>
                                        <Text style={scss.textStyleMedium}> Order Id: {"\n"} {item.orderNumber}</Text>
                                        <Text style={scss.textStyleLight}>Bill Amount: {"\n"} ₹{parseFloat(item.billAmount).toFixed(2)}</Text>
                                    </View>
                                    <View style={scss.flatListFooter}>
                                        <Text style={scss.footerText}>
                                            {I18n.t("DATE")}:{" "}
                                            {item.date ? item.date.toString().split(/T/)[0]
                                                : item.date}
                                        </Text>
                                        <IconMA
                                            size={25}
                                            style={{ paddingRight: 10 }}
                                            name="eye"
                                            color="#000"
                                            onPress={() =>
                                                this.handleViewOrder(item, index)
                                            }
                                        >
                                        </IconMA>
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

export default OrderHistory;
