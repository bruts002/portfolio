import {
    GET_TODOS_SUCCESS,
    GET_TODOS_FAILURE
} from './todo.constants'

const initialState = {
    todoLists: [],
    loading: true,
    error: false
};

export default (state = initialState, action) => {
    switch (action.type) {
        case GET_TODOS_SUCCESS:
            const { todoLists } = action;
            return {
                todoLists,
                loading: false,
                error: false,
            }
        case GET_TODOS_FAILURE:
            const { error } = action;
            return {
                todoLists: [],
                loading: false,
                error
            }
        default:
            return state
    }
}
