import React from 'react';
import { Icon, Classes } from '@blueprintjs/core';
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

const TodoItem = ({
    todo,
    id,
    removeTodo,
    toggleDone,
    isDone
}) => <div
    className={Classes.HEADING}
    style={styles.root}>
    <Icon
        icon={isDone ? IconNames.TICK_CIRCLE : IconNames.SELECTION}
        iconSize={Icon.SIZE_LARGE}
        onClick={()=>toggleDone(id, !isDone)}
        style={styles.complete}
        />
    <span className={Classes.TEXT_LARGE}> {todo} </span>
    <Icon
        icon={IconNames.TRASH}
        iconSize={Icon.SIZE_LARGE}
        onClick={()=>removeTodo(id)}
        style={styles.trash}
    />
</div>

export default TodoItem
