from flask import Flask
from flask_socketio import SocketIO

app = Flask(__name__)
socket = SocketIO(app, cors_allowed_origins="http://localhost:3000")


from flask_backend.views import *
from flask_backend.events import *
