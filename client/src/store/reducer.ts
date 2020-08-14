import { combineReducers } from 'redux';
import meetingReducer from './meeting/reducer';

const rootReducer = combineReducers({
    meeting: meetingReducer,
});
export default rootReducer;
