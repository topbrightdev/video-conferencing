import React from 'react';
import './App.css';
import AppRoutes from './containers/AppRoutes';
import { Provider } from 'react-redux';
import initStore from './store';
import { StylesProvider } from '@material-ui/core';
import SnackbarProvider from 'react-simple-snackbar';

function App() {
    const store = initStore();
    
    return (
        <StylesProvider injectFirst>
            <SnackbarProvider>
                <Provider store={store}>
                    <AppRoutes />
                </Provider>
            </SnackbarProvider>
        </StylesProvider>
    );
}

export default App;
