#!/bin/bash

echo "🔧 Setting up environment for Investra DAO..."

# Create .env file in backend directory
cat > backend/.env << EOF
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/investra-dao

# Server Configuration
PORT=5001
NODE_ENV=development

# API Keys (if needed)
# NEXT_PUBLIC_ALPHA_VANTAGE_KEY=your_alpha_vantage_key_here
EOF

echo "✅ Created backend/.env file"
echo ""
echo "📋 Environment setup complete!"
echo ""
echo "🚀 To start the servers:"
echo "1. Backend: cd backend && npm start"
echo "2. Frontend: cd frontend && npm run dev"
echo ""
echo "💡 MongoDB is optional - DAO functionality will work without it"
echo "💡 To install MongoDB locally: brew install mongodb-community"
