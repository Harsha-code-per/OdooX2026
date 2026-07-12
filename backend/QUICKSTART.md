# Quick Start Guide

Get your Odoo X Backend running in 5 minutes!

## Prerequisites

- Python 3.12+
- PostgreSQL 12+
- pip and venv

## 1. Clone and Navigate

```bash
cd backend
```

## 2. Setup Environment

```bash
# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate  # On Linux/Mac
# or
venv\Scripts\activate  # On Windows

# Install dependencies
pip install -r requirements.txt
```

## 3. Configure Database

```bash
# Create PostgreSQL database
createdb odoo_db

# Copy environment file
cp .env.example .env

# Edit .env with your database credentials
# At minimum, update:
# DATABASE_URL=postgresql+asyncpg://your_user:your_password@localhost/5432/odoo_db
# SECRET_KEY=your-secure-secret-key-here
```

## 4. Setup Database

```bash
# Run migrations
alembic upgrade head

# Test the setup
python test_setup.py
```

## 5. Start Server

```bash
# Option 1: Using the startup script
./start.sh

# Option 2: Direct uvicorn
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## 6. Test the API

Visit `http://localhost:8000/docs` for interactive API documentation.

### Test Login

```bash
curl -X POST "http://localhost:8000/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@odoo.com",
    "password": "Admin123!"
  }'
```

### Test Registration

```bash
curl -X POST "http://localhost:8000/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "SecurePass123!",
    "full_name": "New User"
  }'
```

## Default Users

After migration, you can login with:
- **Admin**: admin@odoo.com / Admin123!
- **Employee**: john.doe@odoo.com / Test123!
- **Asset Manager**: jane.smith@odoo.com / Test123!
- **Department Head**: bob.johnson@odoo.com / Test123!

## Troubleshooting

### Database Connection Error

```bash
# Check PostgreSQL is running
pg_isready

# Test database connection
psql -h localhost -U your_user -d odoo_db

# If database doesn't exist
createdb odoo_db
```

### Migration Issues

```bash
# Reset and retry
alembic downgrade base
alembic upgrade head
```

### Permission Issues

```bash
# Make scripts executable
chmod +x start.sh
```

## Next Steps

1. Configure email settings for verification emails
2. Update CORS settings for frontend integration
3. Set up production deployment
4. Review security settings

## Need Help?

- Check the main [README.md](README.md) for detailed documentation
- API documentation: `http://localhost:8000/docs`
- Health check: `http://localhost:8000/health`