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

class MyVvips extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisibleLoader: false,
      homePageData: [],
      pagination: 0,
      isSearBarVisible: 0,
      searchData: '',
      activeUsedStatus: 1, // 1 for Active, 0 for used
    };
  }
  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', async () => {
      this.setState({isVisibleLoader: false});
      if (this.state.activeUsedStatus === 1) {
        this.getHomePageData();
      } else {
        this.getUsedPageData();
      }
    });
    // if (this.state.activeUsedStatus === 1) {
    //   this.getHomePageData();
    // } else {
    //   this.getUsedPageData();
    // }
  }
  componentWillUnmount() {
    this._unsubscribe();
  }
  getUsedPageData = () => {
    const page_no = this.state.pagination;
    let postData = {
      search: this.state.searchData,
    };
    console.log('page no. ' + page_no);
    this.setState({isVisibleLoader: true});
    FetchPostWithHeader(
      'api/usedVenueList?page=' + (page_no + 1),
      postData,
      this.props.user.authToken,
    ).then(result => {
      this.setState({isVisibleLoader: false});
      if (result.status == 400) {
        Toast.show(result.message);
      } else if (result.status == 200) {
        console.log('Response data ' + JSON.stringify(result));
        if (result.data.data && result.data.data.length) {
          let loadData = this.state.homePageData;
          if (loadData.length) {
            result.data.data.map((item, index) => {
              loadData.push(item);
            });
            this.setState({homePageData: loadData, pagination: page_no + 1});
          } else {
            this.setState({
              homePageData: result.data.data,
              pagination: page_no + 1,
            });
          }
        }
      }
    });
  };
  getHomePageData = () => {
    this.setState({isVisibleLoader: true});
    let postData = {
      search: this.state.searchData,
    };
    FetchPostWithHeader(
      'api/getMyVVIPList',
      postData,
      this.props.user.authToken,
    ).then(result => {
      console.log('Active Data ', JSON.stringify(result));
      this.setState({isVisibleLoader: false});
      if (result.status == 400) {
        Toast.show(result.message);
      } else if (result.status == 200) {
        console.log(result);
        if (result.data.data && result.data.data.length) {
          this.setState({homePageData: result.data.data});
        }
      }
    });
  };
  searchData = async () => {
    if (this.state.activeUsedStatus === 1) {
      this.setState({pagination: 0, homePageData: []}, () => {
        this.getHomePageData();
      });
    } else if (this.state.activeUsedStatus === 0) {
      this.setState({pagination: 0, homePageData: []}, () => {
        this.getUsedPageData();
      });
    }
  };
  handleOnReachEndScroll = () => {
    if (this.state.activeUsedStatus === 0) {
      this.getUsedPageData();
    }
  };
  pushScreenWithData = (routeName, Data) => {
    PushScreen(this.props, routeName, Data);
  };
  homePageDataItem = ({item}) => {
    if (this.state.activeUsedStatus === 1) {
      return (
        <View style={{marginBottom: 63, marginHorizontal: 15}}>
          <View>
            <ImageBackground
              source={{uri: 'ic_red_bg'}}
              style={styles.eventGuestDate}>
              <Text style={styles.eventGuestDateText}>
                Guests - {item.VVIPGuests}
              </Text>
              <Text style={styles.eventGuestDateText}>
                {item.isUnliimitedAccess === 1
                  ? 'Unlimited'
                  : moment(item.invitedVVIPDateStart).format('MM/DD') +
                    ' - ' +
                    moment(item.invitedVVIPDateEnd).format('MM/DD')}
              </Text>
            </ImageBackground>
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
            <View
              style={{
                flex: 0.7,
                justifyContent: 'center',
                alignContent: 'center',
                // borderWidth: 1,
              }}>
              <Text
                style={{
                  color: '#425154',
                  fontSize: 18,
                  fontWeight: 'bold',
                  paddingBottom: 5,
                }}>
                <IconM
                  style={{top: 20}}
                  name="stacked-bar-chart"
                  size={20}
                  color="#ED0817"
                />
                {item.name}
              </Text>
              <Text style={{color: '#949FA2'}}>
                <IconE name="location-pin" size={20} />
                {item.location}
              </Text>
            </View>
            <View style={{flex: 0.3, margin: 5, justifyContent: 'center'}}>
              {item.status === 'checkedIn' ? (
                <TouchableOpacity>
                  <Text style={styles.listButton}>Checked In</Text>
                </TouchableOpacity>
              ) : item.status === 'checkin' ? (
                <TouchableOpacity
                  onPress={() => {
                    this.pushScreenWithData('CheckIn', item);
                  }}>
                  <Text style={styles.listButton}>Check In</Text>
                </TouchableOpacity>
              ) : item.status === 'invited' ? (
                <TouchableOpacity>
                  <Text style={styles.listButton}>Invited</Text>
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
    } else if (this.state.activeUsedStatus === 0) {
      return (
        <View style={{marginBottom: 63, marginHorizontal: 15}}>
          <View>
            <ImageBackground
              source={{uri: 'ic_red_bg'}}
              style={styles.eventGuestDate}>
              <Text style={styles.eventGuestDateText}>
                Guests - {item.VVIPGuests}
              </Text>
              <Text style={styles.eventGuestDateText}>
                {item.isUnliimitedAccess === 1
                  ? 'Unlimited'
                  : moment(item.invitedVVIPDateStart).format('MM/DD') +
                    ' - ' +
                    moment(item.invitedVVIPDateEnd).format('MM/DD')}
              </Text>
            </ImageBackground>
            <ImageBackground
              style={{
                width: '100%',
                height: 255,
                resizeMode: 'cover',
                borderRadius: 5,
              }}
              source={{uri: 'default_event_img'}}>
              <Image
                source={{uri: item.venue_info.venue_url}}
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
            <View
              style={{
                flex: 0.7,
                justifyContent: 'center',
                alignContent: 'center',
              }}>
              <Text
                style={{
                  color: '#425154',
                  fontSize: 18,
                  fontWeight: 'bold',
                  paddingBottom: 5,
                }}>
                <IconM
                  style={{top: 20}}
                  name="stacked-bar-chart"
                  size={20}
                  color="#ED0817"
                />
                {item.venue_info.name}
              </Text>
              <Text style={{color: '#949FA2'}}>
                <IconE name="location-pin" size={20} />
                {item.venue_info.location}
              </Text>
            </View>

            {/* <Text style={{marginBottom: 10, fontSize: 12}}>
              Checked in{' '}
              {moment(item.last_check_in_full_time).format('ddd, D MMMM')} at{' '}
              {moment(item.last_check_in_full_time).format('hh:mm A')}
            </Text> */}
            <View
              style={{
                flex: 0.3,
                margin: 5,
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  backgroundColor: '#00D59E',
                  color: '#fff',
                  fontSize: 14,
                  padding: 10,
                  alignSelf: 'center',
                  borderRadius: 5,
                }}>
                {item.status}
              </Text>
            </View>
          </View>
        </View>
      );
    }
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
    if (this.state.activeUsedStatus === 1) {
      this.setState(
        {pagination: 0, searchData: '', homePageData: [], isSearBarVisible: 0},
        () => {
          this.getHomePageData();
        },
      );
    } else if (this.state.activeUsedStatus === 0) {
      this.setState(
        {pagination: 0, searchData: '', homePageData: [], isSearBarVisible: 0},
        () => {
          this.getUsedPageData();
        },
      );
    }
  };
  rightMenuOnPress = () => {
    MoveScreen(this.props, 'ProfileMenu');
  };
  pushScreenWithData = (routeName, Data) => {
    PushScreen(this.props, routeName, Data);
  };
  activePressed = () => {
    this.setState(
      {activeUsedStatus: 1, pagination: 0, homePageData: []},
      () => {
        this.getHomePageData();
      },
    );
  };
  usedPress = () => {
    this.setState(
      {activeUsedStatus: 0, pagination: 0, homePageData: []},
      () => {
        this.getUsedPageData();
      },
    );
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
                  this.searchData();
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
            leftProfileName={
              this.props.user.profileName === '' ? (
                <>{''}</>
              ) : (
                this.props.user.profileName
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
        <View style={styles.activeUsedStyle}>
          <TouchableOpacity
            onPress={() => {
              this.activePressed();
            }}
            style={[
              styles.activeusedStyleItem,
              {
                backgroundColor:
                  this.state.activeUsedStatus == 1 ? '#4200C9' : '#DEDEDE',
              },
            ]}>
            <Text
              style={[
                styles.activeUsedText,
                {color: this.state.activeUsedStatus == 1 ? '#fff' : '#8D8D8D'},
              ]}>
              Active
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.usedPress();
            }}
            style={[
              styles.activeusedStyleItem,
              {
                backgroundColor:
                  this.state.activeUsedStatus == 0 ? '#4200C9' : '#DEDEDE',
              },
            ]}>
            <Text
              style={[
                styles.activeUsedText,
                {color: this.state.activeUsedStatus == 0 ? '#fff' : '#8D8D8D'},
              ]}>
              Used
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.container}>
          <FlatList
            style={{marginTop: 0}}
            showsVerticalScrollIndicator={false}
            data={this.state.homePageData}
            renderItem={this.homePageDataItem}
            onEndReached={this.handleOnReachEndScroll}
          />
        </View>
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

export default connect(mapStateToProps, mapsDespathToProps)(MyVvips);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2EEFD',
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
  activeUsedStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  activeusedStyleItem: {
    width: '50%',
  },
  activeUsedText: {
    paddingVertical: 20,
    fontSize: 18,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  itemTitle: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 15,
    width: '95%',
    height: 95,
    borderRadius: 5,
    backgroundColor: '#fff',
    alignSelf: 'center',
    position: 'absolute',
    paddingVertical: 5,
    bottom: -50,
  },
  eventGuestDate: {
    width: 120,
    height: 55,
    alignSelf: 'flex-end',
    top: 55,
    zIndex: 1,
  },
  eventGuestDateText: {
    color: '#fff',
    fontSize: 12,
    alignSelf: 'center',
  },
});
