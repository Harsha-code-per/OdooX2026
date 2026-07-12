"""Seed initial data

Revision ID: 002_seed_data
Revises: 001_initial
Create Date: 2026-07-12

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.sql import table, column
from datetime import datetime
import uuid

# revision identifiers, used by Alembic.
revision: str = '002_seed_data'
down_revision: Union[str, None] = '001_initial'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Get current timestamp
    now = datetime.utcnow()

    # Insert departments first
    departments_table = table('departments',
        column('id', sa.UUID),
        column('name', sa.String),
        column('code', sa.String),
        column('employee_count', sa.Integer),
        column('status', sa.String),
        column('created_at', sa.DateTime),
        column('updated_at', sa.DateTime)
    )

    # Create some sample departments
    engineering_dept = uuid.uuid4()
    operations_dept = uuid.uuid4()
    finance_dept = uuid.uuid4()

    op.bulk_insert(departments_table, [
        {
            'id': engineering_dept,
            'name': 'Engineering',
            'code': 'ENG',
            'employee_count': 0,
            'status': 'active',
            'created_at': now,
            'updated_at': now
        },
        {
            'id': operations_dept,
            'name': 'Operations',
            'code': 'OPS',
            'employee_count': 0,
            'status': 'active',
            'created_at': now,
            'updated_at': now
        },
        {
            'id': finance_dept,
            'name': 'Finance',
            'code': 'FIN',
            'employee_count': 0,
            'status': 'active',
            'created_at': now,
            'updated_at': now
        }
    ])

    # Create users table reference
    users_table = table('users',
        column('id', sa.UUID),
        column('email', sa.String),
        column('password_hash', sa.String),
        column('full_name', sa.String),
        column('department_id', sa.UUID),
        column('role_id', sa.Integer),
        column('status', sa.String),
        column('must_change_password', sa.Boolean),
        column('failed_login_attempts', sa.Integer),
        column('created_at', sa.DateTime),
        column('updated_at', sa.DateTime)
    )

    # Create default admin user (password: Admin123! - should be changed)
    # In production, this should be done via environment variables or secure prompts
    import bcrypt
    admin_password = bcrypt.hashpw(b"Admin123!", bcrypt.gensalt(rounds=12)).decode('utf-8')

    admin_user_id = uuid.uuid4()

    op.bulk_insert(users_table, [
        {
            'id': admin_user_id,
            'email': 'admin@odoo.com',
            'password_hash': admin_password,
            'full_name': 'System Administrator',
            'department_id': None,  # Will be assigned later
            'role_id': 1,  # admin role
            'status': 'active',
            'must_change_password': True,  # Force password change on first login
            'failed_login_attempts': 0,
            'created_at': now,
            'updated_at': now
        }
    ])

    # Update admin user with department
    op.execute("""
        UPDATE users
        SET department_id = '{}'::uuid
        WHERE email = 'admin@odoo.com'
    """.format(engineering_dept))

    # Update department head
    op.execute("""
        UPDATE departments
        SET head_user_id = '{}'::uuid
        WHERE id = '{}'::uuid
    """.format(admin_user_id, engineering_dept))

    # Create sample users for testing
    test_password = bcrypt.hashpw(b"Test123!", bcrypt.gensalt(rounds=12)).decode('utf-8')

    op.bulk_insert(users_table, [
        {
            'id': uuid.uuid4(),
            'email': 'john.doe@odoo.com',
            'password_hash': test_password,
            'full_name': 'John Doe',
            'department_id': engineering_dept,
            'role_id': 4,  # employee role
            'status': 'active',
            'must_change_password': False,
            'failed_login_attempts': 0,
            'created_at': now,
            'updated_at': now
        },
        {
            'id': uuid.uuid4(),
            'email': 'jane.smith@odoo.com',
            'password_hash': test_password,
            'full_name': 'Jane Smith',
            'department_id': operations_dept,
            'role_id': 2,  # asset_manager role
            'status': 'active',
            'must_change_password': False,
            'failed_login_attempts': 0,
            'created_at': now,
            'updated_at': now
        },
        {
            'id': uuid.uuid4(),
            'email': 'bob.johnson@odoo.com',
            'password_hash': test_password,
            'full_name': 'Bob Johnson',
            'department_id': finance_dept,
            'role_id': 3,  # department_head role
            'status': 'active',
            'must_change_password': False,
            'failed_login_attempts': 0,
            'created_at': now,
            'updated_at': now
        }
    ])

    # Update department heads and employee counts
    op.execute("""
        UPDATE departments
        SET employee_count = (
            SELECT COUNT(*)
            FROM users
            WHERE users.department_id = departments.id
        )
    """)

    # Update finance department head
    op.execute("""
        UPDATE departments
        SET head_user_id = (
            SELECT id
            FROM users
            WHERE email = 'bob.johnson@odoo.com'
        )
        WHERE code = 'FIN'
    """)


def downgrade() -> None:
    # Remove sample users (keep admin for testing purposes, or remove all)
    op.execute("DELETE FROM users WHERE email IN ('john.doe@odoo.com', 'jane.smith@odoo.com', 'bob.johnson@odoo.com')")

    # Optionally remove admin user
    op.execute("DELETE FROM users WHERE email = 'admin@odoo.com'")

    # Remove sample departments
    op.execute("DELETE FROM departments WHERE code IN ('ENG', 'OPS', 'FIN')")

    # Remove roles
    op.execute("DELETE FROM roles WHERE name IN ('admin', 'asset_manager', 'department_head', 'employee')")