import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import app, db
from models import Event
from datetime import datetime

def upgrade():
    with app.app_context():
        # Add new columns
        db.engine.execute('ALTER TABLE event ADD COLUMN image VARCHAR(500)')
        db.engine.execute('ALTER TABLE event ADD COLUMN features JSON')
        db.engine.execute('ALTER TABLE event ADD COLUMN icon VARCHAR(50)')
        db.engine.execute('ALTER TABLE event ADD COLUMN time TIME')
        db.engine.execute('ALTER TABLE event ADD COLUMN status VARCHAR(20) DEFAULT "active"')
        
        # Convert existing datetime to date
        db.engine.execute('ALTER TABLE event ADD COLUMN new_date DATE')
        db.engine.execute('UPDATE event SET new_date = date(date)')
        db.engine.execute('ALTER TABLE event DROP COLUMN date')
        db.engine.execute('ALTER TABLE event RENAME COLUMN new_date TO date')
        
        # Set default max_participants
        db.engine.execute('UPDATE event SET max_participants = 20 WHERE max_participants IS NULL')

def downgrade():
    with app.app_context():
        # Remove new columns
        db.engine.execute('ALTER TABLE event DROP COLUMN image')
        db.engine.execute('ALTER TABLE event DROP COLUMN features')
        db.engine.execute('ALTER TABLE event DROP COLUMN icon')
        db.engine.execute('ALTER TABLE event DROP COLUMN time')
        db.engine.execute('ALTER TABLE event DROP COLUMN status')
        
        # Convert date back to datetime
        db.engine.execute('ALTER TABLE event ADD COLUMN new_date DATETIME')
        db.engine.execute('UPDATE event SET new_date = datetime(date)')
        db.engine.execute('ALTER TABLE event DROP COLUMN date')
        db.engine.execute('ALTER TABLE event RENAME COLUMN new_date TO date')

if __name__ == '__main__':
    upgrade() 