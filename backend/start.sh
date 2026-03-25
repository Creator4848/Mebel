#!/bin/bash
# start.sh - Run setup and start server

echo "Running initial database setup..."
python seed.py

echo "Starting FastAPI server..."
uvicorn app.main:app --host 0.0.0.0 --port $PORT
