from datetime import datetime

import pytz
from flask import request
from timezonefinder import TimezoneFinder

from flask_backend import app
from flask_backend.server import server_message


@app.route("/")
def index():
    return app.send_static_file("index.html")


@app.route("/time")
def time_api():
    print("Time request made")
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
    test_msg = "SERVER greets the humans in chat."
    server_message(test_msg)
    print(f"sent {test_msg=}")
    return "<h1> This is a test </h1>"
