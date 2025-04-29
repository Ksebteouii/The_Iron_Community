from models import db, User
from app import app

def make_user_admin(email):
    with app.app_context():
        user = User.query.filter_by(email=email).first()
        if user:
            user.is_admin = True
            db.session.commit()
            print(f"User {user.email} is now an admin.")
        else:
            print("User not found.")

if __name__ == "__main__":
    import sys
    if len(sys.argv) != 2:
        print("Usage: python make_admin.py user_email@example.com")
    else:
        make_user_admin(sys.argv[1])
