import { Modal, Text, View, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import React, { Component } from 'react';
import { FlatList } from 'react-native';
import scss from '../../commonUtils/assets/styles/style.scss';
import CustomerService from '../services/CustomerService';
import I18n from "react-native-i18n";
import { default as MinusIcon, default as PlusIcon, default as ScanIcon } from 'react-native-vector-icons/MaterialCommunityIcons';
import { Appbar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

export class CartDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tableId: 0,
            previousItems: [],
            menuItems: [],
            clientId: 0,
            storeId: 0,
            tableName: "",
        };
    }

    // Back Button Action
    handleBackButtonClick() {
        this.props.navigation.goBack(null);
        return true;
    }

    async componentDidMount() {
        const clientId = await AsyncStorage.getItem("custom:clientId1");
        const storeId = await AsyncStorage.getItem("storeId");
        let tableId = this.props?.route?.params?.tableId;
        let tableName = this.props?.route?.params?.tableName;
        let menu = this.props?.route?.params?.menu;
        this.getData(menu);
        this.getAllPreviousItems(tableId);
        this.setState({ tableId: tableId, clientId: clientId, storeId: storeId, tableName: tableName });
    }

    getData(menu) {
        // console.log({ menu });
        let newItems = [];
        for (let i = 0; i < menu.length; i++) {
            if (menu[i].cart) {
                newItems.push(menu[i]);
            }
        }
        console.log({ newItems });
        this.setState({ menuItems: newItems });
    }

    // Get all previously ordered items
    getAllPreviousItems(tableId) {
        CustomerService.getTableItems(tableId).then((res) => {
            let oldItems = res?.data[0]?.itemResponses;
            console.log({ oldItems }, "getting all table items");
            if (oldItems) {
                this.setState({ previousItems: oldItems });
            }
        }).catch(err => {
            console.log({ err });
        });
    }

    // Modifying the items qty
    incrementForTable(item, index) {
        const items = [...this.state.menuItems];
        var addItem = parseInt(items[index].qty) + 1;
        items[index].qty = addItem.toString();
        this.setState({ menuItems: items }, () => {

        });
    }

    decreamentForTable(item, index) {
        const items = [...this.state.menuItems];
        if (items[index].qty > 1) {
            var minItem = parseInt(items[index].qty) - 1;
            items[index].qty = minItem.toString();
            this.setState({ menuItems: items });
        } else {
            items[index].qty = 0;
            items[index].cart = false;
            this.getData(items);
        }
    }

    updateQuanty(text, index, item) {
        const items = [...this.state.menuItems];
        if (parseInt(text) > 0 && item.qty !== NaN) {
            items[index].qty = parseInt(text);
            this.setState({ menuItems: items });
        } else {
            alert("Please Enter A Valid QTY");
        }
    }

    // Place New Order
    placeNewOrder() {
        let lineItems = [];
        this.state.menuItems.forEach((element, index) => {
            console.log({ element });
            let obj = {
                cgst: element.taxValues.cgstValue,
                sgst: element.taxValues.sgstValue,
                clientId: this.state.clientId,
                discount: 0,
                division: element.divisionId,
                itemPrice: element.itemMrp,
                manualDiscount: 0,
                name: element.itemName,
                netValue: (element.itemMrp * element.qty),
                originalBarcodeCreatedAt: element.createdDate,
                promoDiscount: 0,
                qty: element.qty,
                section: element.sectionId,
                storeId: this.state.storeId,
                tableId: this.state.tableId
            };
            lineItems.push(obj);
        });
        console.log({ lineItems });
        CustomerService.saveLineItemsRes(lineItems).then((res) => {
            console.log({ res });
            let response = res?.data;
            if (response) {
                console.log({ response });
                this.setState({ menuItems: [] });
                this.props.navigation.goBack();
                this.props.route.params.onGoBack();
            }
        });
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <Appbar mode="center-aligned" style={styles.mainContainer} >
                    <Appbar.BackAction
                        onPress={() => this.handleBackButtonClick()}
                    />
                    <Appbar.Content title="Cart Items" />
                </Appbar>
                <View style={styles.oldItemsStyle}>
                    <Text>Table# {this.state.tableName} {"\n"} Previous Items - {this.state.previousItems.length}</Text>
                    <FlatList
                        keyExtractor={(item, index) => String(index)}
                        data={this.state.previousItems}
                        renderItem={({ item, index }) => (
                            <View style={[scss.flatListContainer, { backgroundColor: '#ffffff23', borderColor: '#ffffff23' }]}>
                                <View style={scss.flatListSubContainer}>
                                    <View style={scss.textContainer}>
                                        <Text style={scss.highText}>S.NO: {index + 1}</Text>
                                    </View>
                                    <View style={scss.textContainer}>
                                        <Text style={scss.textStyleLight}>
                                            <Text style={scss.textStyleMedium}>
                                                {item.name}
                                                {"\n"}
                                            </Text>
                                            {parseFloat(item.itemMrp).toFixed(2)}
                                        </Text>
                                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                            <TouchableOpacity disabled={true}>
                                                <MinusIcon name="minus-circle-outline" size={20} color={"red"} />
                                            </TouchableOpacity>
                                            <TextInput
                                                style={{
                                                    fontFamily: 'regular',
                                                    fontSize: 12,
                                                    height: 20,
                                                    width: 20
                                                }}
                                                editable={false}
                                                keyboardType={'numeric'}
                                                activeUnderlineColor='#000'
                                                value={String(item.quantity)}
                                                maxLength={10}
                                                textAlign={'center'}
                                            />
                                            <TouchableOpacity disabled={true}>
                                                <PlusIcon name="plus-circle-outline" size={20} color={"red"} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        )}
                    />
                </View>
                <Text>New Items - {this.state.menuItems.length}</Text>
                <View style={styles.newItemsStyle}>
                    <FlatList
                        keyExtractor={(item, index) => String(index)}
                        data={this.state.menuItems}
                        renderItem={({ item, index }) => (
                            <View style={[scss.flatListContainer]}>
                                <View style={scss.flatListSubContainer}>
                                    <View style={scss.textContainer}>
                                        <Text style={scss.highText}>S.NO: {index + 1}</Text>
                                    </View>
                                    <View style={scss.textContainer}>
                                        <Text style={scss.textStyleLight}>
                                            <Text style={scss.textStyleMedium}>
                                                {item.name}
                                                {"\n"}
                                            </Text>
                                            {parseFloat(item.itemMrp).toFixed(2)}
                                        </Text>
                                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                            <TouchableOpacity
                                                onPress={() => this.decreamentForTable(item, index)}>
                                                <MinusIcon name="minus-circle-outline" size={20} color={"red"} />
                                            </TouchableOpacity>
                                            <TextInput
                                                style={{
                                                    fontFamily: 'regular',
                                                    fontSize: 12,
                                                    height: 20,
                                                    width: 20
                                                }}
                                                keyboardType={'numeric'}
                                                activeUnderlineColor='#000'
                                                value={String(item.qty)}
                                                maxLength={10}
                                                textAlign={'center'}
                                                onChangeText={(text) => this.updateQuanty(text, index, item)}
                                            />
                                            <TouchableOpacity
                                                onPress={() => this.incrementForTable(item, index)}>
                                                <PlusIcon name="plus-circle-outline" size={20} color={"red"} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        )}
                    />

                </View>
                <TouchableOpacity style={styles.placeOrderBtn} onPress={() => this.placeNewOrder()}>
                    <Text style={styles.placeOrderBtnText}>Place Order</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

export default CartDetails;


const styles = StyleSheet.create({
    oldItemsStyle: {
        backgroundColor: '#00000040',
        maxHeight: '40%'
    },
    newItemsStyle: {
        maxHeight: '40%'
    },
    placeOrderBtn: {
        backgroundColor: '#0d0',
        width: '90%',
        margin: '5%',
        height: '4%',
        borderRadius: 10,
        justifyContent: 'center'
    },
    placeOrderBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center'
    }
});