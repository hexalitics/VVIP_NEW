/**
 * Helpers Functions
 */
import {View} from 'react-native';
import moment from 'moment';
import * as React from 'react';
import {StackActions} from '@react-navigation/native';
const axios = require('axios');
export const navigationRef = React.createRef();

export const DOMAIN = 'http://18.190.107.62/';
export const GOOGLE_MAP_API_KEY = 'AIzaSyDqitish6eMRby16cVxc8OTlSF6jC5nBW0';
export const DEFAULT_IMG =
  'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';

/**
 * Function to convert hex to rgba
 */
export function hexToRgbA(hex, alpha) {
  var c;
  if (/^#([A-Fa-f0-9]{3}){1,2}/.test(hex)) {
    c = hex.substring(1).split('');
    if (c.length === 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = '0x' + c.join('');
    return (
      'rgba(' +
      [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') +
      ',' +
      alpha +
      ')'
    );
  }
  throw new Error('Bad Hex');
}

/**
 * Text Truncate
 */
export function textTruncate(str, length, ending) {
  if (length == null) {
    length = 100;
  }
  if (ending == null) {
    ending = '...';
  }
  if (str.length > length) {
    return str.substring(0, length - ending.length) + ending;
  } else {
    return str;
  }
}

/**
 * Get Date
 */
export function getTheDate(timestamp, format) {
  let time = timestamp * 1000;
  let formatDate = format ? format : 'MM-DD-YYYY';
  return moment(time).format(formatDate);
}

/**
 * Convert Date To Timestamp
 */
export function convertDateToTimeStamp(date, format) {
  let formatDate = format ? format : 'YYYY-MM-DD';
  return moment(date, formatDate).unix();
}

/**
 * Function to return current app layout
 */
export function getAppLayout(url) {
  let location = url.pathname;
  let path = location.split('/');
  return path[1];
}

export const ValidateImage = file => {
  if (!file.name.match(/\.(jpg|jpeg|png|gif|JPG)/)) {
    return true;
  }
};

export const FetchGet = (PATH, access_token = '') => {
  const config = {
    // headers: {Authorization: `Bearer ${access_token}`}
  };
  return axios
    .get(DOMAIN + PATH, config)
    .then(response => response.data)
    .catch(err => err.response);
};
export const FetchPost = (PATH, formData, access_token = '') => {
  const config = {
    // headers: {Authorization: `Bearer ${access_token}`}
  };
  return axios
    .post(DOMAIN + PATH, formData, config)
    .then(response => response.data)
    .catch(err => err.response);
};

export const FetchPostWithHeader = (PATH, formData, access_token = '') => {
  const config = {
    headers: {Authorization: `Bearer ${access_token}`},
  };
  return axios
    .post(DOMAIN + PATH, formData, config)
    .then(response => response.data)
    .catch(err => err.response);
};

export const MoveScreenBack = ({navigation}) => {
  return navigation.goBack();
};

export const MoveScreen = ({navigation}, screenName, extraData) => {
  //console.log(navigation);
  return navigation.navigate(screenName, {...extraData});
};
export const PushScreen = ({navigation}, screenName, extraData) => {
  return navigation.push(screenName, {...extraData});
};
export const ReplaceScreen = ({navigation}, screenName, extraData) => {
  return navigation.replace(screenName, {...extraData});
};
export const MoveScreenToTop = ({navigation}) => {
  return navigation.popToTop();
};

export const ResetStack = ({navigation}, screenName, extraData) => {
  return navigation.reset({
    index: 0,
    routes: [
      {
        name: screenName,
      },
    ],
  });
};
export const ToggleDrawer = ({navigation}) => {
  return navigation.toggleDrawer();
};
export function navigate(name, params) {
  console.log(navigationRef);
  navigationRef.current?.navigate(name, params);
}
export function push(...args) {
  console.log(navigationRef);
  navigationRef.current?.dispatch(StackActions.push(...args));
}

export const validate = (val, rules, connectedValue) => {
  let isValid = true;
  for (let rule in rules) {
    switch (rule) {
      case 'isEmail':
        isValid = isValid && emailValidator(val);
        break;
      case 'minLength':
        isValid = isValid && minLengthValidator(val, rules[rule]);
        break;
      case 'equalTo':
        isValid = isValid && equalToValidator(val, connectedValue[rule]);
        break;
      case 'checkPassword':
        isValid = isValid && passwordChecl(val);
        break;
      case 'notEmpty':
        isValid = isValid && notEmptyValidator(val);
        break;
      case 'nameValid':
        isValid = isValid && nameValidator(val);
        break;
      default:
        isValid = true;
    }
  }

  return isValid;
};

export const validateText = (val, rules, connectedValue) => {
  let isValid = val;
  for (let rule in rules) {
    switch (rule) {
      case 'onlyAcceptNumbers':
        isValid = isValid && onlyAcceptNumber(val);
        break;
      case 'dontAcceptFirstLetterAsZero':
        isValid = isValid && dontAcceptFirstLetterAsZero(val);
        break;
      default:
        isValid = val;
    }
  }

  return isValid;
};

export const VSpace = h => {
  return <View style={{height: h}}></View>;
};

export const HSpace = w => {
  return <View style={{width: w}}></View>;
};

const emailValidator = val => {
  return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    val,
  );
};

const minLengthValidator = (val, minLength) => {
  return val.length >= minLength;
};

const equalToValidator = (val, checkValue) => {
  return val === checkValue;
};

const onlyAcceptNumber = val => {
  return val.replace(/[^0-9]/g, '');
};
const dontAcceptFirstLetterAsZero = val => {
  let checkZero = val.replace(/^0+(?=\d)/, '');
  return checkZero.replace(/[^0-9]/g, '');
};

const notEmptyValidator = val => {
  return val.trim() !== '';
};
const passwordChecl = val => {
  var passw = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
  if (val.match(passw)) {
    return true;
  } else {
    return false;
  }
};
const nameValidator = val => {
  return /^[0-9a-zA-Z \b]+$/.test(val);
};
