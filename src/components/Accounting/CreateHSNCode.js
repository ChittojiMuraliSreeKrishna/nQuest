import React, { Component } from "react";
import {
	Dimensions,
	FlatList,
	Image,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import scss from "../../commonUtils/assets/styles/style.scss";
import Loader from "../../commonUtils/loader";
import AccountingService from "../services/AccountingService";
import Icon from 'react-native-vector-icons/AntDesign'
import {
	buttonContainer,
	buttonImageStyle,
	buttonStyle1,
	flatListMainContainer,
	flatlistSubContainer,
	flatListTitle,
	highText,
	textContainer,
	textStyleLight,
	textStyleMedium,
} from "../Styles/Styles";
import { ScrollView } from "react-native";
var deviceWidth = Dimensions.get("window").width;

export default class CreateHSNCode extends Component {
	constructor(props) {
		super(props);
		this.state = {
			modalVisible: true,
			deleteHsnCode: false,
			hsnList: [],
			loading: false,
		};
	}

	async componentDidMount() {
		this.getAllHsnCode();
	}

	// Refreshing the Hsns
	refresh() {
		this.setState({ hsnList: [] }, () => {
			this.getAllHsnCode();
		});
	}

	// Getting All HsnCodes
	async getAllHsnCode() {
		this.setState({ loading: true });
		AccountingService.getAllHsnCodes()
			.then((res) => {
				if (res) {
					console.log(res.data);
					console.log(res.data.result[0].slabs);
					this.setState({ hsnList: res.data.result });
				}
				this.setState({ loading: false });
			})
			.catch((err) => {
				this.setState({ loading: false });
				console.log(err);
			});
	}

	// Filter Model Actions
	modelCancel() {
		this.setState({ modalVisible: false });
	}

	// Edit Hsn
	handleeditHsn(item, index) {
		this.props.navigation.navigate("AddHsnCode", {
			item: item,
			isEdit: true,
			onGoBack: () => this.refresh(),
			goBack: () => this.refresh(),
		});
	}

	// Add Hsn
	navigateToAddHsnCode() {
		this.props.navigation.navigate("AddHsnCode", {
			isEdit: false,
			onGoBack: () => this.refresh(),
			goBack: () => this.refresh(),
		});
	}

	render() {
		return (
			<View>
				{this.state.loading && <Loader loading={this.state.loading} />}
				<FlatList
					ListHeaderComponent={
						<View style={scss.headerContainer}>
							<Text style={flatListTitle}>Create HSN Code - <Text style={{color: '#ed1c24'}}>{this.state.hsnList.length}</Text> </Text>
							<Icon
							name="plus"
							size={25}
							onPress={() => this.navigateToAddHsnCode()}
							></Icon>
						</View>
					}
					data={this.state.hsnList}
					style={{ marginTop: 20 }}
					scrollEnabled={true}
					renderItem={({ item, index }) => (
						<ScrollView>
						<View style={scss.flatListContainer}>
							<View style={scss.flatListSubContainer}>
								<View style={scss.textContainer}>
									<Text style={scss.highText}>{item.hsnCode}</Text>
								</View>
								<View style={scss.textContainer}>
									<Text style={scss.textStyleMedium}>
										GOODS/SERVICES: {"\n"}
										{item.description}
									</Text>
									<Text style={scss.textStyleLight}>
										TAX APPLICABLE: {"\n"}
										{item.taxAppliesOn}
									</Text>
								</View>
								<View style={scss.textContainer}>
									<Text style={textStyleLight}>SLAB: {item.slabBased}</Text>
								</View>
								<View style={scss.flatListFooter}>
								<Text style={scss.footerText}>
                        Date :{" "}
                        {item.createdDate
                          ? item.createdDate.toString().split(/T/)[0]
                          : item.createdDate}
                      </Text>
					  <TouchableOpacity
											style={scss.footerSingleBtn}
											onPress={() => this.handleeditHsn(item, index)}
										>
											<Image
												style={scss.footerBtnImg}
												source={require("../assets/images/edit.png")}
											/>
										</TouchableOpacity>
								</View>
							</View>
						</View>
						</ScrollView>
					)}
				/>
			</View>
		);
	}
}
