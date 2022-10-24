from flask_backend import socket
from flask_socketio import emit
from flask import request

from flask_backend.user import User, connected_users


@socket.on("message")
def handle_message(message_json):
    print(message_json["user"], message_json["text"])
    emit("message", message_json, broadcast=True)


@socket.on("connect")
def handle_connect():
    new_user = User(id=request.sid)
    connected_users[new_user.id] = new_user
    print("#######\n")
    print(f"New user: {new_user}")
    print(f"All users:")
    for user in connected_users.values():
        print(user)
    print("\n#######")
    emit("newUser", new_user.json(), broadcast=True)


@socket.on("disconnect")
def handle_disconnect():
    user = User(id=request.sid)
    del connected_users[user.id]
    print("#######\n")
    print(f"User disconnected: {user}")
    print(f"All users: {connected_users}")
    print("\n#######")
    emit("delUser", user.json(), broadcast=True)
