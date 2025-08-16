// Mock database for demo purposes
const demoData = {
  categories: [
    { id: 1, name: 'Pizzas', description: 'Fresh baked pizzas with premium toppings' },
    { id: 2, name: 'Sides', description: 'Delicious sides and appetizers' },
    { id: 3, name: 'Drinks', description: 'Refreshing beverages' },
    { id: 4, name: 'Desserts', description: 'Sweet treats to end your meal' }
  ],
  menuItems: [
    // PIZZAS
    {
      id: 1,
      name: 'Margherita Pizza',
      description: 'Classic tomato sauce, mozzarella, and fresh basil',
      price: 14.99,
      image_url: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&h=300&fit=crop',
      category: 'Pizzas',
      is_vegetarian: true,
      is_spicy: false,
      is_featured: true,
      available_sizes: ['Small', 'Medium', 'Large'],
      available_crusts: ['Classic', 'Thin', 'Stuffed'],
      available_toppings: ['Extra Cheese', 'Pepperoni', 'Mushrooms', 'Bell Peppers']
    },
    {
      id: 2,
      name: 'Pepperoni Pizza',
      description: 'Spicy pepperoni with melted mozzarella cheese',
      price: 16.99,
      image_url: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop',
      category: 'Pizzas',
      is_vegetarian: false,
      is_spicy: true,
      is_featured: true,
      available_sizes: ['Small', 'Medium', 'Large'],
      available_crusts: ['Classic', 'Thin', 'Stuffed'],
      available_toppings: ['Extra Cheese', 'Pepperoni', 'Mushrooms', 'Bell Peppers']
    },
    {
      id: 3,
      name: 'BBQ Chicken Pizza',
      description: 'BBQ sauce, grilled chicken, red onions, and cilantro',
      price: 18.99,
      image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
      category: 'Pizzas',
      is_vegetarian: false,
      is_spicy: false,
      is_featured: true,
      available_sizes: ['Small', 'Medium', 'Large'],
      available_crusts: ['Classic', 'Thin', 'Stuffed'],
      available_toppings: ['Extra Cheese', 'Pepperoni', 'Mushrooms', 'Bell Peppers']
    },
    {
      id: 4,
      name: 'Supreme Pizza',
      description: 'Pepperoni, sausage, mushrooms, bell peppers, onions, and olives',
      price: 20.99,
      image_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop',
      category: 'Pizzas',
      is_vegetarian: false,
      is_spicy: true,
      is_featured: false,
      available_sizes: ['Small', 'Medium', 'Large'],
      available_crusts: ['Classic', 'Thin', 'Stuffed'],
      available_toppings: ['Extra Cheese', 'Pepperoni', 'Mushrooms', 'Bell Peppers']
    },
    {
      id: 5,
      name: 'Hawaiian Pizza',
      description: 'Ham, pineapple, and mozzarella cheese',
      price: 17.99,
      image_url: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&h=300&fit=crop',
      category: 'Pizzas',
      is_vegetarian: false,
      is_spicy: false,
      is_featured: false,
      available_sizes: ['Small', 'Medium', 'Large'],
      available_crusts: ['Classic', 'Thin', 'Stuffed'],
      available_toppings: ['Extra Cheese', 'Pepperoni', 'Mushrooms', 'Bell Peppers']
    },
    {
      id: 6,
      name: 'Veggie Delight Pizza',
      description: 'Mushrooms, bell peppers, onions, olives, and tomatoes',
      price: 15.99,
      image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
      category: 'Pizzas',
      is_vegetarian: true,
      is_spicy: false,
      is_featured: false,
      available_sizes: ['Small', 'Medium', 'Large'],
      available_crusts: ['Classic', 'Thin', 'Stuffed'],
      available_toppings: ['Extra Cheese', 'Pepperoni', 'Mushrooms', 'Bell Peppers']
    },
    {
      id: 7,
      name: 'Buffalo Chicken Pizza',
      description: 'Buffalo sauce, grilled chicken, red onions, and ranch drizzle',
      price: 19.99,
      image_url: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&h=300&fit=crop',
      category: 'Pizzas',
      is_vegetarian: false,
      is_spicy: true,
      is_featured: false,
      available_sizes: ['Small', 'Medium', 'Large'],
      available_crusts: ['Classic', 'Thin', 'Stuffed'],
      available_toppings: ['Extra Cheese', 'Pepperoni', 'Mushrooms', 'Bell Peppers']
    },
    {
      id: 8,
      name: 'Meat Lovers Pizza',
      description: 'Pepperoni, sausage, bacon, ham, and ground beef',
      price: 22.99,
      image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
      category: 'Pizzas',
      is_vegetarian: false,
      is_spicy: true,
      is_featured: false,
      available_sizes: ['Small', 'Medium', 'Large'],
      available_crusts: ['Classic', 'Thin', 'Stuffed'],
      available_toppings: ['Extra Cheese', 'Pepperoni', 'Mushrooms', 'Bell Peppers']
    },
    {
      id: 9,
      name: 'Four Cheese Pizza',
      description: 'Mozzarella, parmesan, ricotta, and gorgonzola',
      price: 16.99,
      image_url: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&h=300&fit=crop',
      category: 'Pizzas',
      is_vegetarian: true,
      is_spicy: false,
      is_featured: false,
      available_sizes: ['Small', 'Medium', 'Large'],
      available_crusts: ['Classic', 'Thin', 'Stuffed'],
      available_toppings: ['Extra Cheese', 'Pepperoni', 'Mushrooms', 'Bell Peppers']
    },
    {
      id: 10,
      name: 'Mediterranean Pizza',
      description: 'Feta cheese, olives, sun-dried tomatoes, and artichoke hearts',
      price: 18.99,
      image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
      category: 'Pizzas',
      is_vegetarian: true,
      is_spicy: false,
      is_featured: false,
      available_sizes: ['Small', 'Medium', 'Large'],
      available_crusts: ['Classic', 'Thin', 'Stuffed'],
      available_toppings: ['Extra Cheese', 'Pepperoni', 'Mushrooms', 'Bell Peppers']
    },

    // SIDES
    {
      id: 11,
      name: 'Garlic Bread',
      description: 'Fresh baked bread with garlic butter and herbs',
      price: 4.99,
      image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
      category: 'Sides',
      is_vegetarian: true,
      is_spicy: false,
      is_featured: false,
      available_sizes: ['Regular'],
      available_crusts: ['N/A'],
      available_toppings: []
    },
    {
      id: 12,
      name: 'Caesar Salad',
      description: 'Fresh romaine lettuce, parmesan cheese, and caesar dressing',
      price: 8.99,
      image_url: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop',
      category: 'Sides',
      is_vegetarian: true,
      is_spicy: false,
      is_featured: false,
      available_sizes: ['Regular'],
      available_crusts: ['N/A'],
      available_toppings: []
    },
    {
      id: 13,
      name: 'Breadsticks',
      description: 'Soft breadsticks served with marinara sauce',
      price: 5.99,
      image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
      category: 'Sides',
      is_vegetarian: true,
      is_spicy: false,
      is_featured: false,
      available_sizes: ['Regular'],
      available_crusts: ['N/A'],
      available_toppings: []
    },
    {
      id: 14,
      name: 'Mozzarella Sticks',
      description: 'Crispy breaded mozzarella sticks with marinara sauce',
      price: 7.99,
      image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
      category: 'Sides',
      is_vegetarian: true,
      is_spicy: false,
      is_featured: false,
      available_sizes: ['Regular'],
      available_crusts: ['N/A'],
      available_toppings: []
    },
    {
      id: 15,
      name: 'Chicken Wings',
      description: 'Crispy chicken wings with choice of sauce',
      price: 12.99,
      image_url: 'https://images.unsplash.com/photo-1567620832904-9fe5cf23cd73?w=400&h=300&fit=crop',
      category: 'Sides',
      is_vegetarian: false,
      is_spicy: true,
      is_featured: false,
      available_sizes: ['Regular'],
      available_crusts: ['N/A'],
      available_toppings: []
    },
    {
      id: 16,
      name: 'Greek Salad',
      description: 'Mixed greens, feta cheese, olives, tomatoes, and cucumber',
      price: 9.99,
      image_url: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop',
      category: 'Sides',
      is_vegetarian: true,
      is_spicy: false,
      is_featured: false,
      available_sizes: ['Regular'],
      available_crusts: ['N/A'],
      available_toppings: []
    },
    {
      id: 17,
      name: 'Pasta Salad',
      description: 'Tri-color pasta with Italian dressing and vegetables',
      price: 6.99,
      image_url: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop',
      category: 'Sides',
      is_vegetarian: true,
      is_spicy: false,
      is_featured: false,
      available_sizes: ['Regular'],
      available_crusts: ['N/A'],
      available_toppings: []
    },
    {
      id: 18,
      name: 'Onion Rings',
      description: 'Crispy beer-battered onion rings',
      price: 5.99,
      image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
      category: 'Sides',
      is_vegetarian: true,
      is_spicy: false,
      is_featured: false,
      available_sizes: ['Regular'],
      available_crusts: ['N/A'],
      available_toppings: []
    },

    // DRINKS
    {
      id: 19,
      name: 'Coca Cola',
      description: 'Refreshing Coca Cola soft drink',
      price: 2.99,
      image_url: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400&h=300&fit=crop',
      category: 'Drinks',
      is_vegetarian: true,
      is_spicy: false,
      is_featured: false,
      available_sizes: ['Regular'],
      available_crusts: ['N/A'],
      available_toppings: []
    },
    {
      id: 20,
      name: 'Pepsi',
      description: 'Classic Pepsi soft drink',
      price: 2.99,
      image_url: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400&h=300&fit=crop',
      category: 'Drinks',
      is_vegetarian: true,
      is_spicy: false,
      is_featured: false,
      available_sizes: ['Regular'],
      available_crusts: ['N/A'],
      available_toppings: []
    },
    {
      id: 21,
      name: 'Sprite',
      description: 'Crisp and refreshing Sprite lemon-lime soda',
      price: 2.99,
      image_url: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400&h=300&fit=crop',
      category: 'Drinks',
      is_vegetarian: true,
      is_spicy: false,
      is_featured: false,
      available_sizes: ['Regular'],
      available_crusts: ['N/A'],
      available_toppings: []
    },
    {
      id: 22,
      name: 'Root Beer',
      description: 'Classic root beer with rich, creamy flavor',
      price: 2.99,
      image_url: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400&h=300&fit=crop',
      category: 'Drinks',
      is_vegetarian: true,
      is_spicy: false,
      is_featured: false,
      available_sizes: ['Regular'],
      available_crusts: ['N/A'],
      available_toppings: []
    },
    {
      id: 23,
      name: 'Lemonade',
      description: 'Fresh squeezed lemonade',
      price: 3.99,
      image_url: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400&h=300&fit=crop',
      category: 'Drinks',
      is_vegetarian: true,
      is_spicy: false,
      is_featured: false,
      available_sizes: ['Regular'],
      available_crusts: ['N/A'],
      available_toppings: []
    },
    {
      id: 24,
      name: 'Iced Tea',
      description: 'Refreshing iced tea with lemon',
      price: 2.99,
      image_url: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400&h=300&fit=crop',
      category: 'Drinks',
      is_vegetarian: true,
      is_spicy: false,
      is_featured: false,
      available_sizes: ['Regular'],
      available_crusts: ['N/A'],
      available_toppings: []
    },
    {
      id: 25,
      name: 'Bottled Water',
      description: 'Pure spring water',
      price: 1.99,
      image_url: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400&h=300&fit=crop',
      category: 'Drinks',
      is_vegetarian: true,
      is_spicy: false,
      is_featured: false,
      available_sizes: ['Regular'],
      available_crusts: ['N/A'],
      available_toppings: []
    },
    {
      id: 26,
      name: 'Orange Juice',
      description: 'Fresh squeezed orange juice',
      price: 3.99,
      image_url: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400&h=300&fit=crop',
      category: 'Drinks',
      is_vegetarian: true,
      is_spicy: false,
      is_featured: false,
      available_sizes: ['Regular'],
      available_crusts: ['N/A'],
      available_toppings: []
    },

    // DESSERTS
    {
      id: 27,
      name: 'Tiramisu',
      description: 'Classic Italian dessert with coffee-flavored mascarpone',
      price: 6.99,
      image_url: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop',
      category: 'Desserts',
      is_vegetarian: true,
      is_spicy: false,
      is_featured: false,
      available_sizes: ['Regular'],
      available_crusts: ['N/A'],
      available_toppings: []
    },
    {
      id: 28,
      name: 'Chocolate Lava Cake',
      description: 'Warm chocolate cake with molten center',
      price: 7.99,
      image_url: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop',
      category: 'Desserts',
      is_vegetarian: true,
      is_spicy: false,
      is_featured: false,
      available_sizes: ['Regular'],
      available_crusts: ['N/A'],
      available_toppings: []
    },
    {
      id: 29,
      name: 'Cannoli',
      description: 'Crispy pastry shells filled with sweet ricotta cream',
      price: 5.99,
      image_url: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop',
      category: 'Desserts',
      is_vegetarian: true,
      is_spicy: false,
      is_featured: false,
      available_sizes: ['Regular'],
      available_crusts: ['N/A'],
      available_toppings: []
    },
    {
      id: 30,
      name: 'Gelato',
      description: 'Italian ice cream in various flavors',
      price: 4.99,
      image_url: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop',
      category: 'Desserts',
      is_vegetarian: true,
      is_spicy: false,
      is_featured: false,
      available_sizes: ['Regular'],
      available_crusts: ['N/A'],
      available_toppings: []
    },
    {
      id: 31,
      name: 'Cheesecake',
      description: 'Creamy New York style cheesecake',
      price: 6.99,
      image_url: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop',
      category: 'Desserts',
      is_vegetarian: true,
      is_spicy: false,
      is_featured: false,
      available_sizes: ['Regular'],
      available_crusts: ['N/A'],
      available_toppings: []
    },
    {
      id: 32,
      name: 'Chocolate Chip Cookies',
      description: 'Warm, gooey chocolate chip cookies',
      price: 3.99,
      image_url: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop',
      category: 'Desserts',
      is_vegetarian: true,
      is_spicy: false,
      is_featured: false,
      available_sizes: ['Regular'],
      available_crusts: ['N/A'],
      available_toppings: []
    }
  ],
  users: [
    {
      id: 1,
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
      phone: '(555) 123-4567',
      role: 'customer'
    },
    {
      id: 2,
      first_name: 'Jane',
      last_name: 'Smith',
      email: 'jane@example.com',
      phone: '(555) 234-5678',
      role: 'customer'
    },
    {
      id: 3,
      first_name: 'Mike',
      last_name: 'Johnson',
      email: 'mike@example.com',
      phone: '(555) 345-6789',
      role: 'customer'
    },
    {
      id: 4,
      first_name: 'Sarah',
      last_name: 'Wilson',
      email: 'sarah@example.com',
      phone: '(555) 456-7890',
      role: 'customer'
    },
    {
      id: 5,
      first_name: 'Admin',
      last_name: 'User',
      email: 'admin@peprizzos.com',
      phone: '(555) 987-6543',
      role: 'admin'
    }
  ],
  orders: [
    {
      id: 1,
      order_number: 'PEP-2024-001',
      user_id: 1,
      status: 'delivered',
      total_amount: 32.97,
      created_at: '2024-01-15T18:30:00Z',
      delivery_address: '123 Main St, Downtown, City, State 12345',
      items: [
        { id: 1, name: 'Margherita Pizza', quantity: 1, price: 14.99 },
        { id: 4, name: 'Garlic Bread', quantity: 1, price: 4.99 },
        { id: 6, name: 'Coca Cola', quantity: 2, price: 2.99 }
      ]
    },
    {
      id: 2,
      order_number: 'PEP-2024-002',
      user_id: 1,
      status: 'preparing',
      total_amount: 18.99,
      created_at: '2024-01-15T19:15:00Z',
      delivery_address: '123 Main St, Downtown, City, State 12345',
      items: [
        { id: 2, name: 'Pepperoni Pizza', quantity: 1, price: 16.99 },
        { id: 6, name: 'Coca Cola', quantity: 1, price: 2.99 }
      ]
    },
    {
      id: 3,
      order_number: 'PEP-2024-003',
      user_id: 2,
      status: 'pending',
      total_amount: 25.98,
      created_at: '2024-01-15T20:00:00Z',
      delivery_address: '456 Oak Ave, Suburb, City, State 12345',
      items: [
        { id: 3, name: 'BBQ Chicken Pizza', quantity: 1, price: 18.99 },
        { id: 12, name: 'Caesar Salad', quantity: 1, price: 8.99 }
      ]
    },
    {
      id: 4,
      order_number: 'PEP-2024-004',
      user_id: 3,
      status: 'delivered',
      total_amount: 45.97,
      created_at: '2024-01-15T20:30:00Z',
      delivery_address: '789 Pine St, Downtown, City, State 12345',
      items: [
        { id: 4, name: 'Supreme Pizza', quantity: 1, price: 20.99 },
        { id: 15, name: 'Chicken Wings', quantity: 1, price: 12.99 },
        { id: 19, name: 'Coca Cola', quantity: 2, price: 2.99 },
        { id: 27, name: 'Tiramisu', quantity: 1, price: 6.99 }
      ]
    },
    {
      id: 5,
      order_number: 'PEP-2024-005',
      user_id: 4,
      status: 'ready',
      total_amount: 15.98,
      created_at: '2024-01-15T21:00:00Z',
      delivery_address: '321 Elm St, Suburb, City, State 12345',
      items: [
        { id: 6, name: 'Veggie Delight Pizza', quantity: 1, price: 15.99 }
      ]
    }
  ]
};

// Mock database functions
const mockDB = {
  query: async (text, params = []) => {
    console.log('Mock DB Query:', text, params);
    
    // Handle different query types
    if (text.includes('SELECT') && text.includes('categories')) {
      return { rows: demoData.categories };
    }
    
    if (text.includes('SELECT') && text.includes('menu_items')) {
      let items = demoData.menuItems;
      
      // Apply filters
      if (params.category) {
        items = items.filter(item => item.category === params.category);
      }
      if (params.featured) {
        items = items.filter(item => item.is_featured);
      }
      if (params.search) {
        items = items.filter(item => 
          item.name.toLowerCase().includes(params.search.toLowerCase()) ||
          item.description.toLowerCase().includes(params.search.toLowerCase())
        );
      }
      
      return { rows: items };
    }
    
    if (text.includes('SELECT') && text.includes('users')) {
      return { rows: demoData.users };
    }
    
    if (text.includes('SELECT') && text.includes('orders')) {
      return { rows: demoData.orders };
    }
    
    // Default response
    return { rows: [] };
  },
  
  // Mock connection methods
  connect: () => Promise.resolve(),
  end: () => Promise.resolve()
};

console.log('✅ Using mock database for demo');

module.exports = {
  ...mockDB,
  demoData
};
