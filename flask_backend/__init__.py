from flask import Flask
from flask_socketio import SocketIO

app = Flask(__name__)
socket = SocketIO(app, cors_allowed_origins="*")


from flask_backend.views import *
