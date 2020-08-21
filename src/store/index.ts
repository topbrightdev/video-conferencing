import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducer';

const initStore = () => {
    const preloadedState = {};
    const middleware = [thunk];
    const store = createStore(rootReducer, preloadedState, applyMiddleware(...middleware));
    return store;
};

export default initStore;
