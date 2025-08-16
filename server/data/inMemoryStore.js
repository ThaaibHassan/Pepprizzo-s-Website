// In-memory data store for production deployment
// This replaces the need for external databases during initial deployment

const menuItems = [
  {
    id: 1,
    name: "Margherita Pizza",
    description: "Classic tomato sauce with fresh mozzarella and basil",
    price: 14.99,
    image_url: "/placeholder-pizza.svg",
    category: "pizza",
    is_vegetarian: true,
    is_spicy: false,
    is_featured: true,
    available_sizes: ["Small", "Medium", "Large"],
    available_crusts: ["Classic", "Thin", "Stuffed"],
    available_toppings: ["Extra Cheese", "Mushrooms", "Olives"]
  },
  {
    id: 2,
    name: "Pepperoni Pizza",
    description: "Spicy pepperoni with melted cheese and tomato sauce",
    price: 16.99,
    image_url: "/placeholder-pizza.svg",
    category: "pizza",
    is_vegetarian: false,
    is_spicy: true,
    is_featured: true,
    available_sizes: ["Small", "Medium", "Large"],
    available_crusts: ["Classic", "Thin", "Stuffed"],
    available_toppings: ["Extra Cheese", "Extra Pepperoni", "Jalapeños"]
  },
  {
    id: 3,
    name: "BBQ Chicken Pizza",
    description: "BBQ sauce with grilled chicken, red onions, and cilantro",
    price: 18.99,
    image_url: "/placeholder-pizza.svg",
    category: "pizza",
    is_vegetarian: false,
    is_spicy: false,
    is_featured: false,
    available_sizes: ["Small", "Medium", "Large"],
    available_crusts: ["Classic", "Thin", "Stuffed"],
    available_toppings: ["Extra Chicken", "Bacon", "Pineapple"]
  },
  {
    id: 4,
    name: "Veggie Supreme",
    description: "Loaded with fresh vegetables and premium cheese",
    price: 17.99,
    image_url: "/placeholder-pizza.svg",
    category: "pizza",
    is_vegetarian: true,
    is_spicy: false,
    is_featured: false,
    available_sizes: ["Small", "Medium", "Large"],
    available_crusts: ["Classic", "Thin", "Stuffed"],
    available_toppings: ["Extra Cheese", "Artichokes", "Sun-dried Tomatoes"]
  },
  {
    id: 5,
    name: "Buffalo Wings",
    description: "Crispy wings tossed in spicy buffalo sauce",
    price: 12.99,
    image_url: "/placeholder-pizza.svg",
    category: "appetizers",
    is_vegetarian: false,
    is_spicy: true,
    is_featured: false,
    available_sizes: ["6 pieces", "12 pieces", "24 pieces"],
    available_crusts: [],
    available_toppings: ["Ranch", "Blue Cheese", "Extra Hot"]
  },
  {
    id: 6,
    name: "Garlic Bread",
    description: "Fresh baked bread with garlic butter and herbs",
    price: 4.99,
    image_url: "/placeholder-pizza.svg",
    category: "appetizers",
    is_vegetarian: true,
    is_spicy: false,
    is_featured: false,
    available_sizes: ["Regular", "Large"],
    available_crusts: [],
    available_toppings: ["Extra Cheese", "Parmesan"]
  },
  {
    id: 7,
    name: "Caesar Salad",
    description: "Fresh romaine lettuce with Caesar dressing and croutons",
    price: 8.99,
    image_url: "/placeholder-pizza.svg",
    category: "salads",
    is_vegetarian: false,
    is_spicy: false,
    is_featured: false,
    available_sizes: ["Small", "Large"],
    available_crusts: [],
    available_toppings: ["Extra Dressing", "Parmesan", "Anchovies"]
  },
  {
    id: 8,
    name: "Chocolate Lava Cake",
    description: "Warm chocolate cake with molten center, served with vanilla ice cream",
    price: 6.99,
    image_url: "/placeholder-pizza.svg",
    category: "desserts",
    is_vegetarian: true,
    is_spicy: false,
    is_featured: true,
    available_sizes: ["Regular"],
    available_crusts: [],
    available_toppings: ["Extra Ice Cream", "Chocolate Sauce", "Strawberries"]
  }
];

