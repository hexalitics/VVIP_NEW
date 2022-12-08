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
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';
import Contacts from 'react-native-contacts';
import moment from 'moment';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import IconE from 'react-native-vector-icons/Entypo';
import IconAD from 'react-native-vector-icons/AntDesign';
import IconFA from 'react-native-vector-icons/FontAwesome';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

class Invite extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisibleLoader: false,
      isTodayFuture: 0, //0 for Today, 1 for Future
      contactList: [],
      isQrScannerActive: false,
      isActivePhoneNumbers: [],
      groupName: '',
      invitationText: '',
      fromDate: moment(new Date()).format('YYYY-MM-DD'),
      toDate: moment(new Date()).format('YYYY-MM-DD'),
      isVisibleDatePicker: false,
      datePickerFor: '',
      radio_props: [
        {label: 'Today', value: 'T'},
        {label: 'Tomorrow', value: 'TW'},
        {label: 'Unlimited Access', value: 'U'},
        {label: 'Date Range', value: 'D'},
      ],
      dateUnlimited: 'T',
      isFromToDate: -1, //0 for from date and 1 for to date
      venueData: '',
      selectedContactForInviteScreen: [],
    };
  }
  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', async () => {
      console.log('invite Data', JSON.stringify(this.props.route.params));
      const data = this.props.route.params.phoneNos;
      const venueDetails = this.props.route.params.venueDetails;
      const selectedContactForInviteScreen =
        this.props.route.params.selectedContactForInviteScreen;
      console.log(data);
      this.setState(
        {
          isActivePhoneNumbers: data,
          venueData: venueDetails,
          selectedContactForInviteScreen,
        },
        () => {
          this.getContactList();
        },
      );
    });
  }
  componentWillUnmount() {
    this._unsubscribe();
  }
  getContactList = async () => {
    this.setState({contactList: this.state.selectedContactForInviteScreen});
  };
  selectContact = mobileNumber => {
    console.log(mobileNumber);
    const stateActionMobileNumbers = this.state.isActivePhoneNumbers;
    if (stateActionMobileNumbers.indexOf(mobileNumber) !== -1) {
      var numberIndex = stateActionMobileNumbers.indexOf(mobileNumber);
      stateActionMobileNumbers.splice(numberIndex, 1);
      //alert('Yes, the value exists!');
    } else {
      stateActionMobileNumbers.push(mobileNumber);
    }
    this.setState({isActivePhoneNumbers: stateActionMobileNumbers});
  };
  listSelectedItem = ({item}) => {
    const firstLetter = item.fname.charAt(0);
    const lastLetter = item.lname.charAt(0);
    let nameAbb = firstLetter + lastLetter;
    nameAbb = nameAbb.toUpperCase();
    //The mobile is existed or not
    let isPhoneNoFound = false;
    let theNumberExistedInState = false;
    const selectedNumberIndex = this.state.isActivePhoneNumbers.findIndex(
      obj => obj.phoneNumber === item.number,
    );
    if (selectedNumberIndex >= 0) {
      isPhoneNoFound = true;
    }
    if (isPhoneNoFound) {
      if (this.state.isActivePhoneNumbers.length > 0) {
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
                backgroundColor: '#F2F2F2',
                margin: 5,
                justifyContent: 'flex-start',
                height: 60,
              }}>
              <View style={{}}>
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
                    this.deleteContact(item.number);
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
    const stateActionMobileNumbers = this.state.isActivePhoneNumbers;
    const selectedNumberIndex = this.state.isActivePhoneNumbers.findIndex(
      obj => obj.phoneNumber === mobileNumber,
    );
    if (selectedNumberIndex >= 0) {
      stateActionMobileNumbers.splice(selectedNumberIndex, 1);
    }
    this.setState({isActivePhoneNumbers: stateActionMobileNumbers});
  };
  handleConfirm = date => {
    if (this.state.datePickerFor === 'fromDate') {
      this.setState({fromDate: date});
    } else if (this.state.datePickerFor === 'toDate') {
      this.setState({toDate: date});
    }
    this.hideDatePicker();
  };
  hideDatePicker = () => {
    this.setState({isVisibleDatePicker: false});
  };
  selectOptions = value => {
    if (value === 'T') {
      this.setState({
        fromDate: moment(new Date()).format('YYYY-MM-DD'),
        toDate: moment(new Date()).format('YYYY-MM-DD'),
      });
    } else if (value === 'TW') {
      this.setState({
        fromDate: moment(new Date()).add(1, 'days').format('YYYY-MM-DD'),
        toDate: moment(new Date()).add(1, 'days').format('YYYY-MM-DD'),
      });
    } else if (value === 'U') {
      this.setState({
        fromDate: '',
        toDate: '',
      });
    } else if (value === 'D') {
      this.setState({
        fromDate: moment(new Date()).format('YYYY-MM-DD'),
        toDate: moment(new Date()).format('YYYY-MM-DD'),
      });
    }
    this.setState({dateUnlimited: value});
  };
  inviteUsers = () => {
    if (this.state.dateUnlimited === 'D') {
      const fromdata = moment(this.state.fromDate).format('YYYY-MM-DD');
      const todata = moment(this.state.toDate).format('YYYY-MM-DD');
      if (fromdata > todata) {
        Toast.show('"To" date must be greater than "From" date');
        return false;
      }
    }
    // const postData = new FormData();
    // postData.append('venueId', this.state.venueData.id);
    // postData.append('invitedVVIPDateStart', this.state.fromDate);
    // postData.append('invitedVVIPDateEnd', this.state.toDate);
    // postData.append('VVIPGuests', this.state.groupName);
    // postData.append(
    //   'isUnliimitedAccess',
    //   this.state.dateUnlimited === 'U' ? 1 : 0,
    // );
    // postData.append('message', this.state.invitationText);
    // postData.append('inivtedUser', this.state.isActivePhoneNumbers);
    let postData = {
      venueId: this.state.venueData.id,
      invitedVVIPDateStart:
        this.state.dateUnlimited === 'U'
          ? ''
          : moment(this.state.fromDate).format('YYYY-MM-DD'),
      invitedVVIPDateEnd:
        this.state.dateUnlimited === 'U'
          ? ''
          : moment(this.state.toDate).format('YYYY-MM-DD'),
      VVIPGuests: this.state.groupName,
      isUnliimitedAccess: this.state.dateUnlimited === 'U' ? 1 : 0,
      message: this.state.invitationText,
      inivtedUser: this.state.isActivePhoneNumbers,
    };
    console.log(this.props.user.authToken);
    console.log('invite post data ', JSON.stringify(postData));
    //return false;
    this.setState({isVisibleLoader: true});
    FetchPostWithHeader(
      'api/sendInvitation',
      postData,
      this.props.user.authToken,
    ).then(result => {
      console.log('Invite Response ', JSON.stringify(result));
      if (result.status == 400) {
        this.setState({isVisibleLoader: false});
        Toast.show(result.message);
      } else if (result.status == 200) {
        //console.log('Response data' + JSON.stringify(result));
        Toast.show(result.message);
        MoveScreen(this.props, 'VenuesInvite', {
          venueDetails: this.state.venueData,
        });
      }
    });
  };
  render() {
    return (
      <>
        <HeaderBar
          leftBackNavigation="ic_back_arrow"
          onPressLeft={() => this.leftProfileOnPress()}
          leftText="Back"
        />
        <ScrollView style={[styles.container]}>
          <View style={{backgroundColor: '#F2F2F2'}}>
            <Text style={styles.invitedUserText}>Invited users</Text>
            <FlatList
              horizontal
              style={{marginTop: 10}}
              showsHorizontalScrollIndicator={true}
              data={this.state.contactList}
              renderItem={this.listSelectedItem}
            />
          </View>
          <View style={styles.radioView}>
            <RadioForm formHorizontal={false} animation={false}>
              {this.state.radio_props.map((obj, i) => (
                <RadioButton labelHorizontal={true} key={i}>
                  <RadioButtonInput
                    obj={obj}
                    index={i}
                    isSelected={this.state.dateUnlimited === obj.value}
                    onPress={value => {
                      this.selectOptions(value);
                    }}
                    borderWidth={1}
                    buttonInnerColor={'#00EFD1'}
                    buttonOuterColor={
                      this.state.dateUnlimited === obj.value
                        ? '#00EFD1'
                        : '#000'
                    }
                    buttonSize={10}
                    buttonOuterSize={20}
                    buttonStyle={{paddingVertical: 5, marginVertical: 5}}
                    buttonWrapStyle={{marginLeft: 10}}
                  />
                  <RadioButtonLabel
                    obj={obj}
                    index={i}
                    labelHorizontal={true}
                    onPress={value => {
                      this.selectOptions(value);
                    }}
                    labelStyle={{fontSize: 20, color: '#000'}}
                    labelWrapStyle={{}}
                  />
                </RadioButton>
              ))}
            </RadioForm>
            {/* <RadioForm
              radio_props={this.state.radio_props}
              initial={this.state.dateUnlimited}
              value={this.state.dateUnlimited}
              onPress={value => {
                this.setState({dateUnlimited: value});
              }}
            /> */}
          </View>
          <View style={styles.dateRangeView}>
            <TouchableOpacity
              onPress={() => {
                this.state.dateUnlimited === 'D' &&
                  this.setState({
                    datePickerFor: 'fromDate',
                    isVisibleDatePicker: true,
                    isFromToDate: 0,
                  });
              }}
              style={[
                styles.dateRangeButtons,
                {
                  borderColor:
                    this.state.isFromToDate === 0 ? '#FF0000' : '#000',
                },
              ]}>
              <Text
                style={[
                  styles.datePickerButtonText,
                  {
                    color: this.state.isFromToDate === 0 ? '#FF0000' : '#000',
                  },
                ]}>
                From :{' '}
                {this.state.dateUnlimited === 'U'
                  ? ''
                  : moment(this.state.fromDate).format('DD MMM')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.state.dateUnlimited === 'D' &&
                  this.setState({
                    datePickerFor: 'toDate',
                    isVisibleDatePicker: true,
                    isFromToDate: 1,
                  });
              }}
              style={[
                styles.dateRangeButtons,
                {
                  borderColor:
                    this.state.isFromToDate === 1 ? '#FF0000' : '#000',
                },
              ]}>
              <Text
                style={[
                  styles.datePickerButtonText,
                  {
                    color: this.state.isFromToDate === 1 ? '#FF0000' : '#000',
                  },
                ]}>
                To :{' '}
                {this.state.dateUnlimited === 'U'
                  ? ''
                  : moment(this.state.toDate).format('DD MMM')}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.groupNameTextView}>
            <View
              style={{
                flexDirection: 'row',
                borderWidth: 1,
                borderColor: '#E4E4E4',
                borderRadius: 5,
                marginBottom: 5,
                alignItems: 'center',
                paddingHorizontal: 5,
              }}>
              <IconFA name="user" size={30} color="#000" />
              <TextInput
                style={[styles.groupNameText, {flex: 1}]}
                value={this.state.groupName}
                placeholder="Number of guest(Optional)"
                keyboardType="number-pad"
                onChangeText={value => {
                  this.setState({groupName: value});
                }}
              />
            </View>

            <TextInput
              style={styles.invitationText}
              placeholder="Invitation Text(Optional)"
              multiline={true}
              numberOfLines={4}
              value={this.state.invitationText}
              onChangeText={value => {
                this.setState({invitationText: value});
              }}
            />
          </View>
          <View style={{marginVertical: 10, alignSelf: 'center'}}>
            <TouchableOpacity
              onPress={() => {
                this.inviteUsers();
              }}
              style={{alignSelf: 'center', marginTop: 10}}>
              <Text style={styles.inviteButton}>Invite</Text>
            </TouchableOpacity>
          </View>
          <DateTimePickerModal
            isVisible={this.state.isVisibleDatePicker}
            mode="date"
            onConfirm={this.handleConfirm}
            onCancel={this.hideDatePicker}
          />
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
export default connect(mapStateToProps, mapsDespathToProps)(Invite);

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    backgroundColor: '#fff',
    //height: windowHeight,
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
  inviteButton: {
    backgroundColor: '#FF0000',
    color: '#fff',
    padding: 10,
    borderRadius: 5,
    paddingHorizontal: 80,
    alignSelf: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  dateRangeView: {
    flexDirection: 'row',
    marginHorizontal: 25,
    marginTop: 25,
    justifyContent: 'space-between',
  },
  dateRangeButtons: {
    borderWidth: 1,
    padding: 5,
    width: '48%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioView: {marginHorizontal: 15, marginTop: 20},
  groupNameTextView: {marginHorizontal: 15, marginTop: 15},
  groupNameText: {
    paddingLeft: 5,
  },
  invitationText: {borderWidth: 1, borderRadius: 5, borderColor: '#E4E4E4'},
  invitedUserText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 15,
    color: '#000',
  },
  datePickerButtonText: {
    alignSelf: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
});
