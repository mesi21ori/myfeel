from datetime import datetime, timedelta

_verification_store = {}

def save_code(email, full_name, password_hash, code):
    _verification_store[email] = {
        'full_name': full_name,
        'password_hash': password_hash,
        'code': code,
        'expires_at': datetime.utcnow() + timedelta(minutes=10)
    }

def get_code_entry(email):
    return _verification_store.get(email)

def delete_code(email):
    _verification_store.pop(email, None)
