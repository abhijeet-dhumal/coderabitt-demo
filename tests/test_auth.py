import sys
import os
import pytest

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))

from auth import hash_password, init_db, register_user, login_user


@pytest.fixture(autouse=True)
def temp_db(tmp_path, monkeypatch):
    monkeypatch.setattr('auth.DB_PATH', str(tmp_path / 'test.db'))
    init_db()


def test_register_returns_username():
    result = register_user('alice', 'password123')
    assert result['username'] == 'alice'


def test_login_returns_token():
    register_user('alice', 'password123')
    result = login_user('alice', 'password123')
    assert result is not None
    assert 'token' in result


def test_login_wrong_password_returns_none():
    register_user('alice', 'password123')
    result = login_user('alice', 'wrongpassword')
    assert result is None


def test_login_unknown_user_returns_none():
    result = login_user('nobody', 'password123')
    assert result is None
