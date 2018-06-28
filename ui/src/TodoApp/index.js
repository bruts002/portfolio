import React, { Component } from 'react';

class TodoApp extends Component {
    constructor() {
        super();
        this.state = {
            todos: []
        };
    }

    componentDidMount() {
        fetch('/api/todo')
            .then( todos => this.setState({ todos }) );
    }

    render() {
        return <div>
            TODO APP
            <ul>
                {this.state.todos.map( todo => <li>{todo}</li>)}
            </ul>
        </div>
    }
}

export default TodoApp;
