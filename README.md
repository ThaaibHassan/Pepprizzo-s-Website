# 🍕 Peprizzo's Pizza Webapp

A modern, full-stack web application for Peprizzo's Pizza, featuring online ordering, loyalty rewards, real-time order tracking, and comprehensive admin management.

## ✨ Features

### Customer Features
- 🏠 **Home Page**: Featured pizzas, deals, and quick ordering
- 📋 **Menu**: Browse categories with dietary filters
- 🛒 **Online Ordering**: Cart system with delivery/pickup options
- 💳 **Payment**: Secure payment processing with Stripe
- 📱 **Order Tracking**: Real-time order status updates
- 👤 **User Accounts**: Order history and saved preferences
- 🎁 **Loyalty Program**: Points system and rewards
- 📍 **Location Services**: Store locator with Google Maps

### Admin Features
- 📊 **Dashboard**: Sales analytics and order overview
- 🍕 **Menu Management**: Add/edit menu items and pricing
- 📦 **Order Management**: Accept/reject and track orders
- 👥 **Customer Management**: View profiles and order history
- 🎫 **Promotions**: Create and manage coupon codes

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL database
- Stripe account for payments
- Google Maps API key

### Installation

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd peprizzos-pizza-webapp
   npm run install-all
   ```

2. **Environment Setup:**
   ```bash
   # Copy environment files
   cp server/.env.example server/.env
   cp client/.env.example client/.env
   ```

3. **Configure environment variables:**
   - Database connection
   - Stripe API keys
   - Google Maps API key
   - JWT secret

4. **Start development servers:**
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```
peprizzos-pizza-webapp/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── context/       # React context providers
│   │   ├── utils/         # Utility functions
│   │   └── styles/        # CSS and styling
├── server/                # Node.js backend
│   ├── controllers/       # Route controllers
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   ├── utils/           # Utility functions
│   └── config/          # Configuration files
└── docs/                # Documentation
```

## 🛠 Tech Stack

### Frontend
- **React 18** - UI framework
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Query** - Data fetching
- **Stripe Elements** - Payment processing

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Primary database
- **Redis** - Session caching
- **JWT** - Authentication
- **Stripe** - Payment processing
- **Multer** - File uploads

### DevOps
- **Docker** - Containerization
- **GitHub Actions** - CI/CD
- **Vercel** - Frontend hosting
- **Railway/Heroku** - Backend hosting

## 🔧 Configuration

### Environment Variables

**Server (.env):**
```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/peprizzos
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-jwt-secret
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
GOOGLE_MAPS_API_KEY=your-google-maps-key
```

**Client (.env):**
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_...
REACT_APP_GOOGLE_MAPS_API_KEY=your-google-maps-key
```

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Menu
- `GET /api/menu` - Get all menu items
- `GET /api/menu/categories` - Get menu categories
- `GET /api/menu/:id` - Get specific menu item

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get specific order
- `PUT /api/orders/:id/status` - Update order status

### Admin
- `GET /api/admin/dashboard` - Dashboard analytics
- `POST /api/admin/menu` - Add menu item
- `PUT /api/admin/menu/:id` - Update menu item
- `DELETE /api/admin/menu/:id` - Delete menu item

## 🎨 Design System

### Colors
- **Primary**: #DC2626 (Red)
- **Secondary**: #F59E0B (Yellow)
- **Accent**: #92400E (Brown)
- **Background**: #FEFEFE (White)
- **Text**: #1F2937 (Dark Gray)

### Typography
- **Headings**: Inter, sans-serif
- **Body**: Inter, sans-serif
- **Display**: Playfair Display, serif

## 🧪 Testing

```bash
# Run all tests
npm test

# Run frontend tests
cd client && npm test

# Run backend tests
cd server && npm test
```

## 📦 Deployment

### Frontend (Vercel)
```bash
cd client
npm run build
vercel --prod
```

### Backend (Railway/Heroku)
```bash
cd server
git push heroku main
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support, email support@peprizzos.com or create an issue in the repository.

---

**Built with ❤️ by Blackwater Studios for Peprizzo's Pizza**
