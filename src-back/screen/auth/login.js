import React, {useEffect, useRef, useState} from 'react';
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
  StatusBar,
} from 'react-native';

import {connect} from 'react-redux';
import Toast from 'react-native-root-toast';
import PhoneInput from 'react-native-phone-input';
import CheckBox from '@react-native-community/checkbox';
import auth from '@react-native-firebase/auth';
import {
  networkConnected,
  networkListener,
} from '../../redux/action/networkAction';

import {Loader, Images} from '../../common';

import {
  screen,
  fontSize,
  fontFamily,
  color,
  fontStyle,
} from '../../helper/themeHelper';
import {MoveScreen, FetchPost, VSpace, HSpace} from '../../helper/helpers';

const Login = props => {
  const phoneInputRef = useRef(null);
  const [isVisibleLoader, setIsVisibleLoader] = useState(false);
  const [txtPhone, setTextPhone] = useState('');
  //const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [inputFocus, setInputFocus] = useState(false);

  useEffect(() => {
    auth()
      .signOut()
      .then(() => console.log('User signed out!'));
    setIsVisibleLoader(false);
  }, []);

  const onPressLogin = () => {
    let phulPhone = phoneInputRef.current.getValue();
    let countryCode = phoneInputRef.current.getCountryCode();
    let onlyPhone = phulPhone.replace('+' + countryCode, '');
    //console.log('phone No. ' + onlyPhone);
    if (txtPhone == '') {
      Toast.show('Phone number is required');
    } else if (onlyPhone.length < 10 || onlyPhone.length > 10) {
      Toast.show('Enter a valid phone number');
    } else {
      //console.log('CountryCode: ', countryCode);
      checkPhoneExist(countryCode, onlyPhone);
    }
  };

  const checkPhoneExist = (countryCode, phoneNumber) => {
    let postData = {
      phoneNumber: phoneNumber,
      countyCode: '+' + countryCode,
    };
    //console.log('data: ', postData);
    setIsVisibleLoader(true);
    FetchPost('api/checkPhoneNumberIsExist', postData).then(result => {
      setIsVisibleLoader(false);
      console.log('checkPhoneNumberIsExist: ', result);
      if (result.status == 400) {
        let phulPhone = phoneInputRef.current.getValue();
        MoveScreen(props, 'Verification', {
          postData: postData,
          phoneNumber: phulPhone,
          from: 'login',
        });
      } else if (result.status == 200) {
        MoveScreen(props, 'SignUp', {phoneNo: countryCode + phoneNumber});
        //Toast.show('Phone number is not in the system, please sign up');
      }
    });
  };

  const onPhoneFocus = () => {
    setInputFocus(true);
  };

  const onPhoneBlur = () => {
    setInputFocus(false);
  };

  const onPressSignUp = () => {
    MoveScreen(props, 'SignUp', {phoneNo: ''});
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      <Image source={{uri: Images.ic_top_shape}} style={styles.topImage} />
      <ScrollView style={styles.content}>
        {VSpace(15)}
        <Text style={styles.signInLabe}>Sign in to your Account</Text>
        {VSpace(20)}
        <Text style={styles.phoneLabel}>Phone Number</Text>
        {VSpace(10)}
        <View
          style={[
            styles.input,
            {borderColor: inputFocus ? '#46D1A1' : '#00000033'},
          ]}>
          <PhoneInput
            initialCountry={'us'}
            ref={phoneInputRef}
            autoFormat={false}
            style={styles.textfield}
            textProps={{
              placeholder: '5XXXXXXXX',
              onFocus: onPhoneFocus,
              onBlur: onPhoneBlur,
            }}
            value={txtPhone}
            onChangePhoneNumber={phone => setTextPhone(phone)}
          />
        </View>
        {VSpace(15)}
        {/* <View style={{flexDirection: 'row'}}>
          <CheckBox
            disabled={false}
            style={{height: 15, width: 15}}
            boxType={'square'}
            tintColor={'#5D5E5D'}
            onCheckColor={'#5D5E5D'}
            onTintColor={'#5D5E5D'}
            value={toggleCheckBox}
            onValueChange={newValue => setToggleCheckBox(newValue)}
          />
          {Platform.OS == 'android' ? HSpace(20) : HSpace(5)}
          <Text style={styles.rememberMe}>Remember me</Text>
        </View> */}
        {VSpace(20)}
        <TouchableOpacity style={styles.loginBtn} onPress={onPressLogin}>
          <Text style={styles.loginBtnTxt}>SignIn</Text>
        </TouchableOpacity>
        {VSpace(20)}
        <View style={styles.dontHaveAcc}>
          <Text style={styles.dontHaveAccTxt}>Don't have account</Text>
          {HSpace(5)}
          <TouchableOpacity onPress={onPressSignUp}>
            <Text style={styles.signUp}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {isVisibleLoader && <Loader isVisible={isVisibleLoader} />}
    </View>
  );
};

const mapStateToProps = state => {
  const {isConnected} = state.network;
  const user = state.user;
  return {};
};

const mapsDespathToProps = dispatch => {
  return {
    networkConnected,
    networkListener,
  };
};

export default connect(mapStateToProps, mapsDespathToProps)(Login);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.white,
  },
  topImage: {
    width: screen.screenWidth,
    height: screen.screenWidth * 0.826,
  },
  content: {
    flex: 1,
    paddingHorizontal: screen.screenWidth * 0.1,
  },
  signInLabe: {
    textAlign: 'center',
    fontSize: fontSize.small,
    color: '#5D5E5D',
    fontWeight: 'bold',
  },
  phoneLabel: {
    textAlign: 'left',
    fontSize: fontSize.minix,
    color: '#000000',
  },
  input: {
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignSelf: 'center',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#00000033',
    justifyContent: 'center',
  },
  textfield: {
    textAlign: I18nManager.isRTL ? 'right' : 'left',
    fontSize: fontSize.mini,
    color: color.txtBlack,
  },
  rememberMe: {
    textAlign: 'left',
    fontSize: fontSize.minix,
    color: '#5D5E5D',
  },
  loginBtn: {
    width: '100%',
    height: 40,
    backgroundColor: '#ED0D17',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginBtnTxt: {
    color: color.white,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  dontHaveAcc: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dontHaveAccTxt: {
    textAlign: 'center',
    fontSize: fontSize.regular,
    color: '#5D5E5D',
  },
  signUp: {
    textAlign: 'center',
    fontSize: fontSize.regular,
    color: '#46D1A1',
    fontWeight: 'bold',
  },
});
