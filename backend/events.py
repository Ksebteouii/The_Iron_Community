from flask import Blueprint, request, jsonify
from models import db, User, Event
from auth import token_required

events_bp = Blueprint('events', __name__)

@events_bp.route('/events/<event_type>/signup', methods=['POST'])
@token_required
def signup_for_event(current_user, event_type):
    try:
        # Check if event exists
        event = Event.query.filter_by(type=event_type).first()
        if not event:
            # Create event if it doesn't exist
            event = Event(type=event_type)
            db.session.add(event)
            db.session.commit()

        # Check if user is already signed up
        if current_user in event.participants:
            return jsonify({'error': 'Already signed up for this event'}), 400

        # Add user to event participants
        event.participants.append(current_user)
        db.session.commit()

        return jsonify({
            'message': f'Successfully signed up for {event_type}',
            'event': {
                'id': event.id,
                'type': event.type,
                'participants': [user.id for user in event.participants]
            }
        }), 200

    except Exception as e:
        print(f"Error in signup_for_event: {str(e)}")
        return jsonify({'error': 'Failed to sign up for event'}), 500

@events_bp.route('/events/<event_type>/participants', methods=['GET'])
@token_required
def get_event_participants(current_user, event_type):
    try:
        event = Event.query.filter_by(type=event_type).first()
        if not event:
            return jsonify({'error': 'Event not found'}), 404

        participants = [{
            'id': user.id,
            'name': user.name,
            'email': user.email,
            'profile_picture': user.profile.profile_picture if user.profile else None
        } for user in event.participants]

        return jsonify({
            'event': {
                'id': event.id,
                'type': event.type,
                'participants': participants
            }
        }), 200

    except Exception as e:
        print(f"Error in get_event_participants: {str(e)}")
        return jsonify({'error': 'Failed to get participants'}), 500 