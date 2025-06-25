import jwt
from datetime import datetime, timedelta

SECRET_KEY = "6a01c3cd5ba8eedf5b64c90c3fb427da41485fe3d7af638383f0521323241555eab35552e989d181c8d7199cf1e1bccf298d1a122d810215441f4b550d7f69d3"  

def generate_token(user_id, remember=False):
    expiry = timedelta(days=30) if remember else timedelta(hours=1)
    payload = {
        "user_id": user_id,
        "exp": datetime.utcnow() + expiry,
        "iat": datetime.utcnow()
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")

def decode_token(token):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None


