from flask import request, jsonify
from flask_restful import Resource
from flaskr.db import get_db


def serialize_todo(todo):
    return { 
        'isDone' : todo['done'] == 1,
        'todo'   : todo['todo'],
        'id'     : todo['id']
    }

def serialize_todo_list(todo_list, todos):
    return {
        'id'    : todo_list['id'],
        'name'  : todo_list['list_name'],
        'todos' : list(map(
            serialize_todo,
            filter(
                lambda todo: todo['list_id'] == todo_list['id'],
                todos
            )
        ))
    }

class TodoSimple(Resource):
    def get(self):
        db = get_db()
        todos = db.execute(
            'SELECT * FROM todo'
        ).fetchall()
        todo_lists = db.execute(
            'SELECT * FROM todo_list'
        ).fetchall()
        return list(map(
            lambda todo_list: serialize_todo_list(todo_list, todos),
            todo_lists
        ))

    def post(self):
        req_json = request.get_json()
        todo = req_json['todo']
        list_id = req_json['listId']
        error = None

        if not todo:
            error = 'todo is required.'
        if not list_id:
            error = ' listId is required'
        
        if error is not None:
            return error
        else:
            db = get_db()
            db.execute(
                'INSERT INTO todo (todo, list_id, done)'
                ' VALUES (?, ?, ?)',
                [todo, list_id, False]
            )
            db.commit()
            return 'added new todo'

    def put(self):
        req_json = request.get_json()
        todo_id = req_json['id']
        try:
            done = req_json['isDone']
        except (KeyError):
            done = None
        try:
            todo_name = req_json['todo']
        except (KeyError):
            todo_name = None

        error = None

        if not todo_id:
            error = ' id is required'
        if done is None and todo_name is None:
            error = 'atleast isDone or todo is required'
        if error is not None:
            return error
        else:
            sql_query = 'UPDATE todo set '
            sql_params = []
            if done is not None:
                sql_query += 'done = ? '
                sql_params.append(done)
                if todo_name is not None:
                    sql_query += ', '
            if todo_name is not None:
                sql_query += 'todo = ? '
                sql_params.append(todo_name)
            sql_query += 'WHERE id = ?'
            sql_params.append(todo_id)

            db = get_db()
            db.execute(
                sql_query,
                sql_params
            )
            db.commit()
            return 'updated todo'

    def delete(self):
        todo_id = request.get_json()['todoId']
        if not todo_id:
            return 'id is required'

        db = get_db()
        db.execute(
            'DELETE FROM todo WHERE id = ?',
            [todo_id]
        )
        db.commit()
        return 'removed todo'
