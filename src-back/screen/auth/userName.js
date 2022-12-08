import React, {Component, useRef, useState} from 'react';
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
  TextInput,
  StatusBar,
} from 'react-native';
import {connect} from 'react-redux';
import Toast from 'react-native-root-toast';

import {
  networkConnected,
  networkListener,
} from '../../redux/action/networkAction';

import {Loader, Images} from '../../common';
import {saveAuthReducersData} from '../../redux/action/auth';

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
  FetchPost,
  VSpace,
  HSpace,
} from '../../helper/helpers';

const UserName = props => {
  const [isVisibleLoader, setIsVisibleLoader] = useState(false);
  const [inputFocus, setInputFocus] = useState(false);
  const [userName, setUserName] = useState('');

  const onPressContinue = () => {
    if (userName == '') {
      Toast.show('User name required');
    } else {
      var {postData} = props.route.params;
      postData.name = userName;
      setIsVisibleLoader(true);
      FetchPost('api/register', postData).then(result => {
        setIsVisibleLoader(false);
        console.log('register_result:', result);

        if (result.status == 200) {
          //alert('You have sign up successfully, please signin now');
          console.log(result);
          props.saveAuthReducersData('user', result.data);
          props.saveAuthReducersData('authToken', result.data.token);
          const profileImage =
            result.data.image === null ? '' : result.data.image;
          const profileName = result.data.name === null ? '' : result.data.name;
          props.saveAuthReducersData('profileImage', profileImage);
          props.saveAuthReducersData('profileName', profileName);
          console.log('Redux Data ' + JSON.stringify(props.user));
          goToHomeScreen('CustomerScreens');
          //MoveScreen(props, 'Login');
        } else {
          alert('Something went wrong');
        }
      });
    }
  };

  const onUserFocus = () => {
    setInputFocus(true);
  };

  const onUserBlur = () => {
    setInputFocus(false);
  };
  const goToHomeScreen = routeName => {
    props.navigation.reset({
      index: 0,
      routes: [{name: routeName}],
    });
  };
  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      <Image source={{uri: Images.ic_top_shape}} style={styles.topImage} />
      <ScrollView style={styles.content}>
        {VSpace(15)}
        <Text style={styles.signInLabe}>User Name</Text>
        {VSpace(20)}
        <Text style={styles.phoneLabel}>Enter your user name</Text>
        {VSpace(10)}
        <View
          style={[
            styles.input,
            {borderColor: inputFocus ? '#46D1A1' : '#00000033'},
          ]}>
          <Image source={{uri: Images.ic_user}} style={styles.userIcon} />
          {HSpace(10)}
          <TextInput
            style={styles.textfield}
            placeholder={'Enter your user name'}
            placeholderTextColor={'#5D5E5D'}
            value={userName}
            onFocus={onUserFocus}
            onBlur={onUserBlur}
            onChangeText={txt => setUserName(txt)}
          />
        </View>
        {VSpace(20)}
        <TouchableOpacity style={styles.loginBtn} onPress={onPressContinue}>
          <Text style={styles.loginBtnTxt}>Continue</Text>
        </TouchableOpacity>
      </ScrollView>
      {isVisibleLoader && <Loader isVisible={isVisibleLoader} />}
    </View>
  );
};

const mapStateToProps = state => {
  const {isConnected} = state.network;
  const user = state.user;
  const profileImage = state.profileImage;
  const profileName = state.profileName;
  return {user, profileImage, profileName};
};

const mapsDespathToProps = dispatch => {
  return {
    networkConnected,
    networkListener,
    saveAuthReducersData: (stateName, stateData) =>
      dispatch(saveAuthReducersData(stateName, stateData)),
  };
};

export default connect(mapStateToProps, mapsDespathToProps)(UserName);

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
    flexDirection: 'row',
    width: '100%',
    paddingVertical: Platform.OS == 'ios' ? 10 : 0,
    paddingHorizontal: 10,
    alignSelf: 'center',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#00000033',
    alignItems: 'center',
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
  userIcon: {
    height: 18,
    width: 15.33,
  },
});
