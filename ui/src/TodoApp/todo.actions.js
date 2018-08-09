import {
    GET_TODOS_SUCCESS,
    GET_TODOS_FAILURE
} from './todo.constants'
import api from './todo.api';

export const getTodos = () => {
    return async dispatch => {
        try {
            const result = await api.getTodos();
            if (result.error) {
                dispatch(getTodosFailure(result.error));
            } else {
                dispatch(getTodosSuccess(result));
            }
        } catch (e) {
            dispatch(getTodosFailure(e));
        }
    }
}

export const getTodosSuccess = todoLists => ({
    todoLists,
    type: GET_TODOS_SUCCESS
})

export const getTodosFailure = error => ({
    error,
    type: GET_TODOS_FAILURE
})

export const createList = listName => {
    return async dispatch => {
        try {
            await api.createList( listName )
        } finally {
            dispatch(getTodos());
        }
    }
}

export const updateList = (id, name) => {
    return async dispatch => {
        try {
            await api.updateList(id, name);
        } finally {
            dispatch(getTodos());
        }
    }
}

export const removeList = id => {
    return async dispatch => {
        try {
            await api.removeList(id);
        } finally {
            dispatch(getTodos());
        }
    }
}

export const createTodo = ( todo, listId ) => {
    return async dispatch => {
        try {
            await api.createTodo( todo, listId );
        } finally {
            dispatch(getTodos());
        }
    }
}

export const updateTodo = ( todo, id ) => {
    return async dispatch => {
        try {
            await api.updateTodo( id, undefined, todo );
        } finally {
            dispatch(getTodos());
        }
    }
}

export const toggleDone = (id, isDone) => {
    return async dispatch => {
        try {
            await api.updateTodo( id, isDone );
        } finally {
            dispatch(getTodos());
        }
    }
}

export const removeTodo = id => {
    return async dispatch => {
        try {
            await api.removeTodo(id);
        } finally {
            dispatch(getTodos());
        }
    }
}
