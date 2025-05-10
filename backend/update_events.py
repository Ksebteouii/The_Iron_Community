from app import app
from models import db, Event

def update_event_titles():
    with app.app_context():
        # Get all events
        events = Event.query.all()
        
        # Update event titles
        for event in events:
            if event.title == "Mountain Hiking Adventure":
                event.title = "Hiking Expedition"
            elif event.title == "Beach Cleanup Day":
                event.title = "Iron Community Challenge"
            elif event.title == "Forest Conservation Workshop":
                event.title = "Camping Adventure"
        
        # Commit changes
        db.session.commit()
        print("Event titles updated successfully!")

if __name__ == "__main__":
    update_event_titles() 