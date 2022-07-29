import React, { Component, useState } from 'react';
import { Dimensions, TouchableOpacity, StyleSheet, View, Text } from 'react-native';
import I18n from 'react-native-i18n';
import HomeIcon from 'react-native-vector-icons/Entypo';
import ProfileIcon from 'react-native-vector-icons/Feather';

global.homeButtonClicked = false;
global.profileButtonClicked = false;

const BottomTabNav = (props) => {
  homeButtonActions = () => {
    global.homeButtonClicked = !global.homeButtonClicked;
    props.navigation.navigate('Home');
    global.profileButtonClicked = false;
  };
  profileButtonActions = () => {
    global.profileButtonClicked = !profileButtonClicked;
    global.homeButtonClicked = false;
    props.navigation.navigate('Settings');
  };
  console.log("in bottom tab bar");
  return (
    <View style={styles.bottomContainer}>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.bottomButtons}
          onPress={() => { homeButtonActions(); }}>
          <HomeIcon name="home" color={global.homeButtonClicked === true ? "red" : '#000'} size={20} />
          <Text> {I18n.t("Home")}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomButtons}
          onPress={() => { profileButtonActions(); }}>
          <ProfileIcon name="user" color={global.profileButtonClicked === true ? "red" : '#000'} size={20} />
          <Text> {I18n.t("Profile")}</Text>
        </TouchableOpacity>
      </View>
    </View >
  );
};


const styles = StyleSheet.create({
  bottomContainer: {
    flexDirection: 'column',
  },
  footer: {
    position: 'absolute',
    flex: 0.1,
    left: 0,
    right: 0,
    bottom: -10,
    backgroundColor: '#fff',
    flexDirection: 'row',
    height: 80,
    alignItems: 'center',
  },
  bottomButtons: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  }

});
export default BottomTabNav;
