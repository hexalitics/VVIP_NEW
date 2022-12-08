import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  PermissionsAndroid,
  FlatList,
  TextInput,
  Alert,
} from 'react-native';
import {Loader, Images, HeaderBar, SearchBar} from '../../../common';
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
import moment from 'moment';
import Toast from 'react-native-root-toast';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';
import Contacts from 'react-native-contacts';
import CheckBox from '@react-native-community/checkbox';
import IconE from 'react-native-vector-icons/Entypo';
import IconAD from 'react-native-vector-icons/AntDesign';
import IconI from 'react-native-vector-icons/Ionicons';
import IconEI from 'react-native-vector-icons/EvilIcons';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
class VenuesInvite extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisibleLoader: false,
      isTodayFuture: 0, //0 for Today, 1 for Future
      contactList: [],
      isQrScannerActive: false,
      isActivePhoneNumbers: [],
      isSearBarVisible: 0,
      searchData: '',
      venueDetails: '',
      totalContact: 0,
      totalChecked: 0,
      totalFutureContact: 0,
      includeGuests: false,
    };
    this.arrayholder = [];
  }
  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', async () => {
      this.setState(
        {venueDetails: this.props.route.params.venueDetails},
        () => {
          this.getContactList();
        },
      );
    });
    //this.getContactList();
  }
  componentWillUnmount() {
    this._unsubscribe();
  }
  onQRCodeRead = code => {
    //console.log('QR code ', code.data);
    //return false;
    this.setState({isQrScannerActive: false});
    this.setState({isVisibleLoader: true});
    let postData = {
      venueId: this.state.venueDetails.id,
      code: code.data,
    };
    console.log('QR Code post data ', JSON.stringify(postData));
    //console.log(this.props.user.authToken);
    FetchPostWithHeader(
      'api/verifyCheckIn',
      postData,
      this.props.user.authToken,
    ).then(result => {
      console.log('qr code reader ', JSON.stringify(result));
      if (result.status == 400) {
        this.setState({isVisibleLoader: false});
        Toast.show(result.message);
      } else if (result.status == 200) {
        Toast.show(result.message);
        this.getContactList();
      }
    });
  };
  getContactList = async () => {
    let phoneContact = [];
    const venueData = this.props.route.params.venueDetails;
    this.setState({isVisibleLoader: true});
    let postData = {
      venueId: venueData.id,
    };
    console.log('post data ', JSON.stringify(postData));
    console.log(this.props.user.authToken);
    FetchPostWithHeader(
      'api/todayVenueInvitationList',
      postData,
      this.props.user.authToken,
    ).then(result => {
      this.setState({isVisibleLoader: false});
      if (result.status == 400) {
        Toast.show(result.message);
      } else if (result.status == 200) {
        console.log('Response data' + JSON.stringify(result));
        let contactDetails = [];
        let totalContact = 0;
        let totalChecked = 0;
        if (result.data.length > 0) {
          result.data.map((item, index) => {
            let first = '';
            let last = '';
            let fullname = '';
            let phone = '';
            let countyCode = '';
            if (item.user_info !== null) {
              [first, last] = item.user_info.name.split(' ');
              fullname = item.user_info.name;
              phone = item.user_info.phoneNumber;
              countyCode = item.user_info.countyCode;
            } else {
              [first, last] = item.invitedVVIPName.split(' ');
              fullname = item.invitedVVIPName;
              phone = item.invitedVVIPphoneNumber;
              countyCode = item.invitedVVIPcountyCode;
            }
            //console.log('last name ', last);
            let lastname = last !== 'undefined' ? last : first;
            const temp = {
              fname: first,
              lname: '',
              fullName: fullname,
              number: phone,
              countyCode: countyCode,
              venueId: item.venueId,
              id: item.id,
              status: item.status,
              isChecked: item.isChecked,
              activity_id: item.id,
              invittedVVIPId: item.invittedVVIPId,
              VVIPGuests: item.VVIPGuests,
              isUnliimitedAccess: item.isUnliimitedAccess,
              invitedVVIPDateEnd: item.invitedVVIPDateEnd,
              invitedVVIPDateStart: item.invitedVVIPDateStart,
            };
            totalContact++;
            if (item.isChecked === 1) {
              totalChecked++;
            }
            contactDetails.push(temp);
            //console.log(JSON.stringify(temp));
          });
        }
        this.setState({
          contactList: contactDetails,
          totalContact: totalContact,
          totalChecked: totalChecked,
        });
      }
    });
    console.log(JSON.stringify(this.state.contactList));
  };
  getFutureContact = async () => {
    let phoneContact = [];
    this.setState({isVisibleLoader: true});
    let postData = {
      venueId: this.state.venueDetails.id,
    };
    // console.log('post data ', JSON.stringify(postData));
    // console.log(this.props.user.authToken);
    FetchPostWithHeader(
      'api/futureVenueInvitationList',
      postData,
      this.props.user.authToken,
    ).then(result => {
      this.setState({isVisibleLoader: false});
      if (result.status == 400) {
        Toast.show(result.message);
      } else if (result.status == 200) {
        console.log('Response data' + JSON.stringify(result));
        let contactFutureDetails = [];
        let totalFutureContact = 0;
        //let totalChecked = 0;
        if (result.data.length > 0) {
          result.data.map((item, index) => {
            let first = '';
            let last = '';
            let fullname = '';
            let phone = '';
            let countyCode = '';
            if (item.user_info !== null) {
              [first, last] = item.user_info.name.split(' ');
              fullname = item.user_info.name;
              phone = item.user_info.phoneNumber;
              countyCode = item.user_info.countyCode;
            } else {
              [first, last] = item.invitedVVIPName.split(' ');
              fullname = item.invitedVVIPName;
              phone = item.invitedVVIPphoneNumber;
              countyCode = item.invitedVVIPcountyCode;
            }
            //console.log('first name ', first);
            let lastname = last === 'undefined' ? first : last;
            let temp = {
              fname: first,
              lname: lastname,
              fullName: fullname,
              number: phone,
              countyCode: countyCode,
              venueId: item.venueId,
              id: item.id,
              status: item.status,
              isChecked: item.isChecked,
              activity_id: item.id,
              invittedVVIPId: item.invittedVVIPId,
              VVIPGuests: item.VVIPGuests,
              isUnliimitedAccess: item.isUnliimitedAccess,
              invitedVVIPDateStart: item.invitedVVIPDateStart,
              invitedVVIPDateEnd: item.invitedVVIPDateEnd,
            };
            totalFutureContact++;
            // if (item.isChecked === 1) {
            //   totalChecked++;
            // }
            contactFutureDetails.push(temp);
            //console.log('temporary ', temp);
          });
        }
        //console.log('contact details : ', contactFutureDetails);
        this.setState({
          contactList: contactFutureDetails,
          totalFutureContact: totalFutureContact,
        });
      }
    });
    //console.log(JSON.stringify(this.state.contactList));
  };
  selectContact = mobileNumber => {
    // console.log(mobileNumber);
    // const stateActionMobileNumbers = this.state.isActivePhoneNumbers;
    // if (stateActionMobileNumbers.indexOf(mobileNumber) !== -1) {
    //   var numberIndex = stateActionMobileNumbers.indexOf(mobileNumber);
    //   stateActionMobileNumbers.splice(numberIndex, 1);
    //   //alert('Yes, the value exists!');
    // } else {
    //   stateActionMobileNumbers.push(mobileNumber);
    // }
    // this.setState({isActivePhoneNumbers: stateActionMobileNumbers});
  };
  deleteContact = invittedVVIPId => {
    //console.log('delete mobile ', invittedVVIPId);
    Alert.alert('Delete User', 'Are you sure you want to delete this user?', [
      {
        text: 'No',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: () => {
          this.setState({isVisibleLoader: true});
          let postData = {
            venueId: this.state.venueDetails.id,
            activity_id: invittedVVIPId,
          };
          console.log('post data ', JSON.stringify(postData));
          console.log(this.props.user.authToken);
          FetchPostWithHeader(
            'api/removeVvip',
            postData,
            this.props.user.authToken,
          ).then(result => {
            if (result.status == 400) {
              this.setState({isVisibleLoader: false});
              Toast.show(result.message);
            } else if (result.status == 200) {
              console.log('Response data' + JSON.stringify(result));
              Toast.show(result.message);
              this.getContactList();
            }
          });
        },
      },
    ]);
  };
  editContact = contactDetails => {
    console.log(JSON.stringify(contactDetails));
    const phoneNos = {
      phoneNumber: contactDetails.number,
      name: contactDetails.fullName,
    };
    const venueDetails = contactDetails;
    const selectedContactForInviteScreen = {
      number: contactDetails.number,
      fname: contactDetails.fname,
      lname: contactDetails.lname,
      fullName: contactDetails.fullName,
      thumbnailPath: contactDetails.thumbnailPath,
      hasThumbnail: contactDetails.hasThumbnail,
    };
    MoveScreen(this.props, 'EditInvite', {
      phoneNos: phoneNos,
      venueDetails: venueDetails,
      selectedContactForInviteScreen: selectedContactForInviteScreen,
    });
  };
  listItem = ({item}) => {
    console.log('contact list', item);
    const firstLetter = item.fname === 'undefined' ? ' ' : item.fname.charAt(0); //item.fname.charAt(0);
    const lastLetter = ''; //item.lname === 'undefined' ? ' ' : item.lname.charAt(0);
    let nameAbb = firstLetter + lastLetter;
    nameAbb = nameAbb.toUpperCase();
    let isPhoneNoFound = false;
    //The mobile is existed or not
    let theNumberExistedInState = false;
    if (item.number.length > 0) {
      isPhoneNoFound = true;
    }

    if (isPhoneNoFound) {
      if (item.isChecked === 1) {
        theNumberExistedInState = true;
        //alert('Yes, the value exists!');
      }
      return (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            alignContent: 'center',
            marginHorizontal: 5,
          }}>
          <View
            style={{
              flexDirection: 'row',
              //marginRight: 20,
              marginBottom: 5,
              backgroundColor: '#fff',
              paddingHorizontal: 15,
              paddingVertical: 20,
              borderRadius: 5,
              borderWidth: theNumberExistedInState ? 1 : 0,
              borderColor: theNumberExistedInState ? '#00DCAF' : '',
              justifyContent: 'space-between',
            }}>
            <View>
              <TouchableOpacity
                onPress={() => {
                  this.editContact(item);
                }}>
                {item.hasThumbnail ? (
                  <Image
                    style={{
                      padding: 5,
                      borderRadius: 55,
                      width: 55,
                      height: 55,
                    }}
                    source={{uri: item.thumbnailPath}}
                  />
                ) : (
                  <View
                    style={{
                      backgroundColor: '#000',
                      padding: 5,
                      borderRadius: 55,
                      width: 55,
                      height: 55,
                    }}>
                    <Text
                      style={{color: '#fff', margin: 10, alignSelf: 'center'}}>
                      {nameAbb}
                    </Text>
                  </View>
                )}
                {theNumberExistedInState ? (
                  <Image
                    style={{
                      width: 15,
                      height: 15,
                      position: 'absolute',
                      bottom: -5,
                      left: 20,
                    }}
                    source={{uri: 'ic_green_tick'}}
                  />
                ) : (
                  <Image
                    style={{
                      width: 15,
                      height: 15,
                      position: 'absolute',
                      bottom: -5,
                      left: 20,
                    }}
                    source={{uri: 'ic_gray_tick'}}
                  />
                )}
              </TouchableOpacity>
            </View>
            <View
              style={{
                alignSelf: 'center',
                justifyContent: 'center',
                flex: 1,
              }}>
              <TouchableOpacity
                onPress={() => {
                  this.editContact(item);
                }}>
                <Text
                  style={{marginLeft: 10, fontSize: 15, fontWeight: 'bold'}}>
                  {item.fullName}
                </Text>
                <Text style={{marginLeft: 10}}>{item.number}</Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flex: 0.7,
                justifyContent: 'center',
              }}>
              <Text style={{alignSelf: 'flex-end'}}>
                Guests - {item.VVIPGuests > 0 ? item.VVIPGuests : '00'}
              </Text>
              <Text style={{alignSelf: 'flex-end'}}>
                {item.isUnliimitedAccess === 1
                  ? 'Unlimited'
                  : moment(item.invitedVVIPDateStart).format('MM/DD') +
                    ' - ' +
                    moment(item.invitedVVIPDateEnd).format('MM/DD')}
              </Text>
            </View>
            <TouchableOpacity
              style={{position: 'absolute', top: 10, right: 15}}
              onPress={() => this.deleteContact(item.activity_id)}>
              <IconAD
                style={{alignSelf: 'flex-end'}}
                name="delete"
                size={15}
                color="#FF0006"
              />
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  };
  leftProfileOnPress = () => {
    MoveScreenBack(this.props);
  };
  rightSearchOnPress = () => {
    this.setState({isSearBarVisible: 1});
  };
  closeSearchBar = async () => {
    this.setState({isSearBarVisible: 0, searchData: ''}, () => {
      this.searchContact();
    });
  };
  searchContact = () => {
    const text = this.state.searchData;
    const newData = this.arrayholder.filter(item => {
      const itemData = `${item.fullName.toUpperCase()} ${item.number}`;
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    this.setState({contactList: newData});
    //console.log('all items ', JSON.stringify(this.state.contactList));
  };
  guestCheckBox = newValue => {
    this.setState({includeGuests: newValue});
  };
  getFutureContantList = () => {
    this.setState({isTodayFuture: 1});
    this.getFutureContact();
  };
  pressTodayList = () => {
    this.setState({isTodayFuture: 0});
    this.getContactList();
  };
  render() {
    return (
      <>
        {this.state.isQrScannerActive ? (
          <View
            style={{
              justifyContent: 'center',
              zIndex: 1,
              height: 500,
              width: '100%',
              top: 50,
            }}>
            <QRCodeScanner
              onRead={this.onQRCodeRead}
              //flashMode={RNCamera.Constants.FlashMode.torch}
              // topContent={
              //   <Text>
              //     Go to <Text>wikipedia.org/wiki/QR_code</Text> on your computer
              //     and scan the QR code.
              //   </Text>
              // }
              // bottomContent={
              //   <TouchableOpacity>
              //     <Text>OK. Got it!</Text>
              //   </TouchableOpacity>
              // }
            />
            <View style={{position: 'absolute', top: 10, right: 5}}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({isQrScannerActive: false});
                }}
                style={{alignSelf: 'center'}}>
                {/* <Text style={{fontSize: 15, fontWeight: 'bold', color: '#fff'}}>
                  Close
                </Text> */}
                <IconAD name="close" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
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
                    placeholder="Search with name"
                    onChangeText={value => {
                      this.setState({searchData: value}, () => {
                        this.searchContact();
                      });
                    }}
                    //onTextInput
                  />
                }
                submitSearchButton={
                  <TouchableOpacity
                    onPress={() => {
                      this.searchContact();
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
                leftBackNavigation="ic_back_arrow"
                onPressLeft={() => this.leftProfileOnPress()}
                leftText="Back"
                //rightIcon={<IconEI name="search" size={35} color="#fff" />}
                //onPressRight={() => this.rightSearchOnPress()}
              />
            )}
            <ScrollView style={[styles.container]}>
              <View style={{marginHorizontal: 15}}>
                <Text style={styles.textTitle}>
                  {this.props.route.params.venueDetails.name}
                </Text>
                <Text style={{color: '#949FA2', marginBottom: 10}}>
                  <IconE name="location-pin" size={20} />
                  {this.props.route.params.venueDetails.location}
                </Text>
              </View>
              <View style={styles.vanueStatus}>
                <View
                  style={[styles.vanueStatusItem, {backgroundColor: '#000'}]}>
                  <Image
                    source={{uri: 'ic_vip_pass'}}
                    style={{
                      width: 50,
                      height: 50,
                      resizeMode: 'cover',
                      marginBottom: 10,
                    }}
                  />
                  <Text
                    style={[
                      styles.vanueStatusText,
                      {marginBottom: 10, color: '#fff'},
                    ]}>
                    40
                  </Text>
                  <Text style={[styles.vanueStatusText, {color: '#fff'}]}>
                    Available
                  </Text>
                </View>
                <View
                  style={[
                    styles.vanueStatusItem,
                    {backgroundColor: '#D2F0F8'},
                  ]}>
                  <Image
                    source={{uri: 'ic_used'}}
                    style={{
                      width: 50,
                      height: 50,
                      resizeMode: 'cover',
                      marginBottom: 10,
                    }}
                  />
                  <Text
                    style={[
                      styles.vanueStatusText,
                      {marginBottom: 10, color: '#000'},
                    ]}>
                    50%
                  </Text>
                  <Text
                    style={[
                      styles.vanueStatusText,
                      {marginBottom: 10, color: '#000'},
                    ]}>
                    Used / Day
                  </Text>
                </View>
                <View
                  style={[
                    styles.vanueStatusItem,
                    {backgroundColor: '#EAE8F8'},
                  ]}>
                  <Image
                    source={{uri: 'ic_ticket'}}
                    style={{
                      width: 50,
                      height: 50,
                      resizeMode: 'cover',
                      marginBottom: 10,
                    }}
                  />
                  <Text
                    style={[
                      styles.vanueStatusText,
                      {marginBottom: 10, color: '#000'},
                    ]}>
                    20
                  </Text>
                  <Text
                    style={[
                      styles.vanueStatusText,
                      {marginBottom: 10, color: '#000'},
                    ]}>
                    Total Used
                  </Text>
                </View>
              </View>
              <View style={{marginVertical: 10, marginHorizontal: 15}}>
                <Text style={{fontSize: 20, fontWeight: 'bold', color: '#000'}}>
                  VVIP PASS
                </Text>
                <View style={{flexDirection: 'row', marginTop: 10}}>
                  <CheckBox
                    disabled={false}
                    style={{height: 20, width: 22}}
                    boxType={'square'}
                    tintColor={'#5D5E5D'}
                    onCheckColor={'#5D5E5D'}
                    onTintColor={'#5D5E5D'}
                    value={this.state.includeGuests}
                    onValueChange={newValue => {
                      this.guestCheckBox(newValue);
                    }}
                  />
                  <Text style={styles.includeGuest}>Include Guests</Text>
                </View>
              </View>
              <View style={styles.inviteList}>
                <View style={styles.todayFuture}>
                  <TouchableOpacity
                    onPress={() => {
                      this.pressTodayList();
                    }}>
                    <Text
                      style={[
                        styles.todayFutureText,
                        {
                          color:
                            this.state.isTodayFuture === 0 ? '#000' : '#484848',
                        },
                      ]}>
                      Today({this.state.totalChecked}/{this.state.totalContact})
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      this.getFutureContantList();
                    }}>
                    <Text
                      style={[
                        styles.todayFutureText,
                        {
                          color:
                            this.state.isTodayFuture === 1 ? '#000' : '#484848',
                        },
                      ]}>
                      Future(
                      {this.state.totalFutureContact})
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.buttonStyle}>
                  {this.state.isTodayFuture == 0 ? (
                    <View style={styles.scanAddButton}>
                      <TouchableOpacity
                        onPress={() => {
                          this.setState({isQrScannerActive: true});
                        }}
                        style={styles.scanAddTouchableOpacity}>
                        <Text style={styles.scanAddText}>
                          <IconAD name="scan1" size={18} /> SCAN
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          MoveScreen(this.props, 'ContinueAddedContacts', {
                            venueDetails: this.state.venueDetails,
                          });
                        }}
                        style={styles.scanAddTouchableOpacity}>
                        <Text style={styles.scanAddText}>
                          <IconI name="add-circle" size={18} /> ADD
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={{
                        backgroundColor: '#00D49D',
                        paddingVertical: 10,
                        borderRadius: 5,
                        width: '80%',
                        alignSelf: 'center',
                      }}>
                      <TouchableOpacity
                        onPress={() => {
                          MoveScreen(this.props, 'ContinueAddedContacts', {
                            venueDetails: this.state.venueDetails,
                          });
                        }}>
                        <Text
                          style={{
                            color: '#fff',
                            alignSelf: 'center',
                          }}>
                          <IconI name="add-circle" size={14} /> ADD
                        </Text>
                      </TouchableOpacity>
                    </TouchableOpacity>
                  )}
                </View>
                <View
                  style={{
                    justifyContent: 'center',
                    marginHorizontal: 15,
                  }}>
                  <FlatList
                    style={{marginTop: 10}}
                    showsVerticalScrollIndicator={true}
                    data={this.state.contactList}
                    renderItem={this.listItem}
                  />
                </View>
              </View>
            </ScrollView>
          </>
        )}
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
export default connect(mapStateToProps, mapsDespathToProps)(VenuesInvite);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    height: windowHeight,
    marginTop: 20,
    //marginLeft: 15,
    height: '100%',
  },
  qrCode: {
    marginTop: 5,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 25,
    position: 'absolute',
    bottom: 0,
  },
  textTitle: {
    color: '#425154',
    fontSize: 18,
    fontWeight: 'bold',
  },
  vanueStatus: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignSelf: 'stretch',
    marginHorizontal: 15,
  },
  vanueStatusItem: {
    height: 140,
    width: '30%',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vanueStatusText: {marginBottom: 10, fontSize: 18, fontWeight: 'bold'},
  inviteList: {
    backgroundColor: '#F2F2F2',
    marginTop: 15,
    paddingVertical: 10,
    //paddingHorizontal: 15,
    width: '100%',
    flex: 1,
  },
  todayFuture: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignSelf: 'stretch',
    marginHorizontal: 15,
  },
  todayFutureText: {fontSize: 18, fontWeight: 'bold'},
  buttonStyle: {
    marginTop: 15,
    marginHorizontal: 15,
  },
  scanAddButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
  },
  scanAddTouchableOpacity: {
    backgroundColor: '#00D49D',
    paddingVertical: 10,
    borderRadius: 5,
    width: '49%',
  },
  scanAddText: {
    color: '#fff',
    alignSelf: 'center',
    fontWeight: 'bold',
  },
  includeGuest: {
    textAlign: 'left',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#5D5E5D',
    marginLeft: 20,
    alignSelf: 'center',
  },
});
