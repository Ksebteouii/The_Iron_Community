from flask import Blueprint, request, jsonify
from models import db, Event
from auth import token_required, admin_required
from datetime import datetime
import json

admin_events_bp = Blueprint('admin_events', __name__)

@admin_events_bp.route('/admin/events/<int:event_id>', methods=['GET'])
@token_required
@admin_required
def get_event_for_edit(current_user, event_id):
    try:
        event = Event.query.get_or_404(event_id)
        return jsonify({
            'event': {
                'id': event.id,
                'title': event.title,
                'description': event.description,
                'image': event.image,
                'features': event.features,
                'icon': event.icon,
                'date': event.date.isoformat(),
                'time': event.time.strftime('%H:%M'),
                'location': event.location,
                'max_participants': event.max_participants,
                'status': event.status,
                'created_at': event.created_at.isoformat(),
                'updated_at': event.updated_at.isoformat()
            }
        }), 200
    except Exception as e:
        print(f"Error in get_event_for_edit: {str(e)}")
        return jsonify({'error': 'Failed to fetch event details'}), 500

@admin_events_bp.route('/admin/events/<int:event_id>', methods=['PUT'])
@token_required
@admin_required
def update_event(current_user, event_id):
    try:
        event = Event.query.get_or_404(event_id)
        data = request.get_json()

        # Validate required fields
        required_fields = ['title', 'description', 'date', 'time', 'location']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400

        # Validate date format
        try:
            event_date = datetime.strptime(data['date'], '%Y-%m-%d').date()
        except ValueError:
            return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD'}), 400

        # Validate time format
        try:
            event_time = datetime.strptime(data['time'], '%H:%M').time()
        except ValueError:
            return jsonify({'error': 'Invalid time format. Use HH:MM'}), 400

        # Validate max_participants
        if 'max_participants' in data:
            try:
                max_participants = int(data['max_participants'])
                if max_participants < 1:
                    return jsonify({'error': 'Maximum participants must be a positive number'}), 400
            except ValueError:
                return jsonify({'error': 'Invalid maximum participants value'}), 400

        # Validate status
        valid_statuses = ['active', 'cancelled', 'completed']
        if 'status' in data and data['status'] not in valid_statuses:
            return jsonify({'error': f'Invalid status. Must be one of: {", ".join(valid_statuses)}'}), 400

        # Update event fields
        event.title = data['title']
        event.description = data['description']
        event.image = data.get('image', event.image)
        event.features = data.get('features', event.features)
        event.icon = data.get('icon', event.icon)
        event.date = event_date
        event.time = event_time
        event.location = data['location']
        event.max_participants = data.get('max_participants', event.max_participants)
        event.status = data.get('status', event.status)
        event.updated_at = datetime.utcnow()

        db.session.commit()

        return jsonify({
            'message': 'Event updated successfully',
            'event': {
                'id': event.id,
                'title': event.title,
                'description': event.description,
                'image': event.image,
                'features': event.features,
                'icon': event.icon,
                'date': event.date.isoformat(),
                'time': event.time.strftime('%H:%M'),
                'location': event.location,
                'max_participants': event.max_participants,
                'status': event.status,
                'updated_at': event.updated_at.isoformat()
            }
        }), 200

    except Exception as e:
        print(f"Error in update_event: {str(e)}")
        db.session.rollback()
        return jsonify({'error': 'Failed to update event'}), 500 