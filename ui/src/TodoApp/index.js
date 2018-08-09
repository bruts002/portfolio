import TodoApp from './TodoApp';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import {
    getTodos,
    createList,
    updateList,
    removeList,
    createTodo,
    updateTodo,
    toggleDone,
    removeTodo,
} from './todo.actions';

const mapStateToProps = ({ todo }) => todo;

const mapDispatchToProps = (dispatch, ownProps) => ({
    async onMount() {
        await dispatch(getTodos());
    },
    async createList(listName) {
        await dispatch(createList(listName));
    },
    async updateList(id, name) {
        await dispatch(updateList(id, name));
    },
    async removeList(id) {
        await dispatch(removeList(id));
    },
    async createTodo(todo, listId) {
        await dispatch(createTodo(todo, listId));
    },
    async updateTodo(todo, listId) {
        await dispatch(updateTodo(todo, listId));
    },
    async toggleDone(id, isDone) {
        await dispatch(toggleDone(id, isDone));
    },
    async removeTodo(id) {
        await dispatch(removeTodo(id));
    }
})

export default withRouter(
    connect( mapStateToProps, mapDispatchToProps )(TodoApp)
);
