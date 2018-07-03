from flask import request, jsonify
from flask_restful import Resource
from flaskr.db import get_db


def serialize_todo(todo):
    return { 
        'listId' : todo['list_id'],
        'todo'   : todo['todo'],
        'id'     : todo['id']
    }

class TodoSimple(Resource):
    def get(self):
        db = get_db()
        todos = db.execute(
            'SELECT * FROM todo'
        ).fetchall()
        return list(map(serialize_todo, todos))

    def post(self):
        req_json = request.get_json()
        todo = req_json['todo']
        list_id = req_json['listId']
        error = None

        if not todo:
            error = 'todo is required.'
        if not list_id:
            error += ' listId is required'
        
        if error is not None:
            return error
        else:
            db = get_db()
            db.execute(
                'INSERT INTO todo (todo, list_id)'
                ' VALUES (?, ?)',
                [todo, list_id]
            )
            db.commit()
            return 'added new todo'

    def delete(self):
        todo_id = request.get_json()['todoId']
        db = get_db()
        db.execute(
            'DELETE FROM todo WHERE id = ?',
            [todo_id]
        )
        db.commit()
        return 'removed todo'
