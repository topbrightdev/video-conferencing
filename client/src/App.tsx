import React from 'react';
import './App.css';
import AppRoutes from './containers/AppRoutes';
import { Provider } from 'react-redux';
import initStore from './store';

function App() {
    const store = initStore();
    return (
        <Provider store={store}>
            <AppRoutes />
        </Provider>
    );
}

export default App;
