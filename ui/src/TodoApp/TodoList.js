import React, { Component } from 'react';
import TodoItem from './TodoItem';

const style = {
    container: {
        margin: '10px',
        padding: '5px',
        border: '1px solid lightgray',
        borderRadius: '5px'
    },
    title: {
        margin: 0
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
            name: listName='New List',
            // actions
            removeTodo,
            toggleDone
        } = this.props;

        return <div style={style.container}>
            <h4 style={style.title}>{listName}</h4>
            <ul>
                {todos.map( todo => <TodoItem 
                    key={todo.id}
                    id={todo.id}
                    todo={todo.todo}
                    isDone={todo.isDone}
                    removeTodo={removeTodo}
                    toggleDone={toggleDone}
                />)}
            </ul>
            <form onSubmit={ this.createTodo } >
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

export default TodoList;

