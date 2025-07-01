from flask import Blueprint, request, jsonify
from models.user import User
from utils.auth_guard import jwt_required

user_bp = Blueprint("user", __name__)
@user_bp.route('/profile', methods=['GET'])
@jwt_required
def get_profile():
    user = User.query.filter_by(id=request.user_id).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404

    return jsonify({
        'id': user.id,
        'email': user.email,
        'fullName': user.full_name,
        'isVerified': user.is_verified
    }), 200
