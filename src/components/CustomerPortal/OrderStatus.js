import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import CustomerService from '../services/CustomerService';
import scss from '../../commonUtils/assets/styles/style.scss';
import reg from "../../commonUtils/assets/styles/Registation.scss";

export class OrderStatus extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tableId: 0,
            tableName: "",
            orderItems: [],
            totalAmount: 0,
            totalCgst: 0,
            totalSgst: 0
        };
    }

    async componentDidMount () {
        const tableId = this.props?.route?.params?.table?.id;
        const tableName = this.props?.route?.params?.table?.name;
        const storeId = await AsyncStorage.getItem("storeId");
        this.setState({ tableId: tableId, tableName: tableName, storeId: storeId });
        this.getOrderItems();
    }

    getOrderItems () {
        if (this.state.tableId && this.state.tableId !== 0) {
            CustomerService.getTableItems(this.state.tableId).then((res) => {
                let response = res?.data;
                if (response) {
                    console.log({ response });
                    this.setState({ orderItems: response }, () => {
                        this.calculateValues();
                    });
                }
            });
            console.log({ obj });
        }
    }

    // Calculating Values
    calculateValues () {
        let totalAmount = 0;
        let totalCgst = 0;
        let totalSgst = 0;
        this.state.orderItems.forEach((item, index) => {
            totalAmount = totalAmount + item.grossValue;
            totalCgst = totalCgst + item.cgst;
            totalSgst = totalSgst + item.sgst;
        });
        this.setState({ totalAmount: totalAmount, totalCgst: totalCgst, totalSgst: totalSgst });
    }

    // Add More Items
    addMore () {
        this.props.navigation.replace("Menu");
    }

    // Navigate to Billing Portal
    navigateToPay () {
        // this.props.navigation.push("CustomerNavigation");
    }

    render () {
        return (
            <View style={{ flex: 1 }}>
                <View style={{ height: '55%' }}>
                    <FlatList
                        data={this.state.orderItems}
                        keyExtractor={(item, index) => String(index)}
                        renderItem={({ item, index }) => (
                            <View>
                                <View style={scss.flatListContainer}>
                                    <View style={scss.flatListSubContainer}>
                                        <View style={scss.textContainer}>
                                            {/* <Text style={scss.textStyleLight}>{index + 1}.</Text> */}
                                            <View>
                                                <Image
                                                    source={{ uri: item.image }}
                                                />
                                                <Text style={scss.textStyleMedium}>{item.name}</Text>
                                                <Text style={scss.textStyleMedium}>{item.grossValue}</Text>
                                            </View>
                                            <Text style={[scss.textStyleMedium, { color: item.status === "BeingPrepared" ? "#dd0" : "#0d0" }]}>{item.status}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        )}
                    />
                </View>
                <View>
                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Billing Information</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 2, borderColor: '#d9d9d9', marginTop: 30, marginHorizontal: 10 }}>
                        <Text>Total Amount</Text>
                        <Text>{parseFloat(this.state.totalAmount).toFixed(2)}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 2, borderColor: '#d9d9d9', marginHorizontal: 10 }}>
                        <Text>CGST</Text>
                        <Text>{parseFloat(this.state.totalCgst).toFixed(2)}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 2, borderColor: '#d9d9d9', marginHorizontal: 10 }}>
                        <Text>SGST</Text>
                        <Text>{parseFloat(this.state.totalSgst).toFixed(2)}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 10 }}>
                        <Text style={{ color: '#d00' }}>Payable Amount</Text>
                        <Text style={{ color: '#d00' }}>{parseFloat(this.state.totalSgst + this.state.totalCgst + this.state.totalAmount).toFixed(2)}</Text>
                    </View>
                    {/* <TouchableOpacity style={reg.login_btn} onPress={() => this.addMore()}>
                        <Text style={[reg.login_btn_text]}>ADD MORE ITEMS</Text>
                    </TouchableOpacity> */}
                    {/* <TouchableOpacity onPress={() => this.navigateToPay()}
                        style={[reg.login_btn, { backgroundColor: "#0d0" }]}>
                        <Text style={[reg.login_btn_text]}>GENERATE BILLING</Text>
                    </TouchableOpacity> */}
                </View>
            </View>
        );
    }
}

export default OrderStatus;
