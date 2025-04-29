# auth.py
from flask import Blueprint, request, jsonify
from models import db, User
from utils import hash_password, check_password, is_valid_email

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')

        if not email or not password or not name:
            return jsonify({'error': 'Name, email and password are required'}), 400

        if not is_valid_email(email):
            return jsonify({'error': 'Invalid email format'}), 400

        if len(password) < 6:
            return jsonify({'error': 'Password must be at least 6 characters'}), 400

        if User.query.filter_by(email=email).first():
            return jsonify({'error': 'Email already exists!'}), 400

        hashed_password = hash_password(password)
        new_user = User(name=name, email=email, password=hashed_password)
        db.session.add(new_user)
        db.session.commit()

        return jsonify({'message': 'User created!'}), 201

    except Exception as e:
        print("Signup Error:", e)
        return jsonify({'error': 'Something went wrong!'}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({'error': 'Email and password are required'}), 400

        user = User.query.filter_by(email=email).first()
        if not user or not check_password(user.password, password):
            return jsonify({'error': 'Invalid email or password!'}), 401

        user_data = {
            'id': user.id,
            'email': user.email,
            'is_admin': getattr(user, 'is_admin', False)
        }
        print(f"Login successful response data: {user_data}")

        return jsonify({'message': 'Login successful!', 'user': user_data}), 200

    except Exception as e:
        print("Login Error:", e)
        return jsonify({'error': 'Something went wrong!'}), 500

@auth_bp.route('/request-reset', methods=['POST'])
def request_reset():
    try:
        data = request.get_json()
        email = data.get('email')

        if not email:
            return jsonify({'error': 'Email is required'}), 400

        user = User.query.filter_by(email=email).first()
        if not user:
            return jsonify({'error': 'No user found with this email'}), 404

        return jsonify({'message': 'Reset link simulated. Proceed to reset password.'}), 200

    except Exception as e:
        print("Request Reset Error:", e)
        return jsonify({'error': 'Something went wrong!'}), 500

@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
    try:
        data = request.get_json()
        email = data.get('email')
        new_password = data.get('new_password')

        if not email or not new_password:
            return jsonify({'error': 'Email and new password are required'}), 400

        if len(new_password) < 6:
            return jsonify({'error': 'Password must be at least 6 characters'}), 400

        user = User.query.filter_by(email=email).first()
        if not user:
            return jsonify({'error': 'No user found with this email'}), 404

        user.password = hash_password(new_password)
        db.session.commit()

        return jsonify({'message': 'Password reset successfully!'}), 200

    except Exception as e:
        print("Reset Password Error:", e)
        return jsonify({'error': 'Something went wrong!'}), 500
