import os
from app import app
from models import db, User, Profile, Cart, Message

def recreate_database():
    # Get the database path
    db_path = os.path.join(app.instance_path, 'users.db')
    
    # Remove the existing database if it exists
    if os.path.exists(db_path):
        os.remove(db_path)
        print(f"Removed existing database at {db_path}")
    
    # Create the instance directory if it doesn't exist
    os.makedirs(app.instance_path, exist_ok=True)
    
    # Create all tables
    with app.app_context():
        db.create_all()
        print("Created new database with updated schema")
        
        # Create an admin user
        admin = User(
            name="Admin User",
            email="admin@example.com",
            password="admin123",  # In production, this should be hashed
            is_admin=True
        )
        db.session.add(admin)
        db.session.commit()
        print("Created admin user")

if __name__ == "__main__":
    recreate_database() 