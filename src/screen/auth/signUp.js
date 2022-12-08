import React, {Component, useRef, useState, useEffect} from 'react';
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
import IconMC from 'react-native-vector-icons/MaterialCommunityIcons';
import IconF from 'react-native-vector-icons/Feather';

import {
  networkConnected,
  networkListener,
} from '../../redux/action/networkAction';

import {Images, Loader} from '../../common';

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
  FetchPost,
  VSpace,
  HSpace,
} from '../../helper/helpers';

const SignUp = props => {
  const phoneInputRef = useRef(null);
  const [isVisibleLoader, setIsVisibleLoader] = useState(false);
  const [txtPhone, setTextPhone] = useState('');
  const [inputFocus, setInputFocus] = useState(false);
  const [signInWithInvalidPhoneNo, setsignInWithInvalidPhoneNo] = useState(0);

  useEffect(() => {
    if (props.route.params.phoneNo !== '') {
      console.log('invalid mobile no. ' + props.route.params.phoneNo);
      setsignInWithInvalidPhoneNo(props.route.params.phoneNo);
      setTextPhone(props.route.params.phoneNo);
    }
  }, []);
  const onPressLogin = () => {
    let phulPhone = phoneInputRef.current.getValue();
    let countryCode = phoneInputRef.current.getCountryCode();
    let onlyPhone = phulPhone.replace('+' + countryCode, '');
    if (txtPhone == '') {
      Toast.show('Phone number is required');
      return false;
    } else if (onlyPhone.length < 10 || onlyPhone.length > 10) {
      Toast.show('Enter a valid phone number');
      return false;
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
      //console.log('checkPhoneNumberIsExist: ', result);
      if (result.status == 200) {
        let phulPhone = phoneInputRef.current.getValue();
        MoveScreen(props, 'Verification', {
          postData: postData,
          phoneNumber: phulPhone,
          from: 'signup',
        });
      } else {
        Toast.show('Phone number already exist');
      }
    });
  };

  const onPhoneFocus = () => {
    setInputFocus(true);
  };

  const onPhoneBlur = () => {
    setInputFocus(false);
  };

  const goBack = () => {
    MoveScreenBack(props);
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      {/* <TouchableOpacity style={styles.backIcon} onPress={goBack}>
        <IconMC name="arrow-left-thin" color={color.white} size={30} />
      </TouchableOpacity> */}
      <Image source={{uri: Images.ic_top_shape}} style={styles.topImage} />
      <ScrollView style={styles.content}>
        {VSpace(15)}
        <Text style={styles.signInLabe}>Sign up to your Account</Text>
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
            initialValue={
              props.route.params.phoneNo !== ''
                ? props.route.params.phoneNo
                : ''
            }
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
        {signInWithInvalidPhoneNo > 0 && (
          <Text style={styles.nonExistedPhoneErrorMsg}>
            <IconF name="alert-triangle" size={12} /> Phone number is not in the
            system, please sign up
          </Text>
        )}
        {VSpace(20)}
        <TouchableOpacity style={styles.loginBtn} onPress={onPressLogin}>
          <Text style={styles.loginBtnTxt}>Sign Up</Text>
        </TouchableOpacity>
        {VSpace(20)}
        <View style={styles.dontHaveAcc}>
          <Text style={styles.dontHaveAccTxt}>Already have an account</Text>
          {HSpace(5)}
          <TouchableOpacity onPress={goBack}>
            <Text style={styles.signUp}>SignIn</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {isVisibleLoader && <Loader isVisible={isVisibleLoader} />}
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

export default connect(mapStateToProps, mapsDespathToProps)(SignUp);

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
  backIcon: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 9,
  },
  nonExistedPhoneErrorMsg: {
    color: '#ED0D17',
    padding: 5,
    fontSize: 12,
    backgroundColor: '#f7d7d2',
    borderRadius: 10,
    marginTop: 10,
  },
});
