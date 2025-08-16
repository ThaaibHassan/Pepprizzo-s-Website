#!/bin/bash

# Peprizzo's Pizza Webapp Installation Script
echo "🍕 Welcome to Peprizzo's Pizza Webapp Installation!"
echo "=================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16 or higher first."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version 16 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL is not installed. Please install PostgreSQL first."
    echo "Visit: https://www.postgresql.org/download/"
    echo "You can continue with the installation, but you'll need to set up the database manually."
fi

# Check if Redis is installed
if ! command -v redis-server &> /dev/null; then
    echo "⚠️  Redis is not installed. Please install Redis first."
    echo "Visit: https://redis.io/download"
    echo "You can continue with the installation, but you'll need to set up Redis manually."
fi

echo ""
echo "📦 Installing dependencies..."

# Install root dependencies
echo "Installing root dependencies..."
npm install

# Install server dependencies
echo "Installing server dependencies..."
cd server
npm install
cd ..

# Install client dependencies
echo "Installing client dependencies..."
cd client
npm install
cd ..

echo ""
echo "🔧 Setting up environment files..."

# Copy environment files
if [ ! -f "server/.env" ]; then
    cp server/env.example server/.env
    echo "✅ Created server/.env (please configure your database and API keys)"
else
    echo "⚠️  server/.env already exists"
fi

if [ ! -f "client/.env" ]; then
    cp client/env.example client/.env
    echo "✅ Created client/.env (please configure your API keys)"
else
    echo "⚠️  client/.env already exists"
fi

echo ""
echo "📋 Next Steps:"
echo "=============="
echo ""
echo "1. Configure your environment variables:"
echo "   - Edit server/.env with your database credentials and API keys"
echo "   - Edit client/.env with your API URL and Stripe keys"
echo ""
echo "2. Set up your database:"
echo "   - Create a PostgreSQL database"
echo "   - Update DATABASE_URL in server/.env"
echo "   - Run: cd server && npm run migrate"
echo "   - Run: cd server && npm run seed"
echo ""
echo "3. Start the development servers:"
echo "   - Run: npm run dev"
echo "   - This will start both backend (port 5000) and frontend (port 3000)"
echo ""
echo "4. Access the application:"
echo "   - Frontend: http://localhost:3000"
echo "   - Backend API: http://localhost:5000"
echo "   - Health check: http://localhost:5000/health"
echo ""
echo "5. Default credentials:"
echo "   - Admin: admin@peprizzos.com / admin123"
echo "   - Customer: customer@example.com / customer123"
echo ""
echo "🎉 Installation complete! Happy coding!"
echo ""
echo "For more information, check the README.md file."
