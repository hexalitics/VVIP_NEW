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
  Platform,
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
import Toast from 'react-native-root-toast';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';
import Contacts from 'react-native-contacts';
import IconE from 'react-native-vector-icons/Entypo';
import IconAD from 'react-native-vector-icons/AntDesign';
import IconI from 'react-native-vector-icons/Ionicons';
import IconEI from 'react-native-vector-icons/EvilIcons';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

class ContinueAddedContacts extends Component {
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
      selectedContactForInviteScreen: [],
    };
    this.arrayholder = [];
  }
  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', async () => {
      const vDetails = this.props.route.params.venueDetails;
      console.log('venue details', vDetails);
      this.setState({venueDetails: vDetails}, () => {
        this.getContactList();
      });
    });
  }
  componentWillUnmount() {
    this._unsubscribe();
  }
  getContactList = async () => {
    let phoneContact = [];
    if (Platform.OS === 'android') {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
      ).then(status => {
        if (status === 'granted') {
          Contacts.getAll()
            .then(contacts => {
              //console.log(JSON.stringify(contacts));
              contacts.map((item, index) => {
                //console.log(JSON.stringify(item));
                let phNo = '';
                if (item.phoneNumbers.length > 0) {
                  //phNo = item.phoneNumbers[0].number;
                  item.phoneNumbers.map((phoneNumber, phonenoIndex) => {
                    const temp = {
                      number: phoneNumber.number,
                      fname: item.givenName,
                      lname: item.familyName,
                      fullName: item.displayName,
                      thumbnailPath: item.thumbnailPath,
                      hasThumbnail: item.hasThumbnail,
                    };
                    phoneContact.push(temp);
                  });
                }
              });
              this.setState({contactList: phoneContact});
              this.arrayholder = phoneContact;
            })
            .catch(e => {
              console.log(e);
              //Toast.show('Contact list access permission not granted');
            });
        } else {
          //console.log('Permission not granted for Contact list');
          Toast.show('Contact list access permission not granted');
        }
      });
    } else if (Platform.OS === 'ios') {
      Contacts.getAll()
        .then(contacts => {
          console.log('AllContacts', contacts);
          //this.setState({contactList: contacts});
          contacts.map((item, index) => {
            let phNo = '';
            if (item.phoneNumbers.length > 0) {
              phNo = item.phoneNumbers[0].number;
            }
            const temp = {
              number: phNo,
              fname: item.givenName,
              lname: item.familyName,
              thumbnailPath: item.thumbnailPath,
              hasThumbnail: item.hasThumbnail,
            };
            phoneContact.push(temp);
          });
          this.setState({contactList: phoneContact});
          this.arrayholder = phoneContact;
        })
        .catch(e => {
          console.log(e);
        });
    }
    console.log(JSON.stringify(this.state.contactList));
  };
  selectContact = item => {
    //console.log('selected numbers ', JSON.stringify(item));
    const stateActionMobileNumbers = this.state.isActivePhoneNumbers;
    const selectedContactForInviteScreen =
      this.state.selectedContactForInviteScreen;
    const selectedNumberIndex = stateActionMobileNumbers.findIndex(
      obj => obj.phoneNumber === item.number,
    );
    console.log('is index found ', selectedNumberIndex);
    if (selectedNumberIndex >= 0) {
      //stateActionMobileNumbers.splice(selectedNumberIndex, 1);
      //selectedContactForInviteScreen.splice(selectedNumberIndex, 1);
    } else {
      let temp = {
        phoneNumber: item.number,
        name: item.fullName,
        fname: item.fname,
        lname: item.lname,
        thumbnailPath: item.thumbnailPath,
        hasThumbnail: item.hasThumbnail,
      };
      //console.log('selected numbers ', JSON.stringify(temp));
      stateActionMobileNumbers.push(temp);
      selectedContactForInviteScreen.push(item);
    }
    this.setState({
      isActivePhoneNumbers: stateActionMobileNumbers,
      selectedContactForInviteScreen: selectedContactForInviteScreen,
    });
  };
  listItem = ({item}) => {
    const firstLetter = item.fname.charAt(0);
    const lastLetter = item.lname.charAt(0);
    let nameAbb = firstLetter + lastLetter;
    nameAbb = nameAbb.toUpperCase();
    //The mobile is existed or not
    let isPhoneNoFound = false;
    let theNumberExistedInState = false;
    if (item.number.length > 0) {
      isPhoneNoFound = true;
    }
    if (isPhoneNoFound) {
      if (this.state.isActivePhoneNumbers.length > 0) {
        const selectedNumberIndex = this.state.isActivePhoneNumbers.findIndex(
          obj => obj.number === item.number,
        );
        if (selectedNumberIndex >= 0) {
          theNumberExistedInState = true;
          //alert('Yes, the value exists!');
        }
      }

      return (
        <TouchableOpacity
          onPress={() => {
            this.selectContact(item);
          }}>
          <View
            style={{
              flexDirection: 'row',
              marginRight: 20,
              marginBottom: 5,
              backgroundColor: '#fff',
              padding: 15,
              borderRadius: 5,
              width: '100%',
            }}>
            <View>
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
              {theNumberExistedInState && (
                <Image
                  style={{
                    width: 15,
                    height: 15,
                    position: 'absolute',
                    left: 20,
                    top: '45%',
                  }}
                  source={{uri: 'ic_green_tick'}}
                />
              )}
            </View>
            <View style={{alignSelf: 'flex-start'}}>
              <Text
                style={{
                  marginLeft: 10,
                  fontSize: 15,
                  fontWeight: 'bold',
                  color: theNumberExistedInState ? '#00DCAF' : '#000',
                }}>
                {Platform.OS == 'android'
                  ? item.fullName
                  : item.fname + ' ' + item.lname}
              </Text>
              <Text
                style={{
                  marginLeft: 10,
                  color: theNumberExistedInState ? '#00DCAF' : '#000',
                }}>
                {item.number}
              </Text>
            </View>
            {/* <View
              style={{
                alignSelf: 'center',
                alignItems: 'flex-end',
                width: '50%',
              }}>
              <Text
                style={{
                  color: theNumberExistedInState ? '#00DCAF' : '#000',
                  alignSelf: 'flex-end',
                }}>
                20.00
              </Text>
            </View> */}
          </View>
        </TouchableOpacity>
      );
    }
  };
  listSelectedItem = ({item}) => {
    const firstLetter = item.fname.charAt(0);
    const lastLetter = item.lname.charAt(0);
    let nameAbb = firstLetter + lastLetter;
    nameAbb = nameAbb.toUpperCase();
    //The mobile is existed or not
    let isPhoneNoFound = false;
    let theNumberExistedInState = false;
    if (item.phoneNumber.length > 0) {
      isPhoneNoFound = true;
    }
    if (isPhoneNoFound) {
      if (this.state.isActivePhoneNumbers.length > 0) {
        const selectedNumberIndex = this.state.isActivePhoneNumbers.findIndex(
          obj => obj.phoneNumber === item.phoneNumber,
        );
        if (selectedNumberIndex >= 0) {
          theNumberExistedInState = true;
          //alert('Yes, the value exists!');
        }
      }
      return (
        <>
          {theNumberExistedInState && (
            <View
              style={{
                flexDirection: 'row',
                margin: 5,
                justifyContent: 'flex-start',
                alignItems: 'center',
                height: 70,
              }}>
              <View>
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
                <TouchableOpacity
                  style={{position: 'absolute', right: -5, top: '40%'}}
                  onPress={() => {
                    this.deleteContact(item.phoneNumber);
                  }}>
                  <Image
                    style={{
                      width: 15,
                      height: 15,
                    }}
                    source={{uri: 'ic_cross'}}
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </>
      );
    }
  };
  leftProfileOnPress = () => {
    MoveScreenBack(this.props);
  };
  deleteContact = mobileNumber => {
    //console.log(mobileNumber);
    const stateActionMobileNumbers = this.state.isActivePhoneNumbers;
    const selectedNumberIndex = this.state.isActivePhoneNumbers.findIndex(
      obj => obj.phoneNumber === mobileNumber,
    );
    if (selectedNumberIndex >= 0) {
      stateActionMobileNumbers.splice(selectedNumberIndex, 1);
      //alert('Yes, the value exists!');
    }
    // else {
    //   stateActionMobileNumbers.push(mobileNumber);
    // }
    this.setState({isActivePhoneNumbers: stateActionMobileNumbers});
  };
  rightSearchOnPress = () => {
    this.setState({isSearBarVisible: 1});
  };
  closeSearchBar = async () => {
    this.setState({isSearBarVisible: 0});
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
  moveToInviteScreen = () => {
    if (this.state.isActivePhoneNumbers.length > 0) {
      MoveScreen(this.props, 'Invite', {
        phoneNos: this.state.isActivePhoneNumbers,
        venueDetails: this.state.venueDetails,
        selectedContactForInviteScreen:
          this.state.selectedContactForInviteScreen,
      });
    } else {
      Toast.show('Please select contact to continue invitation');
    }
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
                placeholder="Search with name"
                onChangeText={value => {
                  this.setState({searchData: value}, () => {
                    this.searchContact();
                  });
                }}
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
            rightIcon={<IconEI name="search" size={35} color="#fff" />}
            onPressRight={() => this.rightSearchOnPress()}
          />
        )}
        <View style={[styles.container]}>
          {this.state.isActivePhoneNumbers.length > 0 && (
            <View style={{backgroundColor: '#F2F2F2'}}>
              <FlatList
                horizontal
                style={{
                  backgroundColor: '#F2F2F2',
                  borderWidth: 1,
                  borderColor: '#0082F3',
                }}
                showsHorizontalScrollIndicator={true}
                data={this.state.isActivePhoneNumbers}
                renderItem={this.listSelectedItem}
              />
            </View>
          )}

          <View
            style={{backgroundColor: '#fff', marginLeft: 15, marginRight: 15}}>
            <FlatList
              style={{marginTop: 10}}
              showsVerticalScrollIndicator={true}
              data={this.state.contactList}
              renderItem={this.listItem}
              ListFooterComponent={() => {
                return <View style={{height: 35}}></View>;
              }}
            />
          </View>
        </View>
        <View
          style={{
            bottom: 5,
            padding: 5,
            backgroundColor: 'rgba(52, 52, 52, 0)',
          }}>
          <TouchableOpacity
            style={{alignSelf: 'center', marginTop: 10}}
            onPress={() => {
              this.moveToInviteScreen();
            }}>
            <Text
              style={{
                backgroundColor: '#FF0000',
                color: '#fff',
                padding: 10,
                borderRadius: 5,
                paddingHorizontal: 70,
                alignSelf: 'center',
              }}>
              Continue
            </Text>
          </TouchableOpacity>
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
  return {user};
};
const mapsDespathToProps = dispatch => {
  return {
    networkConnected,
    networkListener,
  };
};
export default connect(
  mapStateToProps,
  mapsDespathToProps,
)(ContinueAddedContacts);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    height: windowHeight,
    //marginTop: 20,
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
});
