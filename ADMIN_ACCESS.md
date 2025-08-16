# Admin Access Guide

## 🔐 Authentication Required

The admin pages are now properly secured and require authentication. Only users with admin role can access these pages.

## 👤 Admin Login Credentials

**Email:** `admin@peprizzos.com`  
**Password:** `password`

## 🚀 How to Access Admin Pages

### 1. Login as Admin
1. Go to the login page: `http://localhost:3000/login`
2. Enter the admin credentials:
   - Email: `admin@peprizzos.com`
   - Password: `password`
3. Click "Login"

### 2. Access Admin Pages
Once logged in as admin, you can access:
- **Dashboard:** `http://localhost:3000/admin`
- **Menu Management:** `http://localhost:3000/admin/menu`
- **Order Management:** `http://localhost:3000/admin/orders`
- **Customer Management:** `http://localhost:3000/admin/customers`

## 🔒 Security Features

### Frontend Protection
- **AdminRoute Component:** Automatically redirects non-admin users to home page
- **Authentication Check:** Verifies user is logged in and has admin role
- **Route Protection:** All admin routes are wrapped with authentication middleware

### Backend Protection
- **JWT Authentication:** All admin API endpoints require valid JWT token
- **Role Verification:** Server checks if user has 'admin' role
- **Middleware Protection:** `protect` middleware validates tokens and user permissions

## 🧪 Testing Authentication

### Test Admin Access
```bash
# Login as admin
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@peprizzos.com","password":"password"}'

# Use the returned token to access admin endpoints
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5001/api/admin/dashboard
```

### Test Customer Access (Should Fail)
```bash
# Login as customer
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password"}'

# Try to access admin endpoint (will return 403 Forbidden)
curl -H "Authorization: Bearer CUSTOMER_TOKEN" \
  http://localhost:5001/api/admin/dashboard
```

## 📋 Available Admin Features

### Menu Management
- ✅ **View all menu items**
- ✅ **Add new menu items**
- ✅ **Edit existing menu items**
- ✅ **Delete menu items**
- ✅ **Filter and search items**

### Order Management
- ✅ **View all orders**
- ✅ **Update order status**
- ✅ **Filter orders by status**
- ✅ **Search orders**

### Customer Management
- ✅ **View all customers**
- ✅ **Customer statistics**
- ✅ **Order history per customer**

### Dashboard
- ✅ **Overview statistics**
- ✅ **Recent orders**
- ✅ **Category breakdown**

## 🛡️ Security Notes

- **No Guest Access:** Admin pages cannot be accessed without authentication
- **Role-Based Access:** Only users with 'admin' role can access admin features
- **Token Expiration:** JWT tokens expire after 7 days
- **Automatic Redirects:** Non-admin users are automatically redirected to home page

## 🔧 Development Notes

- **Demo Mode:** Currently using mock data for demonstration
- **Authentication:** JWT-based authentication with demo secret
- **CORS:** Configured to allow requests from `localhost:3000` and `localhost:3001`
- **Error Handling:** Proper error responses for unauthorized access

## 🚨 Troubleshooting

### If you can't access admin pages:
1. **Check if you're logged in** - You must be authenticated
2. **Verify admin role** - Only admin users can access these pages
3. **Check token validity** - JWT tokens expire after 7 days
4. **Clear browser cache** - Sometimes cached data can cause issues

### If API calls fail:
1. **Check Authorization header** - Must include `Bearer YOUR_TOKEN`
2. **Verify token format** - Should be a valid JWT token
3. **Check server status** - Ensure server is running on port 5001
