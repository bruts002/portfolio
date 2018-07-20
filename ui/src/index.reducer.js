import { combineReducers } from 'redux';
import appReducer from './App/app.reducer';
import todoReducer from './TodoApp/todo.reducer';
import chatReducer from './ChatApp/chat.reducer';

export default combineReducers({
    app: appReducer,
    todo: todoReducer,
    chat: chatReducer
});
