from flask import Blueprint, request, jsonify
from models import db, Cart, User
from flask import g
from functools import wraps

cart_bp = Blueprint('cart', __name__)


def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
       
        user_email = request.headers.get('X-User-Email')
        if not user_email:
            return jsonify({'error': 'Authentication required'}), 401
        user = User.query.filter_by(email=user_email).first()
        if not user:
            return jsonify({'error': 'User not found'}), 404
        g.user = user
        return f(*args, **kwargs)
    return decorated_function

@cart_bp.route('/cart', methods=['GET'])
@login_required
def get_cart():
    cart = Cart.query.filter_by(user_id=g.user.id).first()
    if not cart:
        return jsonify({'items': '[]'}), 200
    return jsonify({'items': cart.items}), 200

@cart_bp.route('/cart', methods=['POST'])
@login_required
def create_or_update_cart():
    data = request.get_json()
    items = data.get('items')
    if items is None:
        return jsonify({'error': 'Items field is required'}), 400
    cart = Cart.query.filter_by(user_id=g.user.id).first()
    if cart:
        cart.items = items
    else:
        cart = Cart(user_id=g.user.id, items=items)
        db.session.add(cart)
    db.session.commit()
    return jsonify({'message': 'Cart saved successfully'}), 200
