const pool = require('../config/database');
const bcrypt = require('bcryptjs');

const seedData = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 12);
    const adminResult = await pool.query(`
      INSERT INTO users (email, password, first_name, last_name, role, is_active, email_verified)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (email) DO NOTHING
      RETURNING id
    `, ['admin@peprizzos.com', hashedPassword, 'Admin', 'User', 'admin', true, true]);

    // Create sample customer
    const customerPassword = await bcrypt.hash('customer123', 12);
    const customerResult = await pool.query(`
      INSERT INTO users (email, password, first_name, last_name, role, is_active, email_verified)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (email) DO NOTHING
      RETURNING id
    `, ['customer@example.com', customerPassword, 'John', 'Doe', 'customer', true, true]);

    // Create categories
    const categories = [
      { name: 'Pizzas', description: 'Fresh baked pizzas with premium toppings', sort_order: 1 },
      { name: 'Sides', description: 'Delicious sides and appetizers', sort_order: 2 },
      { name: 'Drinks', description: 'Refreshing beverages', sort_order: 3 },
      { name: 'Desserts', description: 'Sweet treats to end your meal', sort_order: 4 }
    ];

    for (const category of categories) {
      await pool.query(`
        INSERT INTO categories (name, description, sort_order)
        VALUES ($1, $2, $3)
        ON CONFLICT (name) DO NOTHING
      `, [category.name, category.description, category.sort_order]);
    }

    // Get category IDs
    const pizzaCategory = await pool.query('SELECT id FROM categories WHERE name = $1', ['Pizzas']);
    const sidesCategory = await pool.query('SELECT id FROM categories WHERE name = $1', ['Sides']);
    const drinksCategory = await pool.query('SELECT id FROM categories WHERE name = $1', ['Drinks']);
    const dessertsCategory = await pool.query('SELECT id FROM categories WHERE name = $1', ['Desserts']);

    // Create menu items
    const menuItems = [
      // Pizzas
      {
        category_id: pizzaCategory.rows[0]?.id,
        name: 'Margherita Classic',
        description: 'Fresh mozzarella, tomato sauce, and basil',
        price: 14.99,
        is_vegetarian: true,
        is_vegan: false,
        is_gluten_free: false,
        preparation_time: 15,
        calories: 285,
        allergens: ['dairy', 'gluten'],
        customizations: {
          sizes: ['small', 'medium', 'large'],
          crusts: ['thin', 'thick', 'stuffed'],
          extra_toppings: ['pepperoni', 'mushrooms', 'olives', 'bell_peppers']
        }
      },
      {
        category_id: pizzaCategory.rows[0]?.id,
        name: 'Pepperoni Supreme',
        description: 'Pepperoni, mozzarella, and our signature sauce',
        price: 16.99,
        is_vegetarian: false,
        is_vegan: false,
        is_gluten_free: false,
        is_spicy: true,
        preparation_time: 18,
        calories: 320,
        allergens: ['dairy', 'gluten', 'pork'],
        customizations: {
          sizes: ['small', 'medium', 'large'],
          crusts: ['thin', 'thick', 'stuffed'],
          extra_toppings: ['sausage', 'bacon', 'ham', 'extra_cheese']
        }
      },
      {
        category_id: pizzaCategory.rows[0]?.id,
        name: 'Veggie Delight',
        description: 'Mushrooms, bell peppers, onions, olives, and tomatoes',
        price: 15.99,
        is_vegetarian: true,
        is_vegan: true,
        is_gluten_free: false,
        preparation_time: 16,
        calories: 250,
        allergens: ['gluten'],
        customizations: {
          sizes: ['small', 'medium', 'large'],
          crusts: ['thin', 'thick', 'gluten_free'],
          extra_toppings: ['spinach', 'artichokes', 'sun_dried_tomatoes']
        }
      },
      {
        category_id: pizzaCategory.rows[0]?.id,
        name: 'BBQ Chicken',
        description: 'BBQ sauce, grilled chicken, red onions, and cilantro',
        price: 18.99,
        is_vegetarian: false,
        is_vegan: false,
        is_gluten_free: false,
        preparation_time: 20,
        calories: 350,
        allergens: ['dairy', 'gluten', 'chicken'],
        customizations: {
          sizes: ['small', 'medium', 'large'],
          crusts: ['thin', 'thick', 'stuffed'],
          extra_toppings: ['bacon', 'extra_chicken', 'jalapenos']
        }
      },

      // Sides
      {
        category_id: sidesCategory.rows[0]?.id,
        name: 'Garlic Bread',
        description: 'Fresh baked bread with garlic butter and herbs',
        price: 4.99,
        is_vegetarian: true,
        is_vegan: false,
        is_gluten_free: false,
        preparation_time: 8,
        calories: 180,
        allergens: ['dairy', 'gluten'],
        customizations: {
          sizes: ['regular', 'large'],
          extras: ['extra_cheese', 'extra_garlic']
        }
      },
      {
        category_id: sidesCategory.rows[0]?.id,
        name: 'Chicken Wings',
        description: 'Crispy wings with your choice of sauce',
        price: 12.99,
        is_vegetarian: false,
        is_vegan: false,
        is_gluten_free: false,
        preparation_time: 12,
        calories: 450,
        allergens: ['gluten', 'chicken'],
        customizations: {
          sauces: ['buffalo', 'bbq', 'honey_mustard', 'garlic_parmesan'],
          quantities: [6, 12, 18, 24]
        }
      },
      {
        category_id: sidesCategory.rows[0]?.id,
        name: 'Caesar Salad',
        description: 'Fresh romaine lettuce, parmesan, croutons, and caesar dressing',
        price: 8.99,
        is_vegetarian: true,
        is_vegan: false,
        is_gluten_free: false,
        preparation_time: 10,
        calories: 220,
        allergens: ['dairy', 'gluten', 'eggs'],
        customizations: {
          sizes: ['small', 'large'],
          extras: ['grilled_chicken', 'shrimp', 'extra_dressing']
        }
      },

      // Drinks
      {
        category_id: drinksCategory.rows[0]?.id,
        name: 'Soft Drinks',
        description: 'Coca-Cola, Sprite, Fanta, or Diet Coke',
        price: 2.99,
        is_vegetarian: true,
        is_vegan: true,
        is_gluten_free: true,
        preparation_time: 2,
        calories: 150,
        allergens: [],
        customizations: {
          flavors: ['coca_cola', 'sprite', 'fanta', 'diet_coke'],
          sizes: ['small', 'medium', 'large']
        }
      },
      {
        category_id: drinksCategory.rows[0]?.id,
        name: 'Fresh Lemonade',
        description: 'Homemade lemonade with fresh lemons',
        price: 3.99,
        is_vegetarian: true,
        is_vegan: true,
        is_gluten_free: true,
        preparation_time: 5,
        calories: 120,
        allergens: [],
        customizations: {
          sizes: ['small', 'medium', 'large'],
          extras: ['strawberry', 'mint']
        }
      },

      // Desserts
      {
        category_id: dessertsCategory.rows[0]?.id,
        name: 'Chocolate Lava Cake',
        description: 'Warm chocolate cake with molten center',
        price: 6.99,
        is_vegetarian: true,
        is_vegan: false,
        is_gluten_free: false,
        preparation_time: 8,
        calories: 380,
        allergens: ['dairy', 'gluten', 'eggs'],
        customizations: {
          extras: ['vanilla_ice_cream', 'strawberries', 'whipped_cream']
        }
      },
      {
        category_id: dessertsCategory.rows[0]?.id,
        name: 'Tiramisu',
        description: 'Classic Italian dessert with coffee and mascarpone',
        price: 7.99,
        is_vegetarian: true,
        is_vegan: false,
        is_gluten_free: false,
        preparation_time: 3,
        calories: 320,
        allergens: ['dairy', 'gluten', 'eggs'],
        customizations: {
          extras: ['extra_coffee', 'chocolate_shavings']
        }
      }
    ];

    for (const item of menuItems) {
      await pool.query(`
        INSERT INTO menu_items (
          category_id, name, description, price, is_vegetarian, is_vegan, 
          is_gluten_free, is_spicy, preparation_time, calories, allergens, customizations
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        ON CONFLICT (name) DO NOTHING
      `, [
        item.category_id, item.name, item.description, item.price,
        item.is_vegetarian, item.is_vegan, item.is_gluten_free, item.is_spicy,
        item.preparation_time, item.calories, item.allergens, JSON.stringify(item.customizations)
      ]);
    }

    // Create store location
    await pool.query(`
      INSERT INTO store_locations (
        name, address_line1, city, state, postal_code, phone, email,
        latitude, longitude, delivery_radius
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      ON CONFLICT (name) DO NOTHING
    `, [
      'Peprizzo\'s Downtown',
      '123 Main Street',
      'Downtown',
      'CA',
      '90210',
      '(555) 123-4567',
      'downtown@peprizzos.com',
      34.0522,
      -118.2437,
      5.0
    ]);

    // Create store hours
    const storeLocation = await pool.query('SELECT id FROM store_locations WHERE name = $1', ['Peprizzo\'s Downtown']);
    const storeId = storeLocation.rows[0]?.id;

    if (storeId) {
      const hours = [
        { day: 0, open: '11:00', close: '22:00' }, // Sunday
        { day: 1, open: '11:00', close: '22:00' }, // Monday
        { day: 2, open: '11:00', close: '22:00' }, // Tuesday
        { day: 3, open: '11:00', close: '22:00' }, // Wednesday
        { day: 4, open: '11:00', close: '23:00' }, // Thursday
        { day: 5, open: '11:00', close: '23:00' }, // Friday
        { day: 6, open: '11:00', close: '23:00' }  // Saturday
      ];

      for (const hour of hours) {
        await pool.query(`
          INSERT INTO store_hours (store_id, day_of_week, open_time, close_time)
          VALUES ($1, $2, $3, $4)
          ON CONFLICT (store_id, day_of_week) DO NOTHING
        `, [storeId, hour.day, hour.open, hour.close]);
      }
    }

    // Create sample coupons
    const coupons = [
      {
        code: 'WELCOME10',
        name: 'Welcome Discount',
        description: '10% off your first order',
        discount_type: 'percentage',
        discount_value: 10,
        minimum_order_amount: 20.00,
        usage_limit: 1000,
        valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      },
      {
        code: 'FREEDELIVERY',
        name: 'Free Delivery',
        description: 'Free delivery on orders over $30',
        discount_type: 'fixed',
        discount_value: 5.00,
        minimum_order_amount: 30.00,
        usage_limit: 500,
        valid_until: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000) // 60 days
      }
    ];

    for (const coupon of coupons) {
      await pool.query(`
        INSERT INTO coupons (
          code, name, description, discount_type, discount_value,
          minimum_order_amount, usage_limit, valid_until
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (code) DO NOTHING
      `, [
        coupon.code, coupon.name, coupon.description, coupon.discount_type,
        coupon.discount_value, coupon.minimum_order_amount, coupon.usage_limit, coupon.valid_until
      ]);
    }

    // Create loyalty points for customer
    if (customerResult.rows[0]) {
      await pool.query(`
        INSERT INTO loyalty_points (user_id, points, total_earned)
        VALUES ($1, $2, $3)
        ON CONFLICT (user_id) DO NOTHING
      `, [customerResult.rows[0].id, 100, 100]);
    }

    console.log('✅ Database seeding completed successfully!');
    console.log('👤 Admin credentials: admin@peprizzos.com / admin123');
    console.log('👤 Customer credentials: customer@example.com / customer123');
    console.log('🎫 Sample coupon codes: WELCOME10, FREEDELIVERY');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedData()
    .then(() => {
      console.log('🎉 Database seeding complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Database seeding failed:', error);
      process.exit(1);
    });
}

module.exports = seedData;
