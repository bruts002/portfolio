import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './index.reducer';

const middlewares = [thunk];
const reduxTools = [];

if (process.env.NODE_ENV !== 'production' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
    reduxTools.push(window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__());
}

const enhancer = compose(
    applyMiddleware(...middlewares),
    ...reduxTools
);

const configureStore = initialState => createStore(rootReducer, initialState, enhancer);

export default configureStore;
