
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '0001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('user', sa.Column('name', sa.String(length=100), nullable=True))


def downgrade():
    op.drop_column('user', 'name')
