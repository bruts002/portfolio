const TODO_API_URL = '/api/todo/';
const fetchHeaders = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
};

export default {
    async getTodos(listId) {
        const resp = await fetch(`${TODO_API_URL}${listId?'?listId='+listId:''}`);
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
    async saveTodo(todo, listId) {
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
