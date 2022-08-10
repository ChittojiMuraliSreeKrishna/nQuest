import { Dimensions } from "react-native";
import Device from "react-native-device-detection";
import { RH, RW, RF } from '../../Responsive';
import { color } from "./colorStyles";

var deviceheight = Dimensions.get("window").height;
var deviceWidth = Dimensions.get("window").width;

export const inputField = {
  justifyContent: 'center',
  marginLeft: RW(20),
  marginRight: RW(20),
  height: Device.isTablet ? RH(54) : RH(44),
  marginTop: RH(5),
  marginBottom: RH(5),
  borderColor: color.border,
  borderRadius: 3,
  backgroundColor: color.light,
  borderWidth: 1,
  fontFamily: 'regular',
  paddingLeft: RW(15),
  width: deviceWidth - RW(40),
  fontSize: RF(14),
};

export const inputFieldDisabled = {
  justifyContent: 'center',
  marginLeft: RW(20),
  marginRight: RW(20),
  height: Device.isTablet ? RH(54) : RH(44),
  marginTop: RH(5),
  marginBottom: RH(10),
  borderColor: color.border,
  borderRadius: 3,
  backgroundColor: color.dark,
  color: color.black,
  borderWidth: 1,
  fontFamily: 'regular',
  paddingLeft: RW(15),
  width: deviceWidth - RW(40),
  fontSize: RF(14),
};

export const inputArea = {
  justifyContent: 'center',
  marginLeft: RW(20),
  marginRight: RW(20),
  height: Device.isTablet ? RH(254) : RH(144),
  marginTop: RH(5),
  marginBottom: RH(10),
  borderColor: color.border,
  borderRadius: 3,
  backgroundColor: color.light,
  borderWidth: 1,
  fontFamily: 'regular',
  paddingLeft: RW(15),
  fontSize: RF(14),
};

export const inputHeading = {
  fontSize: RF(13),
  color: color.black,
  marginLeft: RW(20),
  marginTop: RH(10),
  marginBottom: RH(10)
};

export const rnPickerContainer = {
  justifyContent: 'center',
  margin: RH(20),
  height: Device.isTablet ? RH(54) : RH(44),
  marginTop: RH(5),
  marginBottom: RH(10),
  borderColor: color.border,
  borderRadius: 3,
  backgroundColor: color.light,
  borderWidth: 1,
  fontFamily: 'regular',
  paddingLeft: RW(15),
  fontSize: RF(14),
  width: deviceWidth - RW(40)
};

export const rnPicker = {
  placeholder: {
    color: color.grey,
    fontFamily: "regular",
    fontSize: RF(14),
  },
  inputIOS: {
    justifyContent: 'center',
    height: Device.isTablet ? 52 : 42,
    borderRadius: 3,
    // borderWidth: 1,
    fontFamily: 'regular',
    fontSize: RF(14),
    borderColor: color.border,
    backgroundColor: color.light,
  },
  inputAndroid: {
    justifyContent: 'center',
    height: Device.isTablet ? 52 : 42,
    borderRadius: 3,
    // borderWidth: 1,
    fontFamily: 'regular',
    fontSize: RF(14),
    borderColor: color.border,
    backgroundColor: color.light,
    color: color.blue,
  },
};

export const rnPickerError = {
  placeholder: {
    color: color.accent,
    fontFamily: "regular",
    fontSize: RF(14),
  },
  inputIOS: {
    justifyContent: 'center',
    height: Device.isTablet ? 52 : 42,
    borderRadius: 3,
    // borderWidth: 1,
    fontFamily: 'regular',
    fontSize: RF(14),
    borderColor: color.border,
    backgroundColor: color.light,
  },
  inputAndroid: {
    justifyContent: 'center',
    height: Device.isTablet ? 52 : 42,
    borderRadius: 3,
    // borderWidth: 1,
    fontFamily: 'regular',
    fontSize: RF(14),
    borderColor: color.border,
    backgroundColor: color.light,
    color: color.blue,
  },
};


export const submitBtn = {
  width: deviceWidth - RW(40),
  marginHorizontal: RW(20),
  marginVertical: RH(10),
  height: Device.isTablet ? RH(60) : RH(50),
  backgroundColor: color.accent,
  borderRadius: 5,
  borderWidth: Device.isTablet ? 2 : 1,
  borderColor: color.accent,
};

export const submitBtnText = {
  textAlign: 'center',
  marginTop: RH(10),
  color: color.white,
  fontSize: RF(15),
  fontFamily: "regular"
};

export const cancelBtn = {
  width: deviceWidth - RW(40),
  marginHorizontal: RW(20),
  marginVertical: RH(10),
  height: Device.isTablet ? RH(50) : RH(40),
  backgroundColor: color.white,
  borderRadius: 5,
  borderWidth: Device.isTablet ? 2 : 1,
  borderColor: color.border,
};

export const cancelBtnText = {
  textAlign: 'center',
  marginTop: Device.isTablet ? RH(5) : RH(10),
  color: color.black,
  fontSize: RF(15),
  fontFamily: "regular"
};

export const dateSelector = {
  width: deviceWidth - RW(40),
  marginLeft: RW(20),
  marginRight: RW(20),
  marginTop: RH(10),
  marginBottom: RH(10),
  borderWidth: RW(1),
  borderColor: color.border,
  height: RH(50),
  backgroundColor: color.light,
  borderRadius: 5,
  justifyContent: 'center'
};

export const datePickerButton1 = {
  position: 'absolute',
  left: RW(20),
  top: RH(10),
  height: Device.isTablet ? RH(50) : RH(30),
  backgroundColor: color.accent,
  borderRadius: 5,
};

export const datePickerButton2 = {
  position: 'absolute',
  right: RW(20),
  top: RH(10),
  height: Device.isTablet ? RH(50) : RH(30),
  backgroundColor: color.accent,
  borderRadius: 5,
};

export const datePickerBtnText = {
  // textAlign: 'center',
  marginTop: RH(5),
  color: color.light,
  fontSize: RF(14),
  fontFamily: "regular"
};

export const datePickerContainer = {
  height: RH(280),
  width: deviceWidth,
  backgroundColor: color.light
};

export const datePicker = {
  width: deviceWidth,
  height: RH(200),
  marginTop: RH(50),
};

export const dateText = {
  marginLeft: RW(16),
  // marginTop: Device.isTablet ? 0 : RW(10),
  color: color.grey,
  fontSize: RF(15),
  fontFamily: "regular"
};

export const checkPromoDiscountBtn = {
  width: deviceWidth - RW(40),
  marginHorizontal: RW(20),
  marginVertical: RH(10),
  height: Device.isTablet ? RH(60) : RH(50),
  borderRadius: 5,
  borderWidth: Device.isTablet ? 2 : 1,
  display: 'flex', alignItems: 'center', flexDirection: 'row', justifyContent: 'center'
};

export const textStyle = {
  color: "#353C40",
  fontFamily: "medium",
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  marginTop: RF(10),
  fontSize: Device.isTablet ? 19 : 14,
}