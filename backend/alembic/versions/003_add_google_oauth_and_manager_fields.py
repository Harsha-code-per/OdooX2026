"""Add Google OAuth and manager relationship fields

Revision ID: 003_add_google_oauth_fields
Revises: 002_seed_data
Create Date: 2026-07-12

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '003_add_google_oauth_fields'
down_revision: Union[str, None] = '002_seed_data'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add new columns to users table
    op.add_column('users', sa.Column('manager_id', postgresql.UUID(as_uuid=True), nullable=True))
    op.add_column('users', sa.Column('provider', sa.String(length=20), nullable=False, server_default='email'))
    op.add_column('users', sa.Column('google_id', sa.String(length=255), nullable=True, unique=True))
    op.add_column('users', sa.Column('profile_picture', sa.String(length=500), nullable=True))

    # Make password_hash nullable
    op.alter_column('users', 'password_hash',
                    existing_type=sa.String(length=255),
                    nullable=True)

    # Create indexes
    op.create_index('ix_users_manager_id', 'users', ['manager_id'], unique=False)
    op.create_index('ix_users_google_id', 'users', ['google_id'], unique=True)

    # Add foreign key constraint for manager_id
    op.execute('ALTER TABLE users DROP CONSTRAINT IF EXISTS users_manager_id_fkey')
    op.execute('ALTER TABLE users ADD CONSTRAINT users_manager_id_fkey FOREIGN KEY (manager_id) REFERENCES users(id) ON DELETE SET NULL')

    # Update existing users to have 'email' as provider
    op.execute("UPDATE users SET provider = 'email' WHERE provider IS NULL")


def downgrade() -> None:
    # Drop indexes
    op.drop_index('ix_users_google_id', table_name='users')
    op.drop_index('ix_users_manager_id', table_name='users')

    # Remove foreign key constraint
    op.execute('ALTER TABLE users DROP CONSTRAINT IF EXISTS users_manager_id_fkey')

    # Remove columns
    op.drop_column('users', 'profile_picture')
    op.drop_column('users', 'google_id')
    op.drop_column('users', 'provider')
    op.drop_column('users', 'manager_id')

    # Make password_hash not nullable again
    op.alter_column('users', 'password_hash',
                    existing_type=sa.String(length=255),
                    nullable=False)