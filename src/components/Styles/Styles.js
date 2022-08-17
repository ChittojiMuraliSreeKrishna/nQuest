import { Dimensions } from "react-native";
import Device from "react-native-device-detection";
import { RF, RH, RW } from "../../Responsive";
import { color } from "./colorStyles";

var deviceheight = Dimensions.get("window").height;
var deviceWidth = Dimensions.get("window").width;

export const listEmptyMessage = {
	fontSize: Device.isTablet ? RF(21) : RF(17),
	color: color.accent,
	textAlign: "center",
	fontFamily: "bold",
	marginTop: deviceheight / 3,
};

export const headerTitleContainer = {
	display: "flex",
	flexDirection: "row",
	justifyContent: "space-between",
	alignItems: "center",
	paddingHorizontal: RW(10),
	height: Device.isTablet ? RH(60) : RH(50),
	backgroundColor: color.white,
	marginBottom: RH(5),
};

export const headerTitleSubContainer = {
	display: "flex",
	flexDirection: "row",
	justifyContent: "flex-start",
	alignItems: "center",
};

export const headerTitleSubContainer2 = {
	display: "flex",
	flexDirection: "row",
	justifyContent: "flex-end",
	alignItems: "center",
};

export const menuButton = {
	width: Device.isTablet ? RW(50) : RW(40),
	height: Device.isTablet ? RH(40) : RH(30),
	marginRight: RW(10),
};

export const backButton = {
	width: RW(40),
	height: RH(40),
	marginRight: RW(20),
	// marginTop: -RH(10),
};

export const backButtonImage = {
	// marginTop: Device.isTablet ? 0 : RH(-10),
};

export const headerNavigationBtn = {
	backgroundColor: color.accent,
	borderRadius: 5,
	minWidth: Device.isTablet ? RW(160) : RW(110),
	height: Device.isTablet ? RH(40) : RH(30),
	paddingHorizontal: RW(10),
	textAlign: "center",
	// marginRight: RW(10),
};

export const headerNavigationBtnText = {
	fontSize: RF(12),
	marginTop: RH(5),
	fontFamily: "regular",
	color: color.white,
	textAlign: "center",
	alignSelf: "center",
};

export const filterBtn = {
	// backgroundColor: '#686868',
	borderRadius: 5,
	width: Device.isTablet ? RW(40) : RW(30),
	height: Device.isTablet ? RH(42) : RH(32),
};

export const headerTitle = {
	fontFamily: "bold",
	fontSize: RF(18),
	color: color.dark,
};

export const pageNavigationBtn = {
	height: Device.isTablet ? RH(40) : RH(30),
	minWidth: RW(100),
	borderWidth: Device.isTablet ? 2 : 1,
	borderRadius: 5,
	paddingHorizontal: RW(20),
	marginLeft: RW(10),
};

export const pageNavigationBtnText = {
	fontSize: RF(13),
	textAlign: "center",
	textAlignVertical: "center",
	paddingTop: 5,
	fontFamily: "regular",
};

export const pageNavigationBtnContainer = {
	// margin: Device.isTablet ? RH(10) : RH(5)
};

export const sectionListHeader = {
	paddingVertical: RH(2),
	paddingHorizontal: RW(10),
	fontSize: RF(16),
	fontFamily: "medium",
	color: color.lightBlack,
};

export const sectionListBtnContainer = {
	display: "flex",
	flexDirection: "row",
	justifyContent: "space-between",
	alignItems: "center",
	paddingVertical: 10,
	paddingHorizontal: 20,
};

export const sectionListBtn = {
	height: 44,
	backgroundColor: color.white,
	fontFamily: "medium",
	borderWidth: 1,
	borderColor: color.border,
	marginVertical: 2,
	borderRadius: 5,
};

export const flatListHeaderContainer = {
	// backgroundColor: '#686868',
	display: "flex",
	flexDirection: "row",
	width: deviceWidth,
	justifyContent: "space-between",
	alignItems: "center",
	paddingLeft: RW(20),
	paddingRight: RW(20),
	paddingVertical: RH(5),
	height: RH(30),
};

export const flatListTitle = {
	fontSize: RF(15),
	fontFamily: "medium",
	color: color.lightBlack,
	textAlign: "center",
};

export const flatListMainContainer = {
	backgroundColor: color.light,
	borderWidth: Device.isTablet ? 2 : 1,
	borderColor: color.lightBorder,
	flexDirection: "row",
	padding: 10,
	justifyContent: "space-between",
	alignItems: "center",
	marginBottom: Device.isTablet ? RH(10) : RH(5),
	borderRadius: Device.isTablet ? 10 : 5,
	width: deviceWidth - RW(10),
	marginHorizontal: RW(5),
};

export const flatlistSubContainer = {
	flexDirection: "column",
	width: "100%",
	gap: 10,
};

export const highText = {
	fontSize: RF(10),
	fontFamily: "medium",
	color: color.accent,
};

export const textStyleMedium = {
	fontSize: RF(10),
	fontFamily: "medium",
	color: color.dark,
};

export const textStyleLight = {
	fontSize: RF(10),
	fontFamily: "normal",
	color: color.lightDark,
};

export const textContainer = {
	display: "flex",
	flexDirection: "row",
	justifyContent: "space-between",
	alignItems: "center",
	width: "100%",
	paddingTop: RH(10),
	paddingHorizontal: RW(5),
};

export const buttonContainer = {
	flexDirection: "row",
	justifyContent: "center",
	alignItems: "center",
	alignContent: "center",
	// marginBottom: 10
};

export const buttonStyle = {
	width: Device.isTablet ? RW(50) : RW(30),
	height: Device.isTablet ? RW(50) : RW(30),
	borderBottomRightRadius: 5,
	borderTopRightRadius: 5,
	borderWidth: Device.isTablet ? 2 : 1,
	borderColor: color.lightBorder,
};

export const buttonStyle1 = {
	width: Device.isTablet ? RW(50) : RW(30),
	height: Device.isTablet ? RW(50) : RW(30),
	borderBottomLeftRadius: 5,
	borderTopLeftRadius: 5,
	borderWidth: Device.isTablet ? 2 : 1,
	borderColor: color.lightBorder,
};

export const singleButtonStyle = {
	width: Device.isTablet ? RW(40) : RW(30),
	height: Device.isTablet ? RW(42) : RW(30),
	borderRadius: 10,
	marginLeft: 5,
	borderWidth: Device.isTablet ? 2 : 1,
	borderColor: color.lightBorder,
};

export const buttonImageStyle = {
	alignSelf: "center",
	marginTop: 4,
	height: Device.isTablet ? RH(25) : RH(20),
	width: Device.isTablet ? RW(25) : RW(20),
};

export const loadMoreBtn = {
	width: RW(200),
	height: RH(30),
	marginLeft: deviceWidth / 2.5,
	marginTop: RH(10),
	marginBottom: RH(20),
};

export const loadmoreBtnText = {
	fontSize: RF(12),
	color: color.lightBlack,
	fontFamily: "bold",
};

export const textStyleMediumColor = {
  fontSize: RF(10),
  fontFamily: 'medium',
  color: color.mediumDark
}