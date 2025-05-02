"""Add phone number and confirmation fields to User model

Revision ID: 0002
Revises: 0001
Create Date: 2024-06-01 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '0002'
down_revision = '0001'
branch_labels = None
depends_on = None

def upgrade():
    op.add_column('user', sa.Column('phone_number', sa.String(length=20), nullable=True))
    op.add_column('user', sa.Column('signup_confirmation_code', sa.String(length=10), nullable=True))
    op.add_column('user', sa.Column('is_signup_confirmed', sa.Boolean(), nullable=False, server_default='false'))
    op.add_column('user', sa.Column('reset_confirmation_code', sa.String(length=10), nullable=True))
    op.add_column('user', sa.Column('is_reset_confirmed', sa.Boolean(), nullable=False, server_default='false'))

def downgrade():
    op.drop_column('user', 'is_reset_confirmed')
    op.drop_column('user', 'reset_confirmation_code')
    op.drop_column('user', 'is_signup_confirmed')
    op.drop_column('user', 'signup_confirmation_code')
    op.drop_column('user', 'phone_number')
