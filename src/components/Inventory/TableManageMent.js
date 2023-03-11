import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import {
    FlatList, Text, View, TouchableOpacity,
} from 'react-native';
import scss from '../../commonUtils/assets/styles/style.scss';
import IconMaa from 'react-native-vector-icons/MaterialIcons';
import { ScrollView } from 'react-native';
import IconFA from 'react-native-vector-icons/FontAwesome';
import IconMA from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomerService from '../services/CustomerService';
import Modal from "react-native-modal";
import forms from '../../commonUtils/assets/styles/formFields.scss';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { TextInput } from 'react-native-paper';
import I18n from "react-native-i18n";


export class TableManageMent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tablesList: [],
            storeId: 0,
            clientId: 0,
            showAddTable: false,
            tableName: "",
            availableTableSeats: "",
            isEdit: false,
            tableEditId: 0,
        };
    }

    async componentDidMount() {
        const storeId = await AsyncStorage.getItem("storeId");
        const userId = await AsyncStorage.getItem("userId");
        const clientId = await AsyncStorage.getItem("custom:clientId1");
        this.setState({ clientId: clientId, storeId: storeId }, () => {
            this.getAllTables();
        });
    }

    getAllTables() {
        var bookingType = "Table";
        CustomerService.getTablesList(this.state.storeId, this.state.clientId, bookingType).then((res) => {
            if (res) {
                let tables = res?.data;
                console.log({ tables });
                this.setState({ tablesList: tables });
            }
        });
    }

    addTables() {
        this.setState({ showAddTable: true });
    }

    validationForm() {
        let isFormValid = true;
        if (this.state.tableName === "") {
            isFormValid: false;
        }
        if (this.state.tabel) {
            isFormValid: false;
        }
        return isFormValid;
    }

    saveTable() {
        if (!this.state.isEdit) {
            const list = {
                clientId: this.state.clientId,
                name: this.state.tableName,
                numberOfSeats: this.state.availableTableSeats,
                status: false,
                storeId: this.state.storeId
            };
            console.log({ list });
            CustomerService.saveTable(list).then((res) => {
                console.log({ res });
                if (res?.data) {
                    let response = res.data;
                    console.log({ response });
                    this.modelCancel();
                    this.getAllTables();
                }
            }).catch((err) => {
                console.log({ err });
            });
        }
        else {
            const list = {
                clientId: this.state.clientId,
                storeId: this.state.storeId,
                id: this.state.tableEditId,
                numberOfSeats: this.state.availableTableSeats,
                status: false,
                name: this.state.tableName
            };
            console.log({ list });
            CustomerService.editTable(list).then((res) => {
                console.log({ res });
                if (res?.data) {
                    let response = res.data;
                    console.log({ response });
                    this.modelCancel();
                    this.getAllTables();
                }
            });
        }
    }

    editTable(item) {
        console.log({ item }, item.numberOfSeats);
        this.setState({ tableEditId: item.id, tableName: item.name, availableTableSeats: item.numberOfSeats, isEdit: true, }, () => {
            this.setState({ showAddTable: true, });
        });
    }

    deleteTable() {
        alert("under development");
    }

    modelCancel() {
        this.setState({ showAddTable: false });
    }

    handleTableName = (value) => {
        this.setState({ tableName: value });
    };

    handleSeating = (value) => {
        this.setState({ availableTableSeats: value });
    };

    render() {
        return (
            <View>
                <FlatList
                    ListHeaderComponent={
                        <View style={scss.headerContainer}>
                            <Text style={scss.flat_heading}>Table Management - <Text style={{ color: '#f00' }}>{this.state.tablesList.length}</Text> </Text>
                            <IconMaa
                                size={35}
                                name="playlist-add"
                                style={{ marginRight: 10 }}
                                color="#ED1C24"
                                onPress={() => this.addTables()}
                            />
                        </View>
                    }
                    scrollEnabled={true}
                    data={this.state.tablesList}
                    keyExtractor={(item, i) => i.toString()}
                    removeClippedSubviews={false}
                    renderItem={({ item, index }) => (
                        <View style={{ flex: 1 }}>
                            <ScrollView>
                                <View style={scss.flatListContainer}>
                                    <View style={scss.flatListSubContainer}>
                                        <View style={scss.textContainer}>
                                            <Text style={scss.textStyleLight}>Id:
                                                <Text style={scss.highText}> #{item.id}</Text>
                                            </Text>
                                        </View>
                                        <View style={scss.textContainer}>
                                            <Text style={scss.textStyleLight}>Name:
                                                <Text style={scss.textStyleMedium}> {item.name}</Text>
                                            </Text>
                                            <Text style={scss.textStyleLight}>SeatingCapacity:
                                                <Text style={scss.textStyleMedium}> {item.numberOfSeats}</Text>
                                            </Text>
                                        </View>
                                        <View style={scss.textContainer}>
                                            <View></View>
                                            <View style={scss.buttonContainer}>
                                                <IconFA
                                                    name="edit"
                                                    style={[scss.action_icons, { paddingRight: 5 }]}
                                                    size={20}
                                                    color="#000"
                                                    onPress={() =>
                                                        this.editTable(item, index, false)
                                                    }
                                                >
                                                </IconFA>
                                                <IconMA
                                                    name="trash-can-outline"
                                                    size={20}
                                                    style={scss.action_icons}
                                                    onPress={() =>
                                                        this.deleteTable(item?.id)
                                                    }
                                                >
                                                </IconMA>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </ScrollView>
                        </View>
                    )}
                />
                {this.state.showAddTable && (
                    <View>
                        <Modal style={{ margin: 0 }}
                            isVisible={this.state.showAddTable}
                            onBackButtonPress={() => this.modelCancel()}
                            onBackdropPress={() => this.modelCancel()}
                        >
                            <View style={forms.filterModelContainer}>
                                <Text style={forms.popUp_decorator}>-</Text>
                                <KeyboardAwareScrollView>
                                    <View>
                                        <TextInput
                                            mode="flat"
                                            activeUnderlineColor='#b9b9b9'
                                            underlineColor='#b9b9b9'
                                            underlineColorAndroid="transparent"
                                            placeholder={I18n.t("Seating Capacity")}
                                            placeholderTextColor="#6f6f6f"
                                            textAlignVertical='center'
                                            autoCapitalize='none'
                                            value={String(this.state.availableTableSeats)}
                                            onChangeText={this.handleSeating}
                                        />
                                        <TextInput
                                            mode="flat"
                                            activeUnderlineColor='#b9b9b9'
                                            underlineColor='#b9b9b9'
                                            underlineColorAndroid="transparent"
                                            placeholder={I18n.t("TabelName")}
                                            placeholderTextColor="#6f6f6f"
                                            textAlignVertical='center'
                                            autoCapitalize='none'
                                            value={this.state.tableName}
                                            onChangeText={this.handleTableName}
                                        />
                                    </View>
                                    <View style={forms.action_buttons_container}>
                                        <TouchableOpacity style={[forms.action_buttons, forms.submit_btn]}
                                            onPress={() => this.saveTable()}>
                                            <Text style={forms.submit_btn_text} >{I18n.t("SAVE")}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={[forms.action_buttons, forms.cancel_btn]}
                                            onPress={() => this.modelCancel()}>
                                            <Text style={forms.cancel_btn_text}>{I18n.t("CANCEL")}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </KeyboardAwareScrollView>
                            </View>
                        </Modal>
                    </View>
                )}
            </View>
        );
    }
}

export default TableManageMent;
