import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import {Loader, Images, HeaderBar} from '../../../common';
import {
  MoveScreen,
  FetchPostWithHeader,
  VSpace,
  HSpace,
  MoveScreenBack,
} from '../../../helper/helpers';
import {
  networkConnected,
  networkListener,
} from '../../../redux/action/networkAction';
import {connect} from 'react-redux';
import Toast from 'react-native-root-toast';
import QRCode from 'react-native-qrcode-svg';
import IconE from 'react-native-vector-icons/Entypo';
import IconAD from 'react-native-vector-icons/AntDesign';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

class CheckIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      item: '',
      isVisibleLoader: false,
      counter: 15,
      qrCode: '',
    };
  }
  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', async () => {
      const data = this.props.route.params;
      this.setState({item: data});
      this.getQrCode();
    });
  }
  componentWillUnmount() {
    this._unsubscribe();
  }
  counterStarts = () => {
    const interval = setInterval(() => {
      let count = this.state.counter;
      count--;
      this.setState({counter: count});
      if (count === 0) {
        clearInterval(interval);
      }
    }, 1000);
  };
  getQrCode = () => {
    let postData = {venueId: this.props.route.params.id};
    console.log('Post data ' + JSON.stringify(postData));
    console.log(this.props.user.authToken);
    this.setState({isVisibleLoader: true});
    FetchPostWithHeader(
      'api/userCheckIn',
      postData,
      this.props.user.authToken,
    ).then(result => {
      this.setState({isVisibleLoader: false});
      console.log('data : ', JSON.stringify(result));
      if (result.status == 400) {
        Toast.show(result.message);
      } else if (result.status == 200) {
        this.setState({counter: 15});
        console.log('QR code : ' + result.data.code);
        this.setState({qrCode: result.data.code});
        this.counterStarts();
      }
    });
  };
  resetQrCode = () => {
    this.getQrCode();
  };
  leftProfileOnPress = () => {
    MoveScreenBack(this.props);
  };
  render() {
    return (
      <>
        <HeaderBar
          leftBackNavigation="ic_back_arrow"
          onPressLeft={() => this.leftProfileOnPress()}
          leftText="Back"
        />
        <ScrollView style={[styles.container, {marginTop: 20}]}>
          <View style={{marginHorizontal: 15}}>
            <Text
              style={{
                color: '#425154',
                fontSize: 18,
                fontWeight: 'bold',
              }}>
              {this.state.item.name}
            </Text>
            <Text style={{color: '#949FA2', marginBottom: 10}}>
              <IconE name="location-pin" size={20} />
              {this.state.item.location}
            </Text>
          </View>
          <View style={{marginHorizontal: 15}}>
            <Image
              source={{uri: this.state.item.venue_url}}
              style={{
                width: '100%',
                height: 150,
                resizeMode: 'cover',
                borderRadius: 5,
              }}
            />
          </View>
          <View
            style={[
              styles.qrCode,
              {
                backgroundColor:
                  this.state.counter > 10
                    ? '#C5EADB'
                    : this.state.counter > 5
                    ? '#C4E9F5'
                    : '#FAC7C8',
              },
            ]}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                margin: 10,
                color:
                  this.state.counter > 10
                    ? '#004FDA'
                    : this.state.counter > 5
                    ? '#FF7C00'
                    : '#FF314B',
              }}>
              {this.state.counter} Sec
            </Text>
            {this.state.qrCode !== '' && (
              <QRCode
                value={this.state.qrCode}
                backgroundColor="#fff"
                size={200}
              />
            )}
            <Text style={{marginTop: 20, fontSize: 20}}>
              QR Code cannot be screenshot
            </Text>
            <TouchableOpacity
              onPress={() => {
                this.resetQrCode();
              }}
              disabled={this.state.counter === 0 ? false : true}>
              <Text
                style={{
                  fontSize: 15,
                  marginTop: 5,
                  backgroundColor: '#00D59E',
                  color: '#fff',
                  padding: 10,
                  borderRadius: 5,
                }}>
                <IconAD name="reload1" size={15} style={{marginRight: 5}} />{' '}
                {'   '}
                Reset Now
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        {this.state.isVisibleLoader && (
          <Loader isVisible={this.state.isVisibleLoader} />
        )}
      </>
    );
  }
}
const mapStateToProps = state => {
  const {isConnected} = state.network;
  const user = state.user;
  return {user};
};
const mapsDespathToProps = dispatch => {
  return {
    networkConnected,
    networkListener,
  };
};
export default connect(mapStateToProps, mapsDespathToProps)(CheckIn);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    //height: windowHeight,
  },
  qrCode: {
    flex: 1,
    marginTop: 25,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 20,
    //position: 'absolute',
    //bottom: 0,
  },
});
