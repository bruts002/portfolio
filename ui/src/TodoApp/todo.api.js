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
        try {
            const resp = await fetch(TODO_API_URL);
            const data = await resp.json();
            return data;
        } catch (error) {
            return { error }
        }
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
    async updateTodo(id, isDone, todo) {
        const body = { id }
        if (isDone !== undefined) {
            body.isDone = isDone
        }
        if (todo) {
            body.todo = todo
        }
        return await fetch(TODO_API_URL, {
            method: 'PUT',
            headers: fetchHeaders,
            body: JSON.stringify(body)
        });
    },
    async updateList(id, name) {
        return await fetch(LIST_API_URL, {
            method: 'PUT',
            headers: fetchHeaders,
            body: JSON.stringify({ id, name })
        });
    },
    async removeList(id) {
        return await fetch(LIST_API_URL, {
            method: 'DELETE',
            headers: fetchHeaders,
            body: JSON.stringify({ id })
        });
    }
};
