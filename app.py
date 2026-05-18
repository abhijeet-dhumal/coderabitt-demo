from flask import Flask, jsonify

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


if __name__ == "__main__":
    app.run(debug=False)
