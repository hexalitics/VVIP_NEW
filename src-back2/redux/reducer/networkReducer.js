import { NETWORK_CONNECTED } from '../action/types'
import { appDefaultReducer } from './defaultReducer'

const INITIAL_STATE = appDefaultReducer.network;

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case NETWORK_CONNECTED: {
            return {
                ...state,
                isConnected: action.payload,
            };
        }
        default:
            return state;
    }
};