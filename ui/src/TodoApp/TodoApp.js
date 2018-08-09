import React, { Component } from 'react';
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
        this.props.onMount();
    }

    createNewList = async event => {
        event.preventDefault();
        event.stopPropagation();
        const { createList } = this.props;
        const { newTodoList } = this.state;

        if (newTodoList) {
            await createList( newTodoList );
            this.setState({ newTodoList: '' });
        }
    }

    updateNewList = event => {
        this.setState({
            newTodoList: event.target.value
        });
    }

    render() {
        const { newTodoList } = this.state;
        const {
            todoLists,
            createTodo,
            removeTodo,
            updateTodo,
            toggleDone,
            removeList,
            updateList,
        } = this.props;

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
                <Button type="submit" disabled={!newTodoList} >
                    Create
                </Button>
            </form>
            <div style={styles.listContainerStyle}>
                {todoLists.map( list => <TodoList 
                    key={list.id}
                    listId={list.id}
                    name={list.name}
                    todos={list.todos}
                    createTodo={createTodo}
                    removeTodo={removeTodo}
                    updateTodo={updateTodo}
                    toggleDone={toggleDone}
                    removeList={removeList}
                    updateListName={updateList}
                />)}
            </div>
        </div>
    }
}

export default TodoApp;
