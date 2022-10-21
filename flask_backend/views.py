import time

from flask_backend import app


@app.route("/")
def home_page():
    return "Home!"


@app.route("/api")
def api_fn():
    return {"time": time.time()}
