from flask import Flask

app = Flask(__name__)


@app.route("/socket")
def home():
    return "messages coming form here"
