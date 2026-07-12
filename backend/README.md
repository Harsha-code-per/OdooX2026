# Odoo X Backend API

A comprehensive FastAPI backend with JWT authentication, email verification, password reset, and role-based access control.

## Roles and Password
  - admin@odoo.com / Admin123! (Admin)
  - john.doe@odoo.com / Test123! (Employee)
  - jane.smith@odoo.com / Test123! (Asset Manager)
  - bob.johnson@odoo.com / Test123! (Department Head)

## Features

- **JWT Authentication**: Secure token-based authentication with access and refresh tokens
- **Google OAuth**: Additional authentication method via Google OAuth 2.0
- **Token Rotation**: Automatic refresh token rotation for enhanced security
- **Email Verification**: User email verification workflow
- **Password Reset**: Secure password reset with time-limited tokens
- **Role-Based Access Control**: Multiple user roles (admin, asset_manager, department_head, employee)
- **Manager Relationships**: Employee-manager reporting structure
- **Account Security**: Failed login attempt tracking and account lockout
- **Async Database**: High-performance async PostgreSQL with SQLAlchemy
- **Database Migrations**: Alembic-based database version control

## Tech Stack

- **Framework**: FastAPI
- **Database**: PostgreSQL with asyncpg
- **ORM**: SQLAlchemy 2.0 (async)
- **Authentication**: JWT (PyJWT) + bcrypt
- **Migrations**: Alembic
- **Email**: SMTP support for verification emails

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Database Setup

Create a PostgreSQL database:

```bash
createdb odoo_db
```

### 3. Environment Configuration

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Edit `.env` with your settings:

```env
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/odoo_db
SECRET_KEY=your-secure-secret-key
# ... other settings
```

### 4. Run Database Migrations

```bash
alembic upgrade head
```

This will create all tables and seed initial data including:
- Default roles (admin, asset_manager, department_head, employee)
- Sample departments (Engineering, Operations, Finance)
- Admin user (admin@odoo.com / Admin123!)
- Sample test users

### 5. Start the Server

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

## API Documentation

Once running, visit:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

## Authentication Methods

### Email/Password Authentication
Traditional username and password authentication with email verification.

### Google OAuth Authentication
Secure authentication via Google OAuth 2.0:
- Automatic user creation on first Google login
- No email verification required for Google users
- Link/unlink Google accounts to existing email accounts
- Google users created as employees (role assignment by admin)

📖 **See [GOOGLE_OAUTH_SETUP.md](GOOGLE_OAUTH_SETUP.md) for complete Google OAuth setup guide**

### Manager Relationships
Users can be assigned managers for organizational hierarchy:
- Managers can view their subordinate employees
- Admin users can assign and modify manager relationships
- Supports multi-level management structure

## Authentication Endpoints

### Google OAuth Setup

#### 1. Get Google OAuth URL

```bash
GET /api/v1/auth/google/login
```

Response:
```json
{
  "authorization_url": "https://accounts.google.com/o/oauth2/v2/auth?...",
  "state": "random-state-string"
}
```

#### 2. Handle Google Callback

```bash
POST /api/v1/auth/google/callback
Content-Type: application/json

{
  "code": "authorization-code-from-google",
  "state": "random-state-string"
}
```

Response:
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "token_type": "bearer",
  "expires_in": 10800,
  "user": {
    "id": "user-uuid",
    "full_name": "John Doe",
    "role_id": 4,
    "must_change_password": false,
    "provider": "google",
    "profile_picture": "https://..."
  },
  "is_new_user": true
}
```

#### 3. Link Google Account (Authenticated)

```bash
POST /api/v1/auth/google/link
Authorization: Bearer your-access-token
Content-Type: application/json

{
  "code": "authorization-code-from-google"
}
```

#### 4. Unlink Google Account (Authenticated)

```bash
POST /api/v1/auth/google/unlink
Authorization: Bearer your-access-token
```

### Registration

```bash
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "full_name": "John Doe",
  "department_id": null
}
```

### Email Verification

```bash
POST /api/v1/auth/verify-email
Content-Type: application/json

{
  "token": "verification-token-from-email"
}
```

### Login

```bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

Response:
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "token_type": "bearer",
  "expires_in": 10800,
  "user": {
    "id": "user-uuid",
    "email": "user@example.com",
    "full_name": "John Doe",
    "role_id": 4,
    "must_change_password": false
  }
}
```

### Refresh Token

```bash
POST /api/v1/auth/refresh
Content-Type: application/json

{
  "refresh_token": "your-refresh-token"
}
```

### Logout

```bash
POST /api/v1/auth/logout
Content-Type: application/json

{
  "refresh_token": "your-refresh-token"
}
```

### Password Reset

Request password reset:
```bash
POST /api/v1/auth/reset-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

Confirm password reset:
```bash
POST /api/v1/auth/reset-password/confirm
Content-Type: application/json

{
  "token": "reset-token-from-email",
  "new_password": "NewSecurePass123!"
}
```

### Change Password (Authenticated)

```bash
POST /api/v1/auth/change-password
Authorization: Bearer your-access-token
Content-Type: application/json

{
  "old_password": "OldPassword123!",
  "new_password": "NewPassword123!"
}
```

## Default Users

After running migrations, you can login with:

### Admin User
- **Email**: admin@odoo.com
- **Password**: Admin123!
- **Role**: Admin
- **Note**: First login requires password change

### Test Users
- john.doe@odoo.com / Test123! (Employee)
- jane.smith@odoo.com / Test123! (Asset Manager)
- bob.johnson@odoo.com / Test123! (Department Head)

## Database Schema

### Tables

- **roles**: User roles with permissions
- **departments**: Organizational structure
- **users**: User accounts with authentication
- **refresh_tokens**: JWT refresh token management
- **password_reset_tokens**: Password reset workflow
- **email_verification_tokens**: Email verification workflow

### Security Features

- **Password Hashing**: bcrypt with 12 rounds
- **Token Storage**: SHA-256 hashed tokens only
- **Account Lockout**: 5 failed attempts = 30 minute lockout
- **Token Expiration**: 3 hours access, 30 days refresh
- **Token Rotation**: New refresh token on each use

## Development

### Run with Hot Reload

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Create New Migration

```bash
alembic revision --autogenerate -m "description of changes"
```

### Rollback Migration

```bash
alembic downgrade -1
```

### Reset Database

```bash
alembic downgrade base
alembic upgrade head
```

## Production Deployment

1. **Security**:
   - Set strong `SECRET_KEY` in environment
   - Use HTTPS only
   - Configure proper CORS settings
   - Set up rate limiting

2. **Database**:
   - Use managed PostgreSQL service
   - Configure connection pooling
   - Enable SSL connections

3. **Email**:
   - Configure SMTP settings
   - Use transactional email service for production
   - Set up email templates

4. **Monitoring**:
   - Enable logging
   - Set up health checks
   - Monitor failed login attempts

## Troubleshooting

### Database Connection Issues

```bash
# Check PostgreSQL is running
pg_isready

# Test connection
psql -h localhost -U user -d odoo_db
```

### Migration Issues

```bash
# Check current migration version
alembic current

# View migration history
alembic history

# Force reset (development only)
alembic downgrade base
alembic upgrade head
```

### Token Issues

If tokens expire immediately, check:
- `ACCESS_TOKEN_EXPIRE_MINUTES` in `.env`
- System time is correct
- `SECRET_KEY` is consistent

## License

MIT License - see LICENSE file for details