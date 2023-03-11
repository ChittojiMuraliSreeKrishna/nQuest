import axios from 'axios';
import Constants from 'expo-constants';
import React, { Component } from 'react';
import { Alert, Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import RNBeep from 'react-native-a-beep';
import { RNCamera } from 'react-native-camera';
import { SearchBar } from "react-native-elements";
import ImagePicker from 'react-native-image-crop-picker';
import Modal from "react-native-modal";
import { openDatabase } from 'react-native-sqlite-storage';
import NewSaleService from '../services/NewSaleService';
var deviceWidth = Dimensions.get('window').width;
// Connction to access the pre-populated db
const db = openDatabase({ name: 'tbl_items.db', createFromLocation: 1 });


class Products extends Component {
    constructor(props) {
        super(props);
        this.camera = null;
        this.barcodeCodes = [];
        this.state = {
            barcodeId: "",
            productname: "",
            mobileNumber: "",
            altMobileNo: "",
            name: "",
            loading: false,
            arrayData: [],
            temp: [],
            error: null,
            search: null,
            totalQty: 0,
            qty: [false],
            quantity: '',
            totalAmount: 0,
            gender: "Male",
            gstNumber: "",
            dob: "2021-06-21T18:30:00.000Z",
            address: "",
            modalVisible: true,
            flagqtyModelOpen: false,

            flagone: true,
            flagtwo: false,
            flagthree: false,
            flagfour: false,
            inventoryBarcodeId: '',
            inventoryProductName: '',
            inventoryQuantity: '',
            inventoryMRP: '',
            inventoryDiscount: '',
            inventoryNetAmount: '',
            tableHead: ['S.No', 'Barcode', 'Product', 'Price Per Qty', 'Qty', 'Sales Rate'],
            tableData: [
            ],
            camera: {
                type: RNCamera.Constants.Type.back,
                flashMode: RNCamera.Constants.FlashMode.auto,
            }
        };
    }


    async componentDidMount() {
        // this.setState({ arrayData: [] })
        // this.setState({ temp: [] })
        // this.setState({ search: null })
        this.barcodeDBStore();
        this.getItems();

    }

    getItems = () => {
        this.setState({ arrayData: [], temp: [], search: null });
        db.transaction(txn => {
            txn.executeSql(
                `SELECT * FROM tbl_item`,
                [],
                (sqlTxn, res) => {
                    let len = res.rows.length;
                    if (len > 0) {
                        let results = [];
                        for (let i = 0; i < len; i++) {
                            let item = res.rows.item(i);
                            let sno = String(this.state.tableData.length + 1);
                            let barcode = item["barcode"];
                            let itemDesc = item["itemDesc"];
                            let netAmount = String(item["netAmount"]);
                            let qty = String(item["qty"]);
                            let totalAmount = String(item["netAmount"]);
                            let image = item['itemImage'];
                            this.state.arrayData.push({ sno: sno, barcode: barcode, itemdesc: itemDesc, netamount: netAmount, qty: qty, netamount: netAmount, image: image });
                            if (this.state.arrayData.length === 1) {
                                this.setState({ arrayData: this.state.arrayData });
                            }
                            this.state.temp.push({ sno: sno, barcode: barcode, itemdesc: itemDesc, netamount: netAmount, qty: qty, netamount: netAmount, image: image });
                        }
                        console.log(this.state.arrayData);
                    }
                },
                error => {
                    console.log("error on getting categories " + error.message);
                },
            );
        });
    };

    pickSingleWithCamera(cropping, mediaType = 'photo') {
        ImagePicker.openCamera({
            cropping: cropping,
            width: 500,
            height: 500,
            includeExif: true,
            mediaType,
        })
            .then((image) => {
                console.log('received image', image);
                this.setState({
                    flagqtyModelOpen: false,
                    modalVisible: false,
                    image: {
                        uri: image.path,
                        width: image.width,
                        height: image.height,
                        mime: image.mime,
                    },
                    images: null,
                });
                this.getImageNameByScan();
            })
            .catch((e) => {
                this.setState({ loading: false });
                this.setState({ flagqtyModelOpen: false, modalVisible: false });
                console.log(e);
                Alert.alert(e.message ? e.message : e);
            });
    }


    pickSingle(cropit, circular = false, mediaType) {
        ImagePicker.openPicker({
            width: 500,
            height: 500,
            cropping: cropit,
            cropperCircleOverlay: circular,
            sortOrder: 'none',
            compressImageMaxWidth: 1000,
            compressImageMaxHeight: 1000,
            compressImageQuality: 1,
            compressVideoPreset: 'MediumQuality',
            includeExif: true,
            cropperStatusBarColor: 'white',
            cropperToolbarColor: 'white',
            cropperActiveWidgetColor: 'white',
            cropperToolbarWidgetColor: '#3498DB',
        })
            .then((image) => {
                console.log('received image', image);
                this.setState({
                    flagqtyModelOpen: false,
                    modalVisible: false,
                    image: {
                        uri: image.path,
                        width: image.width,
                        height: image.height,
                        mime: image.mime,
                    },
                    images: null,
                });
                this.getImageNameByScan();
            })
            .catch((e) => {
                this.setState({ loading: false });
                this.setState({ flagqtyModelOpen: false, modalVisible: false });
                console.log(e);
                Alert.alert(e.message ? e.message : e);
            });
    }


    getImageNameByScan() {
        const formData = new FormData();
        formData.append('image', {
            uri: this.state.image.uri, name: this.state.image.mime, type: this.state.image.mime
        });
        axios({
            url: NewSaleService.getImageScanning(),
            method: 'POST',
            data: formData,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
            }
        })
            .then(response => {
                if (response.data) {
                    console.log("response :", response.data.result[0].name);
                    console.log("response :", global.productname);
                    // this.setState({ inventoryProductName: response.data.result[0].name})
                    // if (global.productname == "something") {
                    { RNBeep.beep(); }
                    global.productname = response.data.result[0].name;
                    this.refresh();
                    //    }
                }

            })
            .catch(function (error) {
                this.setState({ loading: false });
                console.log(error);
                alert(error);
            });
    }

    cancel() {
        console.log('clicked');
        //this.setState({ modalVisible: true });
        this.setState({ flagqtyModelOpen: false, modalVisible: false });
    }



    addAction = (item, index) => {
        console.log('vinod data ---------' + item.barcode);
        this.setState({ barcodeId: item.barcode });
        this.barcodeDBStore();
        console.log('vinod data ---------' + this.state.tableData);
        this.props.navigation.navigate('NewSale', { tableData: this.state.tableData, isFromProducts: true, onGoBack: () => this.refreshTableData() },);
    };


    updateSearch = search => {
        this.setState({ search }, () => {
            if ('' == search) {
                this.setState({
                    arrayData: [...this.state.temp]
                });
                return;
            }
            this.state.arrayData = this.state.temp.filter(function (item) {
                return item.itemdesc.includes(search);
            }).map(function ({ itemdesc, netamount, barcode, qty, image }) {
                return { itemdesc, netamount, barcode, qty, image };
            });
        });
    };



    barcodeDBStore = () => {
        db.transaction(txn => {
            txn.executeSql(
                'SELECT * FROM tbl_item where barcode = ?',
                [this.state.barcodeId],
                (sqlTxn, res) => {
                    let results = [];
                    let len = res.rows.length;
                    if (len > 0) {
                        for (let i = 0; i < len; i++) {
                            let item = res.rows.item(i);
                            let sno = String(this.state.tableData.length + 1);
                            let barcode = item["barcode"];
                            let itemDesc = item["itemDesc"];
                            let netAmount = String(item["netAmount"]);
                            let qty = "1";//String(item["qty"])
                            let totalAmount = String(item["netAmount"]);
                            let image = item['itemImage'];
                            this.state.quantity = qty;

                            if (this.state.tableData.length > 0) {
                                for (let i = 0; i < this.state.tableData.length; i++) {
                                    if (this.state.barcodeId == this.state.tableData[i].barcode) {
                                        { RNBeep.beep(); }
                                        console.log("search category" + JSON.stringify(res.rows.length));
                                        const qtyarr = [...this.state.tableData];
                                        qtyarr[i].qty = String(parseInt(qtyarr[i].qty) + 1); //parseInt(item["qty"]))
                                        this.setState({ tableData: qtyarr, totalAmount: this.state.totalAmount });
                                        return;
                                    }
                                    this.state.totalQty = this.state.totalQty + item["qty"];
                                    this.state.totalAmount = parseInt(this.state.totalAmount) + parseInt(item["netAmount"] * 1);
                                }
                                { RNBeep.beep(); }
                                this.setState({ totalAmount: this.state.totalAmount });
                                this.state.tableData.push({ sno: sno, barcode: barcode, itemdesc: itemDesc, netamount: netAmount, qty: qty, netamount: netAmount, image: image });
                            }
                            else {
                                { RNBeep.beep(); }
                                this.state.totalQty = this.state.totalQty + item["qty"];
                                this.state.totalAmount = parseInt(this.state.totalAmount) + parseInt(item["netAmount"] * 1);
                                this.state.tableData.push({ sno: sno, barcode: barcode, itemdesc: itemDesc, netamount: netAmount, qty: qty, netamount: netAmount, image: image });

                            }
                        }
                    }

                    console.log(JSON.stringify(this.state.tableData));
                    console.log(JSON.stringify(totalQty));
                },
                error => {
                    console.log("error on search category " + error.message);
                },
            );
        });
    };

    refreshTableData() {
        this.setState({ tableData: this.state.tableData });
    }

    refresh() {
        //if( global.barcodeId != 'something'){
        console.log(global.productname);

        this.setState({ search: global.productname });
        console.log('serach text is' + this.state.search);

        // {this.updateSearch(global.productname)}
        search = global.productname;
        this.setState({ search }, () => {
            if ('' == search) {
                this.setState({
                    arrayData: [...this.state.temp]
                });
                return;
            }
            this.state.arrayData = this.state.temp.filter(function (item) {
                return item.itemdesc.includes(search);
            }).map(function ({ itemdesc, netamount, barcode, qty, image }) {
                return { itemdesc, netamount, barcode, qty, image };
            });
        });
        this.forceUpdate();
        // this.state.search
        // }
    }

    getBarcode() {
        //if( global.barcodeId != 'something'){
        this.setState({ inventoryBarcodeId: global.barcodeId });
        // }
    }

    navigateToGetBarCode() {
        global.barcodeId = 'something';
        //this.setState({ barcodeId: global.barcodeId })
        this.props.navigation.navigate('ScanBarCode', {
            onGoBack: () => this.getBarcode(),
        });
    }

    navigateToImageScanner() {
        this.setState({ flagqtyModelOpen: true, modalVisible: true });
        // global.productname = 'something'
        // //this.setState({ barcodeId: global.barcodeId })
        // this.props.navigation.navigate('ImageScanner', {
        //     onGoBack: () => this.refresh(),
        // });
    }


    handledeleteaction = (item, index) => {
        const list = this.state.arrayData;
        list.splice(index, 1);
        this.setState({ arrayData: list });
    };

    addnew() {
        this.props.navigation.navigate('ProductAdd', {
            onGoBack: () => this.refreshallProducts(),
        });
    }

    refreshallProducts() {
        this.setState({ arrayData: [] });
        this.barcodeDBStore();
        this.getItems();
    }




    render() {
        return (
            //   <ScrollView>
            <View style={styles.container}>
                {/* <SafeAreaView> */}
                <View style={styles.viewswidth}>

                    <Text style={{
                        position: 'absolute',
                        left: 10,
                        top: 55,
                        width: 300,
                        height: 20,
                        fontFamily: 'bold',
                        fontSize: 18,
                        color: '#353C40'
                    }}> List of Products </Text>
                    <TouchableOpacity
                        style={{ position: 'absolute', right: 20, top: 47, backgroundColor: '#ED1C24', borderRadius: 5, width: 105, height: 32, }}
                        onPress={() => this.addnew()} >
                        <Text style={{ fontSize: 12, fontFamily: 'regular', color: '#ffffff', marginLeft: 10, marginTop: 8, alignSelf: 'center' }}> {('ADD NEW')} </Text>
                    </TouchableOpacity>
                </View>
                <View
                    style={{
                        flex: 1,
                        paddingHorizontal: 0,
                        paddingVertical: 0,
                        marginTop: 0
                    }}>
                    <View>
                        <SearchBar containerStyle={{ marginRight: 40 }} placeholder="Search products with Name"
                            //inputStyle={{backgroundColor: '#FBFBFB'}}
                            lightTheme editable={true}
                            value={this.state.search}
                            onChangeText={this.updateSearch} >
                        </SearchBar>

                        <TouchableOpacity style={{
                            position: 'absolute',
                            right: 10,
                            top: 20,
                        }} onPress={() => this.navigateToImageScanner()}>
                            <Image source={require('../assets/images/barcode.png')} />
                        </TouchableOpacity>

                        {/* this.props.navigation.navigate('AuthNavigation') */}

                    </View>

                    {this.state.flagqtyModelOpen && (
                        <View>
                            <Modal isVisible={this.state.modalVisible}>
                                <View style={{
                                    flex: 1, justifyContent: 'center', //Centered horizontally
                                    alignItems: 'center',
                                }}>
                                    <View style={{
                                        position: 'absolute',
                                        right: 20,
                                        left: 20,
                                        alignItems: 'center',
                                        justifyContent: 'flex-start',
                                        backgroundColor: "#ffffff", borderRadius: 20,
                                    }}>
                                        <TouchableOpacity
                                            style={{ backgroundColor: '#ED1C24', borderRadius: 5, width: 200, marginTop: 20, height: 32, alignSelf: 'center' }}
                                            onPress={() => this.pickSingleWithCamera(true)} >
                                            <Text style={{ fontSize: 12, fontFamily: 'regular', color: '#ffffff', marginLeft: 10, marginTop: 8, alignSelf: 'center' }}> {('Product Image Scan With Camera')} </Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={{ backgroundColor: '#ED1C24', borderRadius: 5, width: 200, marginTop: 20, height: 32, alignSelf: 'center' }}
                                            onPress={() => this.pickSingle(true)} >
                                            <Text style={{ fontSize: 12, fontFamily: 'regular', color: '#ffffff', marginLeft: 10, marginTop: 8, alignSelf: 'center' }}> {('Product Image Scan With Gallery')} </Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={{ backgroundColor: '#ED1C24', borderRadius: 5, width: 200, marginTop: 20, height: 32, alignSelf: 'center', marginBottom: 20, }}
                                            onPress={() => this.cancel()} >
                                            <Text style={{ fontSize: 12, fontFamily: 'regular', color: '#ffffff', marginLeft: 10, marginTop: 8, alignSelf: 'center' }}> {('Cancel')} </Text>
                                        </TouchableOpacity>

                                    </View>
                                </View>
                            </Modal>
                        </View>)}

                    <FlatList
                        data={this.state.arrayData}
                        keyExtractor={item => item.email}
                        renderItem={({ item, index }) => (
                            <View style={{
                                height: 120,
                                backgroundColor: '#FFFFFF',
                                borderBottomWidth: 5,
                                borderBottomColor: '#FBFBFB',
                                flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
                            }}>
                                <View style={{ flexDirection: 'column', width: '100%', height: 120, }}>
                                    <Image source={{ uri: item.image }} style={{
                                        position: 'absolute', left: 20, top: 15, width: 90, height: 90, borderwidth: 5, borderColor: "#F6F6F6",
                                    }} />
                                    <Text style={{ fontSize: 16, marginTop: 30, marginLeft: 130, fontFamily: 'medium', color: '#353C40' }}>
                                        {item.itemdesc}
                                    </Text>
                                    <Text style={{ fontSize: 12, marginLeft: 130, marginTop: 6, fontFamily: 'regular', color: '#808080' }}>
                                        QUANTITY:
                                    </Text>
                                    <Text style={{ fontSize: 12, marginLeft: 200, marginTop: -16, fontFamily: 'medium', color: '#353C40' }}>
                                        {item.qty} Pieces
                                    </Text>
                                    <Text style={{ fontSize: 12, marginLeft: 130, marginTop: 6, fontFamily: 'regular', color: '#808080' }}>
                                        PRICE/EACH:
                                    </Text>
                                    <Text style={{ fontSize: 12, marginLeft: 210, marginTop: -16, fontFamily: 'medium', color: '#ED1C24' }}>
                                        ₹ {(parseInt(item.netamount)).toString()}
                                    </Text>


                                </View>


                                <TouchableOpacity
                                    style={{
                                        fontSize: 15, fontFamily: 'regular',
                                        right: 80, bottom: 10,
                                        borderColor: '#ED1C24', borderWidth: 1, width: 60, height: 30,
                                        textAlign: 'center', justifyContent: 'center', marginTop: -10, //Centered horizontally
                                        alignItems: 'center', borderRadius: 5,
                                    }}
                                    onPress={() => this.addAction(item, index)} >
                                    <Text style={{
                                        color: "#ED1C24"
                                    }}>
                                        + ADD
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{
                                    position: 'absolute',
                                    right: 50,
                                    top: 65,
                                    width: 30,
                                    height: 30,
                                    borderBottomLeftRadius: 5,
                                    borderTopLeftRadius: 5,
                                    borderWidth: 1,
                                    borderColor: "lightgray",
                                    // borderRadius:5,
                                }} onPress={() => this.handleeditaction()}>
                                    <Image style={{ alignSelf: 'center', top: 5, height: Device.isTablet ? 30 : 20, width: Device.isTablet ? 30 : 20 }} source={require('../assets/images/edit.png')} />
                                </TouchableOpacity>

                                <TouchableOpacity style={{
                                    position: 'absolute',
                                    right: 20,
                                    top: 65,
                                    width: 30,
                                    height: 30,
                                    borderBottomRightRadius: 5,
                                    borderTopRightRadius: 5,
                                    borderWidth: 1,
                                    borderColor: "lightgray",
                                }} onPress={() => this.handledeleteaction(item, index)}>
                                    <Image style={{ alignSelf: 'center', top: 5, height: Device.isTablet ? 30 : 20, width: Device.isTablet ? 30 : 20 }} source={require('../assets/images/delete.png')} />

                                </TouchableOpacity>
                                <View style={{
                                    backgroundColor: 'grey',
                                    flexDirection: 'row',
                                    justifyContent: 'space-around',
                                    alignItems: 'center',
                                    height: 30,
                                    width: 90
                                }}>

                                </View>

                            </View>
                        )}
                    />
                </View>
            </View>
            //   </ScrollView>
        );
    }
}
export default Products;


