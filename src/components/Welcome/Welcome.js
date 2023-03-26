import React from 'react';
import { StyleSheet, View, Text, Image, Dimensions, TouchableOpacity } from 'react-native';
var deviceWidth = Dimensions.get('window').width;
import Device from 'react-native-device-detection';
import I18n, { getLanguages } from 'react-native-i18n';
import { RH, RW, RF } from '../../Responsive';
I18n.fallbacks = true;
I18n.defaultLocale = 'english';


// Available languages
I18n.translations = {
    'english': require('../assets/translations/en'),
    'telugu': require('../assets/translations/te'),
    'hindi': require('../assets/translations/hi'),
};

export default class Welcome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            language: 'English',
            languages: [],
        };
    }

    componentWillMount() {
        getLanguages().then(languages => {
            this.setState({ languages });
        });
    }

    letsGoButtonAction() {
        //this.props.navigation.push('LoginAndSignUp', { screen: 'SignUp' });
        this.props.navigation.navigate('Login');
    }

    setLanguage() {

    }

    setLanguage = (value) => {

    };



    render() {
        return (
            <View style={styles.container}>
                <Image source={require('../assets/images/letsGo.png')} style={Device.isTablet ? styles.logoImage_tablet : styles.logoImage_mobile} />
                <View style={Device.isTablet ? styles.headerContainer_tablet : styles.headerContainer_mobile}>
                    <Text style={Device.isTablet ? styles.headerGreeting_tablet : styles.headerGreeting_mobile}> {I18n.t('Get Started')} </Text>
                    <Text style={Device.isTablet ? styles.headerTitle_tablet : styles.headerTitle_mobile}> {I18n.t('Lets explore the world Best Retail & Textiles')} </Text>

                </View>

                <TouchableOpacity
                    style={Device.isTablet ? styles.letsGoButton_tablet : styles.letsGoButton_mobile}
                    onPress={() => this.letsGoButtonAction()} >
                    <Text style={Device.isTablet ? styles.letsGoButtonText_tablet : styles.letsGoButtonText_mobile}> {I18n.t('LET GO')} </Text>
                </TouchableOpacity>
            </View>

        );
    }
}

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        flexDirection: 'row',
        marginLeft: RW(24),
        marginRight: RW(24),
        marginTop: 2,
        height: RH(34),
        borderColor: '#AAAAAA',
        backgroundColor: 'white',
        color: 'black',
        textAlign: 'center',
    },
    inputAndroid: {
        flexDirection: 'row',
        width: RW(100),
        marginTop: 2,
        height: RH(34),
        borderColor: '#AAAAAA',
        backgroundColor: 'white',
        color: 'black',
        textAlign: 'center',

    },
});



const styles = StyleSheet.create({
    imagealign: {
        marginTop: RH(14),
        marginRight: RW(10),
    },
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
    },



    // Styles For Mobile
    logoImage_mobile: {
        width: RW(302),
        height: RH(275),
        position: 'absolute',
        top: RH(130)
    },
    headerContainer_mobile: {
        flex: 1,
        marginTop: RH(450),
        width: deviceWidth,
        height: RH(200)
    },
    headerGreeting_mobile: {
        color: "#353C4050",
        fontSize: RF(16),
        fontFamily: "bold",
        marginLeft: RW(20),
        marginTop: RH(20)
    },
    headerTitle_mobile: {
        color: "#353C40",
        fontSize: RF(30),
        fontFamily: "bold",
        marginLeft: RW(20),
        marginTop: RW(20),
        flexDirection: 'column',
        justifyContent: 'center',
    },
    letsGoButton_mobile: {
        backgroundColor: '#ED1C24',
        justifyContent: 'center',
        position: 'absolute',
        marginLeft: RW(20),
        width: deviceWidth - RW(40),
        bottom: RH(30),
        height: RH(44),
        borderRadius: 10,
        fontWeight: 'bold',
        // marginBottom:100,
    },
    letsGoButtonText_mobile: {
        color: 'white',
        justifyContent: 'center',
        alignSelf: 'center',
        fontSize: RF(14),
        fontFamily: "regular",
    },

    // Styles For Tablet
    logoImage_tablet: {
        width: RW(402),
        height: RH(375),
        position: 'absolute',
        top: RH(130)
    },
    headerContainer_tablet: {
        flex: 1,
        marginTop: RH(450),
        width: deviceWidth,
        height: RH(200)
    },
    headerGreeting_tablet: {
        color: "#353C4050",
        fontSize: RF(26),
        fontFamily: "bold",
        marginLeft: RW(20),
        marginTop: RH(20)
    },
    headerTitle_tablet: {
        color: "#353C40",
        fontSize: RF(40),
        fontFamily: "bold",
        marginLeft: RW(20),
        marginTop: RH(20),
        flexDirection: 'column',
        // height: RH(135),
        justifyContent: 'center',
    },
    letsGoButton_tablet: {
        backgroundColor: '#ED1C24',
        justifyContent: 'center',
        position: 'absolute',
        marginLeft: RW(20),
        width: deviceWidth - RW(40),
        bottom: RH(30),
        height: RH(60),
        borderRadius: 10,
        fontWeight: 'bold',
        // marginBottom:100,
    },
    letsGoButtonText_tablet: {
        color: 'white',
        justifyContent: 'center',
        alignSelf: 'center',
        fontSize: RF(20),
        fontFamily: "regular",
    },

});
