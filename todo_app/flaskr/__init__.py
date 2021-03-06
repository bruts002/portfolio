import os

from flask import Flask, request
from flask_restful import Api


def create_app(test_config=None):
    # TODO: unit tests
    # TODO: ORM?
    # TODO: Redis (some in memory cache)
    # TODO: Celery (task-queue)
    #   -- share across deployments
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY='dev',
        DATABASE=os.path.join(app.instance_path, 'flaskr.sqlite'),
    )
    app.config.from_envvar('CONFIG_FILE')
    api = Api(app)

    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    # a simple page that says hello
    @app.route('/hello')
    def hello():
        return 'Hello, World!'

    from . import db
    db.init_app(app)

    from . import todo_list
    api.add_resource(todo_list.TodoList, '/api/todo_app/list/')

    from . import todo
    api.add_resource(todo.TodoSimple, '/api/todo_app/todo/')

    return app
