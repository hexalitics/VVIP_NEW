import {Alert, NativeModules, PermissionsAndroid} from 'react-native';
import Moment from 'moment';
import Toast from 'react-native-root-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Contacts from 'react-native-contacts';

import {asyncKeys} from './themeHelper';

export function isNotEmpty(text) {
  try {
    return text.toString().trim().length > 0;
  } catch (e) {
    return false;
  }
}

//Toast
export function showToast(string) {
  Toast.show(string, {animation: true, shadow: true});
}

//AsyncStorage
export function setAsyncValues(key, item) {
  AsyncStorage.setItem(key, item);
}

export function getAsyncValues(key) {
  return AsyncStorage.getItem(key);
}

export function removeAsyncValues(key) {
  return AsyncStorage.removeItem(key);
}

//Logout
export function onLogoutRemoveData() {
  AsyncStorage.getAllKeys((err, keys) => {
    keys.forEach(key => {
      if (key !== asyncKeys.LANGUAGE || key !== asyncKeys.OPEN_FIRST_TIME) {
        AsyncStorage.removeItem(key);
      }
    });
  });
}

//Date formatting methods
export function getDateInFormat(strDate, format) {
  Moment.locale('en');
  return Moment(strDate).format(format);
}

//Alert
export function showAlert(title, message) {
  return Alert.alert(title, message, [{text: 'Ok', onPress: () => {}}], {
    cancelable: false,
  });
}
export async function androidGetContactList() {
  return await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
  ).then(status => {
    if (status === 'granted') {
      Contacts.getAll()
        .then(contacts => contacts)
        .catch(e => {
          console.log(e);
          //Toast.show('Contact list access permission not granted');
        });
    }
  });
}
export async function iosGetContactList() {
  return Contacts.getAll()
    .then(contacts => {
      return contacts;
    })
    .catch(e => {
      console.log(e);
    });
}
