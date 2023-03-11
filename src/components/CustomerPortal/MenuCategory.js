import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import { Text, View, FlatList, TouchableOpacity, Image } from 'react-native';
import scss from '../../commonUtils/assets/styles/style.scss';
import IconFA from 'react-native-vector-icons/FontAwesome';
import InventoryService from '../services/InventoryService';
import headers from '../../commonUtils/assets/styles/HeaderStyles.scss';
import Device from 'react-native-device-detection';
import { default as MinusIcon, default as PlusIcon } from 'react-native-vector-icons/MaterialCommunityIcons';
import { TextInput } from 'react-native';

class MenuCategory extends Component {

    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            storeId: 0,
            menuItems: [],
            userId: 0,
            selectedTable: "",
            showTableModel: false,
            availTable: [],
            fromTable: "",
            toTable: "",
            divisionsList: [],
            categoriesList: [],
            selectedDivision: "",
            selectedCategory: "",
            allItems: [],
            previousItems: [],
            newItems: [],
            disableOrder: true,
            tableId: 0,
            tableName: "",
        };
    }

    async componentDidMount() {
        const storeId = await AsyncStorage.getItem("storeId");
        const userId = await AsyncStorage.getItem("userId");
        const clientId = await AsyncStorage.getItem("custom:clientId1");
        console.log({ userId, clientId });
        this.setState({ storeId: storeId, userId: userId }, () => {
            this.getAllDivisions();
        });
        console.log(this.props.route, "aprams");
        this._isMounted = true;
        console.warn(this._isMounted);
        let tableId = this.props?.route?.params?.table?.id;
        let tableName = this.props?.route?.params?.table?.name;
        this.setState({ tableId: tableId, tableName: tableName });
    }

    // Divisions section
    getAllDivisions() {
        let domain = "Restaurants";
        InventoryService.getAllDivisions(domain).then((res) => {
            console.log({ res });
            let response = res?.data;
            let divisions = [];
            if (res.data) {
                response.forEach(element => {
                    divisions.push({
                        value: element.id,
                        label: element.name,
                        id: element.id,
                        bool: false
                    });
                });
                console.log({ divisions });
                this.setState({ divisionsList: divisions });
            }
        });
    }

    handleDivision = (value, index) => {
        if (this.state.divisionsList[index].bool === true) {
            this.state.divisionsList[index].bool = false;
        } else {
            this.state.divisionsList[index].bool = true;
        }
        for (let i = 0; i < this.state.divisionsList.length; i++) {
            if (index != i) {
                this.state.divisionsList[i].bool = false;
            }
            this.setState({ divisionsList: this.state.divisionsList }, () => {
                let domain = "Restaurants";
                console.log({ value });
                this.setState({ selectedDivision: value }, () => {
                    this.getAllCatogiries(this.state.selectedDivision, domain);
                });
            });
        }

    };

    // Categories section
    getAllCatogiries(data, domain) {
        this.setState({ categoriesList: [] });
        let categories = [];
        InventoryService.getAllCategory(data, domain).then((res) => {
            if (res?.data) {
                console.log(res.data);
                for (let i = 0; i < res.data.length; i++) {
                    categories.push({
                        value: res.data[i].id,
                        label: res.data[i].category,
                        id: res.data[i].id,
                        iamge: res.data[i].image,
                        bool: false
                    });
                }
                console.log({ categories });
                this.setState({ categoriesList: categories });
            }
        });
    }

    handleCateory = (value, index) => {
        if (this.state.categoriesList[index].bool === true) {
            this.state.categoriesList[index].bool = false;
        } else {
            this.state.categoriesList[index].bool = true;
        }
        for (let i = 0; i < this.state.categoriesList.length; i++) {
            if (index != i) {
                this.state.categoriesList[i].bool = false;
            }
            this.setState({ categoriesList: this.state.categoriesList }, () => {
                let domain = "Restaurants";
                console.log({ value });
                this.setState({ selectedCategory: value }, () => {
                    this.searchItems();
                });
            });
        }
    };

    // Searching
    searchItems() {
        InventoryService.getAllSearchItems(this.state.selectedCategory, this.state.storeId).then((res) => {
            if (res?.data) {
                let items = res.data.content;
                this.state.menuItems.push(items);
                this.setState({ menuItems: items });
            }
        });
    }

    // Add To Cart
    addToCart(item, index) {
        if (this.state.tableId && this.state.tableId !== 0) {
            const items = [...this.state.menuItems];
            items[index].cart = true;
            items[index].qty = 1;
            this.setState({ menuItems: items });
        } else {
            alert("Please Select the table");
        }
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
            this.setState({ menuItems: items });
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

    // Cart Functionality
    showCart() {
        if (this.state.tableId && this.state.tableId !== 0) {
            this.props.navigation.navigate("CartDetails", {
                tableId: this.state.tableId,
                menu: this.state.menuItems,
                tableName: this.state.tableName,
                goBack: () => this.searchItems(),
                onGoBack: () => this.searchItems()
            });
        } else {
            alert("plase select the table");
        }
    }

    // Unmounting component
    componentWillUnmount() {
        this._isMounted = false;
    }


    render() {
        let tableId = this.props?.route?.params?.table?.id; // TableId
        let tableName = this.props?.route?.params?.table?.name; // TableName
        console.log({ tableId, tableName });
        return (
            <View>
                <View>
                    <View style={scss.headerContainer}>
                        <Text style={scss.flat_heading}>Menu Items-{" "}<Text style={{ color: '#ED1C24' }}>{this.state.menuItems.length}</Text> </Text>
                        <Text style={{ fontSize: 20, color: '#b9b9b9' }}>#{tableName}</Text>
                        <TouchableOpacity onPress={() => this.showCart()} style={[{ backgroundColor: "#ed1c24", width: '15%', height: '80%', borderRadius: 5 }]}>
                            <Text style={{ color: '#fff', textAlign: 'center' }}>Cart{"  "}
                                <IconFA
                                    name="opencart"
                                    size={14}
                                    color="#FFF"
                                />
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={this.state.menuItems}
                        keyExtractor={(item, index) => String(index)}
                        numColumns={Device.isTablet ? 4 : 3}
                        ListHeaderComponent={
                            <View>
                                <View>
                                    <FlatList
                                        horizontal
                                        showsVerticalScrollIndicator={false}
                                        showsHorizontalScrollIndicator={false}
                                        keyExtractor={(item, index) => String(index)}
                                        data={this.state.divisionsList}
                                        style={headers.pageNavigationContainer}
                                        renderItem={({ item, index }) => (
                                            <View>
                                                <TouchableOpacity style={[headers.pageNavigationBtn, {
                                                    borderColor: item.bool ? "#ed1c24" : "#d7d7d7",
                                                    borderBottomWidth: item.bool ? 3 : 0
                                                }]} onPress={() => this.handleDivision(item.value, index)}>
                                                    <Text style={headers.pageNavigationBtnText}>{item.label}</Text>
                                                </TouchableOpacity>
                                            </View>
                                        )}
                                    />
                                    <FlatList
                                        numColumns={5}
                                        data={this.state.categoriesList}
                                        keyExtractor={(item, index) => String(index)}
                                        renderItem={({ item, index }) => (
                                            <View>
                                                <TouchableOpacity style={[{
                                                    marginHorizontal: 15,
                                                    marginVertical: 15
                                                }]} onPress={() => this.handleCateory(item.value, index)}>
                                                    <Image
                                                        style={[scss.logoimg, { height: 50, width: 50, backgroundColor: item.bool ? "#ed1c24" : "#d9d9d9", borderRadius: 5 }]}
                                                        source={{ uri: item.image }}
                                                    />
                                                    <Text style={[headers.pageNavigationBtnText, { color: item.bool ? "#ed1c24" : "#000" }]}>{item.label}</Text>
                                                </TouchableOpacity>
                                            </View>
                                        )}
                                    />
                                </View>
                            </View>
                        }
                        removeClippedSubviews={false}
                        renderItem={({ item, index }) => (
                            <View style={{ flex: 1, marginHorizontal: 5, marginVertical: 10 }}>
                                <View style={{ height: 160, maxHeight: 160, width: 120, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <Image
                                        source={{ uri: item.image }}
                                        style={{ height: 90, width: 90, borderRadius: 10 }}
                                    />
                                    {/* <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                </ScrollView> */}
                                    <Text style={{ textAlign: "center", flexShrink: 1 }} numberOfLines={1} ellipsizeMode="tail">{item.itemName}</Text>
                                    <Text style={{ textAlign: "center" }}>₹{parseFloat(item.itemMrp).toFixed(2)}</Text>
                                    {item.cart ? <View style={{ flexDirection: 'row', alignItems: 'center' }}>
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
                                    </View> : <View>
                                        <TouchableOpacity onPress={() => this.addToCart(item, index)}>
                                            <Text style={{ textAlign: 'center', fontSize: 16 }}><PlusIcon name="plus-circle-outline" size={20} color={"red"} />Add to cart</Text>
                                        </TouchableOpacity>
                                    </View>}
                                </View>
                            </View>
                        )}
                    />
                </View>
            </View>
        );
    }
}

export default MenuCategory;
