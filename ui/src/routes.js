import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import TodoApp from './TodoApp';
import ChatApp from './ChatApp';

export default (
    <Switch>
        <Route path='/todo' component={TodoApp} />
        <Route path='/chat' component={ChatApp} />
        <Redirect to='/todo' />
    </Switch>
);
