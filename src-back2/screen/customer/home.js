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
  StatusBar,
  FlatList,
  Button,
  ImageBackground,
} from 'react-native';

import {connect} from 'react-redux';
import Toast from 'react-native-root-toast';
import {saveAuthReducersData} from '../../redux/action/auth';
import moment from 'moment';

import {
  networkConnected,
  networkListener,
} from '../../redux/action/networkAction';

import {Loader, Images, HeaderBar, SearchBar} from '../../common';

import {
  screen,
  fontSize,
  fontFamily,
  color,
  fontStyle,
} from '../../helper/themeHelper';
import {
  MoveScreen,
  FetchPostWithHeader,
  VSpace,
  HSpace,
  PushScreen,
} from '../../helper/helpers';

import IconAD from 'react-native-vector-icons/AntDesign';
import IconEI from 'react-native-vector-icons/EvilIcons';
import IconE from 'react-native-vector-icons/Entypo';
import IconM from 'react-native-vector-icons/MaterialIcons';
import {TextInput} from 'react-native-gesture-handler';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisibleLoader: false,
      homePageData: [],
      pagination: 0,
      isSearBarVisible: 0,
      searchData: '',
      isRefreshing: false,
    };
  }
  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', async () => {
      this.setState(
        {isVisibleLoader: false, pagination: 0, homePageData: []},
        () => {
          this.getHomePageData();
        },
      );
    });
  }
  componentWillUnmount() {
    this._unsubscribe();
  }
  getHomePageData = () => {
    const page_no = this.state.pagination;
    let postData = {
      search: this.state.searchData,
    };
    // console.log('Post data ' + JSON.stringify(postData));
    // console.log('Page No. ' + page_no);
    // console.log('Token ' + this.props.user.authToken);
    if (this.state.isRefreshing === false) {
      this.setState({isVisibleLoader: true});
    }
    FetchPostWithHeader(
      'api/getVenueList?page=' + (page_no + 1),
      postData,
      this.props.user.authToken,
    ).then(result => {
      this.setState({isVisibleLoader: false});
      console.log('home data : ', JSON.stringify(result.data.data));
      if (result.status == 400) {
        this.setState({isRefreshing: false});
        Toast.show(result.message);
      } else if (result.status == 200) {
        //console.log('Response data ' + JSON.stringify(result));
        if (result.data.data && result.data.data.length) {
          let loadData = this.state.homePageData;
          if (loadData.length) {
            result.data.data.map((item, index) => {
              loadData.push(item);
            });
            this.setState({
              homePageData: loadData,
              pagination: page_no + 1,
              isRefreshing: false,
            });
          } else {
            this.setState({
              homePageData: result.data.data,
              pagination: page_no + 1,
              isRefreshing: false,
            });
          }
        }
      }
    });
  };
  searchHomePageData = async () => {
    this.setState({pagination: 0, homePageData: []}, () => {
      this.getHomePageData();
    });
  };
  handleOnReachEndScroll = () => {
    console.log('Scroll Down');
    this.getHomePageData();
  };
  pullToRefresh = () => {
    console.log('Pull to Refresh');
    this.setState(
      {
        isRefreshing: true,
        isSearBarVisible: 0,
        searchData: '',
        pagination: 0,
        homePageData: [],
      },
      () => {
        this.getHomePageData();
      },
    );
  };
  homePageDataItem = ({item}) => {
    return (
      <View
        style={{
          marginBottom: 63,
          //borderBottomColor: '#E7EBEC',
          //borderBottomWidth: 1,
          //paddingBottom: 15,
          marginHorizontal: 15,
        }}
        key={item.id}>
        <View>
          <ImageBackground
            style={{
              width: '100%',
              height: 255,
              resizeMode: 'cover',
              borderRadius: 5,
            }}
            source={{uri: 'default_event_img'}}>
            <Image
              source={{uri: item.venue_url}}
              style={{
                width: '100%',
                height: 255,
                resizeMode: 'cover',
                borderRadius: 5,
              }}
            />
          </ImageBackground>
        </View>
        <View style={styles.itemTitle}>
          <View style={{width: '70%'}}>
            <Text
              style={{
                color: '#425154',
                fontSize: 18,
                fontWeight: 'bold',
                marginBottom: 5,
              }}>
              <IconM name="stacked-bar-chart" size={20} color="#ED0817" />
              {item.name}
            </Text>
            <Text style={{color: '#949FA2', marginBottom: 10}}>
              <IconE name="location-pin" size={20} />
              {item.location}
            </Text>
          </View>
          {/* <Text style={{fontWeight: 'bold', fontSize: 13}}>
            {moment(item.createdAt).format('ddd, D MMMM')}
          </Text> */}
          <View style={{width: '30%', margin: 5, justifyContent: 'center'}}>
            {item.status === 'checkin' ? (
              <TouchableOpacity
                onPress={() => {
                  this.pushScreenWithData('CheckIn', item);
                }}>
                <Text style={styles.listButton}>Check In</Text>
              </TouchableOpacity>
            ) : item.status === 'checkedIn' ? (
              <TouchableOpacity>
                <Text style={styles.listButton}>Checked In</Text>
              </TouchableOpacity>
            ) : item.status === 'noAccess' ? (
              <TouchableOpacity>
                <Text style={styles.listButton}>Request</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity>
                <Text style={styles.listSignUpButton}>Sign Up</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  };
  goToNextView = nextView => {
    this.props.navigation.reset({
      index: 0,
      routes: [{name: nextView}],
    });
  };
  rightSearchOnPress = () => {
    this.setState({isSearBarVisible: 1});
  };
  closeSearchBar = async () => {
    if (
      this.state.searchData != '' ||
      this.state.pagination > 0 ||
      this.state.homePageData.length == 0
    ) {
      this.setState(
        {isSearBarVisible: 0, searchData: '', pagination: 0, homePageData: []},
        () => {
          this.getHomePageData();
        },
      );
    } else {
      this.setState({isSearBarVisible: 0});
    }
  };
  rightMenuOnPress = () => {
    MoveScreen(this.props, 'ProfileMenu');
  };
  leftProfileOnPress = () => {
    console.log('left menu pressed');
  };
  pushScreenWithData = (routeName, Data) => {
    PushScreen(this.props, routeName, Data);
  };
  render() {
    return (
      <>
        {this.state.isSearBarVisible ? (
          <SearchBar
            searchInput={
              <TextInput
                style={{
                  flex: 1,
                  borderWidth: 1,
                  backgroundColor: '#fff',
                  borderRadius: 5,
                  width: '80%',
                  margin: 5,
                  height: 40,
                  paddingLeft: 8,
                }}
                placeholder="Search with name and address"
                onChangeText={value => {
                  this.setState({searchData: value});
                }}
              />
            }
            submitSearchButton={
              <TouchableOpacity
                onPress={() => {
                  this.searchHomePageData();
                }}
                style={{position: 'absolute', right: 30, zIndex: 1}}>
                <IconEI name="search" size={35} color="#000" />
              </TouchableOpacity>
            }
            closeButton={
              <TouchableOpacity
                style={{width: '5%'}}
                onPress={() => {
                  this.closeSearchBar();
                }}>
                <IconAD name="close" size={15} color="#fff" />
              </TouchableOpacity>
            }
          />
        ) : (
          <HeaderBar
            leftIcon={
              this.props.user.profileImage === ''
                ? 'ic_user'
                : this.props.user.profileImage
            }
            //onPressLeft={() => leftProfileOnPress()}
            leftProfileName={
              this.props.user.profileName === '' ? (
                <>{''}</>
              ) : (
                <>{this.props.user.profileName}</>
              )
            }
            leftProfileTitle="VVIP PASS"
            rightIcon={<IconEI name="search" size={35} color="#fff" />}
            onPressRight={() => this.rightSearchOnPress()}
            rightMenuIcon={
              <IconE name="dots-three-vertical" size={25} color="#fff" />
            }
            rightMenuOnPress={() => this.rightMenuOnPress()}
          />
        )}
        {/* {this.state.homePageData.lenght == 0 && (
          <Text style={{alignSelf: 'center', marginTop: 15}}>
            No Record Found
          </Text>
        )} */}
        <View style={styles.container}>
          <FlatList
            style={{marginTop: 50}}
            showsVerticalScrollIndicator={false}
            data={this.state.homePageData}
            renderItem={this.homePageDataItem}
            onEndReached={this.handleOnReachEndScroll}
            refreshing={this.state.isRefreshing}
            onRefresh={this.pullToRefresh}
          />
          {this.state.isVisibleLoader && (
            <Loader isVisible={this.state.isVisibleLoader} />
          )}
        </View>
      </>
    );
  }
}

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

export default connect(mapStateToProps, mapsDespathToProps)(Home);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2EEFD',
    //marginTop: 50,
  },
  listButton: {
    backgroundColor: '#00D59E',
    borderRadius: 5,
    color: '#fff',
    padding: 10,
    alignSelf: 'center',
  },
  listSignUpButton: {
    backgroundColor: '#FF0000',
    borderRadius: 5,
    color: '#fff',
    padding: 10,
  },
  itemTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '95%',
    borderRadius: 5,
    backgroundColor: '#fff',
    alignSelf: 'center',
    position: 'absolute',
    padding: 10,
    bottom: -50,
  },
});
