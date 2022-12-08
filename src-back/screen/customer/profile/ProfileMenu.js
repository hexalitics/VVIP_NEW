import React, {Component} from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import {Loader, Images, ProfileHeaderBar} from '../../../common';
import {MoveScreen, MoveScreenBack} from '../../../helper/helpers';
import {
  screen,
  fontSize,
  fontFamily,
  color,
  fontStyle,
} from '../../../helper/themeHelper';
import {
  networkConnected,
  networkListener,
} from '../../../redux/action/networkAction';
import {connect} from 'react-redux';
import Toast from 'react-native-root-toast';
import Share from 'react-native-share';
import IconAD from 'react-native-vector-icons/AntDesign';
import {ScrollView} from 'react-native-gesture-handler';
import {saveAuthReducersData} from '../../../redux/action/auth';

class ProfileMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  shareApp = async () => {
    let options = {
      //message: 'VVVIP',
      //title: 'Testing..',
      url: 'https://react-native-share.github.io/react-native-share/docs/share-open',
    };
    Share.open(options)
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        err && console.log(err);
      });
  };
  leftProfileOnPress = () => {
    MoveScreenBack(this.props);
  };
  logout = () => {
    this.props.saveAuthReducersData('user', {});
    this.props.saveAuthReducersData('authToken', '');
    this.goToNextView('Login');
  };
  goToNextView = nextView => {
    this.props.navigation.reset({
      index: 0,
      routes: [{name: nextView}],
    });
  };
  render() {
    return (
      <>
        <ProfileHeaderBar
          leftBackNavigation="ic_back_arrow"
          onPressLeft={() => this.leftProfileOnPress()}
          leftText="Back"
          ProfileImage={
            this.props.user.profileImage === ''
              ? 'ic_user'
              : this.props.user.profileImage
          }
          ProfileName={
            this.props.user.profileName === '' ? (
              <>{''}</>
            ) : (
              this.props.user.profileName
            )
          }
          ProfileTitle="VVIP PASS"
        />
        <ScrollView>
          <View style={styles.container}>
            <View style={styles.menuList}>
              <TouchableOpacity
                onPress={() => {
                  MoveScreen(this.props, 'AboutUs');
                }}
                style={[styles.menuItem, {backgroundColor: '#fff'}]}>
                <View style={styles.itemContent}>
                  <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                    About Us
                  </Text>
                  <IconAD name="right" size={20} />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  this.shareApp();
                }}
                style={[styles.menuItem, {backgroundColor: '#fff'}]}>
                <View style={styles.itemContent}>
                  <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                    Share the app
                  </Text>
                  <IconAD name="right" size={20} />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.menuItem, {backgroundColor: '#fff'}]}>
                <View style={styles.itemContent}>
                  <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                    Rate the app
                  </Text>
                  <IconAD name="right" size={20} />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  MoveScreen(this.props, 'ContactUs');
                }}
                style={[styles.menuItem, {backgroundColor: '#fff'}]}>
                <View style={styles.itemContent}>
                  <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                    Contact Us
                  </Text>
                  <IconAD name="right" size={20} />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  MoveScreen(this.props, 'TermsConditions');
                }}
                style={[styles.menuItem, {backgroundColor: '#fff'}]}>
                <View style={styles.itemContent}>
                  <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                    Term and conditions
                  </Text>
                  <IconAD name="right" size={20} />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  //MoveScreen(this.props, 'TermsConditions');
                }}
                style={[styles.menuItem, {backgroundColor: '#fff'}]}>
                <View style={styles.itemContent}>
                  <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                    Privacy Policy
                  </Text>
                  <IconAD name="right" size={20} />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  this.logout();
                }}
                style={[styles.menuItem, {backgroundColor: '#fff'}]}>
                <View style={styles.itemContent}>
                  <Text style={{fontSize: 18, fontWeight: 'bold'}}>Logout</Text>
                  <IconAD name="right" size={20} />
                </View>
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
    saveAuthReducersData: (stateName, stateData) =>
      dispatch(saveAuthReducersData(stateName, stateData)),
  };
};
export default connect(mapStateToProps, mapsDespathToProps)(ProfileMenu);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.white,
    marginHorizontal: 15,
    backgroundColor: '#f9f9f9',
  },
  menuList: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignContent: 'center',
    marginTop: 10,
  },
  menuItem: {
    margin: 10,
    padding: 10,
    borderRadius: 5,
  },
  itemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
});
