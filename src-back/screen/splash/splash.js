import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Alert,
  LogBox,
  Image,
  Platform,
  StatusBar,
} from 'react-native';

import {connect} from 'react-redux';
import {StackActions} from '@react-navigation/native';
import RNAndroidKeyboardAdjust from 'rn-android-keyboard-adjust';
import SplashScreen from 'react-native-splash-screen';
import Toast from 'react-native-root-toast';
import DeviceInfo from 'react-native-device-info';

import {
  networkConnected,
  networkListener,
} from '../../redux/action/networkAction';
import {Loader, Images} from '../../common';

import {color} from '../../helper/themeHelper';
import {FetchPost, FetchGet, MoveScreen} from '../../helper/helpers';

class Splash extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisibleLoader: false,
    };
  }

  componentWillMount() {
    LogBox.ignoreAllLogs(true);
  }
  async componentDidMount() {
    if (Platform.OS === 'android') RNAndroidKeyboardAdjust.setAdjustPan();
    setTimeout(() => {
      SplashScreen.hide();
    }, 2000);
    this.loadData();
  }
  loadData = async () => {
    this.setState({isVisibleLoader: true});
    setTimeout(() => {
      FetchGet('api/appConfiguration').then(result => {
        console.log('Initial ', JSON.stringify(result));
        this.setState({isVisibleLoader: false});
        if (result.status == 400) {
          Toast.show(result.message);
          this.goToNextView('Initial');
        } else if (result.status == 200) {
          let version = DeviceInfo.getVersion();
          //console.log(version);
          let updatedVersion = result.data.iOSVersion;
          if (Platform.OS === 'android') {
            updatedVersion = result.data.AndroidVersion;
          }
          //updatedVersion = '2';
          // console.log(
          //   'Is Value in Redux in splash screen ' +
          //     JSON.stringify(this.props.user),
          // );
          if (updatedVersion > version) {
            Toast.show('Please Download The Updated Version App', {
              duration: Toast.durations.LONG,
              position: 0,
              backgroundColor: '#000',
              textColor: '#fff',
            });
            if (this.props.user.id > 0 && this.props.user.token != '') {
              this.goToHomeScreen('CustomerScreens');
            } else {
              this.goToNextView('Initial');
            }
          } else {
            if (this.props.user.id > 0 && this.props.user.token != '') {
              this.goToHomeScreen('CustomerScreens');
            } else {
              this.goToNextView('Initial');
            }
          }
        }
      });
    }, 4000);
  };

  //Navigation Methods
  goToHomeScreen = routeName => {
    this.props.navigation.reset({
      index: 0,
      routes: [{name: routeName}],
    });
  };
  goToNextView = nextView => {
    this.props.navigation.dispatch(StackActions.replace(nextView));
  };

  render() {
    const {} = this.props;
    const {} = this.state;
    const {container} = styles;
    return (
      <View style={container}>
        <StatusBar translucent backgroundColor="transparent" />
        <Image source={{uri: Images.splash}} style={styles.splashImg} />
        {this.state.isVisibleLoader && (
          <Loader isVisible={this.state.isVisibleLoader} />
        )}
      </View>
    );
  }
}

const mapStateToProps = state => {
  const {isConnected} = state.network;
  const {user} = state.user;
  return {user};
};

const mapsDespathToProps = dispatch => {
  return {
    networkConnected,
    networkListener,
  };
};

export default connect(mapStateToProps, mapsDespathToProps)(Splash);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: color.white,
  },
  splashImg: {
    height: '100%',
    width: '100%',
  },
});
