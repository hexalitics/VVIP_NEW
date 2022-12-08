import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
} from 'react-native';
import {Loader, Images, HeaderBar} from '../../../common';
import {
  MoveScreen,
  FetchPostWithHeader,
  MoveScreenBack,
} from '../../../helper/helpers';
import {
  networkConnected,
  networkListener,
} from '../../../redux/action/networkAction';
import {connect} from 'react-redux';
import Toast from 'react-native-root-toast';
import IconMC from 'react-native-vector-icons/MaterialCommunityIcons';
import IconFA from 'react-native-vector-icons/FontAwesome';

class ContactUs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisibleLoader: false,
      firstName: '',
      lastName: '',
      email: '',
      message: '',
    };
  }
  contactRequest = () => {
    if (this.state.firstName === '') {
      Toast.show('First Name Required');
      return false;
    } else if (this.state.lastName === '') {
      Toast.show('Last Name Required');
      return false;
    } else if (this.state.email === '') {
      Toast.show('Email Required');
      return false;
    } else if (this.state.message === '') {
      Toast.show('Message Required');
      return false;
    }
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (reg.test(this.state.email) === false) {
      Toast.show('Enter valid email');
      this.setState({email: ''});
      return false;
    }
    console.log(this.props.user.authToken);
    this.setState({isVisibleLoader: true});
    const postData = {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      email: this.state.email,
      message: this.state.message,
    };
    console.log('post data', postData);
    FetchPostWithHeader(
      'api/contactUs',
      postData,
      this.props.user.authToken,
    ).then(result => {
      this.setState({isVisibleLoader: false});
      console.log('Contact us data : ', JSON.stringify(result));
      if (result.status == 400) {
        Toast.show(result.message);
      } else if (result.status == 200) {
        Toast.show(result.message);
        this.leftProfileOnPress();
      }
    });
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
        <ScrollView style={styles.container}>
          <View style={styles.headingView}>
            <Text style={styles.headingText}>Contact Us</Text>
          </View>
          <View style={styles.contactUsForm}>
            <View style={styles.formElementView}>
              <Text style={styles.label}>First Name</Text>
              <View style={styles.inputView}>
                <IconFA style={styles.inputIcon} name="user" size={20} />
                <TextInput
                  placeholder="First Name"
                  keyboardType="default"
                  onChangeText={value => {
                    this.setState({firstName: value});
                  }}
                  style={{height: 45}}
                />
              </View>
            </View>
            <View style={styles.formElementView}>
              <Text style={styles.label}>Last Name</Text>
              <View style={styles.inputView}>
                <IconFA style={styles.inputIcon} name="user" size={20} />
                <TextInput
                  placeholder="Last Name"
                  keyboardType="default"
                  onChangeText={value => {
                    this.setState({lastName: value});
                  }}
                  style={{height: 45}}
                />
              </View>
            </View>
            <View style={styles.formElementView}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputView}>
                <IconMC style={styles.inputIcon} name="email" size={20} />
                <TextInput
                  placeholder="Email"
                  keyboardType="email-address"
                  onChangeText={value => {
                    this.setState({email: value});
                  }}
                  style={{height: 45}}
                />
              </View>
            </View>
            <View style={styles.formElementView}>
              <Text style={styles.label}>Type Your Message</Text>
              <View style={styles.inputView}>
                <TextInput
                  placeholder="Type Your Message"
                  keyboardType="default"
                  multiline={true}
                  numberOfLines={7}
                  onChangeText={value => {
                    this.setState({message: value});
                  }}
                  style={{height: 120}}
                />
              </View>
            </View>
            <View style={[styles.formElementView]}>
              <TouchableOpacity
                onPress={() => {
                  this.contactRequest();
                }}
                style={styles.sendButton}>
                <Text style={styles.buttonText}>SEND</Text>
              </TouchableOpacity>
            </View>
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
export default connect(mapStateToProps, mapsDespathToProps)(ContactUs);

const styles = new StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headingView: {
    padding: 10,
  },
  headingText: {
    color: '#000',
    fontSize: 25,
    fontWeight: 'bold',
  },
  contactUsForm: {},
  formElementView: {
    padding: 5,
    margin: 5,
  },
  label: {
    color: '#000',
    fontSize: 15,
    fontWeight: 'bold',
  },
  inputView: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 5,
    margin: 5,
    borderColor: '#F1F1F1',
  },
  inputIcon: {
    marginHorizontal: 10,
    color: '#000',
  },
  sendButton: {
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: '#ED0817',
    paddingVertical: 10,
    marginHorizontal: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    letterSpacing: 5,
  },
});
