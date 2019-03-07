#!/bin/bash

# copy chat initial db
cp ./chat_app/data/base.db ./data/chat_app.db

# initialize chat application database
sqlite3 ./data/todo_app.sqlite < ./todo_app/flaskr/schema.sql
