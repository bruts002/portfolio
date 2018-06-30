from flask import (
    Blueprint, flash, g, redirect, request,url_for
)
from flaskr.db import get_db

bp = Blueprint('todo_list', __name__)

@bp.route('/')
def index():
    db = get_db()
    todo_lists = db.execute(
        'SELECT id, list_name FROM todo_list'
    ).fetchall()
    return ''.join(todo_lists)

@bp.route('/create', methods=[ 'POST' ])
def create():
    list_name = request.get_json()['name']
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
