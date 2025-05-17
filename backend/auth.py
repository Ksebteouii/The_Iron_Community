from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from models import db, User, Profile
from utils import is_valid_email, is_strong_password
import secrets
import datetime
import random
import string
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps

auth_bp = Blueprint('auth', __name__)


tokens = {} # Dictionary to store tokens and their user IDs  



def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        auth_header = request.headers.get('Authorization')
        
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
        
        if not token:
            return jsonify({'error': 'Token is missing!'}), 401
        
        user_id = tokens.get(token)
        if not user_id:
            return jsonify({'error': 'Invalid token!'}), 401
        
        current_user = User.query.get(user_id)
        if not current_user:
            return jsonify({'error': 'User not found!'}), 401
        
        return f(current_user, *args, **kwargs)
    return decorated



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

        if not is_strong_password(password):
            return jsonify({'error': 'Password must be at least 8 characters and include uppercase, lowercase, digit, and special character'}), 400

        if User.query.filter_by(email=email).first():
            return jsonify({'error': 'Email already exists!'}), 400

        hashed_password = generate_password_hash(password)
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
        if not user:
            print(f"Login failed: user with email {email} not found")
            return jsonify({'error': 'Invalid email or password!'}), 401

        # Debugging: print hashed password and check result
        print(f"Stored hashed password: {user.password}")
        password_match = check_password_hash(user.password, password)
        print(f"Password match result: {password_match}")

        if not password_match:
            return jsonify({'error': 'Invalid email or password!'}), 401

        # Generate token
        token = secrets.token_hex(16)
        tokens[token] = user.id

        user_data = {
            'id': user.id,
            'email': user.email,
            'is_admin': getattr(user, 'is_admin', False)
        }
        print(f"Login successful response data: {user_data}")

        return jsonify({
            'message': 'Login successful!', 
            'user': user_data,
            'token': token
        }), 200

    except Exception as e:
        print("Login Error:", e)
        return jsonify({'error': 'Something went wrong!'}), 500


@auth_bp.route('/reset-password', methods=['POST'])
@cross_origin()
def reset_password():
    data = request.get_json()
    email = data.get('email')
    new_password = data.get('new_password')

    if not email or not new_password:
        return jsonify({'error': 'All fields are required'}), 400

    if not is_strong_password(new_password):
        return jsonify({'error': 'Password must be at least 8 characters and include uppercase, lowercase, digit, and special character'}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404

    # Update password
    user.password = generate_password_hash(new_password)
    db.session.commit()

    return jsonify({'message': 'Password reset successful'}), 200



@auth_bp.route('/auth/verify', methods=['GET'])
@token_required
def verify(current_user):
    user_data = {
        'id': current_user.id,
        'email': current_user.email,
        'is_admin': getattr(current_user, 'is_admin', False)
    }
    return jsonify({'user': user_data}), 200
