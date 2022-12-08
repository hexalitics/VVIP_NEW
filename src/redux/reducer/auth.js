import {SAVA_AUTH_DATA} from '../action/types';
const initialState = {
  user: {},
  authToken: '',
  profileImage: '',
  profileName: '',
  //rememberMe: false,
  isTodayFuture: true, //true for Todaylist and false for future list
};
const authReducers = (state = initialState, action) => {
  switch (action.type) {
    case SAVA_AUTH_DATA:
      return {
        ...state,
        [action.stateName]: action.stateData,
      };
    default:
      return state;
  }
};
export default authReducers;
