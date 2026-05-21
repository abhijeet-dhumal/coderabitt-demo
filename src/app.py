from flask import Flask, jsonify, render_template, request
from auth import init_db, register_user, login_user, get_all_users

app = Flask(__name__)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/register", methods=["POST"])
def register():
    data = request.json if isinstance(request.json, dict) else {}
    username = data.get("username", "")
    password = data.get("password", "")
    if not isinstance(username, str) or not isinstance(password, str):
        return jsonify({"error": "username and password must be strings"}), 400
    username = username.strip()
    password = password.strip()
    if not username or not password:
        return jsonify({"error": "username and password are required"}), 400
    result = register_user(username, password)
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
    app.run(debug=True, host="0.0.0.0", port=8080)  # debug=True and 0.0.0.0 in production
