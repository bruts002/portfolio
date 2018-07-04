import React, { Component } from 'react';
import api from './todo.api';
import Todo from './Todo';

class TodoApp extends Component {
    constructor() {
        super();
        this.state = {
            todos: []
        };
    }

    componentDidMount() {
        this.getTodos();
    }

    getTodos = listId => {
        api.getTodos(listId)
            .then( todos => this.setState({ todos }) );
    }

    removeTodo = id => {
        api
            .removeTodo(id)
            .then( () => this.getTodos() );
    }

    toggleDone = (id, isDone) => {
        api
            .toggleDone(id, isDone)
            .then( () => this.getTodos() );
    }

    saveTodo = event => {
        event.preventDefault();
        event.stopPropagation();
        api
            .saveTodo( this.state.newTodo, 2 )
            .then( () => this.getTodos() );

        this.setState({
            newTodo: ''
        });
    }

    updateNewTodo = event => {
        this.setState({
            newTodo: event.target.value
        })
    }

    render() {
        const { newTodo } = this.state;
        return <div>
            <h2>TODO APP</h2>
            <ul>
                {this.state.todos.map( todo => <Todo 
                    id={todo.id}
                    todo={todo.todo}
                    isDone={todo.isDone}
                    removeTodo={this.removeTodo}
                    toggleDone={this.toggleDone}
                />)}
            </ul>
            <form onSubmit={ this.saveTodo } >
                <input
                    type="text"
                    value={newTodo}
                    onChange={ this.updateNewTodo }
                    />
                <input type="submit" value="save" />
            </form>
        </div>
    }
}

export default TodoApp;
