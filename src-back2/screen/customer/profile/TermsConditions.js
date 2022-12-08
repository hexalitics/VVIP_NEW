import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
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

class TermsConditions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: 'Terms and Condition',
      termsConditions: '',
      isVisibleLoader: false,
    };
  }
  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', async () => {
      this.getTermsConditions();
    });
  }
  componentWillUnmount() {
    this._unsubscribe();
  }
  getTermsConditions = () => {
    //console.log(this.props.user.authToken);
    this.setState({isVisibleLoader: true});
    const postData = {};
    FetchPostWithHeader(
      'api/termsAndCondition',
      postData,
      this.props.user.authToken,
    ).then(result => {
      this.setState({isVisibleLoader: false});
      //console.log('Terms condition data : ', JSON.stringify(result));
      if (result.status == 400) {
        Toast.show(result.message);
      } else if (result.status == 200) {
        //Toast.show(result.message);
        this.setState({termsConditions: result.data});
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
            <Text style={styles.headingText}>{this.state.title}</Text>
          </View>
          <View style={styles.headingView}>
            <Text style={styles.descriptionText}>
              {this.state.termsConditions}
            </Text>
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
export default connect(mapStateToProps, mapsDespathToProps)(TermsConditions);

const styles = new StyleSheet.create({
  container: {
    flex: 1,
  },
  headingView: {
    padding: 10,
  },
  headingText: {
    color: '#000',
    fontSize: 25,
    fontWeight: 'bold',
  },
  descriptionText: {
    color: '#7D7D7D',
    fontSize: 15,
    lineHeight: 23,
    textAlign: 'justify',
  },
});
