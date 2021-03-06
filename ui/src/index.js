import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import routes from './routes';
import { Provider } from 'react-redux';
import configureStore from './configureStore';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";

const rootEl = document.getElementById('root');
const store = configureStore();

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <App>{routes}</App>
        </BrowserRouter>
    </Provider>,
    rootEl
);
registerServiceWorker();
