# utils.py
import bcrypt
import re

def hash_password(password):
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

def check_password(hashed_password, user_password):
    return bcrypt.checkpw(
        user_password.encode('utf-8'),
        hashed_password.encode('utf-8')
    )

def is_valid_email(email):
    pattern = r'^[\w\.-]+@[\w\.-]+\.\w+$'
    return re.match(pattern, email) is not None
