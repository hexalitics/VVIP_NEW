import { NetInfo } from 'react-native';
import { NETWORK_CONNECTED } from './types';

//Product Like/Unlike Actions
export const networkConnected = () => {
    return (dispatch, getState) => {
        try {

            return NetInfo.isConnected.fetch().done(
                (isConnected) => {
                    console.log('isConnected: ', isConnected);
                    dispatch({
                        type: NETWORK_CONNECTED,
                        payload: isConnected,
                    })
                    return Promise.resolve(isConnected);
                });

        } catch (e) {
            console.log(e);
        }
    };
};

export const networkListener = () => {
    return (dispatch, getState) => {
        try {

            //let connected = NetInfo.isConnected
            return NetInfo.isConnected.addEventListener('connectionChange', function(isConnected){
                //console.log('Network status connected: ', isConnected);
                dispatch({
                    type: NETWORK_CONNECTED,
                    payload: isConnected,
                })
                NetInfo.isConnected.removeEventListener()
                return Promise.resolve(isConnected);
            });

        } catch (e) {
            console.log(e);
        }
    };
};