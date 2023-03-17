import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import { Text, View, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import scss from '../../commonUtils/assets/styles/style.scss';
import IconFA from 'react-native-vector-icons/FontAwesome';
import InventoryService from '../services/InventoryService';
import headers from '../../commonUtils/assets/styles/HeaderStyles.scss';
import Device from 'react-native-device-detection';
import { default as MinusIcon, default as PlusIcon } from 'react-native-vector-icons/MaterialCommunityIcons';
import { TextInput } from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage';
import { err } from 'react-native-svg/lib/typescript/xml';

const dataBase = openDatabase({ name: 'menucategory.db', createFromLocation: 1 }, () => { }, err => { console.warn({ err }); });

class MenuCategory extends Component {

    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            storeId: 0,
            menuItems: [],
            cartItems: [],
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
        this.createDateBaase();
        if (this.state.tableId !== 0) {
            this.searchItems();
        }
    }

    createDateBaase() {
        dataBase.transaction((txn) => {
            txn.executeSql(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='menus'",
                [],
                (tx, res) => {
                    console.log('item', res.rows.length);
                    console.log({ res }, res.rows);
                    if (res.rows.length === 0) {
                        txn.executeSql('DROP TABLE IF EXISTS menus', []);
                        txn.executeSql('CREATE TABLE IF NOT EXISTS menus(menuId INTEGER PRIMARY KEY AUTOINCREMENT, createdDate DATETIME, cuisine VARCHAR(30), divisionId VARCHAR(30), divisionId VARCHAR(30), id VARCHAR(30), image VARCHAR(200), itemMrp VARCHAR(30), itemName VARCHAR(30), itemStatus VARCHAR(30), qty VARCHAR(30), section VARCHAR(30), sectionId VARCHAR(30), taxValues JSONB)', []);
                    }
                }),
                (err) => {
                    console.error({ err });
                };
        });
        // Alert.alert("DataBase", "created Table");
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
                res.data.forEach((item) => {
                    categories.push({
                        value: item.id,
                        label: item.category,
                        id: item.id,
                        iamge: item.image,
                        bool: false
                    });
                });
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
            const { menuItems } = this.state;
            if (res?.data) {
                let items = new Set();
                items = res.data.content;
                console.log({ items });
                this.handleDataBase(items);
                this.setState({ menuItems: items }, () => {
                });
            }
        });
    }

    handleDataBase(items) {
        dataBase.transaction((tx) => {
            items.forEach((item) => {
                tx.executeSql(
                    "INSERT INTO menus (menuId, createdDate, cuisine, divisionId, id, image, itemMrp, itemName, itemStatus, qty, section, sectionId, taxValues) VALUES (DEFAULT, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    [item.createdDate, item.cuisine, item.divisionId, item.id, item.image, item.itemMrp, item.itemName, item.itemStatus, item.qty, item.section, item.sectionId, item.taxValues],
                    (tx, results) => {
                        alert("success");
                        console.log("success");
                    },
                    (err) => {
                        console.error({ err });
                    }
                );
            });
        });
    }

    // Add To Cart
    addToCart = (item, index) => {
        if (this.state.tableId && this.state.tableId !== 0) {
            const items = [...this.state.menuItems];
            items[index].cart = true;
            items[index].qty = 1;
            console.log({ item });
            if (this.state.cartItems.length === 0) {
                this.state.cartItems.push(item);
            } else {
                for (let i = 0; i < this.state.cartItems.length; i++) {
                    if (parseInt(this.state.cartItems[i].id) === item.id) {
                        this.state.cartItems[i].qty + 1;
                    } else {
                        this.state.cartItems.push(item);
                    }
                }
            }
            this.setState({ menuItems: items, cartItems: this.state.cartItems }, () => {
                // console.log(this.state.cartItems);
            });
        } else {
            alert("Please Select the table");
        }
    };

    // Modifying the items qty
    incrementForTable(item, index) {
        const items = [...this.state.menuItems];
        var addItem = parseInt(items[index].qty) + 1;
        items[index].qty = addItem.toString();
        this.setState({ menuItems: items }, () => {
            this.state.cartItems.forEach((cart) => {
                if (cart.itemName === item.itemName) {
                    cart.qty + 1;
                }
            });
            console.log(this.state.cartItems);
            this.setState({ cartItems: this.state.cartItems });
        });
    }

    decreamentForTable(item, index) {
        const items = [...this.state.menuItems];
        if (items[index].qty > 1) {
            var minItem = parseInt(items[index].qty) - 1;
            items[index].qty = minItem.toString();
            this.setState({ menuItems: items }, () => {
            });
        } else {
            items[index].qty = 0;
            items[index].cart = false;
            this.setState({ menuItems: items });
        }
        this.state.cartItems.forEach((cart) => {
            if (cart.itemName === item.itemName) {
                if (cart.qty > 1) {
                    cart.qty - 1;
                } else {
                    cart.cart = false;
                }
            }
        });
        this.setState({ cartItems: this.state.cartItems });
    }

    updateQuanty(text, index, item) {
        const items = [...this.state.menuItems];
        if (parseInt(text) > 0 && item.qty !== NaN) {
            items[index].qty = parseInt(text);
            this.setState({ menuItems: items }, () => {
                this.state.cartItems.forEach((cart) => {
                    if (cart.itemName === item.itemName) {
                        cart.qty = parseInt(text);
                    }
                });
            });
        } else {
            alert("Please Enter A Valid QTY");
        }
    }

    // Cart Functionality
    showCart() {
        if (this.state.tableId && this.state.tableId !== 0) {
            this.props.navigation.navigate("CartDetails", {
                tableId: this.state.tableId,
                menu: this.state.cartItems,
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
