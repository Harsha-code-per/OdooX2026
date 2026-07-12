#!/bin/bash

# Odoo X Backend Startup Script

echo "🚀 Starting Odoo X Backend..."

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install dependencies if requirements.txt has changed
echo "Checking dependencies..."
pip install -r requirements.txt

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚠️  Warning: .env file not found. Creating from .env.example..."
    cp .env.example .env
    echo "📝 Please edit .env with your configuration before starting the server."
    echo "   At minimum, update:"
    echo "   - DATABASE_URL"
    echo "   - SECRET_KEY"
    echo "   - Email settings (optional)"
    exit 1
fi

# Check if database migrations have been run (optional now)
echo "Checking database status..."
python3 test_setup.py 2>/dev/null || echo "⚠️  Database not available - starting in degraded mode"

echo "✅ Starting FastAPI server..."
echo "API will be available at: http://localhost:8000"
echo "API Documentation: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop the server"

# Start the server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000