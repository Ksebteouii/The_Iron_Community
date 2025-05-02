"""Add Message model

Revision ID: 0003
Revises: 0002_add_confirmation_fields_to_user
Create Date: 2024-06-01 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '0003'
down_revision = '0002_add_confirmation_fields_to_user'
branch_labels = None
depends_on = None

def upgrade():
    op.create_table(
        'message',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('email', sa.String(length=100), nullable=False),
        sa.Column('message', sa.Text, nullable=False),
        sa.Column('admin_reply', sa.Text, nullable=True),
        sa.Column('created_at', sa.DateTime, nullable=False, server_default=sa.func.now())
    )

def downgrade():
    op.drop_table('message')
