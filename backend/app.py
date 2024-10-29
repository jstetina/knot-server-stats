import json
import os
from functools import wraps

from flask import Flask, jsonify, make_response, request, session
from flask_cors import CORS
from flask_login import login_required, login_user, logout_user

from config import *
from database import Database

app = Flask(__name__)
CORS(app, resources={r"*": {"origins": "*"}})

db = Database(app, db_config)


@app.post("/login")
def login():
    """Login route to authenticate user and create a session."""
    req_data: dict = request.json

    if not db.auth_user(req_data):
        return (
            "Could not verify",
            401,
            {"WWW-Authenticate": "Basic realm='Login required!'"},
        )

    if login_user(session["username"]):
        return (
            "Could not verify",
            401,
            {"WWW-Authenticate": "Basic realm='Login required!'"},
        )

    session["logged_in"] = True
    session["username"] = req_data["username"]

    return jsonify({"message": "Login successful"})


@app.post("/logout")
def logout():
    """Logout route to clear the user session."""
    session.clear()
    return jsonify({"message": "Logged out successfully"})


@app.get("/get-stats")
@login_required
def get_json():
    """Protected endpoint to retrieve and combine JSON files in a directory."""
    directory_path = "./stat_files"
    combined_data = []

    for filename in os.listdir(directory_path):
        if filename.endswith(".json"):
            file_path = os.path.join(directory_path, filename)
            with open(file_path, "r") as file:
                data = json.load(file)
                combined_data.append(data)

    return jsonify(combined_data)


if __name__ == "__main__":
    app.run(debug=True)
