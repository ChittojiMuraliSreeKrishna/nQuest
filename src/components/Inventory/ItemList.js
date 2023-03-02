import React, { Component } from 'react';
import { Text, View, FlatList, ScrollView } from 'react-native';
import Loader from '../../commonUtils/loader';
import scss from '../../commonUtils/assets/styles/style.scss';
import IconMaa from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import InventoryService from '../services/InventoryService';
import I18n from "react-native-i18n";

export class ItemList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            storeId: 0,
            itemsArray: []
        };
    };

    async componentDidMount () {
        const storeId = await AsyncStorage.getItem("storeId");
        this.setState({ storeId: storeId }, () => {
            this.getAllItems();
        });
    }

    getAllItems () {
        InventoryService.getListItems(this.state.storeId).then(res => {
            if (res?.data) {
                let response = res.data.content;
                // console.log(response.content)
                this.setState({ itemsArray: response }, () => {
                    console.log(this.state.itemsArray);
                });
            }
        });
    }

    addListItem () {
        this.props.navigation.navigate("AddListItem", {
            isEdit: false,
            onGoBack: () => this.refresh(),
            goBack: () => this.refresh()
        });
    }

    refresh () {
        this.getAllItems();
    }

    render () {
        return (
            <View>
                {this.state.loading && <Loader loading={this.state.loading} />}
                <View>
                    <FlatList
                        ListHeaderComponent={
                            <View style={scss.headerContainer}>
                                <Text style={scss.flat_heading}>Availability - <Text style={{ color: '#f00' }}>{this.state.itemsArray.length}</Text></Text>
                            </View>
                        }
                        scrollEnabled={true}
                        data={this.state.itemsArray}
                        keyExtractor={(item, i) => i.toString()}
                        removeClippedSubviews={false}
                        renderItem={({ item, index }) => (
                            <View style={{ flex: 1 }}>
                                <ScrollView>
                                    <View style={scss.flatListContainer}>
                                        <View style={scss.flatListSubContainer}>
                                            <View style={scss.textContainer}>
                                                <Text style={scss.highText}>S.NO: {index + 1}</Text>
                                                <Text style={scss.textStyleLight}>{I18n.t("Cusine")}:
                                                    <Text style={scss.textStyleMedium}> {item.cuisine}</Text>
                                                </Text>
                                            </View>
                                            <View style={scss.textContainer}>
                                                <Text style={scss.textStyleLight}>{I18n.t("Section")}:
                                                    <Text style={scss.textStyleMedium}> {item.section}</Text>
                                                </Text>
                                                <Text style={scss.textStyleLight}>{I18n.t("Name")}:
                                                    <Text style={scss.textStyleMedium}> {item.itemName}</Text>
                                                </Text>
                                            </View>
                                            <View style={scss.textContainer}>
                                                <Text style={scss.textStyleLight}>{I18n.t("Price")}:
                                                    <Text style={scss.textStyleMedium}> {item.itemMrp}</Text>
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                </ScrollView>
                            </View>
                        )}
                    />
                </View>
            </View>
        );
    }
}

export default ItemList;
