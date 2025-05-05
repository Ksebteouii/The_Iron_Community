from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from models import db, User, Profile

profile_bp = Blueprint('profile', __name__)

@profile_bp.route('/api/profile/<email>', methods=['GET'])
@cross_origin()
def get_profile(email):
    try:
        profile = Profile.query.filter_by(email=email).first()
        if profile:
            return jsonify({
                'profile': {
                    'name': profile.name,
                    'email': profile.email,
                    'profile_picture': profile.profile_picture,
                    'bio': profile.bio,
                    'gender': profile.gender,
                    'phone_number': profile.phone_number
                }
            })
        return jsonify({'profile': None}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@profile_bp.route('/api/profile', methods=['POST'])
@cross_origin()
def update_profile():
    try:
        data = request.get_json()
        email = data.get('email')
        
        if not email:
            return jsonify({'error': 'Email is required'}), 400

        profile = Profile.query.filter_by(email=email).first()
        
        if not profile:
            # Create new profile
            profile = Profile(
                email=email,
                name=data.get('name', ''),
                profile_picture=data.get('profile_picture', ''),
                bio=data.get('bio', ''),
                gender=data.get('gender', ''),
                phone_number=data.get('phone_number', '')
            )
            db.session.add(profile)
        else:
            # Update existing profile
            profile.name = data.get('name', profile.name)
            profile.profile_picture = data.get('profile_picture', profile.profile_picture)
            profile.bio = data.get('bio', profile.bio)
            profile.gender = data.get('gender', profile.gender)
            profile.phone_number = data.get('phone_number', profile.phone_number)

        db.session.commit()
        return jsonify({'message': 'Profile updated successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500 