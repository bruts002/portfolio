import React from 'react';

const TodoItem = ({
    todo,
    id,
    removeTodo,
    toggleDone,
    isDone
}) => <li>
    <span onClick={()=>toggleDone(id, !isDone)}> X </span>
    <span> {todo} </span>
    <span> {isDone ? 'DONE' : 'WAIT'} </span>
    <span onClick={()=>removeTodo(id)}> X </span>
</li>

export default TodoItem