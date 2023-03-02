import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import { FlatList, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import CustomerService from '../services/CustomerService';
import Device from "react-native-device-detection";
import forms from '../../commonUtils/assets/styles/formFields.scss';
import scss from "../../commonUtils/assets/styles/style.scss";
import Clipbrd from "../../commonUtils/Clipboard";
import IconMA from 'react-native-vector-icons/MaterialCommunityIcons';


export class MngOrder extends Component {

    constructor(props) {
        super(props);
        this.state = {
            storeId: 0,
            clientId: 0,
            listOfOrders: [],
        };
    }

    async componentDidMount () {
        const storeId = await AsyncStorage.getItem("storeId");
        const clientId = await AsyncStorage.getItem("custom:clientId1");
        this.setState({ storeId: storeId, clientId: clientId }, () => {
            this.getAllOrders();
        });
    }

    getAllOrders () {
        const { clientId, storeId } = this.state;
        CustomerService.getAllMenuOrders(clientId, storeId).then((res) => {
            if (res?.data) {
                console.log(res.data[0].lineItems);
                this.setState({ listOfOrders: res.data });
            }
        });
    }

    updateOrder (item) {
        console.log({ item });
        let itemId = item.lineItemId;
        let status = "FoodReady";
        CustomerService.updateOrders(itemId, status).then((res) => {
            console.log(res);
            if (res?.data) {
                this.getAllOrders();
            }
        });
    }

    render () {
        return (
            <View>
                <FlatList
                    keyExtractor={(item, i) => i.toString()}
                    data={this.state.listOfOrders}
                    scrollEnabled={true}
                    ListHeaderComponent={
                        <View style={scss.headerContainer}>
                            <Text style={scss.flat_heading}>
                                Menu Orders -{" "}
                                <Text style={{ color: "#ED1C24" }}>{this.state.listOfOrders.length}</Text>
                            </Text>
                        </View>
                    }
                    renderItem={({ item, index }) => (
                        <View style={{ flex: 1 }}>
                            <ScrollView>
                                <View style={{ width: '90%', borderWidth: 2, borderColor: '#999', borderRadius: 20, margin: '5%', minHeight: 200 }}>
                                    <View style={{ marginVertical: 10, borderBottomColor: '#999', borderBottomWidth: 2 }}>
                                        <Text style={[scss.textStyleMedium, { textAlign: 'center' }]}>Table: #{item.name}</Text>
                                    </View>
                                    <View style={scss.textContainer}>
                                        <View style={{ width: '25%', justifyContent: 'center', alignItems: 'center' }}>
                                            <Text></Text>
                                        </View>
                                        <View style={{ width: '25%', justifyContent: 'center', alignItems: 'center' }}>
                                            <Text>NAME</Text>
                                        </View>
                                        <View style={{ width: '25%', justifyContent: 'center', alignItems: 'center' }}>
                                            <Text>QTY</Text>
                                        </View>
                                        <View style={{ width: '25%', justifyContent: 'center', alignItems: 'center' }}>
                                            <Text>STATUS</Text>
                                        </View>
                                    </View>
                                    <View>
                                        {item.lineItems.map((item, index) => (
                                            <View style={[scss.textContainer, { marginVertical: 10 }]}>
                                                <View style={{ width: '25%' }}>
                                                    <Image source={{ uri: item.image }} />
                                                </View>
                                                <View style={{ width: '25%', justifyContent: 'flex-start', alignItems: "flex-start" }}>
                                                    <Text style={{ width: 150 }} >{item.name}</Text>
                                                </View>
                                                <View style={{ width: '25%', justifyContent: 'center', alignItems: "center" }}>
                                                    <Text style={{ textAlign: 'center', width: 100 }}>{item.quantity}</Text>
                                                </View>
                                                <View style={{ width: '25%', justifyContent: 'center', alignItems: "center" }}>
                                                    {item.status === "BeingPrepared" ? <TouchableOpacity onPress={() => this.updateOrder(item)} style={{ borderWidth: 2, borderColor: '#0dd', width: 60, borderRadius: 5 }}>
                                                        <Text style={{ color: '#0dd', textAlign: 'center' }}>Ready</Text>
                                                    </TouchableOpacity> :
                                                        <IconMA
                                                            size={30}
                                                            name="check-circle-outline"
                                                            style={{ marginRight: 10 }}
                                                            color="#0dd"
                                                        ></IconMA>
                                                    }
                                                </View>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            </ScrollView>
                        </View>
                    )}
                />
            </View>
        );
    }
}

export default MngOrder;
