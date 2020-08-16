import React from 'react';
import './App.css';
import AppRoutes from './containers/AppRoutes';
import { Provider } from 'react-redux';
import initStore from './store';
import { StylesProvider } from '@material-ui/core';

function App() {
    const store = initStore();
    return (
        <StylesProvider injectFirst>
            <Provider store={store}>
                <AppRoutes />
            </Provider>
        </StylesProvider>
    );
}

export default App;
