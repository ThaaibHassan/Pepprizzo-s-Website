# 🍕 Complete Deployment Guide - Peprizzo's Pizza Website

This guide will help you deploy your **exact local website** online, not a simplified version.

## 🎯 What We're Deploying

Your complete Peprizzo's Pizza website with:
- ✅ Full React frontend with all components
- ✅ Complete backend API with all routes
- ✅ User authentication system
- ✅ Menu management
- ✅ Order processing
- ✅ Admin dashboard
- ✅ Loyalty points system
- ✅ Real-time updates
- ✅ Payment processing (simplified)
- ✅ All your existing UI components and styling

## 🚀 Step-by-Step Deployment

### Step 1: Backend Deployment (Required First)

#### Option A: Render.com (Recommended - Free)
1. Go to [render.com](https://render.com) and create an account
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `peprizzos-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free
5. Add environment variables:
   ```
   NODE_ENV=production
   PORT=10000
   JWT_SECRET=your-super-secret-jwt-key-here
   CLIENT_URL=https://peprizzos-pizza.netlify.app
   SESSION_SECRET=your-super-secret-session-key-here
   ```
6. Click "Create Web Service"
7. Wait for deployment and copy your backend URL (e.g., `https://peprizzos-backend.onrender.com`)

#### Option B: Railway.app (Alternative - Free)
1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Add environment variables in the dashboard
5. Deploy and get your backend URL

### Step 2: Update Frontend API Configuration

1. Edit `client/src/lib/api.ts`
2. Update the production baseURL with your backend URL:
   ```typescript
   baseURL: process.env.NODE_ENV === 'production' 
     ? 'https://your-backend-url.com/api'  // ← Update this
     : 'http://localhost:5001/api',
   ```
3. Commit and push your changes

### Step 3: Frontend Deployment

Your frontend will automatically deploy to Netlify when you push to GitHub. If not:
1. Go to [netlify.com](https://netlify.com)
2. Connect your GitHub repository
3. Set build settings:
   - **Base directory**: `client`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`

## 🔧 Environment Variables

### Backend (.env file)
```bash
NODE_ENV=production
PORT=10000
JWT_SECRET=your-super-secret-jwt-key-change-this
CLIENT_URL=https://peprizzos-pizza.netlify.app
SESSION_SECRET=your-super-secret-session-key-change-this
```

### Frontend
The frontend automatically detects production vs development and connects to the appropriate backend.

## 🧪 Testing Your Deployment

### Demo Users
- **Customer**: `john@example.com` / `password`
- **Admin**: `admin@peprizzos.com` / `password`

### Test Features
1. **Frontend**: Visit your Netlify URL
2. **Backend**: Test `/health` endpoint
3. **Authentication**: Login with demo users
4. **Menu**: Browse and filter menu items
5. **Orders**: Create and track orders
6. **Admin**: Access admin dashboard

## 📱 What You'll Get Online

### Customer Features
- ✅ Browse menu with filters
- ✅ Add items to cart
- ✅ User registration/login
- ✅ Place orders
- ✅ Track order status
- ✅ View order history
- ✅ Loyalty points system
- ✅ User profile management

### Admin Features
- ✅ Dashboard with statistics
- ✅ Menu item management
- ✅ Order management
- ✅ Customer management
- ✅ Real-time order updates

### Technical Features
- ✅ Responsive design
- ✅ Real-time updates via Socket.IO
- ✅ JWT authentication
- ✅ API rate limiting
- ✅ Error handling
- ✅ Loading states
- ✅ Form validation

## 🐛 Troubleshooting

### Common Issues

1. **Backend not accessible**
   - Check environment variables
   - Verify CORS settings
   - Check Render/Railway logs

2. **Frontend can't connect to backend**
   - Verify backend URL in `api.ts`
   - Check CORS configuration
   - Test backend health endpoint

3. **Authentication not working**
   - Check JWT_SECRET in backend
   - Verify token storage in frontend
   - Check browser console for errors

### Debug Steps
1. Check browser console for frontend errors
2. Check backend logs in Render/Railway dashboard
3. Test API endpoints directly with Postman/curl
4. Verify environment variables are set correctly

## 🔒 Security Notes

- Change default JWT and session secrets
- Consider adding rate limiting
- Implement proper logging
- Add monitoring and alerts
- Use HTTPS everywhere

## 📈 Next Steps

After successful deployment:
1. Add a real database (PostgreSQL, MongoDB)
2. Implement Redis for caching
3. Add payment processing (Stripe)
4. Set up monitoring and logging
5. Add CI/CD pipeline
6. Implement backup strategies

## 🎉 Success!

Once deployed, you'll have your **exact local website** running online with:
- Full functionality
- Real backend API
- User authentication
- Admin capabilities
- Real-time features
- Professional deployment

Your customers can now order pizza online, and you can manage everything through the admin dashboard!

---

**Need help?** Check the logs, verify environment variables, and ensure all services are running. The deployment creates a production-ready version of your local development environment.
