import {Platform, Dimensions, PixelRatio, StatusBar} from 'react-native';
//import * as RNLocalize from 'react-native-localize';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

//Guideline sizes are based on standard ~5" screen mobile device
const guidelineBaseWidth = 350;
const guidelineBaseHeight = 680;

const mainScale = size => (SCREEN_WIDTH / guidelineBaseWidth) * size;
const verticalScale = size => (SCREEN_HEIGHT / guidelineBaseHeight) * size;
const moderateScale = (size, factor = 0.5) =>
  size + (mainScale(size) - size) * factor;

const IS_IPAD = SCREEN_HEIGHT / SCREEN_WIDTH < 1.6;
// based on iphone 5s's scale
const scale = SCREEN_WIDTH / 320;

function normalize(size) {
  const newSize = size * scale;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  }
}

export const keys = {
  API_KEY: '',
};

export const asyncKeys = {
  OPEN_FIRST_TIME: 'OPEN_FIRST_TIME',
  USER_DATA: 'USER_DATA',
  USER_TYPE: 'USER_TYPE',
  IS_LOGGED_IN: 'IS_LOGGED_IN',
  USER_TOKEN: 'USER_TOKEN',
  LANGUAGE: 'LANGUAGE',
  MESSAGES: 'MESSAGES',
};

export const userType = {
  STUDENT: 'STUDENT',
  TRAINER: 'TRAINER',
};

export const color = {
  red: '#FF004E',
  black: '#000000',
  white: '#FFFFFF',
  gray: '#50576e',
  blue: '#2EB0B3',
  green: '#46D1A1',
  orange: '#FEA414',
  transparent: 'transparent',
  txtBlack: '#21283C',
  txtGray: '#97A0AE',
  txtBlue: '#397CAD',
  lightGrayBg: '#F4F5FC',
  modalBg: 'rgba(0,0,0,0.6)',
  modalLightBg: 'rgba(98,103,116,0.53)',
  yellowLinear: ['#FFD00D', '#FEA414'],
};

export const fontSize = {
  xxxxsmall: normalize(6),
  xxxsmall: normalize(7),
  xxsmall: normalize(9),
  xsmall: normalize(10),
  minix: normalize(11),
  mini: normalize(12),
  regular: normalize(14),
  small: normalize(15),
  medium: normalize(17),
  mediumx: normalize(18),
  large: normalize(20),
  xlarge: normalize(25),
  bigger: normalize(30),
  xbigger: normalize(35),
  xxbigger: normalize(40),
};

export const fontStyle = {
  italic: 'italic',
  normal: 'normal',
};

export const fontFamily = {
  CairoBlack: 'Cairo-Black',
  CairoBold: 'Cairo-Bold',
  CairoExtraBold: 'Cairo-ExtraBold',
  CairoLight: 'Cairo-Light',
  CairoExtraLight: 'Cairo-ExtraLight',
  CairoMedium: 'Cairo-Medium',
  CairoRegular: 'Cairo-Regular',
  CairoSemiBold: 'Cairo-SemiBold',
};

export const screen = {
  //Screen
  screen: Dimensions.get('window'),
  platform: Platform.OS,
  isIOS: Platform.OS === 'ios',
  isANDROID: Platform.OS === 'android',
  isiPAD: IS_IPAD,
  screenHeight: SCREEN_HEIGHT,
  screenWidth: SCREEN_WIDTH,
  fullScreenHeight: SCREEN_HEIGHT,
  maxUIWidth: 500,
  statusBarHeight: StatusBar.currentHeight,
  //safeareaSize: safearea(),
  moderateScale,
};

// export const localeValue = {
//   locales: RNLocalize.getLocales(),
//   currencies: RNLocalize.getCurrencies(),
//   country: RNLocalize.getCountry(),
//   calendar: RNLocalize.getCalendar(),
//   tempretureUnit: RNLocalize.getTemperatureUnit(),
//   timezone: RNLocalize.getTimeZone(),
// };
