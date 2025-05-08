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
                title="Mountain Hiking Adventure",
                description="Join us for an exciting mountain hiking adventure! Experience breathtaking views and connect with nature enthusiasts.",
                date=datetime(2024, 5, 15, 9, 0),
                location="Mount Washington Trail",
                max_participants=20
            ),
            Event(
                title="Beach Cleanup Day",
                description="Help us keep our beaches clean! Join this community event to collect trash and protect marine life.",
                date=datetime(2024, 5, 20, 10, 0),
                location="Sunset Beach",
                max_participants=50
            ),
            Event(
                title="Forest Conservation Workshop",
                description="Learn about forest conservation and sustainable practices. Perfect for nature lovers and environmentalists.",
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