from flask_backend import socket
from flask_backend.user import User

SERVER = User(id="server")
SERVER.username = "SERVER"


def server_message(text):
    payload = {"user": SERVER.json(), "text": text}
    socket.emit("message", payload, broadcast=True)
