import React, {Component} from 'react';
import {StyleSheet, Platform} from 'react-native';
import {RootSiblingParent} from 'react-native-root-siblings';
import {Provider} from 'react-redux';

import KeyboardManager from 'react-native-keyboard-manager';

import {Loader} from './src/common';
import AppContainer from './src/navigation/appNavigator';

import configureStore from './src/redux/configurStore';
import {PersistGate} from 'redux-persist/integration/react';
import {persistStore, persistReducer} from 'redux-persist';
const store = configureStore();

class App extends Component {
  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    if (Platform.OS === 'ios') KeyboardManager.setEnable(true);
  }

  render() {
    return (
      <RootSiblingParent>
        <Provider store={store}>
          <PersistGate
            loading={<Loader isVisible={true} />}
            persistor={persistStore(store)}>
            <AppContainer />
          </PersistGate>
        </Provider>
      </RootSiblingParent>
    );
  }
}

const styles = StyleSheet.create({});

export default App;
