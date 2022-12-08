import {SAVA_AUTH_DATA} from './types';
export const saveAuthReducersData = (stateName, stateData) => {
  return {
    type: SAVA_AUTH_DATA,
    stateName,
    stateData,
  };
};
