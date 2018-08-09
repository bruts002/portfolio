import React, { Component } from 'react';
import api from './todo.api';
import TodoList from './TodoList';
import { Button, Classes } from '@blueprintjs/core';

const styles = {
    listContainerStyle: {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'flex-start'
    }
};

class TodoApp extends Component {

    state = {
        newTodoList: '',
        todoLists: [],
        error: false
    }

    componentDidMount() {
        this.getTodos();
    }

    getTodos = async () => {
        const result = await api.getTodos();
        if (result.error) {
            this.setState({
                error: true
            });
        } else {
            this.setState({
                todoLists: result
            });
        }
    }

    removeTodo = id => {
        api
            .removeTodo(id)
            .then( () => this.getTodos() );
    }

    updateTodo = async (todo, id) => {
        await api.updateTodo(id, undefined, todo);
        this.getTodos();
    }

    toggleDone = async (id, isDone) => {
        await api.updateTodo(id, isDone)
        this.getTodos();
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

    removeList = async (id) => {
        await api.removeList(id);
        this.getTodos();
    }

    updateList = async (id, name) => {
        await api.updateList(id, name);
        this.getTodos();
    }

    render() {
        const { newTodoList } = this.state;
        return <div>
            <h2 className={Classes.HEADING}>TODO APP</h2>
            <form onSubmit={ this.createNewList } >
                <label htmlFor="newTodoList">New List</label>
                <input
                    type="text"
                    value={newTodoList}
                    onChange={ this.updateNewList }
                    dir="auto"
                    name="newTodoList"
                    className={ Classes.INPUT + ' ' + Classes.INTENT_PRIMARY }
                    style={{ margin: '8px' }}
                    />
                <Button type="submit">
                    Create
                </Button>
            </form>
            <div style={styles.listContainerStyle}>
                {this.state.todoLists.map( list => <TodoList 
                    key={list.id}
                    listId={list.id}
                    name={list.name}
                    todos={list.todos}
                    createTodo={this.createTodo}
                    removeTodo={this.removeTodo}
                    updateTodo={this.updateTodo}
                    toggleDone={this.toggleDone}
                    removeList={this.removeList}
                    updateListName={this.updateList}
                />)}
            </div>
        </div>
    }
}

export default TodoApp;
