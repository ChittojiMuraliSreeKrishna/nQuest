import { Dimensions } from "react-native";
import Device from "react-native-device-detection";
import { RF, RH, RW } from '../../Responsive';
import { color } from "./colorStyles";


var deviceHeight = Dimensions.get("window").height
var deviceWidth = Dimensions.get("window").width

export const filterMainContainer = {
  backgroundColor: '#ffffff',
  minHeight: Device.isTablet ? RH(500) : RH(400),
  paddingBottom: Device.isTablet ? RH(20) : RH(10),
  maxHeight: Device.isTablet ? RH(700) : RH(600),
  position: 'absolute',
  width: '100%',
  bottom: 0
}

export const filterSubContainer = {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: RH(5),
  height: Device.isTablet ? RH(60) : RH(50),
  borderBottomWidth: RH(1),
  borderColor: color.border,
}

export const viewSubContainer = {
  backgroundColor: color.info,
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: RH(5),
  paddingHorizontal: RW(20),
  height: Device.isTablet ? RH(60) : RH(50),
  marginBottom: RH(5),
}

export const filterHeading = {
  marginTop: RH(0),
  fontSize: RF(17),
  marginLeft: RW(20)
}

export const filterCloseImage = {
  width: Device.isTablet ? RW(70) : RW(50),
  height: Device.isTablet ? RH(50) : RH(50),
  marginTop: Device.isTablet ? RH(30) : RH(25),
}

export const viewContainer = {
  backgroundColor: '#ffffff',
  position: 'absolute',
  bottom: 0,
  minHeight: Device.isTablet ? RH(300) : RH(250),
}

export const viewText = {
  textAlign: 'center',
  fontFamily: 'regular',
  fontSize: RF(18),
  color: '#353C40',
}

export const deleteContainer = {
  backgroundColor: '#ffffff',
  minHeight: Device.isTablet ? RH(300) : RH(250),
  position: 'absolute',
  bottom: 0,
}

export const sucessContainer = {
  backgroundColor: '#FFFFFF',
  minHeight: Device.isTablet ? RH(300) : RH(250),
  position: 'absolute',
  bottom: 0,
}

export const deleteText = {
  textAlign: 'center',
  fontFamily: 'regular',
  fontSize: RF(18),
  color: '#353C40',
}

export const sucessText = {
  textAlign: 'center',
  fontFamily: 'regular',
  fontSize: RF(18),
  color: '#00aa00',
}

export const deleteHeading = {
  color: '#ffffff',
  marginTop: Device.isTablet ? RH(5) : RH(15),
  marginLeft: RW(20),
  fontFamily: 'medium',
  fontSize: RF(15)
}

export const sucessHeading = {
  color: '#ffffff',
  marginTop: Device.isTablet ? RH(5) : RH(15),
  marginLeft: RW(20),
  fontFamily: 'medium',
  fontSize: RF(15)
}

export const deleteHeader = {
  backgroundColor: "#ED1c24",
  width: deviceWidth,
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddinRight: 10,
  paddingHorizontal: Device.isTablet ? 30 : 10,
  height: Device.isTablet ? RH(60) : RH(50)
}

export const sucessHeader = {
  backgroundColor: "#00aa00",
  width: deviceWidth,
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddinRight: 10,
  paddingHorizontal: Device.isTablet ? 30 : 10,
  height: Device.isTablet ? RH(60) : RH(50)
}

export const deleteCloseBtn = {
  // margin: 5,
  height: RH(15),
  width: RW(15)
}

export const sucessBtn = {
  width: deviceWidth - RW(40),
  marginLeft: RW(20),
  marginRight: RW(20),
  marginTop: RH(20),
  height: Device.isTablet ? RH(60) : RH(50),
  backgroundColor: "#FFFFFF",
  borderRadius: 5,
  borderWidth: Device.isTablet ? 2 : 1,
  borderColor: "#00aa00",
}

export const sucessBtnText = {
  textAlign: 'center',
  marginTop: RH(10),
  color: "#00aa00",
  fontSize: RF(15),
  fontFamily: "regular"
}

export const sucessMainText = {
  fontSize: RF(19),
  fontFamily: 'medium', color: '#00aa00'
}
