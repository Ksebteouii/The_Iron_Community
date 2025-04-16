from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import bcrypt
import re

app = Flask(__name__)
CORS(app)

# Configure SQLite database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# User Model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(100))

# Create tables
with app.app_context():
    db.create_all()

# Password Hashing
def hash_password(password):
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

def check_password(hashed_password, user_password):
    return bcrypt.checkpw(
        user_password.encode('utf-8'),
        hashed_password.encode('utf-8')
    )

# Email Validation
def is_valid_email(email):
    pattern = r'^[\w\.-]+@[\w\.-]+\.\w+$'
    return re.match(pattern, email) is not None

# Routes
@app.route('/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        # Step 1: Validate inputs
        if not email or not password:
            return jsonify({'error': 'Email and password are required'}), 400

        if not is_valid_email(email):
            return jsonify({'error': 'Invalid email format'}), 400

        if len(password) < 6:
            return jsonify({'error': 'Password must be at least 6 characters'}), 400

        # Step 2: Check if user exists
        if User.query.filter_by(email=email).first():
            return jsonify({'error': 'Email already exists!'}), 400

        # Step 3: Hash password and store user
        hashed_password = hash_password(password)
        new_user = User(email=email, password=hashed_password)
        db.session.add(new_user)
        db.session.commit()

        return jsonify({'message': 'User created!'}), 201

    except Exception as e:
        print("Signup Error:", e)
        return jsonify({'error': 'Something went wrong!'}), 500

@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        # Step 1: Validate inputs
        if not email or not password:
            return jsonify({'error': 'Email and password are required'}), 400

        # Step 2: Find user and check password
        user = User.query.filter_by(email=email).first()
        if not user or not check_password(user.password, password):
            return jsonify({'error': 'Invalid email or password!'}), 401

        return jsonify({'message': 'Login successful!'}), 200

    except Exception as e:
        print("Login Error:", e)
        return jsonify({'error': 'Something went wrong!'}), 500

if __name__ == '__main__':
    app.run(debug=True)
