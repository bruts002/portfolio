import React, { Component } from 'react';
import TodoItem from './TodoItem';
import {
    Button,
    Classes,
    Card,
    Elevation,
    EditableText,
    InputGroup,
    Intent,
} from '@blueprintjs/core';
import { Icon } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';

const style = {
    container: {
        margin: '10px 5px',
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
    },
    form: {
        width: '270px',
        display: 'flex',
        marginTop: '20px',
        justifyContent: 'space-around'
    }
};

class TodoList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            todos: [],
            editedListName: props.name
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.name !== this.props.name) {
            this.setState({
                editedListName: nextProps.name
            });
        }
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

    updateEditedListName = editedListName => {
        this.setState({ editedListName })
    }

    updateListName = () => {
        const {
            listId,
            name,
        } = this.props;
        const { editedListName } = this.state;

        if (editedListName !== name) {
            this.props.updateListName(editedListName, listId)
        }
    }

    render() {
        const {
            newTodo,
            editedListName,
        } = this.state;
        const {
            // data
            todos,
            listId,
            // actions
            removeTodo,
            updateTodo,
            toggleDone,
            removeList,
        } = this.props;

        return <Card
            elevation={Elevation.THREE}
            style={style.container}>
            <h3
                className={Classes.HEADING}
                style={style.title}>
                <EditableText
                    onChange={ this.updateEditedListName }
                    value={editedListName}
                    onConfirm={this.updateListName}
                    />
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
                style={style.form}
                onSubmit={ this.createTodo } >
                <InputGroup
                    intent={Intent.PRIMARY}
                    onChange={ this.updateNewTodo }
                    value={newTodo}
                />
                <Button type="submit">
                    Add
                </Button>
            </form>
        </Card>
    }
}

export default TodoList;

