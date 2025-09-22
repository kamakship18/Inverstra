#!/bin/bash

# Start the backend server
cd backend && npm run dev &
BACKEND_PID=$!

# Start the frontend server
cd frontend && npm run dev &
FRONTEND_PID=$!

# Function to handle termination
cleanup() {
  echo "Stopping servers..."
  kill $BACKEND_PID
  kill $FRONTEND_PID
  exit
}

# Set up trap to catch Ctrl+C
trap cleanup INT TERM

# Keep script running
wait
