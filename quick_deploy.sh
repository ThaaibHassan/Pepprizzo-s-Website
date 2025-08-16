#!/bin/bash

echo "🍕 Quick Deploy Script for Peprizzo's Website"
echo "=============================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the root directory"
    exit 1
fi

echo "✅ Current Status:"
echo "   - Frontend: Ready and built"
echo "   - Backend: Ready for deployment"
echo "   - All files: Committed to GitHub"
echo ""

echo "🚀 NEXT STEPS:"
echo ""
echo "1. DEPLOY BACKEND:"
echo "   - Go to https://render.com"
echo "   - Create new Web Service"
echo "   - Connect your GitHub repo"
echo "   - Use these settings:"
echo "     • Build: cd server && npm install"
echo "     • Start: cd server && npm start"
echo "     • Plan: Free"
echo ""
echo "2. UPDATE API URL:"
echo "   - Edit client/src/lib/api.ts"
echo "   - Replace backend URL with your Render URL"
echo ""
echo "3. DEPLOY FRONTEND:"
echo "   - Commit and push API URL change"
echo "   - Frontend auto-deploys to Netlify"
echo ""

echo "📋 Environment Variables for Backend:"
echo "   NODE_ENV=production"
echo "   PORT=10000"
echo "   JWT_SECRET=your-super-secret-jwt-key"
echo "   CLIENT_URL=https://peprizzos-pizza.netlify.app"
echo "   SESSION_SECRET=your-super-secret-session-key"
echo ""

echo "🔗 Your URLs:"
echo "   - Frontend: https://peprizzos-pizza.netlify.app"
echo "   - Backend: https://your-backend-name.onrender.com"
echo ""

echo "🎯 Demo Users:"
echo "   - Customer: john@example.com / password"
echo "   - Admin: admin@peprizzos.com / password"
echo ""

echo "📖 Full guide: DEPLOY_NOW.md"
echo ""
echo "🎉 Ready to deploy! Start with step 1 above."
