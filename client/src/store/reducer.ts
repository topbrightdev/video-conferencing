import { combineReducers } from 'redux';

const rootReducer = combineReducers({
    test: (state: {}, action) => {
        return { ...state };
    },
});
export default rootReducer;
