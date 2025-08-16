# Backend Deployment Guide

## Environment Variables

Create a `.env` file in the server directory with the following variables:

```bash
# Server Configuration
NODE_ENV=production
PORT=5001

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Client URL (for CORS)
CLIENT_URL=https://peprizzos-pizza.netlify.app

# Session Configuration
SESSION_SECRET=your-super-secret-session-key-change-this-in-production
```

## Deployment Options

### Option 1: Render.com (Recommended - Free Tier)

1. Go to [render.com](https://render.com) and create an account
2. Click "New +" and select "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: peprizzos-backend
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

5. Add environment variables in the Render dashboard
6. Deploy!

### Option 2: Railway.app

1. Go to [railway.app](https://railway.app) and create an account
2. Click "New Project" and select "Deploy from GitHub repo"
3. Select your repository
4. Railway will automatically detect it's a Node.js app
5. Add environment variables in the Railway dashboard
6. Deploy!

### Option 3: Heroku

1. Install Heroku CLI
2. Run `heroku create peprizzos-backend`
3. Add environment variables: `heroku config:set NODE_ENV=production`
4. Deploy: `git push heroku main`

## Update Frontend API URL

After deploying the backend, update the frontend API configuration in `client/src/lib/api.ts`:

```typescript
baseURL: process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-url.com/api'  // Update this URL
  : 'http://localhost:5001/api',
```

## Demo Users

The system comes with these demo users:

- **Customer**: john@example.com / password
- **Admin**: admin@peprizzos.com / password

## Features

- ✅ Menu management
- ✅ User authentication
- ✅ Order management
- ✅ Admin dashboard
- ✅ Loyalty points system
- ✅ Payment processing (simplified)
- ✅ Real-time updates via Socket.IO

## Notes

- This is a production-ready backend using in-memory storage
- Data will be reset when the server restarts
- For production use, consider adding a real database (PostgreSQL, MongoDB)
- Add Redis for session storage and caching
- Implement proper logging and monitoring
