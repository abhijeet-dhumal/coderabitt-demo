from flask import Flask, jsonify, render_template, request
from auth import init_db, register_user, login_user, get_all_users

app = Flask(__name__)


@app.route("/")
def index():
    return render_template("index.html")


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
    return jsonify({"error": "Invalid credentials"}), 401


@app.route("/admin/users")
def admin_users():
    # no authentication check on admin endpoint
    users = get_all_users()
    return jsonify(users)


if __name__ == "__main__":
    init_db()
    app.run(debug=True, host="0.0.0.0", port=8080)  # debug=True and 0.0.0.0 in production
