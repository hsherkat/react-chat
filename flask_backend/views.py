from datetime import datetime

import pytz
from flask import request
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


@app.route("/api2", methods=["GET", "POST"])
def api2_fn():
    tf = TimezoneFinder()
    lat = lng = None
    if request.method == "GET":
        lat, lng = request.args.get("latitude"), request.args.get("longitude")
    elif request.method == "POST":
        json = request.get_json(silent=True)
        lat, lng = json["latitude"], json["longitude"]
    if lat and lng:
        tz = tf.timezone_at(lng=float(lng), lat=float(lat))
        current_time = datetime.now(tz=pytz.timezone(tz))
        print(current_time)
        return {"time": current_time.strftime("%A, %B %d %I:%M:%S")}
    return {"time": datetime.now()}
