from flask_backend import socket
from flask_socketio import emit
from flask import request

from flask_backend.user import (
    User,
    connected_users,
    create_users_payload,
    disconnected_users,
)
from flask_backend.server import handle_command


@socket.on("connect")
def handle_connect(auth):
    print(auth)
    if (prev_id := auth["prevID"]) is not None and (
        user := disconnected_users.get(prev_id)
    ) is not None:
        user.id = request.sid
        del disconnected_users[prev_id]
    else:
        user = User(id=request.sid)
    connected_users[user.id] = user
    users_payload = create_users_payload()
    emit(
        "usersChange",
        users_payload,
        broadcast=True,
    )
    emit("session", user.json())


@socket.on("disconnect")
def handle_disconnect():
    user = get_user()
    disconnected_users[user.id] = user
    del connected_users[user.id]
    users_payload = create_users_payload()
    emit(
        "usersChange",
        users_payload,
        broadcast=True,
    )


@socket.on("usernameChange")
def handle_username_change(new_name):
    user = get_user()
    if new_name.startswith("SERVER"):
        return
    user.username = new_name
    users_payload = create_users_payload()
    emit(
        "usersChange",
        users_payload,
        broadcast=True,
    )


@socket.on("colorChange")
def handle_color_change(new_color):
    user = get_user()
    user.color = new_color
    users_payload = create_users_payload()
    emit(
        "usersChange",
        users_payload,
        broadcast=True,
    )


@socket.on("message")
def handle_message(message_json):
    user = get_user()
    message_json["user"] = user.json()
    emit("message", message_json, broadcast=True)
    if (text := message_json["text"]).startswith("//"):
        handle_command(text[2:])


def get_user():
    return connected_users[request.sid]
