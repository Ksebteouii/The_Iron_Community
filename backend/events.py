from flask import Blueprint, request, jsonify
from models import db, User, Event
from auth import token_required
from datetime import datetime

events_bp = Blueprint('events', __name__)

@events_bp.route('/events', methods=['GET'])
def get_all_events():
    try:
        events = Event.query.all()
        return jsonify({
            'events': [{
                'id': event.id,
                'title': event.title,
                'description': event.description,
                'date': event.date.isoformat(),
                'location': event.location,
                'max_participants': event.max_participants,
                'current_participants': len(event.participants),
                'created_at': event.created_at.isoformat()
            } for event in events]
        }), 200
    except Exception as e:
        print(f"Error in get_all_events: {str(e)}")
        return jsonify({'error': 'Failed to fetch events'}), 500

@events_bp.route('/events/<int:event_id>', methods=['GET'])
def get_event(event_id):
    try:
        event = Event.query.get_or_404(event_id)
        return jsonify({
            'event': {
                'id': event.id,
                'title': event.title,
                'description': event.description,
                'date': event.date.isoformat(),
                'location': event.location,
                'max_participants': event.max_participants,
                'current_participants': len(event.participants),
                'created_at': event.created_at.isoformat()
            }
        }), 200
    except Exception as e:
        print(f"Error in get_event: {str(e)}")
        return jsonify({'error': 'Failed to fetch event'}), 500

@events_bp.route('/events/<int:event_id>/signup', methods=['POST'])
@token_required
def signup_for_event(current_user, event_id):
    try:
        event = Event.query.get_or_404(event_id)
        
        # Check if event is full
        if event.max_participants and len(event.participants) >= event.max_participants:
            return jsonify({'error': 'Event is full'}), 400

        # Check if user is already signed up
        if current_user in event.participants:
            return jsonify({'error': 'Already signed up for this event'}), 400

        # Add user to event participants
        event.participants.append(current_user)
        db.session.commit()

        return jsonify({
            'message': f'Successfully signed up for {event.title}',
            'event': {
                'id': event.id,
                'title': event.title,
                'current_participants': len(event.participants)
            }
        }), 200

    except Exception as e:
        print(f"Error in signup_for_event: {str(e)}")
        return jsonify({'error': 'Failed to sign up for event'}), 500

@events_bp.route('/events/<int:event_id>/participants', methods=['GET'])
@token_required
def get_event_participants(current_user, event_id):
    try:
        event = Event.query.get_or_404(event_id)
        
        participants = [{
            'id': user.id,
            'name': user.name,
            'email': user.email,
            'profile_picture': user.profile.profile_picture if user.profile else None
        } for user in event.participants]

        return jsonify({
            'event': {
                'id': event.id,
                'title': event.title,
                'participants': participants,
                'total_participants': len(participants)
            }
        }), 200

    except Exception as e:
        print(f"Error in get_event_participants: {str(e)}")
        return jsonify({'error': 'Failed to get participants'}), 500

@events_bp.route('/events/<int:event_id>/cancel', methods=['POST'])
@token_required
def cancel_event_signup(current_user, event_id):
    try:
        event = Event.query.get_or_404(event_id)
        
        if current_user not in event.participants:
            return jsonify({'error': 'Not signed up for this event'}), 400

        event.participants.remove(current_user)
        db.session.commit()

        return jsonify({
            'message': f'Successfully cancelled signup for {event.title}',
            'event': {
                'id': event.id,
                'title': event.title,
                'current_participants': len(event.participants)
            }
        }), 200

    except Exception as e:
        print(f"Error in cancel_event_signup: {str(e)}")
        return jsonify({'error': 'Failed to cancel event signup'}), 500 