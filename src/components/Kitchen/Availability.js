import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import { FlatList, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import InventoryService from '../services/InventoryService';
import scss from '../../commonUtils/assets/styles/style.scss';
import IconMaa from 'react-native-vector-icons/MaterialIcons';
import I18n from "react-native-i18n";
import Device from 'react-native-device-detection';

export class Availability extends Component {

    constructor(props) {
        super(props);
        this.state = {
            storeId: 0,
            listItems: []
        };
    }

    async componentDidMount () {
        const storeId = await AsyncStorage.getItem("storeId");
        this.setState({ storeId: storeId }, () => {
            this.getAllItems();
        });
    }

    getAllItems () {
        InventoryService.getListItems(this.state.storeId).then((res) => {
            let response = res?.data;
            if (response) {
                console.log({ response }, response.content);
                this.setState({ listItems: response.content });
            } else {
                console.log(res);
            }
        });
    }

    handleAvailability (item) {
        console.log({ item });
        let status = item.itemStatus === "AVAILIABILITY" ? "OUTOFSTOCK" : "AVAILIABILITY";
        let id = item.id;
        const { storeId } = this.state;
        InventoryService.kitchenAvailability(id, status, storeId).then((res) => {
            if (res?.data) {
                console.log(res.data);
                this.getAllItems();
            }
        });
    }

    render () {
        return (
            <View>
                <FlatList
                    ListHeaderComponent={
                        <View style={scss.headerContainer}>
                            <Text style={scss.flat_heading}>Availability - <Text style={{ color: '#f00' }}>{this.state.listItems.length}</Text></Text>
                        </View>
                    }
                    scrollEnabled={true}
                    data={this.state.listItems}
                    keyExtractor={(item, i) => i.toString()}
                    numColumns={Device.isTablet ? 4 : 3}
                    removeClippedSubviews={false}
                    renderItem={({ item, index }) => (
                        <View style={{ flex: 1 }}>
                            <ScrollView>
                                <View style={{ flex: 1, marginHorizontal: 5, marginVertical: 10 }}>
                                    <View style={{ height: 160, maxHeight: 160, width: 120, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <Image
                                            source={{ uri: item.image }}
                                            style={{ height: 90, width: 90, borderRadius: 10 }}
                                        />
                                        {/* <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                </ScrollView> */}
                                        <Text style={{ textAlign: "center", flexShrink: 1 }} numberOfLines={1} ellipsizeMode="tail">{item.itemName}</Text>
                                        <TouchableOpacity onPress={() => this.handleAvailability(item)} style={{ width: 45, height: 35, borderRadius: 5, backgroundColor: item.itemStatus === "AVAILIABILITY" ? "#0d0" : "#d00", justifyContent: 'center' }}>
                                            <Text style={{ color: '#fff', textAlign: 'center' }} >{item.itemStatus === "AVAILIABILITY" ? "on" : "off"}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </ScrollView>
                        </View >
                    )
                    }
                />
            </View >
        );
    }
}

export default Availability;
