from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from models import db, User, Profile, Cart, Message, Event
from functools import wraps
from auth import token_required
from datetime import datetime

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/admin/users', methods=['GET'])
@token_required
def get_all_users(current_user):
    if not current_user.is_administrator():
        return jsonify({'error': 'Admin access required'}), 403
    users = User.query.all()
    result = []
    for user in users:
        profile = Profile.query.filter_by(email=user.email).first()
        result.append({
            'id': user.id,
            'name': user.name,
            'email': user.email,
            'is_admin': user.is_admin,
            'profile': {
                'name': profile.name if profile else None,
                'profile_picture': profile.profile_picture if profile else None,
                'bio': profile.bio if profile else None,
                'gender': profile.gender if profile else None,
                'phone_number': profile.phone_number if profile else None,
                'created_at': profile.created_at.isoformat() if profile and profile.created_at else None,
                'updated_at': profile.updated_at.isoformat() if profile and profile.updated_at else None
            } if profile else None
        })
    return jsonify(result), 200

@admin_bp.route('/admin/carts', methods=['GET'])
@token_required
def get_all_carts(current_user):
    if not current_user.is_administrator():
        return jsonify({'error': 'Admin access required'}), 403
    carts = Cart.query.all()
    result = []
    for cart in carts:
        user = User.query.get(cart.user_id)
        profile = Profile.query.filter_by(email=user.email).first() if user else None
        result.append({
            'cart_id': cart.id,
            'user_name': user.name if user else 'Unknown',
            'user_email': user.email if user else 'Unknown',
            'items': cart.items,
            'profile': {
                'name': profile.name if profile else None,
                'profile_picture': profile.profile_picture if profile else None,
                'bio': profile.bio if profile else None,
                'gender': profile.gender if profile else None,
                'phone_number': profile.phone_number if profile else None
            } if profile else None
        })
    return jsonify(result), 200

@admin_bp.route('/admin/carts/<int:cart_id>', methods=['PUT'])
@token_required
def edit_cart(current_user, cart_id):
    if not current_user.is_administrator():
        return jsonify({'error': 'Admin access required'}), 403
    cart = Cart.query.get(cart_id)
    if not cart:
        return jsonify({'error': 'Cart not found'}), 404
    data = request.get_json()
    items = data.get('items')
    if items is None:
        return jsonify({'error': 'Items field is required'}), 400
    cart.items = items
    db.session.commit()
    return jsonify({'message': 'Cart updated successfully'}), 200

@admin_bp.route('/admin/carts/<int:cart_id>', methods=['DELETE'])
@token_required
def delete_cart(current_user, cart_id):
    if not current_user.is_administrator():
        return jsonify({'error': 'Admin access required'}), 403
    cart = Cart.query.get(cart_id)
    if not cart:
        return jsonify({'error': 'Cart not found'}), 404
    db.session.delete(cart)
    db.session.commit()
    return jsonify({'message': 'Cart deleted successfully'}), 200

@admin_bp.route('/admin/contact-messages', methods=['GET'])
@token_required
def get_contact_messages(current_user):
    if not current_user.is_administrator():
        return jsonify({'error': 'Admin access required'}), 403
    messages = Message.query.all()
    return jsonify([{
        'id': msg.id,
        'name': msg.name,
        'email': msg.email,
        'message': msg.message,
        'created_at': msg.created_at.isoformat() if msg.created_at else None
    } for msg in messages]), 200

@admin_bp.route('/admin/users/<int:user_id>', methods=['DELETE'])
@token_required
def delete_user(current_user, user_id):
    if not current_user.is_administrator():
        return jsonify({'error': 'Admin access required'}), 403
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    # Delete associated profile
    profile = Profile.query.filter_by(email=user.email).first()
    if profile:
        db.session.delete(profile)
    
    # Delete associated cart
    cart = Cart.query.filter_by(user_id=user.id).first()
    if cart:
        db.session.delete(cart)
    
    # Delete the user
    db.session.delete(user)
    db.session.commit()
    
    return jsonify({'message': 'User deleted successfully'}), 200

@admin_bp.route('/admin/events', methods=['GET'])
@token_required
def get_all_events(current_user):
    if not current_user.is_administrator():
        return jsonify({'error': 'Unauthorized'}), 403
    
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

@admin_bp.route('/admin/events/<int:event_id>', methods=['DELETE'])
@token_required
def delete_event(current_user, event_id):
    if not current_user.is_administrator():
        return jsonify({'error': 'Unauthorized'}), 403
    
    try:
        event = Event.query.get_or_404(event_id)
        db.session.delete(event)
        db.session.commit()
        return jsonify({'message': 'Event deleted successfully'}), 200
    except Exception as e:
        print(f"Error in delete_event: {str(e)}")
        return jsonify({'error': 'Failed to delete event'}), 500

@admin_bp.route('/admin/events', methods=['POST'])
@token_required
def create_event(current_user):
    if not current_user.is_administrator():
        return jsonify({'error': 'Unauthorized'}), 403
    
    try:
        data = request.get_json()
        event = Event(
            title=data['title'],
            description=data['description'],
            date=data['date'],
            location=data['location'],
            max_participants=data.get('max_participants')
        )
        db.session.add(event)
        db.session.commit()
        
        return jsonify({
            'message': 'Event created successfully',
            'event': {
                'id': event.id,
                'title': event.title,
                'description': event.description,
                'date': event.date.isoformat(),
                'location': event.location,
                'max_participants': event.max_participants,
                'current_participants': 0,
                'created_at': event.created_at.isoformat()
            }
        }), 201
    except Exception as e:
        print(f"Error in create_event: {str(e)}")
        return jsonify({'error': 'Failed to create event'}), 500

@admin_bp.route('/admin/events/<int:event_id>', methods=['PUT'])
@token_required
def update_event(current_user, event_id):
    if not current_user.is_administrator():
        return jsonify({'error': 'Unauthorized'}), 403
    
    try:
        event = Event.query.get_or_404(event_id)
        data = request.get_json()
        
        if 'title' in data:
            event.title = data['title']
        if 'description' in data:
            event.description = data['description']
        if 'date' in data:
            event.date = datetime.fromisoformat(data['date'])
        if 'location' in data:
            event.location = data['location']
        if 'max_participants' in data:
            event.max_participants = data['max_participants']
            
        db.session.commit()
        
        return jsonify({
            'message': 'Event updated successfully',
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
        print(f"Error in update_event: {str(e)}")
        return jsonify({'error': 'Failed to update event'}), 500
