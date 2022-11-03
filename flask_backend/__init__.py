from flask import Flask
from flask_socketio import SocketIO

app = Flask(__name__, static_folder="../build", static_url_path="/")
socket = SocketIO(
    app, cors_allowed_origins=["http://localhost:3000", "http://localhost:5000"]
)

from flask_backend.views import *
from flask_backend.events import *
