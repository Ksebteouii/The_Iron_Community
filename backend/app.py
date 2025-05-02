from flask import Flask
from flask_cors import CORS
from models import db
from auth import auth_bp
from admin import admin_bp
from messages import messages_bp

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

with app.app_context():
    db.create_all()

# Register blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(admin_bp)
app.register_blueprint(messages_bp)

from cart import cart_bp
app.register_blueprint(cart_bp)

if __name__ == '__main__':
    app.run(debug=True)
