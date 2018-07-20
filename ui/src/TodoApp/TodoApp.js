import React, { Component } from 'react';
import api from './todo.api';
import TodoList from './TodoList';

class TodoApp extends Component {
    constructor() {
        super();
        this.state = {
            todoLists: [],
        };
    }

    componentDidMount() {
        this.getTodos();
    }

    getTodos = () => {
        api
            .getTodos()
            .then( todoLists => this.setState({ todoLists }) );
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

    createTodo = (todo, listId) => {
        return api
            .createTodo( todo, listId )
            .then( () => this.getTodos() );

    }

    createNewList = event => {
        event.preventDefault();
        event.stopPropagation();
        api
            .createList( this.state.newTodoList )
            .then( () => this.setState({ newTodoList: '' }))
            .then( () => this.getTodos() );
    }

    updateNewList = event => {
        this.setState({
            newTodoList: event.target.value
        });
    }

    render() {
        const { newTodoList } = this.state;
        const listContainerStyle = {
            display: 'flex'
        };
        return <div>
            <h2>TODO APP</h2>
            <form onSubmit={ this.createNewList } >
                <label htmlFor="newTodoList">New List</label>
                <input
                    type="text"
                    value={newTodoList}
                    onChange={ this.updateNewList }
                    name="newTodoList"
                    />
                <input type="submit" value="Create" />
            </form>
            <div style={listContainerStyle}>
                {this.state.todoLists.map( list => <TodoList 
                    key={list.id}
                    listId={list.id}
                    name={list.name}
                    todos={list.todos}
                    createTodo={this.createTodo}
                    removeTodo={this.removeTodo}
                    toggleDone={this.toggleDone}
                />)}
            </div>
        </div>
    }
}

export default TodoApp;

