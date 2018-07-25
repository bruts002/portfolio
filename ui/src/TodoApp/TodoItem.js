import React from 'react';
import { Icon, Classes, EditableText } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';

const styles = {
    root: {
        margin: '2px',
        display: 'flex',
        alignItems: 'center'
    },
    trash: {
        marginLeft: 'auto',
        cursor: 'pointer'
    },
    complete: {
        cursor: 'pointer',
        margin: '0 5px'
    }
};

class TodoItem extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            editedTodo: props.todo
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.todo !== this.props.todo) {
            this.setState({
                editedTodo: nextProps.todo
            });
        }
    }

    updateEditedTodo = editedTodo => {
        this.setState({ editedTodo });
    }

    updateTodo = () => {
        const {
            id,
            updateTodo,
            todo
        } = this.props;
        const { editedTodo } = this.state;

        if (todo !== editedTodo) {
            updateTodo(editedTodo, id);
        }
    }

    render() {
        const {
            id,
            removeTodo,
            toggleDone,
            isDone
        } = this.props;
        const { editedTodo } = this.state;
        return (
            <div
                className={Classes.HEADING}
                style={styles.root}>
                <Icon
                    icon={isDone ? IconNames.TICK_CIRCLE : IconNames.SELECTION}
                    iconSize={Icon.SIZE_LARGE}
                    onClick={()=>toggleDone(id, !isDone)}
                    style={styles.complete}
                    />
                <EditableText
                    onChange={ this.updateEditedTodo }
                    value={editedTodo}
                    onConfirm={ this.updateTodo }
                    multiline={true}
                    />
                <Icon
                    icon={IconNames.TRASH}
                    iconSize={Icon.SIZE_LARGE}
                    onClick={()=>removeTodo(id)}
                    style={styles.trash}
                />
            </div>
        );
    }
}

export default TodoItem