const categories = [
  { id: 1, name: "pizza", display_name: "Pizza", description: "Fresh baked pizzas" },
  { id: 2, name: "appetizers", display_name: "Appetizers", description: "Start your meal right" },
  { id: 3, name: "salads", display_name: "Salads", description: "Fresh and healthy options" },
  { id: 4, name: "desserts", display_name: "Desserts", description: "Sweet endings" },
  { id: 5, name: "beverages", display_name: "Beverages", description: "Refreshing drinks" }
];

// In-memory storage for orders, users, etc.
let orders = [];
let users = [];
let loyaltyPoints = {};

// Helper functions
const generateId = () => Math.floor(Math.random() * 1000000) + Date.now();

// Menu store
const menuStore = {
  getMenuItems: (filters = {}) => {
    let items = [...menuItems];
    
    if (filters.category && filters.category !== 'all') {
      items = items.filter(item => item.category === filters.category);
    }
    
    if (filters.vegetarian === 'true') {
      items = items.filter(item => item.is_vegetarian);
    }
    
    if (filters.spicy === 'true') {
      items = items.filter(item => item.is_spicy);
    }
    
    if (filters.featured === 'true') {
      items = items.filter(item => item.is_featured);
    }
    
    if (filters.search) {
      items = items.filter(item => 
        item.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    
    return items;
  },
  
  getCategories: () => categories,
  
  getMenuItem: (id) => menuItems.find(item => item.id === parseInt(id)),
  
  addMenuItem: (item) => {
    const newItem = { ...item, id: generateId() };
    menuItems.push(newItem);
    return newItem;
  },
  
  updateMenuItem: (id, updates) => {
    const index = menuItems.findIndex(item => item.id === parseInt(id));
    if (index !== -1) {
      menuItems[index] = { ...menuItems[index], ...updates };
      return menuItems[index];
    }
    return null;
  },
  
  deleteMenuItem: (id) => {
    const index = menuItems.findIndex(item => item.id === parseInt(id));
    if (index !== -1) {
      return menuItems.splice(index, 1)[0];
    }
    return null;
  }
};

// Order store
const orderStore = {
  createOrder: (orderData) => {
    const order = {
      id: generateId(),
      ...orderData,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    orders.push(order);
    return order;
  },
  
  getOrders: (userId = null) => {
    if (userId) {
      return orders.filter(order => order.user_id === userId);
    }
    return orders;
  },
  
  getOrder: (id) => orders.find(order => order.id === parseInt(id)),
  
  updateOrderStatus: (id, status) => {
    const order = orders.find(o => o.id === parseInt(id));
    if (order) {
      order.status = status;
      order.updated_at = new Date().toISOString();
      return order;
    }
    return null;
  }
};

// User store
const userStore = {
  createUser: (userData) => {
    const user = {
      id: generateId(),
      ...userData,
      created_at: new Date().toISOString()
    };
    users.push(user);
    return user;
  },
  
  getUserByEmail: (email) => users.find(user => user.email === email),
  
  getUser: (id) => users.find(user => user.id === parseInt(id)),
  
  getAllUsers: () => users,
  
  updateUser: (id, updates) => {
    const index = users.findIndex(user => user.id === parseInt(id));
    if (index !== -1) {
      users[index] = { ...users[index], ...updates };
      return users[index];
    }
    return null;
  }
};

// Loyalty store
const loyaltyStore = {
  getPoints: (userId) => loyaltyPoints[userId] || 0,
  
  addPoints: (userId, points) => {
    loyaltyPoints[userId] = (loyaltyPoints[userId] || 0) + points;
    return loyaltyPoints[userId];
  },
  
  deductPoints: (userId, points) => {
    if (loyaltyPoints[userId] && loyaltyPoints[userId] >= points) {
      loyaltyPoints[userId] -= points;
      return loyaltyPoints[userId];
    }
    return false;
  }
};

module.exports = {
  menuStore,
  orderStore,
  userStore,
  loyaltyStore,
  generateId
};
