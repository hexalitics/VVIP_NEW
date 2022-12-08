import {combineReducers, compose, applyMiddleware, createStore} from 'redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {persistStore, persistReducer} from 'redux-persist';
import thunk from 'redux-thunk';
import NetworkReducer from './reducer/networkReducer';
import AuthReducers from './reducer/auth';

const rootReducer = combineReducers({
  network: NetworkReducer,
  user: AuthReducers,
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: ['ui', 'uberSearch'],
};

let composeEnhancers = compose;

if (__DEV__) {
  composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
}
const persistedReducer = persistReducer(persistConfig, rootReducer);
const configureStore = () => {
  let store = createStore(
    persistedReducer,
    composeEnhancers(applyMiddleware(thunk)),
  );
  //let persistor = persistStore(store);
  //console.log(JSON.stringify(store));
  return store;
};
export default configureStore;
