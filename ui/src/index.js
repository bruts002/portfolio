import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './configureStore';
import App from './App.index';
import registerServiceWorker from './registerServiceWorker';

const rootEl = document.getElementById('root');
const store = configureStore();

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    rootEl
);
registerServiceWorker();
