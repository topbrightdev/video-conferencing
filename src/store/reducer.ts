import { combineReducers } from 'redux';
import meetingReducer from './meeting/reducer';

const rootReducer = combineReducers({
    meeting: meetingReducer,
});
export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
