from flask import Blueprint, jsonify, request, make_response
from models import db, User, Activity, ActivityParticipant
from datetime import datetime

activities_bp = Blueprint('activities', __name__)

def add_cors_headers(response):
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    response.headers.add('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response

@activities_bp.route('/activities/<activity_name>/participants', methods=['GET', 'OPTIONS'])
def get_activity_participants(activity_name):
    if request.method == 'OPTIONS':
        response = make_response()
        return add_cors_headers(response)
        
    try:
        # Get all participants for the activity
        participants = ActivityParticipant.query.filter_by(activity_name=activity_name).all()
        
        # Get user details for each participant
        participant_details = []
        for participant in participants:
            user = User.query.get(participant.user_id)
            if user:
                participant_details.append({
                    'id': user.id,
                    'name': user.name,
                    'email': user.email,
                    'joined_at': participant.joined_at.isoformat()
                })
        
        response = jsonify({
            'activity': activity_name,
            'participants': participant_details
        })
        return add_cors_headers(response)
        
    except Exception as e:
        print(f"Error getting participants: {str(e)}")
        response = jsonify({'error': 'Failed to get participants'})
        return add_cors_headers(response), 500

@activities_bp.route('/activities/<activity_name>/join', methods=['POST', 'OPTIONS'])
def join_activity(activity_name):
    if request.method == 'OPTIONS':
        response = make_response()
        return add_cors_headers(response)
        
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        
        if not user_id:
            response = jsonify({'error': 'User ID is required'})
            return add_cors_headers(response), 400
            
        # Check if user is already a participant
        existing_participant = ActivityParticipant.query.filter_by(
            user_id=user_id,
            activity_name=activity_name
        ).first()
        
        if existing_participant:
            response = jsonify({'message': 'Already joined this activity'})
            return add_cors_headers(response), 200
            
        # Create new participant
        new_participant = ActivityParticipant(
            user_id=user_id,
            activity_name=activity_name,
            joined_at=datetime.utcnow()
        )
        
        db.session.add(new_participant)
        db.session.commit()
        
        response = jsonify({
            'message': 'Successfully joined activity',
            'activity': activity_name
        })
        return add_cors_headers(response), 201
        
    except Exception as e:
        print(f"Error joining activity: {str(e)}")
        response = jsonify({'error': 'Failed to join activity'})
        return add_cors_headers(response), 500 