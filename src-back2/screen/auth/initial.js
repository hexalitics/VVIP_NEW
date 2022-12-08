import React, {Component} from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  LogBox,
  TouchableOpacity,
  Platform,
  ScrollView,
  Alert,
  I18nManager,
  FlatList,
  StatusBar,
} from 'react-native';

import SafeArea from 'react-native-safe-area';
import {connect} from 'react-redux';
import {StackActions} from '@react-navigation/native';

import {
  networkConnected,
  networkListener,
} from '../../redux/action/networkAction';

import {ContainerComponent, Images} from '../../common';

import {
  screen,
  fontSize,
  fontFamily,
  color,
  fontStyle,
} from '../../helper/themeHelper';
import {
  MoveScreen,
  MoveScreenBack,
  MoveScreenToTop,
} from '../../helper/helpers';

const Initial = props => {
  const onPressLogin = () => {
    MoveScreen(props, 'Login');
  };
  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      <Image source={{uri: Images.ic_walkthrough}} style={styles.topImage} />
      <View style={styles.logoContainer}>
        <Image source={{uri: Images.ic_vvip_logo}} style={styles.logo} />
      </View>
      <View style={[styles.contentContainer]}>
        <Text style={styles.title}>We Treat You Like Royalty</Text>
        {/* <Text style={styles.title}>let you enter in class</Text>
        <Text style={styles.title}>the very very</Text>
        <Text style={styles.title}>important person that</Text>
        <Text style={styles.title}>you are</Text> */}
        <View style={{height: 80}}></View>
        <TouchableOpacity style={styles.continueBtn} onPress={onPressLogin}>
          <Text style={styles.continueBtnTxt}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const mapStateToProps = state => {
  const {isConnected} = state.network;
  return {};
};

const mapsDespathToProps = dispatch => {
  return {
    networkConnected,
    networkListener,
  };
};

export default connect(mapStateToProps, mapsDespathToProps)(Initial);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topImage: {
    width: '100%',
    height: screen.screenHeight * 0.5,
  },
  contentContainer: {
    height: screen.screenHeight * 0.6,
    width: screen.screenWidth,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    top: screen.screenHeight * 0.45,
    borderTopLeftRadius: screen.screenWidth * 0.1,
    borderTopRightRadius: screen.screenWidth * 0.1,
    zIndex: 9,
    backgroundColor: color.white,
  },
  title: {
    paddingHorizontal: screen.screenWidth * 0.2,
    textAlign: 'center',
    fontSize: fontSize.small,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  continueBtn: {
    width: 200,
    height: 40,
    backgroundColor: '#ED0D17',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueBtnTxt: {
    color: color.white,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  logoContainer: {
    width: screen.screenWidth,
    height: screen.screenHeight * 0.3,
    //backgroundColor: '#CCC',
    position: 'absolute',
    top: screen.screenHeight * 0.05,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 132,
    height: 46.5,
  },
});
