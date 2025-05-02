from flask import Blueprint, request, jsonify
from models import db, Message
from flask import current_app as app

messages_bp = Blueprint('messages', __name__)

@messages_bp.route('/contact-messages', methods=['POST'])
def create_message():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    message_text = data.get('message')

    if not name or not email or not message_text:
        return jsonify({'error': 'Name, email, and message are required'}), 400

    message = Message(name=name, email=email, message=message_text)
    db.session.add(message)
    db.session.commit()

    return jsonify({'message': 'Message received successfully'}), 201

@messages_bp.route('/admin/contact-messages', methods=['GET'])
def get_messages():
    # For simplicity, no auth check here, but should be admin only
    messages = Message.query.order_by(Message.created_at.desc()).all()
    result = []
    for msg in messages:
        result.append({
            'id': msg.id,
            'name': msg.name,
            'email': msg.email,
            'message': msg.message,
            'admin_reply': msg.admin_reply,
            'created_at': msg.created_at.isoformat()
        })
    return jsonify(result), 200

@messages_bp.route('/admin/contact-messages/<int:message_id>/reply', methods=['POST'])
def reply_message(message_id):
    # For simplicity, no auth check here, but should be admin only
    data = request.get_json()
    reply_text = data.get('reply')

    if not reply_text:
        return jsonify({'error': 'Reply text is required'}), 400

    message = Message.query.get(message_id)
    if not message:
        return jsonify({'error': 'Message not found'}), 404

    message.admin_reply = reply_text
    db.session.commit()

    return jsonify({'message': 'Reply saved successfully'}), 200
