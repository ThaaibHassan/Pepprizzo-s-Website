# 🚀 DEPLOY YOUR WEBSITE NOW - Step by Step

## 🎯 Current Status
✅ **Frontend**: Ready and built successfully  
✅ **Backend**: Code ready, needs deployment  
✅ **All files**: Committed and pushed to GitHub  

## 🚀 STEP 1: Deploy Backend (Required First)

### Option A: Render.com (Recommended - Free)
1. **Go to [render.com](https://render.com)** and sign up/login
2. **Click "New +"** → **"Web Service"**
3. **Connect your GitHub repo**: `ThaaibHassan/Pepprizzo-s-Website`
4. **Configure the service**:
   - **Name**: `peprizzos-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`
   - **Plan**: `Free`
5. **Add Environment Variables**:
   ```
   NODE_ENV=production
   PORT=10000
   JWT_SECRET=your-super-secret-jwt-key-change-this
   CLIENT_URL=https://peprizzos-pizza.netlify.app
   SESSION_SECRET=your-super-secret-session-key-change-this
   ```
6. **Click "Create Web Service"**
7. **Wait for deployment** (2-3 minutes)
8. **Copy your backend URL** (e.g., `https://peprizzos-backend.onrender.com`)

### Option B: Use render.yaml (Faster)
1. **Go to [render.com](https://render.com)**
2. **Click "New +"** → **"Blueprint"**
3. **Paste this YAML**:
   ```yaml
   services:
     - type: web
       name: peprizzos-backend
       env: node
       plan: free
       buildCommand: cd server && npm install
       startCommand: cd server && npm start
       envVars:
         - key: NODE_ENV
           value: production
         - key: PORT
           value: 10000
         - key: JWT_SECRET
           value: your-super-secret-jwt-key-change-this
         - key: CLIENT_URL
           value: https://peprizzos-pizza.netlify.app
         - key: SESSION_SECRET
           value: your-super-secret-session-key-change-this
   ```
4. **Deploy** and get your backend URL

## 🔧 STEP 2: Update Frontend API URL

1. **Edit** `client/src/lib/api.ts`
2. **Replace line 8** with your backend URL:
   ```typescript
   baseURL: process.env.NODE_ENV === 'production' 
     ? 'https://YOUR-BACKEND-URL.onrender.com/api'  // ← Update this
     : 'http://localhost:5001/api',
   ```
3. **Save the file**

## 🚀 STEP 3: Deploy Frontend

1. **Commit and push** your API URL change:
   ```bash
   git add .
   git commit -m "🔗 Update API URL to deployed backend"
   git push origin main
   ```
2. **Your frontend will auto-deploy** to Netlify
3. **Or manually deploy** by pushing to GitHub

## ✅ STEP 4: Test Everything

1. **Test Backend**: Visit your backend URL + `/api/menu`
2. **Test Frontend**: Visit your Netlify URL
3. **Test Login**:
   - Customer: `john@example.com` / `password`
   - Admin: `admin@peprizzos.com` / `password`

## 🎉 What You'll Get

- **Full website online** with all features
- **Customer ordering system** working
- **Admin dashboard** fully functional
- **Real-time updates** via Socket.IO
- **Mobile-responsive** design
- **Professional deployment**

## 🔧 If Something Goes Wrong

1. **Check backend logs** in Render dashboard
2. **Check frontend logs** in Netlify dashboard
3. **Verify environment variables** are set correctly
4. **Check CORS settings** in backend

## 📱 Your URLs After Deployment

- **Frontend**: `https://peprizzos-pizza.netlify.app`
- **Backend**: `https://your-backend-name.onrender.com`
- **Admin**: `https://peprizzos-pizza.netlify.app/admin`

---

## 🚀 READY TO DEPLOY?

**Start with Step 1** - Deploy your backend to Render.com, then follow the rest!

Your website will be **100% functional online** with all the features from your local development! 🎉
