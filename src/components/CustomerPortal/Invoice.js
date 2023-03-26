import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import CustomerService from '../services/CustomerService';
import scss from '../../commonUtils/assets/styles/style.scss';
import reg from "../../commonUtils/assets/styles/Registation.scss";
import IconMA from 'react-native-vector-icons/MaterialCommunityIcons';

export class Invoice extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tableId: 0,
            tableName: "",
            orderItems: [],
            totalAmount: 0,
            totalCgst: 0,
            totalSgst: 0,
            bookingType: "",
            tableDetails: [],
            isOrderPlaced: false,
            roomBillPending: false,
            invoiceRooms: []
        };
    }

    async componentDidMount() {
        const tableId = this.props?.route?.params?.table?.id;
        const tableName = this.props?.route?.params?.table?.name;
        const bookingType = this.props?.route?.params?.table?.bookingType;
        const storeId = await AsyncStorage.getItem("storeId");
        const tableDetails = this.props?.route?.params?.table;
        console.log({ tableDetails });
        this.setState({ tableId: tableId, tableName: tableName, storeId: storeId, tableDetails: tableDetails, bookingType: bookingType });
        this.getOrderItems();
    }

    getOrderItems() {
        // alert(this.state.storeId);
        if (this.state.tableId && this.state.tableId !== 0) {
            if (this.state.bookingType === "Table") {
                CustomerService.getTableItems(this.state.tableId).then((res) => {
                    let response = res?.data[0].itemResponses;
                    let booking = res?.data[0].booking;
                    if (response) {
                        console.log({ response, booking });
                        this.setState({ orderItems: response }, () => {
                            this.calculateValues();
                        });
                    }
                });
            } else {
                CustomerService.getRoomOrders(this.state.tableId, this.state.storeId).then(res => {
                    let resOrders = res?.data;
                    console.log({ resOrders }, resOrders[0].itemResponses);
                    if (resOrders[0].invoiceId === null) {
                        this.setState({ orderItems: resOrders[0].itemResponses, roomBillPending: true }, () => {
                            this.calculateValues();
                        });
                    } else {
                        resOrders.map(item => {
                            item.isSelected = false;
                        });
                        console.log({ resOrders });
                        this.setState({ orderItems: resOrders, roomBillPending: false }, () => {
                            this.calculateValues();
                        });
                    }
                });
            }
        }
    }

    // Calculating Values
    calculateValues(type) {
        let totalAmount = 0;
        let totalCgst = 0;
        let totalSgst = 0;
        if (type === "Room") {
            this.state.orderItems.forEach((item, index) => {
                if (item.isSelected === true) {
                    item.itemResponses.forEach((sub) => {
                        totalCgst = totalCgst + sub.cgst;
                        totalSgst = totalSgst + sub.sgst;
                        totalAmount = totalAmount + sub.netValue;
                    });
                }
            });
        } else {
            this.state.orderItems.forEach((item, index) => {
                totalAmount = totalAmount + item.netValue;
                totalCgst = totalCgst + item.cgst;
                totalSgst = totalSgst + item.sgst;
            });
        }
        this.setState({ totalAmount: totalAmount, totalCgst: totalCgst, totalSgst: totalSgst });
    }

    // Add More Items
    addMore() {
        this.props.navigation.replace("Menu");
    }

    // Navigate to Billing Portal
    navigateToPay() {

        if (this.state.bookingType === "Room" && this.state.roomBillPending === false) {
            let finalItems = [];
            this.state.orderItems.forEach((element) => {
                if (element.isSelected) {
                    finalItems.push(element.invoiceId);
                }
            });
            console.log({ finalItems });
            if (finalItems.length < 1) {
                alert("Please Select The Order");
            } else {
                let totalValue = this.state.totalAmount;
                let obj = {
                    bookingId: this.state.tableId,
                    barCodeList: finalItems,
                    storeId: this.state.storeId,
                    totalAmount: this.state.totalAmount,
                    CGST: this.state.totalCgst,
                    SGST: this.state.totalSgst,
                    grandNetAmount: totalValue,
                    enablePayment: true,
                    bookType: 'Room',
                    onGoBack: () => this.refresh(),
                };
                console.log({ obj });
                this.props.navigation.navigate('Payment', obj, { domain: 'Room' });
            }
        } else {
            CustomerService.billTable(true, this.state.tableId).then((res) => {
                console.log({ res });
                let resp = res?.data;
                if (resp) {
                    console.log({ resp });
                    if (this.state.bookingType === "Table") {
                        let totalValue = this.state.totalAmount;
                        let obj = {
                            CGST: this.state.totalCgst,
                            SGST: this.state.totalSgst,
                            createdBy: "",
                            domainType: "Restaurants",
                            grossAmount: totalValue,
                            storeId: this.state.storeId,
                            tableId: this.state.tableId,
                            totalPromoDisc: 0,
                            totalManualDisc: 0,
                            totalAmount: totalValue,
                            netPayableAmount: totalValue,
                            grandNetAmount: totalValue,
                            enablePayment: true,
                            barCodeList: this.state.orderItems,
                            bookType: 'Table',
                            onGoBack: () => this.refresh(),
                        };
                        this.props.navigation.navigate('Payment', obj, { domain: 'Table' });
                    } else {
                        if (this.state.roomBillPending === true) {
                            let totalValue = this.state.totalAmount;
                            let obj = {
                                CGST: this.state.totalCgst,
                                SGST: this.state.totalSgst,
                                createdBy: "",
                                domainType: "Restaurants",
                                grossAmount: totalValue,
                                storeId: this.state.storeId,
                                tableId: this.state.tableId,
                                totalPromoDisc: 0,
                                totalManualDisc: 0,
                                totalAmount: totalValue,
                                netPayableAmount: totalValue,
                                grandNetAmount: totalValue,
                                enablePayment: true,
                                lineItemsReVo: this.state.orderItems,
                            };
                            this.createInvoice(obj);
                        } else {
                            let finalItems = [];
                            this.state.orderItems.forEach((element) => {
                                if (element.isSelected) {
                                    finalItems.push(element.invoiceId);
                                }
                            });
                            console.log({ finalItems });
                        }
                    }
                } else {
                    console.log({ res });
                }
            });
        }
    }

    createInvoice(obj) {
        console.log({ obj });
        CustomerService.cteateInvoice(obj).then((res) => {
            console.log({ res });
            if (res.data) {
                this.props.navigation.replace('Invoice', { table: this.state.tableDetails });
            }
        }).catch((err) => {
            console.log(err);
        });
    }

    refresh() {
        console.log("hello");
        this.setState({ orderItems: [] });
    }

    selectInvoice(item) {
        console.log({ item });
        if (item.isSelected === false) {
            item.isSelected = true;
        } else {
            item.isSelected = false;
        }
        this.setState({ orderItems: this.state.orderItems }, () => {
            let type = "Room";
            this.calculateValues(type);
        });
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <View style={{ height: '55%' }}>
                    {this.state.bookingType === "Table" ?
                        <View>
                            <FlatList
                                data={this.state.orderItems}
                                keyExtractor={(item, index) => String(index)}
                                ListHeaderComponent={
                                    <View style={scss.textContainer}>
                                        <View style={{ width: '15%' }}>
                                            <Text style={scss.textStyleMedium}>S.No</Text>
                                        </View>
                                        <View style={{ width: '20%' }}>
                                            <Text style={[scss.textStyleMedium, { textAlign: 'left' }]}>ITEM</Text>
                                        </View>
                                        <View style={{ width: '10%' }}>
                                            <Text style={[scss.textStyleMedium, { textAlign: 'left' }]}>QTY</Text>
                                        </View>
                                        <View style={{ width: '15%' }}>
                                            <Text style={[scss.textStyleMedium, { textAlign: 'left' }]}>MRP</Text>
                                        </View>
                                        <View style={{ width: '25%' }}>
                                            <Text style={[scss.textStyleMedium, { textAlign: 'left' }]}>NET VALUE</Text>
                                        </View>
                                    </View>
                                }
                                renderItem={({ item, index }) => (
                                    <View>
                                        <View style={scss.flatListContainer}>
                                            <View style={scss.flatListSubContainer}>
                                                <View style={scss.textContainer}>
                                                    <View style={{ width: '10%' }}>
                                                        <Text style={scss.textStyleLight}>{index + 1}.</Text>
                                                    </View>
                                                    <View style={{ width: '30%' }}>
                                                        <Text style={[scss.textStyleMedium, { textAlign: 'left' }]}>{item.name}</Text>
                                                    </View>
                                                    <View style={{ width: '10%' }}>
                                                        <Text style={[scss.textStyleMedium, { textAlign: 'left' }]}>{item.quantity}</Text>
                                                    </View>
                                                    <View style={{ width: '20%' }}>
                                                        <Text style={[scss.textStyleMedium, { textAlign: 'left' }]}>{item.itemPrice}</Text>
                                                    </View>
                                                    <View style={{ width: '20%' }}>
                                                        <Text style={[scss.textStyleMedium, { textAlign: 'left' }]}>{item.grossValue}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                )}
                            />
                        </View> : <View>
                            <FlatList
                                data={this.state.orderItems}
                                keyExtractor={(item, index) => String(index)}
                                ListHeaderComponent={
                                    this.state.roomBillPending === true ?
                                        <View>
                                            <Text>List Items - {this.state.orderItems.length}</Text>
                                            <View style={scss.textContainer}>
                                                <View style={{ width: '15%' }}>
                                                    <Text style={scss.textStyleMedium}>S.No</Text>
                                                </View>
                                                <View style={{ width: '20%' }}>
                                                    <Text style={[scss.textStyleMedium, { textAlign: 'left' }]}>ITEM</Text>
                                                </View>
                                                <View style={{ width: '10%' }}>
                                                    <Text style={[scss.textStyleMedium, { textAlign: 'left' }]}>QTY</Text>
                                                </View>
                                                <View style={{ width: '15%' }}>
                                                    <Text style={[scss.textStyleMedium, { textAlign: 'left' }]}>MRP</Text>
                                                </View>
                                                <View style={{ width: '25%' }}>
                                                    <Text style={[scss.textStyleMedium, { textAlign: 'left' }]}>NET VALUE</Text>
                                                </View>
                                            </View>
                                        </View>
                                        : <View>
                                            <Text>List Orders - {this.state.orderItems.length}</Text>
                                        </View>
                                }
                                renderItem={({ item, index }) => (
                                    <View>
                                        {console.log({ item })}
                                        {this.state.roomBillPending === true ?
                                            <View>
                                                <View style={scss.flatListContainer}>
                                                    <View style={scss.flatListSubContainer}>
                                                        <View style={scss.textContainer}>
                                                            <View style={{ width: '10%' }}>
                                                                <Text style={scss.textStyleLight}>{index + 1}.</Text>
                                                            </View>
                                                            <View style={{ width: '30%' }}>
                                                                <Text style={[scss.textStyleMedium, { textAlign: 'left' }]}>{item.name}</Text>
                                                            </View>
                                                            <View style={{ width: '10%' }}>
                                                                <Text style={[scss.textStyleMedium, { textAlign: 'left' }]}>{item.quantity}</Text>
                                                            </View>
                                                            <View style={{ width: '20%' }}>
                                                                <Text style={[scss.textStyleMedium, { textAlign: 'left' }]}>{item.itemPrice}</Text>
                                                            </View>
                                                            <View style={{ width: '20%' }}>
                                                                <Text style={[scss.textStyleMedium, { textAlign: 'left' }]}>{item.netValue}</Text>
                                                            </View>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View> :
                                            <View style={{ marginVertical: 20, borderColor: '#000', borderWidth: 1, width: '98%', marginHorizontal: '1%', borderRadius: 5 }}>
                                                <View style={{ borderColor: '#000', borderBottomWidth: 1 }}>
                                                    {item.isSelected === false ? <IconMA
                                                        size={30}
                                                        name="check-circle-outline"
                                                        style={{ marginRight: 10 }}
                                                        onPress={() => this.selectInvoice(item)}
                                                        color="#aaa"
                                                    ></IconMA> : <IconMA
                                                        size={30}
                                                        name="check-circle-outline"
                                                        onPress={() => this.selectInvoice(item)}
                                                        style={{ marginRight: 10 }}
                                                        color="#0d0"
                                                    ></IconMA>}
                                                </View>
                                                <View style={scss.textContainer}>
                                                    <View style={{ width: '15%' }}>
                                                        <Text style={scss.textStyleMedium}>S.No</Text>
                                                    </View>
                                                    <View style={{ width: '20%' }}>
                                                        <Text style={[scss.textStyleMedium, { textAlign: 'left' }]}>ITEM</Text>
                                                    </View>
                                                    <View style={{ width: '10%' }}>
                                                        <Text style={[scss.textStyleMedium, { textAlign: 'left' }]}>QTY</Text>
                                                    </View>
                                                    <View style={{ width: '15%' }}>
                                                        <Text style={[scss.textStyleMedium, { textAlign: 'left' }]}>MRP</Text>
                                                    </View>
                                                    <View style={{ width: '25%' }}>
                                                        <Text style={[scss.textStyleMedium, { textAlign: 'left' }]}>NET VALUE</Text>
                                                    </View>
                                                </View>
                                                {item.itemResponses.map((item, index) => (
                                                    <View style={scss.flatListContainer}>
                                                        <View style={scss.flatListSubContainer}>
                                                            <View style={scss.textContainer}>
                                                                <View style={{ width: '10%' }}>
                                                                    <Text style={scss.textStyleLight}>{index + 1}.</Text>
                                                                </View>
                                                                <View style={{ width: '30%' }}>
                                                                    <Text style={[scss.textStyleMedium, { textAlign: 'left' }]}>{item.name}</Text>
                                                                </View>
                                                                <View style={{ width: '10%' }}>
                                                                    <Text style={[scss.textStyleMedium, { textAlign: 'left' }]}>{item.quantity}</Text>
                                                                </View>
                                                                <View style={{ width: '20%' }}>
                                                                    <Text style={[scss.textStyleMedium, { textAlign: 'left' }]}>{item.itemPrice}</Text>
                                                                </View>
                                                                <View style={{ width: '20%' }}>
                                                                    <Text style={[scss.textStyleMedium, { textAlign: 'left' }]}>{item.netValue}</Text>
                                                                </View>
                                                            </View>
                                                        </View>
                                                    </View>
                                                ))}
                                            </View>}
                                    </View>
                                )}
                            />
                        </View>}
                </View>
                {this.state.bookingType === "Table" || this.state.bookingType === "Room" && this.state.roomBillPending === true ? <View>
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
                        <Text style={{ color: '#d00' }}>{parseFloat(this.state.totalAmount).toFixed(2)}</Text>
                    </View>
                    <TouchableOpacity onPress={() => { if (this.state.tableId) { this.navigateToPay(); } }}
                        style={[reg.login_btn, { backgroundColor: "#0d0" }]}>
                        <Text style={[reg.login_btn_text]}>GENERATE BILLING</Text>
                    </TouchableOpacity>
                </View> : <View>
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
                    <TouchableOpacity onPress={() => { if (this.state.tableId) { this.navigateToPay(); } }}
                        style={[reg.login_btn, { backgroundColor: "#0d0" }]}>
                        <Text style={[reg.login_btn_text]}>Proceed To Pay</Text>
                    </TouchableOpacity>
                </View>}
            </View>
        );
    }
}

export default Invoice;
