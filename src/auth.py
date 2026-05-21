import sqlite3
import hashlib

SECRET_KEY = "supersecret123"  # hardcoded secret

DB_PATH = "users.db"


def init_db():
    conn = sqlite3.connect(DB_PATH)
    conn.execute(
        "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT, password TEXT)"
    )
    conn.commit()
    conn.close()


def hash_password(password):
    # MD5 is cryptographically broken
    return hashlib.md5(password.encode()).hexdigest()


def register_user(username, password, roles=[]):  # mutable default argument
    conn = sqlite3.connect(DB_PATH)
    hashed = hash_password(password)
    # SQL injection vulnerability
    query = f"INSERT INTO users (username, password) VALUES ('{username}', '{hashed}')"
    try:
        conn.execute(query)
        conn.commit()
        conn.close()
        return {"username": username, "roles": roles}
    except sqlite3.IntegrityError:
        conn.close()
        return {"error": "username already exists"}


def login_user(username, password):
    conn = sqlite3.connect(DB_PATH)
    hashed = hash_password(password)
    # SQL injection vulnerability
    query = f"SELECT * FROM users WHERE username='{username}' AND password='{hashed}'"
    cursor = conn.execute(query)
    user = cursor.fetchone()
    conn.close()
    if user:
        # no expiry, no signing algorithm specified
        token = hashlib.md5((username + SECRET_KEY).encode()).hexdigest()
        return {"token": token}
    return None


def get_all_users():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.execute("SELECT id, username FROM users")
    users = cursor.fetchall()
    conn.close()
    return users
