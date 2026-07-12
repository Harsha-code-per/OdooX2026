"""Add core business features tables

Revision ID: 004_add_core_business_features
Revises: 003_add_google_oauth_fields
Create Date: 2026-07-12

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '004_add_core_business_features'
down_revision: Union[str, None] = '003_add_google_oauth_fields'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ==========================================
    # REWARD SYSTEM TABLES
    # ==========================================

    # Rewards table
    op.create_table(
        'rewards',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('description', sa.String(1000), nullable=True),
        sa.Column('category', sa.String(50), nullable=False, server_default='merchandise'),
        sa.Column('points_required', sa.Integer, nullable=False, server_default='0'),
        sa.Column('image_url', sa.String(500), nullable=True),
        sa.Column('stock_quantity', sa.Integer, nullable=False, server_default='0'),
        sa.Column('status', sa.String(50), nullable=False, server_default='available'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Index('ix_rewards_category', 'category'),
        sa.Index('ix_rewards_status', 'status'),
        sa.Index('ix_rewards_points_required', 'points_required')
    )

    # Reward redemptions table
    op.create_table(
        'reward_redemptions',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('reward_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('points_used', sa.Integer, nullable=False),
        sa.Column('status', sa.String(50), nullable=False, server_default='pending'),
        sa.Column('notes', sa.String(1000), nullable=True),
        sa.Column('processed_by', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('processed_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('fulfilled_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.ForeignKeyConstraint(['reward_id'], ['rewards.id'], ),
        sa.ForeignKeyConstraint(['processed_by'], ['users.id'], ),
        sa.Index('ix_reward_redemptions_user_id', 'user_id'),
        sa.Index('ix_reward_redemptions_reward_id', 'reward_id'),
        sa.Index('ix_reward_redemptions_status', 'status'),
        sa.Index('ix_reward_redemptions_created_at', 'created_at')
    )

    # User points table
    op.create_table(
        'user_points',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('total_points', sa.Integer, nullable=False, server_default='0'),
        sa.Column('total_xp', sa.Integer, nullable=False, server_default='0'),
        sa.Column('available_points', sa.Integer, nullable=False, server_default='0'),
        sa.Column('redeemed_points', sa.Integer, nullable=False, server_default='0'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.Index('ix_user_points_user_id', 'user_id', unique=True),
        sa.Index('ix_user_points_total_points', 'total_points'),
        sa.Index('ix_user_points_available_points', 'available_points')
    )

    # Points transactions table
    op.create_table(
        'points_transactions',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('points', sa.Integer, nullable=False),
        sa.Column('xp', sa.Integer, nullable=False, server_default='0'),
        sa.Column('transaction_type', sa.String(50), nullable=False),
        sa.Column('source', sa.String(100), nullable=True),
        sa.Column('source_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('description', sa.String(500), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.Index('ix_points_transactions_user_id', 'user_id'),
        sa.Index('ix_points_transactions_transaction_type', 'transaction_type'),
        sa.Index('ix_points_transactions_created_at', 'created_at')
    )

    # ==========================================
    # NOTIFICATION SYSTEM TABLES
    # ==========================================

    # Notifications table
    op.create_table(
        'notifications',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('type', sa.String(50), nullable=False),
        sa.Column('priority', sa.String(20), nullable=False, server_default='medium'),
        sa.Column('status', sa.String(20), nullable=False, server_default='pending'),
        sa.Column('title', sa.String(255), nullable=False),
        sa.Column('message', sa.Text(), nullable=False),
        sa.Column('action_url', sa.String(500), nullable=True),
        sa.Column('is_read', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('read_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('sent_via_email', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('sent_via_app', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('email_sent_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('app_sent_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('error_message', sa.Text(), nullable=True),
        sa.Column('retry_count', sa.Integer, nullable=False, server_default='0'),
        sa.Column('extra_data', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.Index('ix_notifications_user_id', 'user_id'),
        sa.Index('ix_notifications_type', 'type'),
        sa.Index('ix_notifications_status', 'status'),
        sa.Index('ix_notifications_is_read', 'is_read'),
        sa.Index('ix_notifications_created_at', 'created_at'),
        sa.Index('ix_notifications_user_status', 'user_id', 'status')
    )

    # Notification preferences table
    op.create_table(
        'notification_preferences',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('enable_email_notifications', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('enable_app_notifications', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('enable_compliance_alerts', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('enable_csr_alerts', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('enable_challenge_alerts', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('enable_badge_alerts', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('enable_policy_reminders', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('enable_reward_alerts', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('email_digest_frequency', sa.String(20), nullable=False, server_default='immediate'),
        sa.Column('quiet_hours_start', sa.String(5), nullable=True),
        sa.Column('quiet_hours_end', sa.String(5), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.Index('ix_notification_preferences_user_id', 'user_id', unique=True)
    )

    # ==========================================
    # CARBON EMISSION TABLES
    # ==========================================

    # Carbon transactions table
    op.create_table(
        'carbon_transactions',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('transaction_type', sa.String(50), nullable=False),
        sa.Column('status', sa.String(50), nullable=False, server_default='pending'),
        sa.Column('source_type', sa.String(50), nullable=True),
        sa.Column('source_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('emission_factor_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('quantity', sa.Numeric(10, 2), nullable=False, server_default='0'),
        sa.Column('unit', sa.String(20), nullable=False),
        sa.Column('total_emissions', sa.Numeric(10, 2), nullable=False, server_default='0'),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('calculation_date', sa.DateTime(timezone=True), nullable=True),
        sa.Column('calculated_by', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('verified_by', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('verified_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('error_message', sa.Text(), nullable=True),
        sa.Column('auto_calculated', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('auto_calculation_attempted', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('auto_calculation_error', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.ForeignKeyConstraint(['calculated_by'], ['users.id'], ),
        sa.ForeignKeyConstraint(['verified_by'], ['users.id'], ),
        sa.ForeignKeyConstraint(['emission_factor_id'], ['emission_factors.id'], ),
        sa.Index('ix_carbon_transactions_user_id', 'user_id'),
        sa.Index('ix_carbon_transactions_transaction_type', 'transaction_type'),
        sa.Index('ix_carbon_transactions_status', 'status'),
        sa.Index('ix_carbon_transactions_source_type_id', 'source_type', 'source_id'),
        sa.Index('ix_carbon_transactions_emission_factor_id', 'emission_factor_id'),
        sa.Index('ix_carbon_transactions_created_at', 'created_at')
    )

    # Purchases table
    op.create_table(
        'purchases',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('department_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('purchase_order_number', sa.String(100), nullable=True),
        sa.Column('vendor_name', sa.String(255), nullable=False),
        sa.Column('vendor_id', sa.String(100), nullable=True),
        sa.Column('purchase_date', sa.DateTime(timezone=True), nullable=False),
        sa.Column('total_amount', sa.Numeric(12, 2), nullable=False, server_default='0'),
        sa.Column('currency', sa.String(3), nullable=False, server_default='USD'),
        sa.Column('material_weight_kg', sa.Numeric(10, 2), nullable=True),
        sa.Column('material_type', sa.String(100), nullable=True),
        sa.Column('shipping_distance_km', sa.Numeric(10, 2), nullable=True),
        sa.Column('shipping_method', sa.String(50), nullable=True),
        sa.Column('carbon_transaction_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('carbon_emissions_calculated', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('status', sa.String(20), nullable=False, server_default='pending'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.ForeignKeyConstraint(['department_id'], ['departments.id'], ),
        sa.ForeignKeyConstraint(['carbon_transaction_id'], ['carbon_transactions.id'], ),
        sa.Index('ix_purchases_user_id', 'user_id'),
        sa.Index('ix_purchases_department_id', 'department_id'),
        sa.Index('ix_purchases_purchase_date', 'purchase_date'),
        sa.Index('ix_purchases_status', 'status'),
        sa.Index('ix_purchases_carbon_transaction_id', 'carbon_transaction_id')
    )

    # Manufacturing table
    op.create_table(
        'manufacturing',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('facility_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('batch_number', sa.String(100), nullable=True),
        sa.Column('product_type', sa.String(255), nullable=False),
        sa.Column('production_date', sa.DateTime(timezone=True), nullable=False),
        sa.Column('quantity_produced', sa.Numeric(10, 2), nullable=False, server_default='0'),
        sa.Column('unit', sa.String(20), nullable=False),
        sa.Column('electricity_kwh', sa.Numeric(10, 2), nullable=True),
        sa.Column('natural_gas_kwh', sa.Numeric(10, 2), nullable=True),
        sa.Column('water_liters', sa.Numeric(10, 2), nullable=True),
        sa.Column('carbon_transaction_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('carbon_emissions_calculated', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('status', sa.String(20), nullable=False, server_default='in_progress'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.ForeignKeyConstraint(['carbon_transaction_id'], ['carbon_transactions.id'], ),
        sa.Index('ix_manufacturing_user_id', 'user_id'),
        sa.Index('ix_manufacturing_facility_id', 'facility_id'),
        sa.Index('ix_manufacturing_production_date', 'production_date'),
        sa.Index('ix_manufacturing_status', 'status'),
        sa.Index('ix_manufacturing_carbon_transaction_id', 'carbon_transaction_id')
    )

    # Expenses table
    op.create_table(
        'expenses',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('department_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('expense_report_number', sa.String(100), nullable=True),
        sa.Column('expense_type', sa.String(50), nullable=False),
        sa.Column('expense_date', sa.DateTime(timezone=True), nullable=False),
        sa.Column('amount', sa.Numeric(12, 2), nullable=False, server_default='0'),
        sa.Column('currency', sa.String(3), nullable=False, server_default='USD'),
        sa.Column('travel_distance_km', sa.Numeric(10, 2), nullable=True),
        sa.Column('travel_method', sa.String(50), nullable=True),
        sa.Column('accommodation_nights', sa.Integer, nullable=True),
        sa.Column('carbon_transaction_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('carbon_emissions_calculated', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('status', sa.String(20), nullable=False, server_default='pending'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.ForeignKeyConstraint(['department_id'], ['departments.id'], ),
        sa.ForeignKeyConstraint(['carbon_transaction_id'], ['carbon_transactions.id'], ),
        sa.Index('ix_expenses_user_id', 'user_id'),
        sa.Index('ix_expenses_department_id', 'department_id'),
        sa.Index('ix_expenses_expense_type', 'expense_type'),
        sa.Index('ix_expenses_expense_date', 'expense_date'),
        sa.Index('ix_expenses_status', 'status'),
        sa.Index('ix_expenses_carbon_transaction_id', 'carbon_transaction_id')
    )

    # Fleet table
    op.create_table(
        'fleet',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('vehicle_id', sa.String(100), nullable=True),
        sa.Column('vehicle_type', sa.String(50), nullable=False),
        sa.Column('make', sa.String(100), nullable=True),
        sa.Column('model', sa.String(100), nullable=True),
        sa.Column('year', sa.Integer, nullable=True),
        sa.Column('fuel_type', sa.String(50), nullable=True),
        sa.Column('record_date', sa.DateTime(timezone=True), nullable=False),
        sa.Column('distance_km', sa.Numeric(10, 2), nullable=False, server_default='0'),
        sa.Column('fuel_consumed_liters', sa.Numeric(10, 2), nullable=True),
        sa.Column('electricity_kwh', sa.Numeric(10, 2), nullable=True),
        sa.Column('carbon_transaction_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('carbon_emissions_calculated', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('status', sa.String(20), nullable=False, server_default='active'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.ForeignKeyConstraint(['carbon_transaction_id'], ['carbon_transactions.id'], ),
        sa.Index('ix_fleet_user_id', 'user_id'),
        sa.Index('ix_fleet_vehicle_id', 'vehicle_id'),
        sa.Index('ix_fleet_record_date', 'record_date'),
        sa.Index('ix_fleet_vehicle_type', 'vehicle_type'),
        sa.Index('ix_fleet_status', 'status'),
        sa.Index('ix_fleet_carbon_transaction_id', 'carbon_transaction_id')
    )

    # ==========================================
    # CSR ACTIVITY TABLES
    # ==========================================

    # CSR activities table
    op.create_table(
        'csr_activities',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('department_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('challenge_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('title', sa.String(255), nullable=False),
        sa.Column('description', sa.Text(), nullable=False),
        sa.Column('activity_type', sa.String(50), nullable=False),
        sa.Column('activity_date', sa.DateTime(timezone=True), nullable=False),
        sa.Column('hours_spent', sa.Integer, nullable=True),
        sa.Column('beneficiaries_count', sa.Integer, nullable=True),
        sa.Column('amount_donated', sa.Integer, nullable=True),
        sa.Column('carbon_impact_kg', sa.Integer, nullable=True),
        sa.Column('points_earned', sa.Integer, nullable=False, server_default='0'),
        sa.Column('xp_earned', sa.Integer, nullable=False, server_default='0'),
        sa.Column('status', sa.String(50), nullable=False, server_default='draft'),
        sa.Column('submitted_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('reviewed_by', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('reviewed_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('approval_notes', sa.Text(), nullable=True),
        sa.Column('evidence_required', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('evidence_provided', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('evidence_file_count', sa.Integer, nullable=False, server_default='0'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.ForeignKeyConstraint(['department_id'], ['departments.id'], ),
        sa.ForeignKeyConstraint(['reviewed_by'], ['users.id'], ),
        sa.Index('ix_csr_activities_user_id', 'user_id'),
        sa.Index('ix_csr_activities_department_id', 'department_id'),
        sa.Index('ix_csr_activities_challenge_id', 'challenge_id'),
        sa.Index('ix_csr_activities_activity_type', 'activity_type'),
        sa.Index('ix_csr_activities_status', 'status'),
        sa.Index('ix_csr_activities_activity_date', 'activity_date'),
        sa.Index('ix_csr_activities_evidence_provided', 'evidence_provided')
    )

    # Evidence documents table
    op.create_table(
        'evidence_documents',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('csr_activity_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('file_name', sa.String(255), nullable=False),
        sa.Column('file_path', sa.String(500), nullable=False),
        sa.Column('file_size', sa.Integer, nullable=False),
        sa.Column('file_type', sa.String(100), nullable=False),
        sa.Column('file_extension', sa.String(10), nullable=False),
        sa.Column('is_verified', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('verified_by', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('verified_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('verification_notes', sa.Text(), nullable=True),
        sa.Column('uploaded_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('upload_ip', sa.String(45), nullable=True),
        sa.Column('upload_source', sa.String(100), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['csr_activity_id'], ['csr_activities.id'], ),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.ForeignKeyConstraint(['verified_by'], ['users.id'], ),
        sa.Index('ix_evidence_documents_csr_activity_id', 'csr_activity_id'),
        sa.Index('ix_evidence_documents_user_id', 'user_id'),
        sa.Index('ix_evidence_documents_is_verified', 'is_verified'),
        sa.Index('ix_evidence_documents_uploaded_at', 'uploaded_at')
    )

    # ==========================================
    # BADGE SYSTEM TABLES
    # ==========================================

    # Badges table
    op.create_table(
        'badges',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('name', sa.String(100), nullable=False, unique=True),
        sa.Column('description', sa.Text(), nullable=False),
        sa.Column('icon', sa.String(255), nullable=True),
        sa.Column('category', sa.String(50), nullable=False),
        sa.Column('unlock_metric', sa.String(50), nullable=False),
        sa.Column('unlock_threshold', sa.Integer, nullable=False, server_default='0'),
        sa.Column('unlock_rule', postgresql.JSON(), nullable=True),
        sa.Column('auto_award', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('points_reward', sa.Integer, nullable=False, server_default='0'),
        sa.Column('xp_reward', sa.Integer, nullable=False, server_default='0'),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('is_limited', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('max_awards', sa.Integer, nullable=True),
        sa.Column('total_awarded', sa.Integer, nullable=False, server_default='0'),
        sa.Column('display_order', sa.Integer, nullable=False, server_default='0'),
        sa.Column('rarity', sa.String(20), nullable=False, server_default='common'),
        sa.Column('requirements', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Index('ix_badges_category', 'category'),
        sa.Index('ix_badges_unlock_metric', 'unlock_metric'),
        sa.Index('ix_badges_is_active', 'is_active'),
        sa.Index('ix_badges_display_order', 'display_order'),
        sa.Index('ix_badges_rarity', 'rarity')
    )

    # Badge unlock rules table
    op.create_table(
        'badge_unlock_rules',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('badge_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('rule_name', sa.String(100), nullable=False),
        sa.Column('metric_type', sa.String(50), nullable=False),
        sa.Column('threshold_value', sa.Integer, nullable=False, server_default='0'),
        sa.Column('operator', sa.String(10), nullable=False, server_default='>='),
        sa.Column('conditions', postgresql.JSON(), nullable=True),
        sa.Column('time_period_days', sa.Integer, nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('priority', sa.Integer, nullable=False, server_default='0'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['badge_id'], ['badges.id'], ),
        sa.Index('ix_badge_unlock_rules_badge_id', 'badge_id'),
        sa.Index('ix_badge_unlock_rules_is_active', 'is_active'),
        sa.Index('ix_badge_unlock_rules_priority', 'priority')
    )

    # User badges table
    op.create_table(
        'user_badges',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('badge_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('awarded_by', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('auto_awarded', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('is_displayed', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('current_value', sa.Integer, nullable=False, server_default='0'),
        sa.Column('target_value', sa.Integer, nullable=False, server_default='0'),
        sa.Column('progress_percentage', sa.Integer, nullable=False, server_default='0'),
        sa.Column('awarded_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('earned_date', sa.DateTime(timezone=True), nullable=True),
        sa.Column('award_metadata', postgresql.JSON(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.ForeignKeyConstraint(['badge_id'], ['badges.id'], ),
        sa.ForeignKeyConstraint(['awarded_by'], ['users.id'], ),
        sa.Index('ix_user_badges_user_id', 'user_id'),
        sa.Index('ix_user_badges_badge_id', 'badge_id'),
        sa.Index('ix_user_badges_awarded_at', 'awarded_at'),
        sa.Index('ix_user_badges_auto_awarded', 'auto_awarded'),
        sa.Index('ix_user_badges_user_badge', 'user_id', 'badge_id', unique=True)
    )

    # Badge progress table
    op.create_table(
        'badge_progress',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('badge_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('metric_type', sa.String(50), nullable=False),
        sa.Column('current_value', sa.Integer, nullable=False, server_default='0'),
        sa.Column('target_value', sa.Integer, nullable=False, server_default='0'),
        sa.Column('progress_percentage', sa.Integer, nullable=False, server_default='0'),
        sa.Column('is_unlocked', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('unlocked_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('last_updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('streak_count', sa.Integer, nullable=False, server_default='0'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.ForeignKeyConstraint(['badge_id'], ['badges.id'], ),
        sa.Index('ix_badge_progress_user_id', 'user_id'),
        sa.Index('ix_badge_progress_badge_id', 'badge_id'),
        sa.Index('ix_badge_progress_is_unlocked', 'is_unlocked'),
        sa.Index('ix_badge_progress_user_badge', 'user_id', 'badge_id', unique=True)
    )

    # ==========================================
    # COMPLIANCE ISSUE TABLES
    # ==========================================

    # Compliance issues table
    op.create_table(
        'compliance_issues',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('title', sa.String(255), nullable=False),
        sa.Column('description', sa.Text(), nullable=False),
        sa.Column('category', sa.String(50), nullable=False),
        sa.Column('severity', sa.String(50), nullable=False, server_default='medium'),
        sa.Column('status', sa.String(50), nullable=False, server_default='open'),
        sa.Column('owner_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('department_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('assigned_by', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('due_date', sa.DateTime(timezone=True), nullable=False),
        sa.Column('raised_date', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('resolved_date', sa.DateTime(timezone=True), nullable=True),
        sa.Column('closed_date', sa.DateTime(timezone=True), nullable=True),
        sa.Column('resolution_notes', sa.Text(), nullable=True),
        sa.Column('resolution_method', sa.String(100), nullable=True),
        sa.Column('risk_level', sa.String(20), nullable=True),
        sa.Column('impact_description', sa.Text(), nullable=True),
        sa.Column('affected_stakeholders', sa.Text(), nullable=True),
        sa.Column('source', sa.String(50), nullable=True),
        sa.Column('source_reference', sa.String(255), nullable=True),
        sa.Column('related_policy_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('verified_by', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('verified_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('is_overdue', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('overdue_days', sa.Integer, nullable=False, server_default='0'),
        sa.Column('last_overdue_check', sa.DateTime(timezone=True), nullable=True),
        sa.Column('overdue_notification_sent', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('upcoming_due_date_sent', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('priority', sa.Integer, nullable=False, server_default='3'),
        sa.Column('escalation_level', sa.Integer, nullable=False, server_default='0'),
        sa.Column('escalated_to', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('escalated_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_by', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('updated_by', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['owner_id'], ['users.id'], ),
        sa.ForeignKeyConstraint(['department_id'], ['departments.id'], ),
        sa.ForeignKeyConstraint(['assigned_by'], ['users.id'], ),
        sa.ForeignKeyConstraint(['verified_by'], ['users.id'], ),
        sa.ForeignKeyConstraint(['escalated_to'], ['users.id'], ),
        sa.ForeignKeyConstraint(['created_by'], ['users.id'], ),
        sa.ForeignKeyConstraint(['updated_by'], ['users.id'], ),
        sa.Index('ix_compliance_issues_owner_id', 'owner_id'),
        sa.Index('ix_compliance_issues_department_id', 'department_id'),
        sa.Index('ix_compliance_issues_category', 'category'),
        sa.Index('ix_compliance_issues_severity', 'severity'),
        sa.Index('ix_compliance_issues_status', 'status'),
        sa.Index('ix_compliance_issues_due_date', 'due_date'),
        sa.Index('ix_compliance_issues_is_overdue', 'is_overdue'),
        sa.Index('ix_compliance_issues_priority', 'priority'),
        sa.Index('ix_compliance_issues_created_by', 'created_by'),
        sa.Index('ix_compliance_issues_raised_date', 'raised_date')
    )

    # Compliance issue comments table
    op.create_table(
        'compliance_issue_comments',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('compliance_issue_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('comment', sa.Text(), nullable=False),
        sa.Column('comment_type', sa.String(20), nullable=False, server_default='update'),
        sa.Column('is_internal', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('previous_status', sa.String(20), nullable=True),
        sa.Column('new_status', sa.String(20), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['compliance_issue_id'], ['compliance_issues.id'], ),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.Index('ix_compliance_issue_comments_compliance_issue_id', 'compliance_issue_id'),
        sa.Index('ix_compliance_issue_comments_user_id', 'user_id'),
        sa.Index('ix_compliance_issue_comments_is_internal', 'is_internal'),
        sa.Index('ix_compliance_issue_comments_created_at', 'created_at')
    )

    # Compliance issue attachments table
    op.create_table(
        'compliance_issue_attachments',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('compliance_issue_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('file_name', sa.String(255), nullable=False),
        sa.Column('file_path', sa.String(500), nullable=False),
        sa.Column('file_size', sa.Integer, nullable=False),
        sa.Column('file_type', sa.String(100), nullable=False),
        sa.Column('file_extension', sa.String(10), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('attachment_type', sa.String(50), nullable=False, server_default='evidence'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['compliance_issue_id'], ['compliance_issues.id'], ),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.Index('ix_compliance_issue_attachments_compliance_issue_id', 'compliance_issue_id'),
        sa.Index('ix_compliance_issue_attachments_user_id', 'user_id'),
        sa.Index('ix_compliance_issue_attachments_attachment_type', 'attachment_type')
    )


def downgrade() -> None:
    # Drop tables in reverse order of creation

    # Compliance tables
    op.drop_table('compliance_issue_attachments')
    op.drop_table('compliance_issue_comments')
    op.drop_table('compliance_issues')

    # Badge tables
    op.drop_table('badge_progress')
    op.drop_table('user_badges')
    op.drop_table('badge_unlock_rules')
    op.drop_table('badges')

    # CSR tables
    op.drop_table('evidence_documents')
    op.drop_table('csr_activities')

    # Carbon tables
    op.drop_table('fleet')
    op.drop_table('expenses')
    op.drop_table('manufacturing')
    op.drop_table('purchases')
    op.drop_table('carbon_transactions')

    # Notification tables
    op.drop_table('notification_preferences')
    op.drop_table('notifications')

    # Reward tables
    op.drop_table('points_transactions')
    op.drop_table('user_points')
    op.drop_table('reward_redemptions')
    op.drop_table('rewards')