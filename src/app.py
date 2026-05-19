from flask import Flask, jsonify, request
from auth import init_db, register_user, login_user, get_all_users

app = Flask(__name__)

USERS = [
    {"id": 1, "name": "Alice", "email": "alice@example.com"},
    {"id": 2, "name": "Bob", "email": "bob@example.com"},
]


@app.route("/users")
def get_users():
    return jsonify(USERS)


@app.route("/users/<int:user_id>")
def get_user(user_id):
    for user in USERS:
        if user["id"] == user_id:
            return jsonify(user)
    return jsonify({"error": "Not found"}), 404


@app.route("/register", methods=["POST"])
def register():
    data = request.json
    # no input validation at all
    result = register_user(data["username"], data["password"])
    return jsonify(result), 201


@app.route("/login", methods=["POST"])
def login():
    data = request.json
    result = login_user(data["username"], data["password"])
    if result:
        return jsonify(result)
    # leaks whether username exists vs wrong password
    return jsonify({"error": "Invalid username"}), 401


@app.route("/admin/users")
def admin_users():
    # no authentication check on admin endpoint
    users = get_all_users()
    return jsonify(users)


if __name__ == "__main__":
    init_db()
    app.run(debug=True, host="0.0.0.0")  # debug=True and 0.0.0.0 in production
