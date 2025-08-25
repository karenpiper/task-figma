#!/bin/bash

echo "🚀 Setting up Premium Kanban Productivity Tool"
echo "=============================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v16 or higher first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version 16 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not available. Please install npm."
    exit 1
fi

echo "✅ npm detected"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Create server directory if it doesn't exist
if [ ! -d "server" ]; then
    echo "📁 Creating server directory..."
    mkdir -p server
fi

echo ""
echo "🎉 Setup complete! You can now run the application:"
echo ""
echo "   npm run dev"
echo ""
echo "This will start:"
echo "   - Backend server on http://localhost:3001"
echo "   - Frontend on http://localhost:5173"
echo ""
echo "The SQLite database will be automatically created when you first run the app."
echo ""
echo "Happy task managing! 🎯" 