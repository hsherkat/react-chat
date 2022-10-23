from flask_backend import socket
from flask_socketio import emit


@socket.on("message")
def handle_message(message_json):
    print(message_json)
    emit("message", message_json, broadcast=True)
