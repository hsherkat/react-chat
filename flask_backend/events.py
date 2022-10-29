from flask_backend import socket
from flask_socketio import emit
from flask import request

from flask_backend.user import User, connected_users, create_user_payload
from flask_backend.server import handle_command


@socket.on("connect")
def handle_connect(auth):
    print(auth)
    new_user = User(id=request.sid)
    connected_users[new_user.id] = new_user
    user_payload = {user.id: user.json() for user in connected_users.values()}
    emit(
        "usersChange",
        user_payload,
        broadcast=True,
    )


@socket.on("disconnect")
def handle_disconnect():
    user = get_user()
    del connected_users[user.id]
    user_payload = create_user_payload()
    emit(
        "usersChange",
        user_payload,
        broadcast=True,
    )


@socket.on("usernameChange")
def handle_username_change(new_name):
    user = get_user()
    if new_name.startswith("SERVER"):
        return
    user.username = new_name
    user_payload = {user.id: user.json() for user in connected_users.values()}
    emit(
        "usersChange",
        user_payload,
        broadcast=True,
    )


@socket.on("message")
def handle_message(message_json):
    text = message_json["text"]
    user = get_user()
    message_json["user"] = user.json()
    emit("message", message_json, broadcast=True)
    if text.startswith("//"):
        handle_command(text[2:])


def get_user():
    return connected_users[request.sid]
