from flask import Blueprint, request, jsonify
from models.user import User
from extensions import db
from utils.email import send_verification_email
from utils.verify_cache import save_code, get_code_entry, delete_code
from datetime import datetime, timedelta
import bcrypt
import random
from utils.jwt_helper import generate_token
from datetime import datetime


auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/request-verification', methods=['POST', 'OPTIONS'])
def request_verification():
    if request.method == 'OPTIONS':
        return '', 200
    data = request.json
    email = data.get('email')
    password = data.get('password')
    full_name = data.get('fullName')

    if not email or not password or not full_name:
        return jsonify({'error': 'Missing required fields'}), 400

    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({'error': 'User already exists'}), 400

    hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    code = str(random.randint(100000, 999999))

    save_code(email, full_name, hashed, code)
    send_verification_email(email, code)

    return jsonify({'message': 'Verification code sent to email'}), 200


@auth_bp.route('/verify-email', methods=['POST', 'OPTIONS'])
def verify_email():
    if request.method == 'OPTIONS':
        return '', 200

    data = request.json
    email = data.get('email')
    code = data.get('code')

    entry = get_code_entry(email)

    if not entry:
        return jsonify({'error': 'No verification request found'}), 400

    if entry['code'] != code:
        return jsonify({'error': 'Invalid verification code'}), 400

    if entry['expires_at'] < datetime.utcnow():
        delete_code(email)
        return jsonify({'error': 'Code expired'}), 400

    new_user = User(
        email=email,
        password_hash=entry['password_hash'],
        full_name=entry['full_name'],
        is_verified=True
    )

    db.session.add(new_user)
    db.session.commit()
    delete_code(email)

    return jsonify({'message': 'Email verified and account created!'}), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    remember = data.get('remember', False)

    user = User.query.filter_by(email=email).first()

    if not user or not bcrypt.checkpw(password.encode('utf-8'), user.password_hash.encode('utf-8')):
        return jsonify({'error': 'Invalid email or password'}), 401

    if not user.is_verified:
        return jsonify({'error': 'Email not verified'}), 403

    token = generate_token(user.id, remember)

    return jsonify({
        'access_token': token,
        'user': {
            'id': user.id,
            'email': user.email,
            'fullName': user.full_name
        }
    }), 200
