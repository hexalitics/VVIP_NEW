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
import OTPInputView from '@twotalltotems/react-native-otp-input';
import {connect} from 'react-redux';
import auth from '@react-native-firebase/auth';
import Toast from 'react-native-root-toast';
import {StackActions, useNavigation} from '@react-navigation/native';

import {
  networkConnected,
  networkListener,
} from '../../redux/action/networkAction';
import {saveAuthReducersData} from '../../redux/action/auth';

import {ContainerComponent, Images, Loader} from '../../common';

import {
  screen,
  fontSize,
  fontFamily,
  color,
  fontStyle,
} from '../../helper/themeHelper';
import {MoveScreen, FetchPost, VSpace, HSpace} from '../../helper/helpers';

const Verification = props => {
  const [isVisibleLoader, setIsVisibleLoader] = useState(false);
  const [code, setCode] = useState('');
  const [phone, setPhone] = useState('');
  const [confirm, setConfirm] = useState(null);
  const [counter, setCounter] = React.useState(30);
  const [clearInput, setclearInput] = useState(false);
  useEffect(async () => {
    const {phoneNumber} = props.route.params;
    setPhone(phoneNumber);
    setIsVisibleLoader(false);
    setupPhoneAuth();
    await auth().onAuthStateChanged(user => {
      if (user) {
        saveUser();
      } else {
        setIsVisibleLoader(false);
      }
    });
    //smsTimer();
  }, []);

  useEffect(() => {
    const timer =
      counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
    return () => clearInterval(timer);
  }, [counter]);

  const setupPhoneAuth = async () => {
    const {phoneNumber} = props.route.params;
    //console.log('mobile number', phoneNumber);
    const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
    //console.log('Confirmation ', JSON.stringify(confirmation));
    setConfirm(confirmation);
  };
  const setupResendPhoneAuth = async () => {
    const {phoneNumber} = props.route.params;
    const confirmation = await auth().signInWithPhoneNumber(phoneNumber, true);
    //console.log('Confirmation ', JSON.stringify(confirmation));
    setConfirm(confirmation);
  };
  const onPressResendCode = () => {
    setCode('');
    setclearInput(true);
    setCounter(30);
    setupResendPhoneAuth();
  };

  const onPressVerify = async () => {
    if (code == '') {
      Toast.show('Please enter a valid code');
    } else {
      try {
        setIsVisibleLoader(true);
        let result = await confirm.confirm(code);
        setIsVisibleLoader(false);
        console.log('AuthResult: ', result);
        if ((await result) != null) {
          saveUser();
        }
      } catch (error) {
        alert(error);
        setIsVisibleLoader(false);
      }
    }
  };

  const saveUser = () => {
    const {from} = props.route.params;
    if (from == 'signup') {
      const {postData} = props.route.params;
      MoveScreen(props, 'UserName', {postData});
    } else if (from == 'login') {
      const {postData} = props.route.params;
      setIsVisibleLoader(true);
      FetchPost('api/login', postData).then(result => {
        setIsVisibleLoader(false);
        //console.log('login_result: ' + result);
        if (result.status == 200) {
          props.saveAuthReducersData('user', result.data);
          props.saveAuthReducersData('authToken', result.data.token);
          const profileImage =
            result.data.image === null ? '' : result.data.image;
          const profileName = result.data.name === null ? '' : result.data.name;
          props.saveAuthReducersData('profileImage', profileImage);
          props.saveAuthReducersData('profileName', profileName);
          goToHomeScreen('CustomerScreens');
        } else {
          alert('Something went wrong, please login again');
        }
      });
    }
  };
  const goToHomeScreen = routeName => {
    props.navigation.reset({
      index: 0,
      routes: [{name: routeName}],
    });
  };
  const goToNextView = nextView => {
    props.navigation.reset({
      index: 0,
      routes: [{name: nextView}],
    });
  };
  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      <Image source={{uri: Images.ic_top_shape}} style={styles.topImage} />
      <ScrollView style={styles.content}>
        {VSpace(15)}
        <Text style={styles.otpCodeLabe}>Enter OTP CODE</Text>
        {VSpace(20)}
        <View style={styles.dontHaveAcc}>
          <Text style={styles.codeSend}>Code has been send to </Text>
          <Text style={styles.phoneLabel}>{phone}</Text>
        </View>
        {VSpace(10)}
        <OTPInputView
          code={code}
          autoFocusOnLoad
          editable={true}
          keyboardType={'number-pad'}
          pinCount={6}
          style={{
            alignSelf: 'center',
            width: '100%',
            height: 80,
          }}
          codeInputFieldStyle={{
            borderRadius: 6,
            color: color.txtBlack,
          }}
          codeInputHighlightStyle={{
            borderRadius: 6,
            color: color.txtBlack,
            backgroundColor: color.lightGrayBg,
            borderColor: color.green,
          }}
          onCodeFilled={code => {
            console.log(`Code is ${code}`);
            //setCode(code);
          }}
          onCodeChanged={code => {
            setCode(code);
            setclearInput(false);
          }}
          clearInputs={clearInput}
        />
        {VSpace(10)}
        {counter === 0 ? (
          <TouchableOpacity onPress={onPressResendCode}>
            <Text
              style={[styles.codeSend, {fontWeight: 'bold', color: '#46D1A1'}]}>
              Resend Code <Text style={{color: '#ED0D17'}}>{counter}</Text>
            </Text>
          </TouchableOpacity>
        ) : (
          <Text
            style={[styles.codeSend, {fontWeight: 'bold', color: '#9C9D9C'}]}>
            Resend Code <Text style={{color: '#ED0D17'}}>{counter}</Text>
          </Text>
        )}

        {VSpace(20)}
        <TouchableOpacity style={styles.loginBtn} onPress={onPressVerify}>
          <Text style={styles.loginBtnTxt}>Verify</Text>
        </TouchableOpacity>
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
    saveAuthReducersData: (stateName, stateData) =>
      dispatch(saveAuthReducersData(stateName, stateData)),
  };
};

export default connect(mapStateToProps, mapsDespathToProps)(Verification);

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
  otpCodeLabe: {
    textAlign: 'center',
    fontSize: fontSize.mini,
    color: '#ED0D17',
    fontWeight: 'bold',
  },
  codeSend: {
    textAlign: 'center',
    fontSize: fontSize.minix,
    color: '#5D5E5D',
  },
  phoneLabel: {
    textAlign: 'center',
    fontSize: fontSize.minix,
    color: '#000000',
    fontWeight: 'bold',
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
    fontSize: fontSize.small,
    color: '#5D5E5D',
  },
  signUp: {
    textAlign: 'center',
    fontSize: fontSize.small,
    color: '#46D1A1',
    fontWeight: 'bold',
  },
});
