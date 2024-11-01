import json
import os
import secrets

from flask import Flask, jsonify, request, session
from flask_cors import CORS
from flask_login import LoginManager, UserMixin, login_required, login_user, logout_user

from config import *
from database import Database, Users

app = Flask(__name__)
app.secret_key = secrets.token_hex(64)
db = Database(app, db_config)
CORS(app, resources={r"*": {"origins": "*"}})

login_manager = LoginManager()
login_manager.init_app(app)


@login_manager.user_loader
def load_user(user_id):
    return db.get_user_id(user_id)


@app.post("/login")
def login():
    """Login route to authenticate user and create a session."""
    req_data = request.json
    if user := db.auth_user(req_data):
        login_user(user)
        return jsonify({"message": "Login successful"}), 200
    return jsonify({"message": "Invalid credentials"}), 401


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
