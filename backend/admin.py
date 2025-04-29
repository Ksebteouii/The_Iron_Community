from flask import Blueprint, request, jsonify
from models import db, User
from models import db, User, Cart

from functools import wraps

admin_bp = Blueprint('admin', __name__)

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Simple admin check: expects 'admin' query param for demo purposes
        # In real app, use proper auth and session management
        is_admin = request.headers.get('X-Admin', 'false').lower() == 'true'
        if not is_admin:
            return jsonify({'error': 'Admin access required'}), 403
        return f(*args, **kwargs)
    return decorated_function

@admin_bp.route('/admin/carts', methods=['GET'])
@admin_required
def get_all_carts():
    carts = Cart.query.all()
    result = []
    for cart in carts:
        user = User.query.get(cart.user_id)
        result.append({
            'cart_id': cart.id,
            'user_name': user.name if user else 'Unknown',
            'user_email': user.email if user else 'Unknown',
            'items': cart.items
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
