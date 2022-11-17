import logging
from datetime import datetime

from flask_backend import socket
from flask_socketio import emit
from flask import request

from flask_backend.user import (
    User,
    connected_users,
    create_users_payload,
    disconnected_users,
    get_user, user_times, is_moderator,
)
from flask_backend.server import handle_command, server_message


@socket.on("connect")
def handle_connect(auth):
    if (prev_id := auth["prevID"]) is not None and (
            user := disconnected_users.get(prev_id)
    ) is not None:
        reconnect(user)
    else:
        user = User(id=request.sid)
    user_times[datetime.now()] = user
    connected_users[user.id] = user
    users_payload = create_users_payload()
    emit(
        "usersChange",
        users_payload,
        broadcast=True,
    )
    emit("session", user.json())
    server_message(f"{user.username} has entered the chat")
    logging.info(f"{request.sid} || CONNECT || {auth}")


def reconnect(user: User):
    del disconnected_users[user.id]
    user.id = request.sid


@socket.on("disconnect")
def handle_disconnect():
    user = get_user()
    disconnect(user)
    users_payload = create_users_payload()
    emit(
        "usersChange",
        users_payload,
        broadcast=True,
    )
    server_message(f"{user.username} has left the chat")
    logging.info(f"{request.sid} || DISCONNECT")


def disconnect(user: User):
    disconnected_users[user.id] = user
    del connected_users[user.id]
    for time, person in user_times.items():
        if user == person:
            del user_times[time]
            break


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
    logging.info(f"{request.sid} || USERNAMECHANGE || {new_name}")


@socket.on("colorChange")
def handle_color_change(new_color: str):
    user = get_user()
    user.color = new_color
    users_payload = create_users_payload()
    emit(
        "usersChange",
        users_payload,
        broadcast=True,
    )
    logging.info(f"{request.sid} || COLORCHANGE || {new_color}")


@socket.on("message")
def handle_message(message_json):
    logging.info(f"{request.sid} || MESSAGE || {message_json}")
    user = get_user()
    message_json["user"] = user.json()
    if (text := message_json["text"]).startswith("//"):
        handle_command(user, text[2:])
        return
    emit("message", message_json, broadcast=True)
