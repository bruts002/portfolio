from flask import request, jsonify
from flask_restful import Resource
from flaskr.db import get_db


def serialize_list(list):
    return { 
        'id'     : list['id'],
        'name'   : list['list_name'],
    }

class TodoList(Resource):
    def get(self):
        db = get_db()
        lists = db.execute(
            'SELECT * FROM todo_list'
        ).fetchall()
        return list(map(
            serialize_list,
            lists
        ))

    def post(self):
        req_json = request.get_json()
        list_name = req_json['name']
        error = None

        if not list_name:
            error = 'name is required.'
        
        if error is not None:
            return error
        else:
            db = get_db()
            db.execute(
                'INSERT INTO todo_list (list_name)'
                ' VALUES (?)',
                [list_name]
            )
            db.commit()
            return 'added new list'

    def put(self):
        req_json = request.get_json()
        list_id = req_json['id']
        list_name = req_json['name']
        error = None

        if not id:
            error = ' id is required'
        if not list_name:
            error = ' name is required'
        if error is not None:
            return error
        else:
            db = get_db()
            db.execute(
                'UPDATE todo_list set name = ? WHERE id = ?',
                [list_name, list_id]
            )
            db.commit()
            return 'updated list'

    def delete(self):
        list_id = request.get_json()['id']
        if not list_id:
            return 'id is required'

        db = get_db()
        db.execute(
            'DELETE FROM todo_list WHERE id = ?',
            [list_id]
        )
        db.commit()
        return 'removed list'