const pickerSelectStyles = StyleSheet.create({
    placeholder: {
        color: "#001B4A55",
        fontFamily: "bold",
        fontSize: 16,
    },
    inputIOS: {
        marginLeft: 20,
        marginRight: 20,
        marginTop: 10,
        height: 40,
        backgroundColor: '#ffffff',
        borderBottomColor: '#456CAF55',
        color: '#001B4A',
        fontFamily: "bold",
        fontSize: 16,
        borderRadius: 3,
    },
    inputAndroid: {
        marginLeft: 20,
        marginRight: 20,
        marginTop: 10,
        height: 40,
        backgroundColor: '#ffffff',
        borderBottomColor: '#456CAF55',
        color: '#001B4A',
        fontFamily: "bold",
        fontSize: 16,
        borderRadius: 3,
    },
});


const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#FAFAFF'
    },
    viewswidth: {
        backgroundColor: '#ffffff',
        width: deviceWidth,
        textAlign: 'center',
        fontSize: 24,
        height: 84,
    },
    input: {
        justifyContent: 'center',
        margin: 20,
        height: 40,
        marginTop: 5,
        marginBottom: 10,
        borderColor: '#8F9EB717',
        borderRadius: 3,
        backgroundColor: 'white',
        borderWidth: 1,
        fontFamily: 'semibold',
        fontSize: 16,
    },
    signInButton: {
        backgroundColor: '#ED1C24',
        justifyContent: 'center',
        width: '48%',
        marginLeft: 0,
        marginTop: 10,
        height: 40,
        borderRadius: 30,
        fontWeight: 'bold',
        margin: 10,
        // alignSelf:'center',
        // marginBottom:100,
    },
    qty: {
        backgroundColor: '#ED1C24',
        justifyContent: 'center',
        width: '18%',
        marginTop: 10,
        height: 40,
        margin: 5,
        borderRadius: 5,
        fontWeight: 'bold',
    },
    imagealign: {
        marginTop: 25,
        marginRight: 34,
    },
    itemscount: {
        backgroundColor: '#ED1C24',
        justifyContent: 'center',
        width: '18%',
        marginLeft: 0,
        marginTop: 10,
        height: 40,
        borderRadius: 5,
        fontWeight: 'bold',
        margin: 5,
        // alignSelf:'center',
        // marginBottom:100,
    },
    itemDetail: {
        backgroundColor: '#ffffff',

        width: '60%',
        marginLeft: 0,
        marginTop: 10,
        height: 40,
        borderRadius: 5,
        fontWeight: 'bold',
        margin: 5,
        // alignSelf:'center',
        // marginBottom:100,
    },
    signInButtonRight: {
        backgroundColor: '#ED1C24',
        justifyContent: 'center',
        width: '48%',
        marginTop: 10,
        height: 40,
        margin: 10,
        borderRadius: 30,
        fontWeight: 'bold',
    },
    signInButtonText: {
        color: 'white',
        alignSelf: 'center',
        fontSize: 14,
        fontFamily: "regular",
    },
    signInFieldStyle: {
        color: 'black',
        marginLeft: 20,
        marginTop: 5,
        fontSize: 18,
        fontFamily: "regular",
        textAlign: 'left',
    },
    findIteminput: {
        marginLeft: 30,
        marginRight: 30,
        marginTop: 20,
        marginBottom: 1000,
        height: 50,
        backgroundColor: "#DEF1FF",
        borderRadius: 10,
        color: '#001B4A',
        fontFamily: "regular",
        fontSize: 12,
    },
    qtyInput: {
        width: 50,
        height: 25,
        // marginTop: 20,
        // marginBottom: 1000,
        // height: 50,
        // backgroundColor: "#DEF1FF",
        // borderRadius: 10,
        // color: '#001B4A',
        // fontFamily: "regular",
        // fontSize: 12,
    },
    signUptext: {
        marginTop: 40,
        fontFamily: "regular",
        alignSelf: 'center',
        color: '#FFFFFF',
        fontSize: 28,
    },
    saleBillsText: {
        marginLeft: 0,
        marginTop: -20,
        marginBottom: 10,
        fontFamily: "bold",
        color: '#0F2851',
        fontSize: 14,
    },
    tablecontainer: {
        flex: 1,
        // width:deviceWidth,
        marginLeft: 20,
        marginRight: 20,
        padding: 20,
        paddingTop: 30,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    head: {
        height: 45,
        borderColor: '#FAFAFF',
        borderWidth: 1,
        borderRadius: 10,
    },
    text: {
        margin: 6,
        color: "#ED1C24",
        fontFamily: "semibold",
        fontSize: 11,
    },
    textData: {
        margin: 6,
        color: "#48596B",
        fontFamily: "regular",
        fontSize: 10,
    },

    Topcontainer: {
        flexDirection: 'row',
        marginLeft: 0,
        marginRight: 0,
        width: '100%',
        backgroundColor: 'grey',
        height: 50
    },

    TopcontainerforModel: {
        flexDirection: 'row',
        marginLeft: 0,
        marginRight: 0,
        marginTop: 10,
        width: '100%',
        backgroundColor: 'grey',
        borderRadius: 20,
        height: 50,
    },
    TopcontainerforPay: {
        flexDirection: 'row',
        marginLeft: 0,
        marginRight: 0,
        marginTop: 10,
        width: '100%',
        backgroundColor: '#ffffff',
        borderColor: 'lightgray',
        borderRadius: 0,
        height: 50,
    },
    TopcontainerforItems: {
        flexDirection: 'row',
        marginLeft: 0,
        marginRight: 0,
        marginTop: 10,
        width: '100%',
        backgroundColor: '#ffffff',
        borderColor: 'lightgray',
        borderRadius: 0,
        height: 50,
    },
    redbox: {
        backgroundColor: "#1CA2FF",
        alignSelf: "flex-start",

        //marginHorizontal: "1%",
        marginBottom: 6,
        width: "25%",
        height: 45,
        textAlign: "center",
    },
    bluebox: {
        backgroundColor: "#ED1C24",
        alignSelf: "flex-start",
        //marginHorizontal: "1%",
        marginBottom: 6,
        width: "25%",
        height: 45,
        textAlign: "center",
    },
    blackbox: {
        backgroundColor: "#ED1C24",
        alignSelf: "flex-start",
        //marginHorizontal: "1%",
        marginBottom: 6,
        width: "25%",
        height: 45,
        textAlign: "center",
    },
    greenbox: {
        backgroundColor: "#ED1C24",
        alignSelf: "flex-start",
        //marginHorizontal: "1%",
        marginBottom: 6,
        width: "25%",
        height: 45,
        textAlign: "center",
    },





    tabBar: {
        flexDirection: 'row',
        paddingTop: Constants.statusBarHeight,
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        padding: 16,
    },
    box: {
        width: 50,
        height: 50,
    },
    row: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    button: {
        paddingHorizontal: 8,
        paddingVertical: 6,
        //borderRadius: 4,
        backgroundColor: "#ED1C24",
        alignSelf: "flex-start",
        //marginHorizontal: "1%",
        marginBottom: 6,
        width: "25%",
        height: 45,
        textAlign: "center",
    },
    selected: {
        backgroundColor: "#BBE3FF",
        borderWidth: 0,
        backgroundColor: "#ED1C24",
    },
    buttonLabel: {
        textAlign: "center",
        color: "#BBE3FF",
        fontFamily: "regular",
        fontSize: 14,
    },
    selectedLabel: {
        color: "white",
        textAlign: "center",
        alignSelf: "center",
        marginTop: 10,
        fontFamily: "regular",
        fontSize: 14,
    },
    label: {
        textAlign: "center",
        marginBottom: 10,
        fontSize: 24,
    },

    //model
    modelcontainer: {
        alignItems: 'center',
        backgroundColor: '#ede3f2',
        padding: 100
    },
    modal: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#f7021a',
        padding: 100
    },
    modeltext: {
        color: '#3f2949',
        marginTop: 10
    },
    btn: {
        width: 40, height: 18, borderWidth: 0.2, borderColor: '#48596B', fontFamily: "regular",
        fontSize: 10,
    },
    btnText: { textAlign: 'center', color: '#fff' }


    ,
    preview: {
        margin: 20,
        height: 300,
        marginTop: 5,
        marginBottom: 10,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    overlay: {
        position: 'absolute',
        padding: 16,
        right: 0,
        left: 0,
        alignItems: 'center'
    },
    topOverlay: {
        top: 0,
        flex: 1,
        marginLeft: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    bottomOverlay: {
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.4)',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    enterBarcodeManualButton: {
        padding: 15,
        backgroundColor: 'white',
        borderRadius: 40
    },
    scanScreenMessage: {
        fontSize: 14,
        color: 'white',
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center'
    }
});
