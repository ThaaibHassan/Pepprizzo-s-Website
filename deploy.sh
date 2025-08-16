#!/bin/bash

echo "🍕 Deploying Peprizzo's Pizza Website..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the root directory"
    exit 1
fi

echo "📦 Building frontend..."
cd client
npm run build
cd ..

echo "✅ Frontend built successfully!"

echo ""
echo "🚀 Deployment Instructions:"
echo ""
echo "1. BACKEND DEPLOYMENT (Required first):"
echo "   - Go to https://render.com"
echo "   - Create new Web Service"
echo "   - Connect your GitHub repo"
echo "   - Set build command: npm install"
echo "   - Set start command: npm start"
echo "   - Add environment variables from server/DEPLOYMENT.md"
echo "   - Deploy and get your backend URL"
echo ""
echo "2. UPDATE FRONTEND API URL:"
echo "   - Edit client/src/lib/api.ts"
echo "   - Update the production baseURL with your backend URL"
echo "   - Commit and push changes"
echo ""
echo "3. FRONTEND DEPLOYMENT:"
echo "   - Your frontend will auto-deploy to Netlify"
echo "   - Or push to trigger deployment"
echo ""
echo "4. TEST THE WEBSITE:"
echo "   - Frontend: https://peprizzos-pizza.netlify.app"
echo "   - Backend: Your deployed backend URL"
echo ""
echo "Demo users:"
echo "  - Customer: john@example.com / password"
echo "  - Admin: admin@peprizzos.com / password"
echo ""
echo "🎉 Your exact local website is now online!"
