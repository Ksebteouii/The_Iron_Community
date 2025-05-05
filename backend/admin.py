from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from models import db, User, Profile, Cart, Message
from functools import wraps

admin_bp = Blueprint('admin', __name__)

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # For demo, check for admin header
        if request.headers.get('X-Admin') != 'true':
            return jsonify({'error': 'Admin access required'}), 403
        return f(*args, **kwargs)
    return decorated_function

@admin_bp.route('/admin/users', methods=['GET'])
@admin_required
def get_all_users():
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
@admin_required
def get_all_carts():
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
@admin_required
def edit_cart(cart_id):
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
@admin_required
def delete_cart(cart_id):
    cart = Cart.query.get(cart_id)
    if not cart:
        return jsonify({'error': 'Cart not found'}), 404
    db.session.delete(cart)
    db.session.commit()
    return jsonify({'message': 'Cart deleted successfully'}), 200

@admin_bp.route('/admin/contact-messages', methods=['GET'])
@admin_required
def get_contact_messages():
    messages = Message.query.all()
    return jsonify([{
        'id': msg.id,
        'name': msg.name,
        'email': msg.email,
        'message': msg.message,
        'created_at': msg.created_at.isoformat() if msg.created_at else None
    } for msg in messages]), 200

@admin_bp.route('/admin/users/<int:user_id>', methods=['DELETE'])
@admin_required
def delete_user(user_id):
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
