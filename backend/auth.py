from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from models import db, User, Profile
from utils import hash_password, check_password, is_valid_email, is_strong_password
import secrets
import datetime
import random
import string
from werkzeug.security import generate_password_hash, check_password_hash

auth_bp = Blueprint('auth', __name__)

# In-memory token store for demo purposes (replace with persistent store in production)
reset_tokens = {}

# Store verification codes temporarily (in production, use Redis or similar)
verification_codes = {}

def generate_verification_code():
    """Generate a 6-digit verification code"""
    return ''.join(random.choices(string.digits, k=6))

def generate_reset_token():
    """Generate a secure reset token"""
    return ''.join(random.choices(string.ascii_letters + string.digits, k=32))

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

@auth_bp.route('/forgot-password', methods=['POST'])
@cross_origin()
def forgot_password():
    data = request.get_json()
    email = data.get('email')
    
    if not email:
        return jsonify({'error': 'Email is required'}), 400
    
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    profile = Profile.query.filter_by(email=email).first()
    if not profile or not profile.phone_number:
        return jsonify({'error': 'No phone number found for this account'}), 400
    
    # Generate verification code
    verification_code = generate_verification_code()
    verification_codes[email] = {
        'code': verification_code,
        'expires': datetime.datetime.utcnow() + datetime.timedelta(minutes=10),
        'token': generate_reset_token()
    }
    
    # In a production environment, you would send this code via SMS
    # For development, we'll return it in the response
    return jsonify({
        'message': 'Verification code sent to your phone number',
        'verification_code': verification_code,  # Remove this in production
        'phone_number': profile.phone_number[-4:]  # Show only last 4 digits
    }), 200

@auth_bp.route('/verify-reset-code', methods=['POST'])
@cross_origin()
def verify_reset_code():
    data = request.get_json()
    email = data.get('email')
    code = data.get('code')
    
    if not email or not code:
        return jsonify({'error': 'Email and verification code are required'}), 400
    
    stored_data = verification_codes.get(email)
    if not stored_data:
        return jsonify({'error': 'No verification code found for this email'}), 400
    
    if datetime.datetime.utcnow() > stored_data['expires']:
        del verification_codes[email]
        return jsonify({'error': 'Verification code has expired'}), 400
    
    if code != stored_data['code']:
        return jsonify({'error': 'Invalid verification code'}), 400
    
    # Return the reset token for the next step
    return jsonify({
        'message': 'Code verified successfully',
        'reset_token': stored_data['token']
    }), 200

@auth_bp.route('/reset-password', methods=['POST'])
@cross_origin()
def reset_password():
    data = request.get_json()
    email = data.get('email')
    reset_token = data.get('reset_token')
    new_password = data.get('new_password')
    
    if not all([email, reset_token, new_password]):
        return jsonify({'error': 'All fields are required'}), 400
    
    if not is_strong_password(new_password):
        return jsonify({'error': 'Password must be at least 8 characters and include uppercase, lowercase, digit, and special character'}), 400
    
    stored_data = verification_codes.get(email)
    if not stored_data or stored_data['token'] != reset_token:
        return jsonify({'error': 'Invalid or expired reset token'}), 400
    
    if datetime.datetime.utcnow() > stored_data['expires']:
        del verification_codes[email]
        return jsonify({'error': 'Reset token has expired'}), 400
    
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    # Update password
    user.password = generate_password_hash(new_password)
    db.session.commit()
    
    # Clean up verification data
    del verification_codes[email]
    
    return jsonify({'message': 'Password reset successful'}), 200
