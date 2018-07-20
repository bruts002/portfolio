const BASE_URL = '/api/todo_app/';
const TODO_API_URL = BASE_URL + 'todo/';
const LIST_API_URL = BASE_URL + 'list/';
const fetchHeaders = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
};

export default {
    async createList(name) {
        const resp = await fetch(LIST_API_URL, {
            method: 'POST',
            headers: fetchHeaders,
            body: JSON.stringify({ name })
        });
        const data = await resp.json();
        return data;
    },
    async getTodos() {
        const resp = await fetch(TODO_API_URL);
        const data = await resp.json();
        return data;
    },
    async removeTodo(id) {
        return await fetch(TODO_API_URL, {
            method: 'DELETE',
            headers: fetchHeaders,
            body: JSON.stringify({todoId:id})
        });
    },
    async createTodo(todo, listId) {
        return await fetch(TODO_API_URL, {
            method: 'POST',
            headers: fetchHeaders,
            body: JSON.stringify({ todo, listId })
        });
    },
    async toggleDone(id, isDone) {
        return await fetch(TODO_API_URL, {
            method: 'PUT',
            headers: fetchHeaders,
            body: JSON.stringify({ id, isDone })
        });
    }
};
