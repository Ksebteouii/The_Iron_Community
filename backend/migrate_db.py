from app import app
from models import db, User, Profile, Cart, Message, Event
from datetime import datetime

def migrate():
    with app.app_context():
        # Create all tables
        db.create_all()

        # Create some sample events
        events = [
            Event(
                title="Camping Adventure",
                description="Join us for an unforgettable camping experience in the wilderness. Learn survival skills, enjoy nature, and make new friends.",
                date=datetime(2024, 5, 15, 9, 0),
                location="Mount Washington Trail",
                max_participants=20
            ),
            Event(
                title="Hiking Expedition",
                description="Challenge yourself with our guided hiking expedition. Perfect for both beginners and experienced hikers.",
                date=datetime(2024, 5, 20, 10, 0),
                location="Sunset Beach",
                max_participants=50
            ),
            Event(
                title="Iron Community Challenge",
                description="Test your limits in our community fitness challenge. A perfect blend of strength, endurance, and teamwork.",
                date=datetime(2024, 6, 1, 14, 0),
                location="Green Valley Forest Center",
                max_participants=30
            )
        ]

        # Add events to database
        for event in events:
            db.session.add(event)

        # Commit changes
        db.session.commit()

if __name__ == "__main__":
    migrate() 