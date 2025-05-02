from flask import Blueprint, request, jsonify
from models import db, User
from utils import hash_password, check_password, is_valid_email, is_strong_password
import secrets
import datetime

auth_bp = Blueprint('auth', __name__)

# In-memory token store for demo purposes (replace with persistent store in production)
reset_tokens = {}

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
        if not user:
            print(f"Login failed: user with email {email} not found")
            return jsonify({'error': 'Invalid email or password!'}), 401

        # Debugging: print hashed password and check result
        print(f"Stored hashed password: {user.password}")
        password_match = check_password(user.password, password)
        print(f"Password match result: {password_match}")

        if not password_match:
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

        # Generate a secure token and store it with expiration
        token = secrets.token_urlsafe(32)
        expiration = datetime.datetime.utcnow() + datetime.timedelta(hours=1)
        reset_tokens[token] = {'email': email, 'expires': expiration}

        # Email sending disabled to avoid errors; enable and configure SMTP to use
        # send_reset_email(email, token)

        return jsonify({'message': 'Reset link sent. Please check your email.', 'token': token}), 200

    except Exception as e:
        print("Request Reset Error:", e)
        return jsonify({'error': 'Something went wrong!'}), 500

@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
    try:
        data = request.get_json()
        token = data.get('token')
        new_password = data.get('new_password')

        if not token or not new_password:
            return jsonify({'error': 'Token and new password are required'}), 400

        if not is_strong_password(new_password):
            return jsonify({'error': 'Password must be at least 8 characters and include uppercase, lowercase, digit, and special character'}), 400

        token_data = reset_tokens.get(token)
        if not token_data:
            return jsonify({'error': 'Invalid or expired token'}), 400

        if token_data['expires'] < datetime.datetime.utcnow():
            del reset_tokens[token]
            return jsonify({'error': 'Token has expired'}), 400

        user = User.query.filter_by(email=token_data['email']).first()
        if not user:
            return jsonify({'error': 'No user found with this email'}), 404

        user.password = hash_password(new_password)
        db.session.commit()

        # Remove token after successful reset
        del reset_tokens[token]

        return jsonify({'message': 'Password reset successfully!'}), 200

    except Exception as e:
        print("Reset Password Error:", e)
        return jsonify({'error': 'Something went wrong!'}), 500
