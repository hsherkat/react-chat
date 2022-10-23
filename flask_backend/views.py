from datetime import datetime

import pytz
from flask import request
from flask_socketio import emit
from timezonefinder import TimezoneFinder

from flask_backend import app


@app.route("/")
def home_page():
    return "Home!"


@app.route("/api")
def api_fn():
    tf = TimezoneFinder()
    lat, lng = request.args.get("latitude"), request.args.get("longitude")
    if lat and lng:
        tz = tf.timezone_at(lng=float(lng), lat=float(lat))
        current_time = datetime.now(tz=pytz.timezone(tz))
        print(current_time)
        return {"time": current_time.strftime("%A, %B %d %I:%M:%S")}
    return {"time": datetime.now()}


@app.route("/test")
def test_fn():
    emit(
        "message",
        {"user": "Mike", "text": "welp... we'll get em next time"},
        broadcast=True,
    )
