import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import { DrawerActions } from "@react-navigation/native";
import axios from "axios";
import Constants from "expo-constants";
import React, { Component } from "react";
import {
	Alert,
	Dimensions,
	FlatList,
	Image,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import RNBeep from "react-native-a-beep";
import { RNCamera } from "react-native-camera";
import Device from "react-native-device-detection";
import { SearchBar } from "react-native-elements";
import I18n from "react-native-i18n";
import ImagePicker from "react-native-image-crop-picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Modal from "react-native-modal";
import RNPickerSelect from "react-native-picker-select";
import { Chevron } from "react-native-shapes";
import { openDatabase } from "react-native-sqlite-storage";
import CreateCustomerService from "../services/CreateCustomerService";
import InventoryService from "../services/InventoryService";
import LoginService from "../services/LoginService";
import NewSaleService from "../services/NewSaleService";
import UrmService from "../services/UrmService";
var deviceWidth = Dimensions.get("window").width;
// Connction to access the pre-populated db
const db = openDatabase({ name: "tbl_items.db", createFromLocation: 1 });
const createdb = openDatabase({
	name: "create_items.db",
	createFromLocation: 1,
});

class NewSaleRetail extends Component {
	constructor(props) {
		super(props);
		this.camera = null;
		this.barcodeCodes = [];
		this.state = {
			barcodeId: "",
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
			quantity: "",
			totalAmount: 0,
			totalDiscount: 0,
			gender: "Male",
			gstNumber: "",
			dob: "2021-06-21T18:30:00.000Z",
			address: "",
			modalVisible: true,
			flagone: true,
			flagqtyModelOpen: false,
			flagCustomerOpen: false,
			flagtwo: false,
			productItemId: 0,
			productuom: "",
			flagthree: false,
			flagfour: false,
			inventoryBarcodeId: "",
			inventoryProductName: "",
			inventoryQuantity: "",
			inventoryMRP: "",
			inventoryDiscount: "",
			inventoryNetAmount: "",
			customerPhoneNumber: "",
			customerName: "",
			customerEmail: "",
			customerGender: "",
			customerAddress: "",
			customerGSTNumber: "",
			domainId: 1,
			storeId: 1,
			tableHead: [
				"S.No",
				"Barcode",
				"Product",
				"Price Per Qty",
				"Qty",
				"Sales Rate",
			],
			tableData: [],
			inventoryDelete: false,
			lineItemDelete: false,
			uom: [],
			store: "",
			privilages: [],
			subPrivilages: "",
			camera: {
				type: RNCamera.Constants.Type.back,
				flashMode: RNCamera.Constants.FlashMode.auto,
			},
		};
	}

	handleMenuButtonClick() {
		this.props.navigation.openDrawer();
	}

	async takePicture() {
		if (this.camera) {
			const options = { quality: 0.5, base64: true };
			const data = await this.camera.takePictureAsync(options);
			console.log(data.uri);
		}
	}

	pendingView() {
		return (
			<View
				style={{
					flex: 1,
					backgroundColor: "lightgreen",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<Text>Waiting</Text>
			</View>
		);
	}

	//   toggleModal(visible) {
	//     this.setState({ modalVisible: visible });
	//  }

	async componentDidMount() {
		var domainStringId = "";
		var storeStringId = "";
		AsyncStorage.getItem("domainDataId")
			.then((value) => {
				domainStringId = value;
				this.setState({ domainId: parseInt(domainStringId) });
				console.log("domain data ids" + this.state.domainId);
			})
			.catch(() => {
				this.setState({ loading: false });
				console.log("There is error getting domainDataId");
				// alert('There is error getting domainDataId');
			});

		AsyncStorage.getItem("storeId")
			.then((value) => {
				storeStringId = value;
				this.setState({ storeId: parseInt(storeStringId) });
				console.log(this.state.storeId);
				console.log("storeId" + this.state.storeId);
			})
			.catch(() => {
				this.setState({ loading: false });
				console.log("There is error getting storeId");
				// alert('There is error getting storeId');
			});
		this.barcodeDBStore();
		this.getItems();

		AsyncStorage.getItem("custom:isSuperAdmin")
			.then((value) => {
				if (value === "true") {
					var domainId = "1";
					if (global.domainName === "Textile") {
						domainId = "1";
					} else if (global.domainName === "Retail") {
						domainId = "2";
					} else if (global.domainName === "Electrical & Electronics") {
						domainId = "3";
					}

					axios
						.get(UrmService.getPrivillagesForDomain() + domainId)
						.then((res) => {
							if (res.data && res.data["isSuccess"] === "true") {
								let len = res.data["result"].length;
								if (len > 0) {
									if (len > 0) {
										for (let i = 0; i < len; i++) {
											let previlage = res.data["result"][i];
											if (previlage.name === "Billing Portal") {
												for (
													let i = 0;
													i < previlage.subPrivillages.length;
													i++
												) {
													console.log(
														previlage.subPrivillages[i].parentPrivillageId,
													);
													if (
														previlage.id ===
														previlage.subPrivillages[i].parentPrivillageId
													) {
														let subprivilage = previlage.subPrivillages[i];
														if (subprivilage.name === "Dashboard") {
															this.setState({ flagOne: false, flagTwo: false });
														}
														if (i === 0) {
															this.state.privilages.push({
																bool: true,
																name: subprivilage.name,
															});
														} else {
															this.state.privilages.push({
																bool: false,
																name: subprivilage.name,
															});
														}
													}
												}
											}
											this.setState({ privilages: this.state.privilages });
										}
									}
								}
							}
						});
				} else {
					AsyncStorage.getItem("rolename")
						.then((value) => {
							UrmService.getPrivillagesByRoleName(value).then((res) => {
								if (res.data && res.data["isSuccess"] === "true") {
									let len = res.data["result"].parentPrivilages.length;
									let length = res.data["result"].subPrivilages.length;
									// console.log(.name)
									if (len > 0) {
										for (let i = 0; i < len; i++) {
											let previlage = res.data["result"].parentPrivilages[i];
											if (previlage.name === "Billing Portal") {
												if (length > 0) {
													for (let i = 0; i < length; i++) {
														if (
															previlage.id ===
															res.data["result"].subPrivilages[i]
																.parentPrivillageId
														) {
															let subprivilage =
																res.data["result"].subPrivilages[i];
															if (i === 0) {
																this.state.privilages.push({
																	bool: true,
																	name: subprivilage.name,
																});
															} else {
																this.state.privilages.push({
																	bool: false,
																	name: subprivilage.name,
																});
															}
														}
														this.setState({
															privilages: this.state.privilages,
														});
													}
												}
											}
										}
									}
								}
							});
						})
						.catch(() => {
							this.setState({ loading: false });
							console.log("There is error saving domainDataId");
							// alert('There is error saving domainDataId');
						});
				}
			})
			.catch(() => {
				this.setState({ loading: false });
				console.log("There is error getting role Name");
				// alert('There is error getting Role Name');
			});
	}

	topbarAction1 = (item, index) => {
		if (item.name === "Generate Invoice") {
			console.log("generate invocie");
			this.setState({
				inventoryDelete: false,
				modalVisible: false,
				flagone: true,
				flagtwo: false,
				flagthree: false,
				flagfour: false,
			});
		}

		if (this.state.privilages[index].bool === true) {
			this.state.privilages[index].bool = false;
		} else {
			this.state.privilages[index].bool = true;
		}
		for (let i = 0; i < this.state.privilages.length; i++) {
			if (index != i) {
				this.state.privilages[i].bool = false;
			}
			this.setState({ privilages: this.state.privilages });
		}
	};

	invoiceUpdate() {
		this.setState({ tableData: [] });
		alert("payment created successfully");
	}

	pay = () => {
		var lineItems = [];
		var lineItemIds = [];
		for (let i = 0; i < this.state.tableData.length; i++) {
			lineItems.push({
				itemPrice: this.state.tableData[i].netamount,
				quantity: this.state.tableData[i].qty,
				discount: this.state.tableData[i].promoDisc,
				netValue:
					this.state.tableData[i].netamount - this.state.tableData[i].promoDisc,
				barCode: this.state.tableData[i].barcode,
				domainId: this.state.domainId,
			});
		}
		this.setState({ loading: true });
		// const params = lineItems
		console.log(lineItems);
		console.log("params are" + JSON.stringify(lineItems));
		this.setState({ loading: true });
		axios.post(NewSaleService.saveLineItems(), lineItems).then((res) => {
			if (res.data && res.data["isSuccess"] === "true") {
				lineItemIds.push(JSON.parse(res.data["result"]));
				//
				console.log(lineItemIds + `line items saved successfully`);
				var lineItemIdAdd = [];
				for (let i = 0; i < lineItemIds[0].length; i++) {
					lineItemIdAdd.push({ lineItemId: lineItemIds[0][i] });
				}
				//console.log(params)
				this.props.navigation.navigate("Payment", {
					totalAmount: this.state.totalAmount,
					totalDiscount: this.state.totalDiscount,
					customerName: this.state.customerName,
					customerPhoneNumber: this.state.customerPhoneNumber,
					customerGSTNumber: this.state.customerGSTNumber,
					customerAddress: this.state.customerAddress,
					customerGender: this.state.customerGender,
					lineItemIdAdd: lineItemIdAdd,
					totalQty: this.state.totalQty.toString(),
					onGoBack: () => this.invoiceUpdate(),
				});
			} else {
				this.setState({ loading: false });
				alert("duplicate record already exists");
			}
		});
	};

	getItems = () => {
		this.setState({ arrayData: [], temp: [], search: null });
		NetInfo.addEventListener((state) => {
			if (state.isConnected) {
				axios
					.post(InventoryService.getAllBarcodes(), {
						storeId: this.state.storeId,
					})
					.then((res) => {
						if (res.data && res.data["isSuccess"] === "true") {
							let len = res.data["result"].length;
							console.log("get products lenth" + len);
							//setInterval(() => {
							db.transaction((txn) => {
								txn.executeSql(
									"DROP TABLE tbl_item",
									[],
									(sqlTxn, res) => {
										console.log(`delteted successfully`);
									},
									(error) => {
										console.log("error on adding category " + error.message);
									},
								);
							});

							db.transaction((txn) => {
								txn.executeSql(
									`CREATE TABLE IF NOT EXISTS tbl_item(item_id INTEGER PRIMARY KEY AUTOINCREMENT, barcode VARCHAR(20), itemDesc VARCHAR(20), qty INT(5), mrp INT(30), promoDisc INT(30), netAmount INT(30), salesMan INT(30), createdDate VARCHAR(255), lastModified VARCHAR(255), itemImage BLOB, uom VARCHAR(255), storeId INT(30), domainDataId INT(30))`,
									[],
									(sqlTxn, res) => {
										console.log("table created successfully");
									},
									(error) => {
										console.log("error on creating table " + error.message);
									},
								);
							});
							if (len > 0) {
								for (let i = 0; i < len; i++) {
									let item = res.data["result"][i];
									console.log(item);
									let barcode = String(item["barcodeId"]);
									let itemDesc = String(item["name"]);
									let qty = item["stockValue"];
									let mrp = item["costPrice"];
									let promoDisc = item["tyecode"];
									let netAmount = item["costPrice"];
									let salesMan = item["empId"];
									let createdDate = String(item["createdDate"]);
									let lastModified = String(item["lastModified"]);
									let uom = item["uom"];
									let storeId = item["storeId"];
									let domainDataId = item["domainDataId"];
									let productItemid = item["productItemId"];
									let productuomm = item["uom"];
									this.setState({ productuom: productuomm });
									this.setState({ productItemId: productItemid });
									db.transaction((txn) => {
										txn.executeSql(
											"INSERT INTO tbl_item ( barcode, itemDesc, qty, mrp, promoDisc, netAmount, salesMan, createdDate, lastModified,itemImage,uom,storeId,domainDataId) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)",
											[
												barcode,
												itemDesc,
												qty,
												mrp,
												promoDisc,
												netAmount,
												salesMan,
												createdDate,
												productItemid,
												"",
												productuomm,
												storeId,
												domainDataId,
											],
											//[, String(getListOfBarcodes[0][0]["itemDesc"]), getListOfBarcodes[0][0]["qty"], , getListOfBarcodes[0][0]['promoDisc'], getListOfBarcodes[0][0]['netAmount'], getListOfBarcodes[0][0]['salesMan'], String(getListOfBarcodes[0][0]['createdDate']), String(getListOfBarcodes[0][0]['lastModified'])],
											(sqlTxn, res) => {
												console.log(`added at insert----`);
												db.transaction((txn) => {
													txn.executeSql(
														`SELECT * FROM tbl_item`,
														[],
														(sqlTxn, res) => {
															let len = res.rows.length;
															if (len > 0) {
																let results = [];
																if (this.state.arrayData.length > 0) {
																	return;
																}
																for (let i = 0; i < len; i++) {
																	let item = res.rows.item(i);

																	let sno = String(
																		this.state.tableData.length + 1,
																	);
																	let barcode = item["barcode"];

																	let itemDesc = item["itemDesc"];
																	console.log(barcode + "added to table----");
																	let netAmount = String(item["netAmount"]);
																	let qty = String(item["qty"]);
																	let uom = String(item["uom"]);
																	let lastModified = parseInt(
																		item["lastModified"],
																	);
																	let totalAmount = String(item["netAmount"]);
																	let image = item["itemImage"];
																	console.log("uom are" + lastModified);
																	// console.log(res.rows + "added to table----");
																	this.state.arrayData.push({
																		sno: sno,
																		barcode: barcode,
																		itemdesc: itemDesc,
																		promoDisc: promoDisc,
																		netamount: netAmount,
																		qty: qty,
																		netamount: netAmount,
																		image: image,
																		productItemId: lastModified,
																		productuom: uom,
																	});
																	if (this.state.arrayData.length === 1) {
																		this.setState({
																			arrayData: this.state.arrayData,
																		});
																	}
																	this.state.temp.push({
																		sno: sno,
																		barcode: barcode,
																		itemdesc: itemDesc,
																		netamount: netAmount,
																		promoDisc: promoDisc,
																		qty: qty,
																		netamount: netAmount,
																		image: image,
																		productItemId: lastModified,
																		productuom: uom,
																	});
																}

																console.log(this.state.arrayData);
															}
															return;
														},
														(error) => {
															console.log(
																"error on getting categories " + error.message,
															);
														},
													);
												});
											},
											(error) => {
												console.log(
													"error on adding category " + error.message,
												);
											},
										);
									});
								}
							}
						}
					});
			} else {
				db.transaction((txn) => {
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
									let image = item["itemImage"];

									this.state.arrayData.push({
										sno: sno,
										barcode: barcode,
										itemdesc: itemDesc,
										promoDisc: promoDisc,
										netamount: netAmount,
										qty: qty,
										netamount: netAmount,
										image: image,
										productItemId: this.state.productItemId,
										productuom: this.state.productuom,
									});
									if (this.state.arrayData.length === 1) {
										this.setState({ arrayData: this.state.arrayData });
									}
									this.state.temp.push({
										sno: sno,
										barcode: barcode,
										itemdesc: itemDesc,
										promoDisc: promoDisc,
										netamount: netAmount,
										qty: qty,
										netamount: netAmount,
										image: image,
									});
								}
								console.log(this.state.arrayData);
							}
						},
						(error) => {
							console.log("error on getting categories " + error.message);
						},
					);
				});
			}
		});
	};

	setResult = (results) => {
		console.log("vinod data ---------" + len);
	};

	addAction = (item, index) => {
		console.log("vinod data ---------" + item.barcode);
		this.setState({
			barcodeId: item.barcode,
			flagone: true,
			flagtwo: false,
			flagthree: false,
			flagfour: false,
		});
		this.barcodeDBStore();
		// const qtyarr = [...this.state.arrayData];
		// //this.setState({ barcodeId: text })
		// let sno = String(this.state.tableData.length + 1)
		// let barcode = qtyarr[index].barcode
		// //let barcode = item["barcode"]
		// let itemDesc = qtyarr[index].itemdesc
		// //let itemDesc = item["itemDesc"]
		// let qty = qtyarr[index].qty
		// let netAmount = qtyarr[index].netamount
		// //let netAmount = String(item["netAmount"])
		// // let qty = String(item["qty"])

		// let totalAmount = String(qtyarr[index].netamount)
		// //console.log(JSON.stringify(item))
		// this.state.quantity = qty
		// this.state.totalQty = (parseInt(this.state.totalQty) + parseInt(qtyarr[index].qty)).toString()
		// this.state.totalAmount = (parseInt(this.state.totalAmount) + parseInt(qtyarr[index].netamount) * qty)
		// //this.state.tableData.push([sno, barcode, itemDesc, netAmount, qty, netAmount])
		// this.state.tableData.push({ sno: sno, barcode: barcode, itemdesc: itemDesc, netamount: netAmount, qty: qty, netamount: netAmount })
		// // this.barcodeDBStore()
		// this.setState({ flagone: true })
		// this.setState({ flagtwo: false })
		// this.setState({ flagthree: false })
		// this.setState({ flagfour: false })
	};

	renderHeader = () => {
		return (
			<View>
				<SearchBar
					containerStyle={{ marginRight: 40 }}
					placeholder="Search Here..."
					lightTheme
					round
					editable={true}
					value={this.state.search}
					autoCapitalize="none"
					onChangeText={this.updateSearch}
				></SearchBar>

				<TouchableOpacity
					style={{
						position: "absolute",
						right: 10,
						top: 20,
					}}
					onPress={() => this.navigateToImageScanner()}
				>
					<Image source={require("../assets/images/barcode.png")} />
				</TouchableOpacity>

				{/* this.props.navigation.navigate('AuthNavigation') */}
			</View>
		);
	};

	updateSearch = (search) => {
		let text = search.toLowerCase();
		this.setState({ text }, () => {
			if ("" == text) {
				this.setState({
					arrayData: [...this.state.temp],
				});
				return;
			}
			this.state.arrayData = this.state.temp
				.filter(function (item) {
					return item.itemdesc.includes(text);
				})
				.map(function ({
					itemdesc,
					netamount,
					barcode,
					qty,
					image,
					productuom,
				}) {
					return { itemdesc, netamount, barcode, qty, image, productuom };
				});
		});
	};

	barcodeDBStore = () => {
		console.log("---------------------------------------------------");
		db.transaction((txn) => {
			txn.executeSql(
				"SELECT * FROM tbl_item where barcode = ?",
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
							let promoDisc = item["promoDisc"];
							let qty = "1"; //String(item["qty"])
							let totalAmount = String(item["netAmount"]);
							let image = item["itemImage"];
							this.state.quantity = qty;

							this.state.totalQty = (
								parseInt(this.state.totalQty) + 1
							).toString();
							this.state.totalAmount =
								parseInt(this.state.totalAmount) +
								parseInt(item["netAmount"] * 1);
							this.state.totalDiscount =
								parseInt(this.state.totalDiscount) +
								parseInt(item["promoDisc"] * 1);

							if (this.state.tableData.length > 0) {
								for (let i = 0; i < this.state.tableData.length; i++) {
									if (this.state.barcodeId == this.state.tableData[i].barcode) {
										{
											RNBeep.beep();
										}
										console.log(
											"search categoryvinod" + JSON.stringify(res.rows.length),
										);
										const qtyarr = [...this.state.tableData];
										qtyarr[i].qty = String(parseInt(qtyarr[i].qty) + 1); //parseInt(item["qty"]))
										this.setState({ tableData: qtyarr });
										// this.setState({ totalAmount: parseInt(this.state.totalAmount) + parseInt(item["netAmount"] * 1) })
										// this.setState({ totalDiscount: parseInt(this.state.totalDiscount) + parseInt(item["promoDisc"] * 1) })
										return;
									}
									// this.state.totalQty = this.state.totalQty + item["qty"]
									// this.state.totalQty = (parseInt(this.state.totalQty) + 1).toString()
								}
								{
									RNBeep.beep();
								}
								// this.setState({ totalAmount: this.state.totalAmount })
								// this.setState({ totalDiscount: this.state.totalDiscount })
								this.state.tableData.push({
									sno: sno,
									barcode: barcode,
									itemdesc: itemDesc,
									promoDisc: promoDisc,
									netamount: netAmount,
									qty: qty,
									netamount: netAmount,
									image: image,
								});
							} else {
								{
									RNBeep.beep();
								}
								// this.state.totalQty = this.state.totalQty + item["qty"]
								// this.state.totalQty = (parseInt(this.state.totalQty) + 1).toString()
								// this.state.totalAmount = parseInt(this.state.totalAmount) + parseInt(item["netAmount"] * 1)
								// this.state.totalDiscount = parseInt(this.state.totalDiscount) + parseInt(item["promoDisc"] * 1)
								this.state.tableData.push({
									sno: sno,
									barcode: barcode,
									itemdesc: itemDesc,
									promoDisc: promoDisc,
									netamount: netAmount,
									qty: qty,
									netamount: netAmount,
									image: image,
								});
							}
							//parse this.state.totalAmount + item["netAmount"]
							// this.state.tableData.push([sno, barcode, itemDesc, netAmount, qty, netAmount])
						}
					} else {
						if (this.state.barcodeId.length > 0) {
							alert("No product related with this barcode");
						}
					}
					this.setState({
						flagone: true,
						flagtwo: false,
						flagthree: false,
						flagfour: false,
					});
					console.log(JSON.stringify(this.state.tableData.length));
					console.log(JSON.stringify(totalQty));
				},
				(error) => {},
			);
		});
	};

	modelCancel() {
		this.setState({
			inventoryDelete: false,
			lineItemDelete: false,
			flagqtyModelOpen: false,
			flagCustomerOpen: false,
			modalVisible: false,
		});
	}

	handleInventoryBarcode = (text) => {
		this.setState({ inventoryBarcodeId: text });
	};
	handleInventoryProductName = (text) => {
		this.setState({ inventoryProductName: text });
	};
	handleInventoryQuantity = (value) => {
		this.setState({ inventoryQuantity: value });
	};

	handleInventoryMRP = (text) => {
		this.setState({ inventoryMRP: text });
	};
	handleInventoryDiscount = (text) => {
		this.setState({ inventoryDiscount: text });
		// console.log(this.state.inventoryMRP)
		// console.log(text)
		// this.setState({ inventoryNetAmount: (parseInt(this.state.inventoryMRP) - parseInt(text)).toString() })
	};
	handleInventoryNetAmount = (text) => {
		this.setState({ inventoryNetAmount: text });
	};

	handleMobileNumber = (text) => {
		this.setState({ mobileNumber: text });
	};
	handleAltNumber = (text) => {
		this.setState({ altMobileNo: text });
	};
	handlename = (value) => {
		this.setState({ name: value });
	};

	handleGender = (text) => {
		this.setState({ gender: text });
	};
	handleGstnumber = (text) => {
		this.setState({ gstNumber: text });
	};
	handledob = (value) => {
		this.setState({ dob: value });
	};

	handleaddress = (value) => {
		this.setState({ address: value });
	};

	handleBarCode = (text) => {
		this.setState({ barcodeId: text });
	};

	handleCustomerPhoneNumber = (text) => {
		this.setState({ customerPhoneNumber: text });
	};

	handleCustomerName = (text) => {
		this.setState({ customerName: text });
	};

	handleCustomerEmail = (text) => {
		this.setState({ customerEmail: text });
	};

	handleCustomerAddress = (text) => {
		this.setState({ customerAddress: text });
	};

	handleCustomerGSTNumber = (text) => {
		this.setState({ customerGSTNumber: text });
	};

	handlecustomerGender = (text) => {
		this.setState({ customerGender: text });
	};

	addCustomer() {
		if (this.state.customerPhoneNumber.length != 10) {
			alert("Please Enter valid mobile number");
			return;
		} else if (this.state.customerName.length === 0) {
			alert("Please Enter customer name");
			return;
		}
		// else if (this.state.customerGender.length === 0) {
		//   alert('Please Enter customer gender');
		//   return
		// }
		// else if (this.state.customerAddress.length === 0) {
		//   alert('Please Enter customer address');
		//   return
		// }
		// else if (this.state.customerGSTNumber.length === 0) {
		//   alert('Please Enter customer GST Number');
		//   return
		// }
		// {
		//   "email":"manideep6067@gmail.com",
		//   "phoneNumber":"8466043603",
		//   "birthDate":"07-03-1995",
		//   "gender":"male",
		//   "name":"vinod",
		//   "username":"Mani_123451",
		//   "parentId":"1",
		//   "domianId":"0",
		//   "address":"Katrenikona",
		//   "isCustomer":true,
		//   "isSuperAdmin":false,
		//   "stores":[

		//   ],
		//   "role":{
		//   },
		//   "clientId":"",
		//   "isConfigUser":false,
		//   "clientDomain":[]
		//   }
		const params = {
			email: this.state.customerEmail,
			phoneNumber: this.state.customerPhoneNumber,
			birthDate: "",
			gender: this.state.customerGender,
			name: this.state.customerName,
			username: this.state.customerName,
			parentId: "1",
			domianId: this.state.domainId,
			address: this.state.customerAddress,
			isCustomer: true,
			isSuperAdmin: false,
			role: {},
			stores: [],
			clientId: "",
			isConfigUser: false,
			clientDomain: [],
		};
		this.setState({ loading: true });
		axios
			.post(LoginService.createUser(), params)
			.then((res) => {
				if (res.data && res.data["isSuccess"] === "true") {
					this.setState({
						flagCustomerOpen: false,
						modalVisible: false,
						loading: false,
					});
					//alert("create customer" + JSON.stringify(res.data["result"].body));
				} else {
					this.setState({
						loading: false,
						flagCustomerOpen: false,
						modalVisible: false,
					});
					// alert("create customer" + JSON.stringify(res.data["result"].body));
				}
			})
			.catch(() => {
				this.setState({ loading: false });
				this.setState({
					loading: false,
					flagCustomerOpen: false,
					modalVisible: false,
				});
				alert("There is an Error in Creating Customer");
			});
	}

	getUserDetails = () => {
		const params = {
			phoneNo: this.state.customerPhoneNumber,
		};
		axios
			.post(LoginService.getUser(), params)
			.then((res) => {
				if (res.data && res.data["isSuccess"] === "true") {
					this.setState({
						customerGender: res.data["result"][0].gender,
						customerName: res.data["result"][0].userName,
					});
					//this.setState({ customerEmail: res.data["result"][0].userName });
					// this.setState({ customerAddress: res.data["result"][0].gender });

					// alert("get customer" + JSON.stringify(res.data["result"]));
				} else {
					this.setState({ loading: false });
				}
			})
			.catch(() => {
				this.setState({ loading: false });
				this.setState({ flagCustomerOpen: false, modalVisible: false });
				alert("There is an Error in Getting Customer Details");
			});
	};

	async inventoryCreate() {
		if (this.state.inventoryBarcodeId.length === 0) {
			alert("Please Enter Barcode by using scan/Mannually");
		} else if (this.state.inventoryProductName.length === 0) {
			alert("Please Enter Product name");
		} else if (this.state.inventoryQuantity.length === 0) {
			alert("Please Enter Quantity");
		}
		// else if (this.state.store.length === 0) {
		//   alert('Please Select UOM');
		// }
		else if (this.state.inventoryMRP.length === 0) {
			alert("Please Enter MRP");
		} else if (this.state.inventoryDiscount.length === 0) {
			alert("Please Enter offer price");
		} else {
			NetInfo.addEventListener((state) => {
				if (state.isConnected) {
					const params = {
						//required
						costPrice: this.state.inventoryMRP,
						name: this.state.inventoryProductName,
						listPrice: this.state.inventoryDiscount,
						stockValue: parseInt(this.state.inventoryQuantity),
						uom: this.state.store,
						domainDataId: this.state.domainId,
						storeId: this.state.storeId,
						barcodeId: parseInt(this.state.inventoryBarcodeId),
						isBarcode: true,
						//optional
						tyecode: this.state.inventoryDiscount, //"10",
						defaultImage: "",
						status: "1",
						title: "",
						stock: "1",
						color: "",
						length: 35,
						productValidity: "",
						empId: 1,
					};
					console.log("params are" + JSON.stringify(params));
					this.setState({ loading: true });
					axios.post(InventoryService.createProduct(), params).then((res) => {
						if (res.data && res.data["isSuccess"] === "true") {
							this.setState({ loading: false });
							console.log(`inventory added successfully`);
							this.setState({
								arrayData: [],
								image: "",
								store: "",
								temp: [],
								flagone: false,
								flagtwo: false,
								flagthree: true,
							});
							this.getItems();
						} else {
							this.setState({ loading: false });
							alert("duplicate record already exists");
						}
					});
				} else {
					createdb.transaction((txn) => {
						txn.executeSql(
							`CREATE TABLE IF NOT EXISTS create_item(item_id INTEGER PRIMARY KEY AUTOINCREMENT, barcode VARCHAR(20), itemDesc VARCHAR(20), qty INT(5), mrp INT(30), promoDisc INT(30), netAmount INT(30), salesMan INT(30), createdDate VARCHAR(255), lastModified VARCHAR(255), itemImage BLOB, uom VARCHAR(255), storeId INT(30), domainDataId INT(30))`,
							[],
							(sqlTxn, res) => {
								console.log("CREATE table created successfully");
							},
							(error) => {
								console.log("error on creating table " + error.message);
							},
						);
					});

					createdb.transaction((txn) => {
						txn.executeSql(
							"INSERT INTO create_item( barcode, itemDesc, qty, mrp, promoDisc, netAmount, salesMan, createdDate, lastModified,itemImage,uom,storeId,domainDataId) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)",
							[
								this.state.inventoryBarcodeId,
								this.state.inventoryProductName,
								parseInt(this.state.inventoryQuantity),
								parseInt(this.state.inventoryMRP),
								parseInt(this.state.inventoryDiscount),
								parseInt(this.state.inventoryMRP),
								"",
								"",
								"",
								"pieces",
								1,
								1,
							],
							//[, String(getListOfBarcodes[0][0]["itemDesc"]), getListOfBarcodes[0][0]["qty"], , getListOfBarcodes[0][0]['promoDisc'], getListOfBarcodes[0][0]['netAmount'], getListOfBarcodes[0][0]['salesMan'], String(getListOfBarcodes[0][0]['createdDate']), String(getListOfBarcodes[0][0]['lastModified'])],
							(sqlTxn, res) => {
								console.log(`CREATE added successfully`);
								alert("record created in offline successfully");
							},
							(error) => {
								console.log("error on adding category " + error.message);
							},
						);
					});
				}
			});
		}
	}

	async getUOM() {
		NetInfo.addEventListener((state) => {
			if (state.isConnected) {
				var uom = [];

				axios.get(InventoryService.getUOM()).then((res) => {
					if (res.data["result"]) {
						for (var i = 0; i < res.data["result"].length; i++) {
							console.log("getuom" + res.data["result"][i].uomName);
							uom.push({
								value: res.data["result"][i].uomName, //id
								label: res.data["result"][i].uomName,
							});
						}
					}
					this.setState({
						uom: uom,
					});
					AsyncStorage.setItem("uomData", JSON.stringify(uom))
						.then(() => {
							console.log("table data saved");
						})
						.catch(() => {
							this.setState({ loading: false });
							console.log("There is error saving token");
							//alert('There is error saving token');
						});
					console.log(this.state.uom);
				});
			} else {
				const value = AsyncStorage.getItem("uomData");
				console.log("value is---->" + JSON.stringify(value));
				this.setState({
					uom: value,
				});
			}
		});
	}

	endEditing() {
		console.log("end edited");
		if (this.state.customerPhoneNumber.length > 0) {
			this.getUserDetails();
		} else {
			this.barcodeDBStore();
		}
	}

	handleQty = (text) => {
		this.setState({ quantity: text });
		// this.componentDidMount()
	};

	modelCreate() {
		const params = {
			mobileNumber: this.state.mobileNumber,
			altMobileNo: this.state.altMobileNo,
			name: this.state.name,
			gender: "Male",
			gstNumber: this.state.gstNumber,
			dob: "2021-06-21T18:30:00.000Z",
			anniversary: "1",
			address: this.state.address,
		};
		console.log("obj" + JSON.stringify(params));
		console.log(CreateCustomerService.createCustomer());
		axios.post(CreateCustomerService.createCustomer(), params).then((res) => {
			console.log(res);
			if (res.data.statusCode === "OK") {
				// toast.success(res.data.body);
				this.setState({
					modalVisible: false,
					mobileNumber: "",
					altMobileNo: "",
					name: "",
					gender: "Male",
					gstNumber: "",
					dob: "",
					anniversary: "",
					address: "",
				});
			} else {
			}
		});
	}

	menuAction() {
		this.props.navigation.dispatch(DrawerActions.openDrawer());
	}

	topbarAction2() {
		this.setState({
			inventoryDelete: false,
			modalVisible: false,
			inventoryBarcodeId: "",
			inventoryProductName: "",
			inventoryQuantity: "",
			inventoryMRP: "",
			inventoryDiscount: "",
			inventoryNetAmount: "",
			modalVisible: true,
			flagone: false,
			flagtwo: true,
			flagthree: false,
			flagfour: false,
		});
		//this.synccreateInventoryOfflineToOnline()
		this.getUOM();
	}

	topbarAction3() {
		this.setState({
			inventoryDelete: false,
			modalVisible: false,
			arrayData: [],
			temp: [],
			search: null,
			flagone: false,
			flagtwo: false,
			flagthree: true,
			flagfour: false,
		});
		// this.synccreateInventoryOfflineToOnline();
		this.getItems();
	}

	topbarAction4() {
		this.setState({
			flagone: false,
			flagtwo: false,
			flagthree: false,
			flagfour: true,
		});
	}

	refresh() {
		if (global.barcodeId != "something") {
			this.setState({ barcodeId: global.barcodeId });
			this.barcodeDBStore();
		}

		this.setState({
			flagone: true,
			flagtwo: false,
			flagthree: false,
			flagfour: false,
		});
	}

	allProductsrefresh() {
		console.log(global.productname);
		this.setState({ search: global.productname });
		console.log("serach text is" + this.state.search);
		search = global.productname;
		this.setState({ search }, () => {
			if ("" == search) {
				this.setState({
					arrayData: [...this.state.temp],
				});
				return;
			}
			this.state.arrayData = this.state.temp
				.filter(function (item) {
					return item.itemdesc.includes(search);
				})
				.map(function ({ itemdesc, netamount, barcode, qty, image }) {
					return { itemdesc, netamount, barcode, qty, image };
				});
		});
		this.forceUpdate();
	}

	getBarcode() {
		//if( global.barcodeId != 'something'){
		this.setState({
			inventoryBarcodeId: global.barcodeId,
			flagone: false,
			flagtwo: true,
			flagthree: false,
		});
		// }
	}

	refreshGetBarCode() {
		if (global.barcodeId != "something") {
			this.setState({ inventoryBarcodeId: global.barcodeId });
		}
	}

	navigateToGetBarCode() {
		console.log("tapped");
		global.barcodeId = "something";
		this.props.navigation.navigate("ScanBarCode", {
			isFromNewSale: false,
			isFromAddProduct: true,
			onGoBack: () => this.refreshGetBarCode(),
		});
	}

	navigateToScanCode() {
		global.barcodeId = "something";
		//this.setState({ barcodeId: global.barcodeId })
		this.props.navigation.navigate("ScanBarCode", {
			onGoBack: () => this.refresh(),
		});
	}

	// navigateToGetBarCode() {
	//   global.barcodeId = 'something'
	//   //this.setState({ barcodeId: global.barcodeId })
	//   this.props.navigation.navigate('ScanBarCode', {
	//     onGoBack: () => this.getBarcode(),
	//   });
	// }

	navigateToImageScanner() {
		//this.props.navigation.navigate('ImageScanner')
		// this.setState({ flagqtyModelOpen: true })
		// this.setState({ modalVisible: true });
	}

	updateQtyForTable = (text, index) => {
		const qtyarr = [...this.state.tableData];
		qtyarr[index].qty = text;
		this.setState({ tableData: qtyarr });
		// this.state.totalQty = (parseInt(this.state.totalQty) - parseInt(text)).toString()
		this.state.totalQty = (parseInt(this.state.totalQty) + 1).toString();
		this.state.totalAmount = (
			parseInt(this.state.totalAmount) + parseInt(qtyarr[index].netamount)
		).toString();
		this.state.totalDiscount = (
			parseInt(this.state.totalDiscount) + parseInt(qtyarr[index].promoDisc)
		).toString();
	};

	incrementForTable = (item, index) => {
		const qtyarr = [...this.state.tableData];
		var additem = parseInt(qtyarr[index].qty) + 1;
		// var priceFor1 = parseInt(item.netAmount)
		// var price = priceFor1  * additem;
		// qtyarr[index].netamount = price.toString()
		qtyarr[index].qty = additem.toString();
		this.setState({ tableData: qtyarr });

		this.state.totalQty = (parseInt(this.state.totalQty) + 1).toString();
		// var minumsValue = parseInt(this.state.totalQty) - parseInt(qtyarr[index].qty)
		//console.log('minusdd' + minumsValue)
		//this.state.totalQty = parseInt(this.state.totalQty) - parseInt(qtyarr[index].qty)
		// this.state.totalQty =  (parseInt(this.state.totalQty) + parseInt(qtyarr[index].qty)).toString()
		this.state.totalAmount = (
			parseInt(this.state.totalAmount) + parseInt(qtyarr[index].netamount)
		).toString();
		this.state.totalDiscount = (
			parseInt(this.state.totalDiscount) + parseInt(qtyarr[index].promoDisc)
		).toString();
	};

	decreamentForTable = (item, index) => {
		if (item.qty == 1) {
			return;
		}
		const qtyarr = [...this.state.tableData];
		var additem = parseInt(qtyarr[index].qty) - 1;
		qtyarr[index].qty = additem.toString();
		if (qtyarr[index].qty > 0) {
			this.setState({ tableData: qtyarr });
		}

		this.state.totalQty = (parseInt(this.state.totalQty) - 1).toString();
		//this.state.totalQty = (parseInt(this.state.totalQty) - parseInt(qtyarr[index].qty)).toString()
		this.state.totalAmount = (
			parseInt(this.state.totalAmount) - parseInt(qtyarr[index].netamount)
		).toString();
		this.state.totalDiscount = (
			parseInt(this.state.totalDiscount) - parseInt(qtyarr[index].promoDisc)
		).toString();
	};

	updateQty = (text, index) => {
		const qtyarr = [...this.state.arrayData];
		qtyarr[index].qty = text;
		this.setState({ arrayData: qtyarr });
	};

	updateQtyValue = (text, index) => {
		const qtyarr = [...this.state.arrayData];
		//qtyarr[index].qty = text;
		this.setState({ arrayData: qtyarr });
	};

	manageQunatity = (item, index) => {
		this.setState({ flagqtyModelOpen: true, modalVisible: true });
	};

	selectedQty = (item, index) => {
		console.log("-------ITEM TAPPED");
		this.setState({ flagqtyModelOpen: false, modalVisible: false });
	};

	increment = (item, index) => {
		const qtyarr = [...this.state.arrayData];
		var additem = parseInt(qtyarr[index].qty) + 1;

		// var priceFor1 = parseInt(item.netAmount)
		// var price = priceFor1  * additem;
		// qtyarr[index].netamount = price.toString()
		qtyarr[index].qty = additem.toString();
		db.transaction((txn) => {
			txn.executeSql(
				"UPDATE tbl_item set qty=? where barcode=?",
				[qtyarr[index].qty, item.barcode],
				(sqlTxn, res) => {
					console.log("updated successfully");
				},
				(error) => {
					console.log("error on search category " + error.message);
				},
			);
		});
		this.setState({ arrayData: qtyarr });
	};

	decreament = (item, index) => {
		const qtyarr = [...this.state.arrayData];
		var additem = parseInt(qtyarr[index].qty) - 1;
		qtyarr[index].qty = additem.toString();
		db.transaction((txn) => {
			txn.executeSql(
				"UPDATE tbl_item set qty=? where barcode=?",
				[qtyarr[index].qty, item.barcode],
				(sqlTxn, res) => {
					console.log("updated successfully");
				},
				(error) => {
					console.log("error on search category " + error.message);
				},
			);
		});
		this.setState({ arrayData: qtyarr });
		if (qtyarr[index].qty > 0) {
			this.setState({ arrayData: qtyarr });
		}
	};

	pickSingleWithCameraForProductsAdd(cropping, mediaType = "photo") {
		ImagePicker.openCamera({
			cropping: cropping,
			width: 500,
			height: 500,
			includeExif: true,
			mediaType,
		})
			.then((image) => {
				console.log("received image", image);
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
				this.getImageNameByScanForProductsAdd();
			})
			.catch((e) => {
				this.setState({ loading: false });
				this.setState({ flagqtyModelOpen: false, modalVisible: false });
				console.log(e);
				Alert.alert(e.message ? e.message : e);
			});
	}

	pickSingleForProductsAdd(cropit, circular = false, mediaType) {
		ImagePicker.openPicker({
			width: 500,
			height: 500,
			cropping: cropit,
			cropperCircleOverlay: circular,
			sortOrder: "none",
			compressImageMaxWidth: 1000,
			compressImageMaxHeight: 1000,
			compressImageQuality: 1,
			compressVideoPreset: "MediumQuality",
			includeExif: true,
			cropperStatusBarColor: "white",
			cropperToolbarColor: "white",
			cropperActiveWidgetColor: "white",
			cropperToolbarWidgetColor: "#3498DB",
		})
			.then((image) => {
				console.log("received image", image);
				this.setState({ flagqtyModelOpen: false });
				this.setState({ modalVisible: false });
				this.setState({
					image: {
						uri: image.path,
						width: image.width,
						height: image.height,
						mime: image.mime,
					},
					images: null,
				});
				this.getImageNameByScanForProductsAdd();
			})
			.catch((e) => {
				this.setState({ loading: false });
				this.setState({ flagqtyModelOpen: false, modalVisible: false });
				console.log(e);
				Alert.alert(e.message ? e.message : e);
			});
	}

	pickSingleWithCamera(cropping, mediaType = "photo") {
		ImagePicker.openCamera({
			cropping: cropping,
			width: 500,
			height: 500,
			includeExif: true,
			mediaType,
		})
			.then((image) => {
				console.log("received image", image);
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
			sortOrder: "none",
			compressImageMaxWidth: 1000,
			compressImageMaxHeight: 1000,
			compressImageQuality: 1,
			compressVideoPreset: "MediumQuality",
			includeExif: true,
			cropperStatusBarColor: "white",
			cropperToolbarColor: "white",
			cropperActiveWidgetColor: "white",
			cropperToolbarWidgetColor: "#3498DB",
		})
			.then((image) => {
				console.log("received image", image);
				this.setState({
					image: {
						flagqtyModelOpen: false,
						modalVisible: false,
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

	imageAction() {
		// console.log('tapped')
		// this.setState({ flagqtyModelOpen: true })
		// this.setState({ modalVisible: true });
	}

	cancel() {
		console.log("clicked");
		this.setState({
			flagCustomerOpen: false,
			flagqtyModelOpen: false,
			modalVisible: false,
		});
	}

	async getImageNameByScanForProductsAdd() {
		const formData = new FormData();
		formData.append("image", {
			uri: this.state.image.uri,
			name: this.state.image.mime,
			type: this.state.image.mime,
		});
		axios({
			url: NewSaleService.getImageScanning(),
			method: "POST",
			data: formData,
			headers: {
				Accept: "application/json",
				"Content-Type": "multipart/form-data",
			},
		})
			.then((response) => {
				//const productname = response.data.result[0].name
				if (response.data) {
					console.log("response :", response.data.result[0].name);
					this.setState({ inventoryProductName: response.data.result[0].name });
					this.forceUpdate();
				}
			})
			.catch(function (error) {
				this.setState({ loading: false });
				console.log(error);
				alert(error);
			});
	}

	getImageNameByScan() {
		const formData = new FormData();
		formData.append("image", {
			uri: this.state.image.uri,
			name: this.state.image.mime,
			type: this.state.image.mime,
		});
		axios({
			url: NewSaleService.getImageScanning(),
			method: "POST",
			data: formData,
			headers: {
				Accept: "application/json",
				"Content-Type": "multipart/form-data",
			},
		})
			.then((response) => {
				if (response.data) {
					console.log("response :", response.data.result[0].name);
					console.log("response :", global.productname);
					// this.setState({ inventoryProductName: response.data.result[0].name})
					// if (global.productname == "something") {
					{
						RNBeep.beep();
					}
					global.productname = response.data.result[0].name;
					this.allProductsrefresh();
					//    }
				}
			})
			.catch(function (error) {
				this.setState({ loading: false });
				console.log(error);
				alert(error);
			});
	}

	deleteInventory = (item, index) => {
		console.log("barcode id is" + item.barcode);
		axios
			.delete(InventoryService.deleteBarcode(), {
				params: {
					//barcodeId=1811759398
					barcodeId: item.barcode,
				},
			})
			.then((res) => {
				if (res.data && res.data["isSuccess"] === "true") {
					const list = this.state.arrayData;
					list.splice(index, 1);
					this.setState({
						arrayData: list,
						inventoryDelete: false,
						modalVisible: false,
					});
				} else {
					alert("Issue in delete barcode and having" + res.data["error"]);
				}
			});
	};

	handledeleteaction = (item, index) => {
		this.setState({ inventoryDelete: true, modalVisible: true });
	};

	deleteLineItem = (item, index) => {
		this.setState({ lineItemDelete: false, modalVisible: false });
		const list = this.state.tableData;
		list.splice(index, 1);
		this.setState({ tableData: list });
		if (this.state.tableData.length == 0) {
			this.setState({ totalQty: 0, totalAmount: 0, totalDiscount: 0 });
			return;
		}
		this.state.totalQty = (parseInt(this.state.totalQty) - item.qty).toString();
		this.state.totalAmount = (
			parseInt(this.state.totalAmount) - parseInt(item.netamount)
		).toString();
		if (item.promoDisc === null) {
			this.state.totalDiscount = (
				parseInt(this.state.totalDiscount) - 0
			).toString();
		} else {
			this.state.totalDiscount = (
				parseInt(this.state.totalDiscount) - parseInt(item.promoDisc)
			).toString();
		}
	};

	handlenewsaledeleteaction = (item, index) => {
		this.setState({ lineItemDelete: true, modalVisible: true });
	};

	handleeditaction = (item, index) => {
		// productItemId:0,
		// barcodeId:0,
		// productname:"",
		// produtctQty:0,
		// productuom:"",
		// productmrp:0,
		// productofferprice:0,
		this.props.navigation.navigate("ProductEdit", {
			productItemId: item.productItemId,
			barcodeId: parseInt(item.barcode),
			productname: item.itemdesc,
			produtctQty: parseInt(item.qty),
			productuom: item.productuom,
			productmrp: String(item.netamount),
			productofferprice: String(item.promoDisc),
			onGoBack: () => this.refreshProductsAfterEdit(),
		});
	};

	refreshProductsAfterEdit() {
		this.barcodeDBStore();
		// this.setState({ flagone: false })
		// this.setState({ flagtwo: false })
		// this.setState({ flagthree: true })
	}

	onEndReached() {
		this.listRef.scrollToOffset({ offset: 0, animated: true });
	}

	handleUOM = (value) => {
		this.setState({ store: value });
	};

	tagCustomer() {
		this.setState({
			customerEmail: "",
			customerPhoneNumber: "",
			customerName: "",
			customerGender: "",
			customerAddress: "",
			customerGSTNumber: "",
			flagCustomerOpen: true,
			mocalVisible: true,
		});
	}

	render() {
		console.log(global.barcodeId);
		AsyncStorage.getItem("tokenkey")
			.then((value) => {
				console.log(value);
			})
			.catch(() => {
				this.setState({ loading: false });
				console.log("There is error getting token");
				// alert('There is error getting token');
			});
		const state = this.state;

		const element = (data, index) => (
			<TextInput
				style={styles.btn}
				underlineColorAndroid="transparent"
				placeholder=""
				placeholderTextColor="#48596B"
				color="#48596B"
				ref={index}
				textAlign={"center"}
				textAlignVertical="center"
				value={this.state.quantity}
				autoCapitalize="none"
				onChangeText={this.handleQty}
			/>
		);

		return (
			<View style={{ flex: 1 }}>
				{/* <View style={styles.container}> */}
				{/* <SafeAreaView> */}
				<View
					style={
						Device.isTablet
							? styles.viewsWidth_tablet
							: styles.viewsWidth_mobile
					}
				>
					<TouchableOpacity
						style={
							Device.isTablet
								? styles.menuButton_tablet
								: styles.menuButton_mobile
						}
						onPress={() => this.handleMenuButtonClick()}
					>
						<Image source={require("../assets/images/menu.png")} />
					</TouchableOpacity>
					<Text
						style={
							Device.isTablet
								? styles.headerTitle_tablet
								: styles.headerTitle_mobile
						}
					>
						{" "}
						{I18n.t("Billing Portal")}{" "}
					</Text>
					<TouchableOpacity
						style={
							Device.isTablet
								? styles.navButton_tablet
								: styles.navButton_mobile
						}
						onPress={() => this.navigateToScanCode()}
					>
						<Text
							style={
								Device.isTablet
									? styles.navButtonText_tablet
									: styles.navButtonText_mobile
							}
						>
							{" "}
							{"NEW SALE SCAN"}{" "}
						</Text>
					</TouchableOpacity>
				</View>

				{/* <View style={styles.Topcontainer}>
          <TouchableOpacity style={{
            borderColor: '#ED1C24',
            height: 50,
            width: "33.3%",
            borderBottomLeftRadius: 5,
            borderTopLeftRadius: 5,
            borderLeftWidth: 1,
            borderTopWidth: 1,
            borderBottomWidth: 1,
            backgroundColor: this.state.flagone ? "#ED1C24" : "#FFFFFF",
            alignSelf: "flex-start",
            // //marginHorizontal: "1%",
            // marginBottom: 6,

          }}
            onPress={() => this.topbarAction1()} >
            <View style={{
              //   borderColor: '#ED1C24',
              //   height: 50,
              //   width: "33.3%",
              //   borderBottomLeftRadius: 5,
              //   borderTopLeftRadius: 5,
              //   borderLeftWidth: 1,
              //   borderTopWidth: 1,
              //   borderBottomWidth: 1,
              //  backgroundColor: this.state.flagone ?  "#ED1C24" : "#FFFFFF",
              //  alignSelf: "flex-start",
              //  // //marginHorizontal: "1%",
              //  // marginBottom: 6,
            }}>

              <Text style={{
                // borderColor: '#ED1C24',
                height: 28,
                width: 100,
                //   borderBottomLeftRadius: 5,
                //  borderTopLeftRadius: 5,
                //   borderBottomWidth: 1,
                //   borderTopWidth: 1,
                //   borderRightWidth: 1,
                color: this.state.flagone ? "#FFFFFF" : "#ED1C24",
                marginTop: 10,
                fontFamily: "regular",
                fontSize: 14,
                textAlign: 'center',
                alignItems: 'center',
              }}> NEW SALE </Text>


              <Image source={this.state.flagone ? require('../assets/images/topSelect.png') : null} style={{
                left: 30, marginTop: 5,
              }} />

            </View>
          </TouchableOpacity>
          <TouchableOpacity style={{
            borderColor: '#ED1C24',
            height: 50,
            width: "33.3%",
            //  borderBottomLeftRadius: 5,
            //  borderTopLeftRadius: 5,
            borderLeftWidth: 1,
            borderTopWidth: 1,
            borderBottomWidth: 1,
            backgroundColor: this.state.flagtwo ? "#ED1C24" : "#FFFFFF",
            alignSelf: "flex-start",
          }}
            onPress={() => this.topbarAction2()} >
            <View style={{
              //   borderColor: '#ED1C24',
              //   height: 50,
              //   width: "33.3%",
              //   borderBottomLeftRadius: 5,
              //   borderTopLeftRadius: 5,
              //   borderBottomWidth: 1,
              //   borderTopWidth: 1,
              //   borderLeftWidth: 1,
              //  backgroundColor: this.state.flagone ?  "#ED1C24" : "#FFFFFF",
              //  alignSelf: "flex-start",
              //  // //marginHorizontal: "1%",
              //  // marginBottom: 6,
              //   width: "33.3%",
              //  // height: 50,
            }}>

              <Text style={{
                borderColor: '#ED1C24',
                height: 28,
                width: 100,
                color: this.state.flagtwo ? "#FFFFFF" : "#ED1C24",
                marginTop: 10,
                fontFamily: "regular",
                fontSize: 14, textAlign: 'center', width: 100,

              }}> ADD Product </Text>
              <Image source={this.state.flagtwo ? require('../assets/images/topSelect.png') : null} style={{
                left: 30, marginTop: 5,
              }} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={{
            borderColor: '#ED1C24',
            height: 50,
            width: "33.3%",
            borderBottomRightRadius: 5,
            borderTopRightRadius: 5,
            borderRightWidth: 1,
            borderLeftWidth: 1,
            borderTopWidth: 1,
            borderBottomWidth: 1,
            backgroundColor: this.state.flagthree ? "#ED1C24" : "#FFFFFF",
            alignSelf: "flex-start",
          }}
            onPress={() => this.topbarAction3()} >
            <View style={{
              // backgroundColor: this.state.flagthree ? "#1CA2FF" : "#ED1C24",
              // alignSelf: "flex-start",
              // //marginHorizontal: "1%",
              // marginBottom: 6,
              // width: "33.3%",
              // height: 50,
              // textAlign: "center",
            }}>

              <Text style={{
                borderColor: '#ED1C24',
                height: 28,
                width: 100,
                color: this.state.flagthree ? "#FFFFFF" : "#ED1C24",
                marginTop: 10,
                fontFamily: "regular",
                fontSize: 14, textAlign: 'center', width: 100,
              }}> FIND ITEM  </Text>
              <Image source={this.state.flagthree ? require('../assets/images/topSelect.png') : null} style={{
                left: 30, marginTop: 5,
              }} />
            </View>
          </TouchableOpacity>
        </View> */}

				<ScrollView>
					<View style={styles.previlagecontainer}>
						<FlatList
							style={styles.flatList}
							horizontal
							data={this.state.privilages}
							showsVerticalScrollIndicator={false}
							showsHorizontalScrollIndicator={false}
							renderItem={({ item, index }) => (
								<TouchableOpacity
									style={{
										height: 36,
										width: 200,
										borderWidth: 1,
										backgroundColor: item.bool ? "#ED1C24" : "#FFFFFF",
										borderColor: item.bool ? "#ED1C24" : "#858585",
										borderRadius: 5,
										marginLeft: 10,
									}}
									onPress={() => this.topbarAction1(item, index)}
								>
									<Text
										style={{
											fontSize: 16,
											alignItems: "center",
											alignSelf: "center",
											marginTop: 5,
											color: item.bool ? "#FFFFFF" : "#858585",
											fontFamily: "regular",
										}}
									>
										{item.name}
									</Text>
								</TouchableOpacity>
							)}
							ListFooterComponent={<View style={{ width: 15 }}></View>}
						/>

						{this.state.flagone && (
							<ScrollView>
								<View
									style={{
										flex: 1,
										paddingHorizontal: 0,
										paddingVertical: 0,
										marginTop: 10,
									}}
								>
									<View>
										<TextInput
											style={
												Device.isTablet
													? styles.input_tablet
													: styles.input_mobile
											}
											underlineColorAndroid="transparent"
											placeholder="Enter Barcode"
											placeholderTextColor="#6F6F6F60"
											textAlignVertical="center"
											keyboardType={"default"}
											autoCapitalize="none"
											// onEndEditing
											onChangeText={(text) => this.handleBarCode(text)}
											onEndEditing={() => this.endEditing()}
										/>

										<TouchableOpacity
											style={
												Device.isTablet
													? styles.tagCustomerButton_tablet
													: styles.tagCustomerButton_mobile
											}
											onPress={() => this.tagCustomer()}
										>
											<Text
												style={
													Device.isTablet
														? styles.tagCustomerButtonText_tablet
														: styles.tagCustomerButtonText_mobile
												}
											>
												{" "}
												{"Tag Customer"}{" "}
											</Text>
										</TouchableOpacity>
									</View>
									<FlatList
										//  ListHeaderComponent={this.renderHeader}
										data={this.state.tableData}
										keyExtractor={(item) => item.email}
										contentContainerStyle={{ paddingBottom: 200 }}
										onEndReached={this.onEndReached.bind(this)}
										scrollEnabled={false}
										ref={(ref) => {
											this.listRef = ref;
										}}
										renderItem={({ item, index }) => (
											<View
												style={{
													height: 120,
													backgroundColor: "#FFFFFF",
													borderBottomWidth: 5,
													borderBottomColor: "#FBFBFB",
													flexDirection: "row",
													justifyContent: "space-between",
													alignItems: "center",
												}}
											>
												<View style={{ flexDirection: "column", height: 120 }}>
													<Image
														source={require("../assets/images/default.jpeg")}
														//source={{ uri: item.image }}
														style={{
															position: "absolute",
															left: 20,
															top: 15,
															width: 90,
															height: 90,
														}}
													/>
													<Text
														style={{
															fontSize: 16,
															marginTop: 10,
															marginLeft: 130,
															fontFamily: "medium",
															color: "#353C40",
														}}
													>
														{item.itemdesc}
													</Text>
													<Text
														style={{
															fontSize: 12,
															marginLeft: 130,
															marginTop: 6,
															fontFamily: "regular",
															color: "#808080",
														}}
													>
														QUANTITY:
													</Text>
													<Text
														style={{
															fontSize: 12,
															marginLeft: 195,
															marginTop: -16,
															fontFamily: "medium",
															color: "#353C40",
														}}
													>
														{item.qty} {item.productuom}
													</Text>
													<Text
														style={{
															fontSize: 12,
															marginLeft: 130,
															marginTop: 6,
															fontFamily: "regular",
															color: "#808080",
														}}
													>
														PRICE/EACH:
													</Text>
													<Text
														style={{
															fontSize: 12,
															marginLeft: 205,
															marginTop: -15,
															fontFamily: "medium",
															color: "#ED1C24",
														}}
													>
														₹ {parseInt(item.netamount).toString()}
													</Text>
													<Text
														style={{
															fontSize: 12,
															marginLeft: 245,
															marginTop: -15,
															fontFamily: "regular",
															color: "#808080",
															textDecorationLine: "line-through",
														}}
													>
														Rs. 100
													</Text>
													<Text
														style={{
															fontSize: 12,
															marginLeft: 130,
															marginTop: 6,
															fontFamily: "regular",
															color: "#808080",
														}}
													>
														TOTAL:
													</Text>
													<Text
														style={{
															fontSize: 12,
															marginLeft: 172,
															marginTop: -15,
															fontFamily: "medium",
															color: "#ED1C24",
														}}
													>
														₹ {(parseInt(item.netamount) * item.qty).toString()}
													</Text>
												</View>

												<View
													style={{
														flexDirection: "row",
														justifyContent: "space-around",
														alignItems: "center",
														height: 30,
														marginRight: 20,
														width: 90,
														//borderWidth:1,
														//borderColor:'#ED1C24',
														// borderRadius:3,
													}}
												>
													<TouchableOpacity
														style={{
															borderColor: "#ED1C24",
															height: 28,
															width: 30,
															borderBottomLeftRadius: 3,
															borderTopLeftRadius: 3,
															borderBottomWidth: 1,
															borderTopWidth: 1,
															borderLeftWidth: 1,
															paddingLeft: 10,
															marginLeft: 20,
														}}
													>
														<Text
															style={{
																alignSelf: "center",
																marginTop: 2,
																marginLeft: -10,
																color: "#ED1C24",
															}}
															onPress={() =>
																this.decreamentForTable(item, index)
															}
														>
															-
														</Text>
													</TouchableOpacity>
													{/* <Text> {item.qty}</Text> */}
													<TextInput
														style={{
															justifyContent: "center",
															margin: 20,
															height: 28,
															width: 30,
															marginTop: 10,
															marginBottom: 10,
															borderColor: "#ED1C24",
															backgroundColor: "white",
															color: "#353C40",
															borderWidth: 1,
															fontFamily: "regular",
															fontSize: 12,
															paddingLeft: 9,
														}}
														underlineColorAndroid="transparent"
														placeholder="0"
														placeholderTextColor="#8F9EB7"
														value={item.qty}
														onChangeText={(text) => this.updateQty(text, index)}
													/>
													<TouchableOpacity
														style={{
															borderColor: "#ED1C24",
															height: 28,
															width: 30,
															borderBottomRightRadius: 3,
															borderTopRightRadius: 3,
															borderBottomWidth: 1,
															borderTopWidth: 1,
															borderRightWidth: 1,
														}}
													>
														<Text
															style={{
																alignSelf: "center",
																marginTop: 2,
																color: "#ED1C24",
															}}
															onPress={() =>
																this.incrementForTable(item, index)
															}
														>
															+
														</Text>
													</TouchableOpacity>

													<TouchableOpacity
														style={{
															position: "absolute",
															right: 20,
															top: -35,
															width: 30,
															height: 30,
															borderRadius: 5,
															// borderTopRightRadius: 5,
															borderWidth: 1,
															borderColor: "lightgray",
														}}
														onPress={() =>
															this.handlenewsaledeleteaction(item, index)
														}
													>
														<Image
															style={{
																alignSelf: "center",
																top: 5,
																height: Device.isTablet ? 30 : 20,
																width: Device.isTablet ? 30 : 20,
															}}
															source={require("../assets/images/delete.png")}
														/>
													</TouchableOpacity>
												</View>

												{this.state.lineItemDelete && (
													<View>
														<Modal isVisible={this.state.modalVisible}>
															<View
																style={[
																	Device.isTablet
																		? styles.filterMainContainer_tablet
																		: styles.filterMainContainer_mobile,
																	{ height: Device.isTablet ? 400 : 300 },
																]}
															>
																<View>
																	<View
																		style={{
																			flexDirection: "row",
																			justifyContent: "space-between",
																			marginTop: 5,
																			height: Device.isTablet ? 60 : 50,
																		}}
																	>
																		<View>
																			<Text
																				style={{
																					marginTop: 15,
																					fontSize: Device.isTablet ? 22 : 17,
																					marginLeft: 20,
																				}}
																			>
																				{" "}
																				Delete Item{" "}
																			</Text>
																		</View>
																		<View>
																			<TouchableOpacity
																				style={{
																					width: Device.isTablet ? 60 : 50,
																					height: Device.isTablet ? 60 : 50,
																					marginTop: Device.isTablet ? 20 : 15,
																					marginRight: Device.isTablet ? 0 : 15,
																				}}
																				onPress={() => this.modelCancel()}
																			>
																				<Image
																					style={{ margin: 5 }}
																					source={require("../assets/images/modelcancel.png")}
																				/>
																			</TouchableOpacity>
																		</View>
																	</View>
																	<Text
																		style={{
																			height: Device.isTablet ? 2 : 1,
																			width: deviceWidth,
																			backgroundColor: "lightgray",
																		}}
																	></Text>
																</View>

																<Text
																	style={{
																		textAlign: "center",
																		fontFamily: "regular",
																		fontSize: 18,
																		color: "#353C40",
																	}}
																>
																	{" "}
																	Are you sure want to delete NewSale Item?{" "}
																</Text>
																<TouchableOpacity
																	style={{
																		width: deviceWidth - 40,
																		marginLeft: 20,
																		marginRight: 20,
																		marginTop: 60,
																		height: 50,
																		backgroundColor: "#ED1C24",
																		borderRadius: 5,
																	}}
																	onPress={() =>
																		this.deleteLineItem(item, index)
																	}
																>
																	<Text
																		style={{
																			textAlign: "center",
																			marginTop: 20,
																			color: "#ffffff",
																			fontSize: 15,
																			fontFamily: "regular",
																		}}
																	>
																		{" "}
																		DELETE{" "}
																	</Text>
																</TouchableOpacity>

																<TouchableOpacity
																	style={{
																		width: deviceWidth - 40,
																		marginLeft: 20,
																		marginRight: 20,
																		marginTop: 20,
																		height: 50,
																		backgroundColor: "#ffffff",
																		borderRadius: 5,
																		borderWidth: 1,
																		borderColor: "#353C4050",
																	}}
																	onPress={() => this.modelCancel()}
																>
																	<Text
																		style={{
																			textAlign: "center",
																			marginTop: 20,
																			color: "#353C4050",
																			fontSize: 15,
																			fontFamily: "regular",
																		}}
																	>
																		{" "}
																		CANCEL{" "}
																	</Text>
																</TouchableOpacity>
															</View>
														</Modal>
													</View>
												)}
											</View>
										)}
									/>
									{this.state.tableData.length != 0 && (
										<View
											style={{
												width: deviceWidth,
												height: 220,
												position: "absolute",
												bottom: 0,
												backgroundColor: "#FFFFFF",
											}}
										>
											<Text
												style={{
													color: "#353C40",
													fontFamily: "medium",
													alignItems: "center",
													marginLeft: 16,
													top: 30,
													justifyContent: "center",
													textAlign: "center",
													marginTop: 10,
													fontSize: 14,
													position: "absolute",
												}}
											>
												Total Qty{" "}
											</Text>
											<Text
												style={{
													color: "#353C40",
													fontFamily: "medium",
													alignItems: "center",
													marginLeft: 16,
													top: 30,
													position: "absolute",
													right: 10,
													justifyContent: "center",
													textAlign: "center",
													marginTop: 10,
													fontSize: 14,
													position: "absolute",
												}}
											>
												{this.state.totalQty}{" "}
											</Text>
											<Text
												style={{
													color: "#353C40",
													fontFamily: "medium",
													alignItems: "center",
													marginLeft: 16,
													top: 60,
													justifyContent: "center",
													textAlign: "center",
													marginTop: 10,
													fontSize: 14,
													position: "absolute",
												}}
											>
												Total MRP{" "}
											</Text>
											<Text
												style={{
													color: "#353C40",
													fontFamily: "medium",
													alignItems: "center",
													marginLeft: 16,
													top: 60,
													position: "absolute",
													right: 10,
													justifyContent: "center",
													textAlign: "center",
													marginTop: 10,
													fontSize: 14,
													position: "absolute",
												}}
											>
												₹ {this.state.totalAmount}{" "}
											</Text>
											<Text
												style={{
													color: "#353C40",
													fontFamily: "medium",
													alignItems: "center",
													marginLeft: 16,
													top: 90,
													justifyContent: "center",
													textAlign: "center",
													marginTop: 10,
													fontSize: 14,
													position: "absolute",
												}}
											>
												Promo Discount{" "}
											</Text>
											<Text
												style={{
													color: "#353C40",
													fontFamily: "medium",
													alignItems: "center",
													marginLeft: 16,
													top: 90,
													position: "absolute",
													right: 10,
													justifyContent: "center",
													textAlign: "center",
													marginTop: 10,
													fontSize: 14,
													position: "absolute",
												}}
											>
												₹ {this.state.totalDiscount}{" "}
											</Text>
											<Text
												style={{
													color: "#353C40",
													fontFamily: "bold",
													alignItems: "center",
													marginLeft: 16,
													top: 120,
													fontSize: 20,
													justifyContent: "center",
													textAlign: "center",
													marginTop: 10,
													fontSize: 14,
													position: "absolute",
												}}
											>
												Payable Amount{" "}
											</Text>
											<Text
												style={{
													color: "#353C40",
													fontFamily: "bold",
													alignItems: "center",
													marginLeft: 16,
													top: 120,
													fontSize: 20,
													position: "absolute",
													right: 10,
													justifyContent: "center",
													textAlign: "center",
													marginTop: 10,
													fontSize: 14,
													position: "absolute",
												}}
											>
												₹{" "}
												{(
													parseInt(this.state.totalAmount) -
													parseInt(this.state.totalDiscount)
												).toString()}{" "}
											</Text>

											{/* <Text style={{
                    color: "#353C40", fontFamily: "bold", alignItems: 'center', marginLeft: 16, top: 150, fontSize: 20, justifyContent: 'center', textAlign: 'center', marginTop: 10,
                    fontSize: 14, position: 'absolute',
                  }}>
                    Customer Name </Text>
                  <Text style={{
                    color: "#353C40", fontFamily: "bold", alignItems: 'center', marginLeft: 16, top: 150, fontSize: 20, position: 'absolute', right: 10, justifyContent: 'center', textAlign: 'center', marginTop: 10,
                    fontSize: 14, position: 'absolute',
                  }}>
                    - </Text>
                    <Text style={{
                    color: "#353C40", fontFamily: "bold", alignItems: 'center', marginLeft: 16, top: 150, fontSize: 20, justifyContent: 'center', textAlign: 'center', marginTop: 10,
                    fontSize: 14, position: 'absolute',
                  }}>
                    Customer Mobile Number </Text>
                  <Text style={{
                    color: "#353C40", fontFamily: "bold", alignItems: 'center', marginLeft: 16, top: 150, fontSize: 20, position: 'absolute', right: 10, justifyContent: 'center', textAlign: 'center', marginTop: 10,
                    fontSize: 14, position: 'absolute',
                  }}>
                    - </Text> */}

											<View style={styles.TopcontainerforPay}>
												<TouchableOpacity
													style={styles.signInButton}
													onPress={() => this.pay()}
												>
													<Text style={styles.signInButtonText}>
														{" "}
														Check out{" "}
													</Text>
												</TouchableOpacity>
											</View>
										</View>
									)}
								</View>
							</ScrollView>
						)}

						{this.state.flagCustomerOpen && (
							<View>
								<Modal isVisible={this.state.modalVisible}>
									<KeyboardAwareScrollView
										KeyboardAwareScrollView
										enableOnAndroid={true}
									>
										<View
											style={{
												flex: 1,
												justifyContent: "center", //Centered horizontally
												alignItems: "center",
												color: "#ffffff",
												borderRadius: 20,
												borderwidth: 10,
											}}
										>
											<View
												style={{
													flex: 1,
													marginLeft: 20,
													marginRight: 20,
													backgroundColor: "#ffffff",
													marginTop: deviceWidth / 2 - 80,
												}}
											>
												<Text
													style={{
														color: "#353C40",
														fontSize: 18,
														fontFamily: "semibold",
														marginLeft: 20,
														marginTop: 20,
														height: 20,
														justifyContent: "center",
													}}
												>
													{" "}
													{"Personal Information"}{" "}
												</Text>

												<View style={{ marginTop: 0, width: deviceWidth }}>
													<TextInput
														style={styles.createUserinput}
														underlineColorAndroid="transparent"
														placeholder="MOBILE NUMBER *"
														placeholderTextColor="#353C4050"
														keyboardType="name-phone-pad"
														textAlignVertical="center"
														autoCapitalize="none"
														value={this.state.customerPhoneNumber}
														onChangeText={(text) =>
															this.handleCustomerPhoneNumber(text)
														}
														onEndEditing={() => this.endEditing()}
													/>
												</View>

												<TextInput
													style={styles.createUserinput}
													underlineColorAndroid="transparent"
													placeholder="CUSTOMER NAME *"
													placeholderTextColor="#353C4050"
													textAlignVertical="center"
													autoCapitalize="none"
													value={this.state.customerName}
													onChangeText={this.handleCustomerName}
												/>

												<View>
													<TextInput
														style={styles.createUserinput}
														underlineColorAndroid="transparent"
														placeholder="EMAIL"
														placeholderTextColor="#353C4050"
														textAlignVertical="center"
														autoCapitalize="none"
														value={this.state.customerEmail}
														onChangeText={this.handleCustomerEmail}
													/>
												</View>

												<View
													style={{
														justifyContent: "center",
														margin: 40,
														height: 44,
														marginTop: 5,
														marginBottom: 10,
														borderColor: "#8F9EB717",
														borderRadius: 3,
														backgroundColor: "#FBFBFB",
														borderWidth: 1,
														fontFamily: "regular",
														paddingLeft: 15,
														fontSize: 14,
													}}
												>
													<RNPickerSelect
														placeholder={{
															label: "GENDER",
															value: "",
														}}
														Icon={() => {
															return (
																<Chevron
																	style={styles.imagealign}
																	size={1.5}
																	color="gray"
																/>
															);
														}}
														items={[
															{ label: "Male", value: "male" },
															{ label: "Female", value: "female" },
														]}
														onValueChange={this.handlecustomerGender}
														style={
															DEvice.isTablet
																? pickerSelectStyles_tablet
																: pickerSelectStyles_mobile
														}
														value={this.state.customerGender}
														useNativeAndroidPickerStyle={false}
													/>
												</View>

												<TextInput
													style={styles.createUserinput}
													underlineColorAndroid="transparent"
													placeholder="ADDRESS"
													placeholderTextColor="#353C4050"
													textAlignVertical="center"
													autoCapitalize="none"
													value={this.state.customerAddress}
													onChangeText={this.handleCustomerAddress}
												/>

												<Text
													style={{
														color: "#353C40",
														fontSize: 18,
														fontFamily: "semibold",
														marginLeft: 20,
														marginTop: 20,
														height: 20,
														justifyContent: "center",
													}}
												>
													{" "}
													{"Business Information(optional)"}{" "}
												</Text>

												<View>
													<TextInput
														style={styles.createUserinput}
														underlineColorAndroid="transparent"
														placeholder="GST NUMBER"
														placeholderTextColor="#353C4050"
														textAlignVertical="center"
														autoCapitalize="none"
														value={this.state.customerGSTNumber}
														onChangeText={this.handleCustomerGSTNumber}
													/>
												</View>

												<TouchableOpacity
													style={{
														margin: 20,
														height: 50,
														backgroundColor: "#ED1C24",
														borderRadius: 5,
														marginLeft: 40,
														marginRight: 40,
													}}
													onPress={() => this.addCustomer()}
												>
													<Text
														style={{
															textAlign: "center",
															margin: 20,
															color: "#ffffff",
															fontSize: 15,
															fontFamily: "regular",
															height: 50,
														}}
													>
														{" "}
														TAG/ADD CUSTOMER{" "}
													</Text>
												</TouchableOpacity>

												<TouchableOpacity
													style={{
														margin: 20,
														height: 50,
														backgroundColor: "#ED1C24",
														borderRadius: 5,
														marginLeft: 40,
														marginRight: 40,
													}}
													onPress={() => this.cancel()}
												>
													<Text
														style={{
															textAlign: "center",
															margin: 20,
															color: "#ffffff",
															fontSize: 15,
															fontFamily: "regular",
															height: 50,
														}}
													>
														{" "}
														{"Cancel"}{" "}
													</Text>
												</TouchableOpacity>
											</View>
										</View>
									</KeyboardAwareScrollView>
								</Modal>
							</View>
						)}
					</View>
				</ScrollView>
			</View>
		);
	}
}
export default NewSaleRetail;

const pickerSelectStyles_mobile = StyleSheet.create({
	placeholder: {
		color: "#6F6F6F",
		fontFamily: "regular",
		fontSize: 15,
	},
	inputIOS: {
		justifyContent: "center",
		height: 42,
		borderRadius: 3,
		borderWidth: 1,
		fontFamily: "regular",
		//paddingLeft: -20,
		fontSize: 15,
		borderColor: "#FBFBFB",
		backgroundColor: "#FBFBFB",
	},
	inputAndroid: {
		justifyContent: "center",
		height: 42,
		borderRadius: 3,
		borderWidth: 1,
		fontFamily: "regular",
		//paddingLeft: -20,
		fontSize: 15,
		borderColor: "#FBFBFB",
		backgroundColor: "#FBFBFB",
		color: "#001B4A",

		// marginLeft: 20,
		// marginRight: 20,
		// marginTop: 10,
		// height: 40,
		// backgroundColor: '#ffffff',
		// borderBottomColor: '#456CAF55',
		// color: '#001B4A',
		// fontFamily: "bold",
		// fontSize: 16,
		// borderRadius: 3,
	},
});

const pickerSelectStyles_tablet = StyleSheet.create({
	placeholder: {
		color: "#6F6F6F",
		fontFamily: "regular",
		fontSize: 20,
	},
	inputIOS: {
		justifyContent: "center",
		height: 52,
		borderRadius: 3,
		borderWidth: 1,
		fontFamily: "regular",
		//paddingLeft: -20,
		fontSize: 20,
		borderColor: "#FBFBFB",
		backgroundColor: "#FBFBFB",
	},
	inputAndroid: {
		justifyContent: "center",
		height: 52,
		borderRadius: 3,
		borderWidth: 1,
		fontFamily: "regular",
		//paddingLeft: -20,
		fontSize: 20,
		borderColor: "#FBFBFB",
		backgroundColor: "#FBFBFB",
		color: "#001B4A",

		// marginLeft: 20,
		// marginRight: 20,
		// marginTop: 10,
		// height: 40,
		// backgroundColor: '#ffffff',
		// borderBottomColor: '#456CAF55',
		// color: '#001B4A',
		// fontFamily: "bold",
		// fontSize: 16,
		// borderRadius: 3,
	},
});

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		justifyContent: "center",
		backgroundColor: "#FAFAFF",
	},
	viewswidth: {
		backgroundColor: "#FFFFFF",
		width: deviceWidth,
		textAlign: "center",
		fontSize: 24,
		height: 84,
	},
	input: {
		justifyContent: "center",
		marginLeft: 20,
		marginRight: 100,
		height: 44,
		marginTop: 5,
		marginBottom: 10,
		borderColor: "#8F9EB717",
		borderRadius: 3,
		backgroundColor: "#FBFBFB",
		borderWidth: 1,
		fontFamily: "regular",
		paddingLeft: 15,
		fontSize: 14,
	},
	phoneinput: {
		justifyContent: "center",
		margin: 20,
		height: 44,
		marginTop: 5,
		marginBottom: 10,
		borderColor: "#8F9EB717",
		borderRadius: 3,
		backgroundColor: "#FBFBFB",
		borderWidth: 1,
		fontFamily: "regular",
		paddingLeft: 15,
		fontSize: 14,
	},
	createUserinput: {
		justifyContent: "center",
		margin: 40,
		height: 44,
		marginTop: 5,
		marginBottom: 10,
		borderColor: "#8F9EB717",
		borderRadius: 3,
		backgroundColor: "#FBFBFB",
		borderWidth: 1,
		fontFamily: "regular",
		paddingLeft: 15,
		fontSize: 14,
	},
	signInButton: {
		backgroundColor: "#ED1C24",
		justifyContent: "center",
		width: "95%",
		marginLeft: 10,
		height: 40,
		borderRadius: 10,
		fontWeight: "bold",
		margin: 5,
		// alignSelf:'center',
		// marginBottom:100,
	},
	qty: {
		backgroundColor: "#ED1C24",
		justifyContent: "center",
		width: "18%",
		marginTop: 10,
		height: 40,
		margin: 5,
		borderRadius: 5,
		fontWeight: "bold",
	},
	imagealign: {
		marginTop: 16,
		marginRight: 20,
	},
	itemscount: {
		backgroundColor: "#ED1C24",
		justifyContent: "center",
		width: "18%",
		marginLeft: 0,
		marginTop: 10,
		height: 40,
		borderRadius: 5,
		fontWeight: "bold",
		margin: 5,
		// alignSelf:'center',
		// marginBottom:100,
	},
	itemDetail: {
		backgroundColor: "#ffffff",

		width: "60%",
		marginLeft: 0,
		marginTop: 10,
		height: 40,
		borderRadius: 5,
		fontWeight: "bold",
		margin: 5,
		// alignSelf:'center',
		// marginBottom:100,
	},
	signInButtonRight: {
		backgroundColor: "#ED1C24",
		justifyContent: "center",
		width: "46%",
		marginRight: 10,
		marginTop: 10,
		height: 40,
		borderRadius: 10,
		fontWeight: "bold",
		margin: 5,
		// alignSelf:'center',
		// marginBottom:100,
	},
	signInButtonText: {
		color: "white",
		alignSelf: "center",
		fontSize: 14,
		fontFamily: "regular",
	},
	signInFieldStyle: {
		color: "black",
		marginLeft: 20,
		marginTop: 5,
		fontSize: 18,
		fontFamily: "regular",
		textAlign: "left",
	},
	findIteminput: {
		marginLeft: 30,
		marginRight: 30,
		marginTop: 20,
		marginBottom: 1000,
		height: 50,
		backgroundColor: "#DEF1FF",
		borderRadius: 10,
		color: "#001B4A",
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
		alignSelf: "center",
		color: "#FFFFFF",
		fontSize: 28,
	},
	saleBillsText: {
		marginLeft: 0,
		marginTop: -20,
		marginBottom: 10,
		fontFamily: "bold",
		color: "#0F2851",
		fontSize: 14,
	},
	tablecontainer: {
		flex: 1,
		// width:deviceWidth,
		marginLeft: 20,
		marginRight: 20,
		padding: 20,
		paddingTop: 30,
		backgroundColor: "#FFFFFF",
		borderRadius: 10,
	},
	container: {
		flex: 1,
		justifyContent: "center",
		backgroundColor: "#FAFAFF",
	},
	previlagecontainer: {
		flex: 1,
		justifyContent: "center",
		// backgroundColor: '#FAFAFF'
	},
	flatList: {
		marginTop: 20,
	},
	head: {
		height: 45,
		borderColor: "#FAFAFF",
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
		flexDirection: "row",
		marginLeft: 20,
		marginRight: 20,
		borderRadius: 5,
		marginTop: 20,
		borderColor: "#ED1C24",
		width: "90%",
		//backgroundColor: '#ffffff',
		height: 50,
	},

	TopcontainerforModel: {
		flexDirection: "row",
		marginLeft: 0,
		marginRight: 0,
		marginTop: 10,
		width: "100%",
		backgroundColor: "grey",
		borderRadius: 20,
		height: 50,
	},
	TopcontainerforPay: {
		flexDirection: "row",
		marginLeft: 0,
		marginRight: 0,
		// marginTop: 10,
		width: "100%",
		backgroundColor: "#ffffff",
		borderColor: "lightgray",
		borderRadius: 0,
		height: 50,
		position: "absolute",
		bottom: 10,
	},
	TopcontainerforItems: {
		flexDirection: "row",
		marginLeft: 0,
		marginRight: 0,
		marginTop: 10,
		width: "100%",
		backgroundColor: "#ffffff",
		borderColor: "lightgray",
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
		flexDirection: "row",
		paddingTop: Constants.statusBarHeight,
	},
	tabItem: {
		flex: 1,
		alignItems: "center",
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
		alignItems: "center",
		backgroundColor: "#ede3f2",
		padding: 100,
	},
	modal: {
		flex: 1,
		alignItems: "center",
		backgroundColor: "#f7021a",
		padding: 100,
	},
	modeltext: {
		color: "#3f2949",
		marginTop: 10,
	},
	btn: {
		width: 40,
		height: 18,
		borderWidth: 0.2,
		borderColor: "#48596B",
		fontFamily: "regular",
		fontSize: 10,
	},
	btnText: { textAlign: "center", color: "#fff" },

	preview: {
		margin: 20,
		height: 300,
		marginTop: 5,
		marginBottom: 10,
		justifyContent: "flex-end",
		alignItems: "center",
	},
	overlay: {
		position: "absolute",
		padding: 16,
		right: 0,
		left: 0,
		alignItems: "center",
	},
	topOverlay: {
		top: 0,
		flex: 1,
		marginLeft: 10,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	bottomOverlay: {
		bottom: 0,
		backgroundColor: "rgba(0,0,0,0.4)",
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
	},
	enterBarcodeManualButton: {
		padding: 15,
		backgroundColor: "white",
		borderRadius: 40,
	},
	scanScreenMessage: {
		fontSize: 14,
		color: "white",
		textAlign: "center",
		alignItems: "center",
		justifyContent: "center",
	},

	// Styles For Mobile
	viewsWidth_mobile: {
		backgroundColor: "#ffffff",
		width: deviceWidth,
		textAlign: "center",
		fontSize: 24,
		height: Device.isAndroid ? 70 : 84,
	},
	menuButton_mobile: {
		position: "absolute",
		left: 10,
		bottom: 0,
		width: 40,
		height: 40,
	},
	headerTitle_mobile: {
		position: "absolute",
		left: 70,
		bottom: 10,
		width: 300,
		height: 25,
		fontFamily: "bold",
		fontSize: 18,
		color: "#353C40",
	},
	input_mobile: {
		justifyContent: "center",
		marginLeft: 20,
		marginRight: 20,
		height: 44,
		marginTop: 5,
		marginBottom: 10,
		borderColor: "#8F9EB717",
		borderRadius: 3,
		backgroundColor: "#FBFBFB",
		borderWidth: 1,
		fontFamily: "regular",
		paddingLeft: 15,
		fontSize: 14,
	},
	rnSelect_mobile: {
		color: "#8F9EB7",
		fontSize: 15,
	},
	rnSelectContainer_mobile: {
		justifyContent: "center",
		margin: 20,
		height: 44,
		marginTop: 5,
		marginBottom: 10,
		borderColor: "#8F9EB717",
		borderRadius: 3,
		backgroundColor: "#FBFBFB",
		borderWidth: 1,
		fontFamily: "regular",
		paddingLeft: 15,
		fontSize: 14,
	},
	saveButton_mobile: {
		margin: 8,
		height: 50,
		backgroundColor: "#ED1C24",
		borderRadius: 5,
	},
	saveButtonText_mobile: {
		textAlign: "center",
		marginTop: 15,
		color: "#ffffff",
		fontSize: 15,
		fontFamily: "regular",
	},
	scanButton_mobile: {
		position: "absolute",
		right: 28,
		top: 20,
		width: 50,
		height: 50,
	},
	scanButtonImage_mobile: {
		color: "#ED1C24",
		fontFamily: "regular",
		fontSize: 12,
		position: "absolute",
		right: 30,
	},
	scanButtonText_mobile: {
		color: "#ED1C24",
		fontFamily: "regular",
		fontSize: 12,
		position: "absolute",
		right: 0,
	},
	tagCustomerButton_mobile: {
		position: "absolute",
		right: 5,
		top: 10,
		backgroundColor: "#ED1C24",
		borderRadius: 5,
		width: 90,
		height: 32,
	},
	tagCustomerButtonText_mobile: {
		fontSize: 12,
		fontFamily: "regular",
		color: "#ffffff",
		marginLeft: 10,
		marginTop: 8,
		alignSelf: "center",
	},
	navButton_mobile: {
		position: "absolute",
		right: 20,
		top: 37,
		backgroundColor: "#ED1C24",
		borderRadius: 5,
		width: 105,
		height: 32,
	},
	navButtonText_mobile: {
		fontSize: 12,
		fontFamily: "regular",
		color: "#ffffff",
		marginLeft: 10,
		marginTop: 8,
		alignSelf: "center",
	},

	// Styles For Tablet
	viewsWidth_tablet: {
		backgroundColor: "#ffffff",
		width: deviceWidth,
		textAlign: "center",
		fontSize: 28,
		height: 90,
	},
	menuButton_tablet: {
		position: "absolute",
		left: 10,
		top: 38,
		width: 90,
		height: 90,
	},
	headerTitle_tablet: {
		position: "absolute",
		left: 70,
		top: 40,
		width: 300,
		height: 40,
		fontFamily: "bold",
		fontSize: 24,
		color: "#353C40",
	},
	input_tablet: {
		justifyContent: "center",
		marginLeft: 20,
		marginRight: 20,
		height: 60,
		marginTop: 5,
		marginBottom: 10,
		borderColor: "#8F9EB717",
		borderRadius: 3,
		backgroundColor: "#FBFBFB",
		borderWidth: 1,
		fontFamily: "regular",
		paddingLeft: 15,
		fontSize: 22,
	},
	rnSelect_tablet: {
		color: "#8F9EB7",
		fontSize: 20,
	},
	rnSelectContainer_tablet: {
		justifyContent: "center",
		margin: 20,
		height: 54,
		marginTop: 5,
		marginBottom: 10,
		borderColor: "#8F9EB717",
		borderRadius: 3,
		backgroundColor: "#FBFBFB",
		borderWidth: 1,
		fontFamily: "regular",
		paddingLeft: 15,
		fontSize: 20,
	},
	saveButton_tablet: {
		margin: 8,
		height: 60,
		backgroundColor: "#ED1C24",
		borderRadius: 5,
	},
	saveButtonText_tablet: {
		textAlign: "center",
		marginTop: 15,
		color: "#ffffff",
		fontSize: 20,
		fontFamily: "regular",
	},
	scanButton_tablet: {
		position: "absolute",
		right: 28,
		top: 20,
		width: 70,
		height: 70,
	},
	scanButtonImage_tablet: {
		color: "#ED1C24",
		fontFamily: "regular",
		fontSize: 18,
		position: "absolute",
		right: 43,
		top: 5,
	},
	scanButtonText_tablet: {
		color: "#ED1C24",
		fontFamily: "regular",
		fontSize: 18,
		position: "absolute",
		right: 0,
	},
	tagCustomerButton_tablet: {
		position: "absolute",
		right: 30,
		top: 15,
		backgroundColor: "#ED1C24",
		borderRadius: 5,
		width: 120,
		height: 42,
	},
	tagCustomerButtonText_tablet: {
		fontSize: 16,
		fontFamily: "regular",
		color: "#ffffff",
		marginLeft: 10,
		marginTop: 8,
		alignSelf: "center",
	},
	navButton_tablet: {
		position: "absolute",
		right: 20,
		top: 27,
		backgroundColor: "#ED1C24",
		borderRadius: 5,
		width: 155,
		height: 42,
	},
	navButtonText_tablet: {
		fontSize: 17,
		fontFamily: "regular",
		color: "#ffffff",
		marginLeft: 10,
		marginTop: 8,
		alignSelf: "center",
	},
});
