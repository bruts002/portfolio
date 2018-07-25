import React, { Component } from 'react';
import TodoItem from './TodoItem';
import { Button, Classes } from '@blueprintjs/core';
import { Icon } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';

const style = {
    container: {
        margin: '10px',
        padding: '5px',
        border: '1px solid lightgray',
        borderRadius: '5px',
        width: '300px'
    },
    title: {
        margin: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    remove: {
        margin: '0 5px',
        cursor: 'pointer'
    }
};

class TodoList extends Component {
    constructor() {
        super();
        this.state = {
            todos: []
        };
    }

    createTodo = event => {
        event.preventDefault();
        event.stopPropagation();

        this.props
            .createTodo( this.state.newTodo, this.props.listId )
            .then( () => this.setState({ newTodo: '' }));
    }

    updateNewTodo = event => {
        this.setState({
            newTodo: event.target.value
        });
    }

    render() {
        const { newTodo } = this.state;
        const {
            // data
            todos,
            listId,
            name: listName='New List',
            // actions
            removeTodo,
            updateTodo,
            toggleDone,
            removeList
        } = this.props;

        return <div style={style.container}>
            <h3
                className={Classes.HEADING}
                style={style.title}>
                {listName}
                <Icon
                    style={style.remove}
                    onClick={ () => removeList(listId) }
                    icon={IconNames.DELETE}
                    iconSize={Icon.SIZE_STANDARD} />
            </h3>
            <div>
                {todos.map( todo => <TodoItem 
                    key={todo.id}
                    id={todo.id}
                    todo={todo.todo}
                    isDone={todo.isDone}
                    removeTodo={removeTodo}
                    updateTodo={updateTodo}
                    toggleDone={toggleDone}
                />)}
            </div>
            <form
                style={{ width: '270px' }}
                onSubmit={ this.createTodo } >
                <input
                    type="text"
                    value={newTodo}
                    onChange={ this.updateNewTodo }
                    dir="auto"
                    className={ Classes.INPUT + ' ' + Classes.INTENT_PRIMARY }
                    style={{ margin: '8px' }}
                    />
                <Button type="submit">
                    Add
                </Button>
            </form>
        </div>
    }
}

export default TodoList;

