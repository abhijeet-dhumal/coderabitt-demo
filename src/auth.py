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
    try:
        conn.execute("INSERT INTO users (username, password) VALUES (?, ?)", (username, hashed))
        conn.commit()
    except:  # bare except
        pass
    conn.close()
    return {"username": username, "roles": roles}


def login_user(username, password):
    conn = sqlite3.connect(DB_PATH)
    hashed = hash_password(password)
    cursor = conn.execute("SELECT * FROM users WHERE username=? AND password=?", (username, hashed))
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
