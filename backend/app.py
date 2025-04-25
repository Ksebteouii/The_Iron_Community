from flask import Flask
from flask_cors import CORS
from models import db
from auth import auth_bp

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

with app.app_context():
    db.create_all()

# Register blueprints
app.register_blueprint(auth_bp)

if __name__ == '__main__':
    app.run(debug=True)
