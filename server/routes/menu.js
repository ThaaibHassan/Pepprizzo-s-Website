const express = require('express');
const pool = require('../config/database');

// Import demo data for mock database
const demoData = require('../config/database').demoData || {
  categories: [],
  menuItems: []
};

const router = express.Router();

// @route   GET /api/menu/categories
// @desc    Get all menu categories
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        categories: demoData.categories
      }
    });

  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   GET /api/menu
// @desc    Get all menu items with optional filters
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      category,
      vegetarian,
      spicy,
      featured,
      search,
      sort = 'name'
    } = req.query;

    let items = [...demoData.menuItems];

    // Apply filters
    if (category && category !== 'all') {
      items = items.filter(item => item.category === category);
    }

    if (vegetarian === 'true') {
      items = items.filter(item => item.is_vegetarian);
    }

    if (spicy === 'true') {
      items = items.filter(item => item.is_spicy);
    }

    if (featured === 'true') {
      items = items.filter(item => item.is_featured);
    }

    if (search) {
      items = items.filter(item => 
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply sorting
    if (sort === 'price_low') {
      items.sort((a, b) => a.price - b.price);
    } else if (sort === 'price_high') {
      items.sort((a, b) => b.price - a.price);
    } else {
      items.sort((a, b) => a.name.localeCompare(b.name));
    }

    res.json({
      success: true,
      data: {
        menu_items: items,
        total: items.length,
        filters: {
          category,
          vegetarian,
          spicy,
          featured,
          search
        }
      }
    });

  } catch (error) {
    console.error('Get menu items error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   GET /api/menu/featured
// @desc    Get featured menu items (for home page)
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    // Get featured items from mock database
    const featuredItems = demoData.menuItems.filter(item => item.is_featured);
    
    // Group by category
    const categories = demoData.categories.slice(0, 3);
    const groupedItems = categories.map(category => ({
      category,
      items: featuredItems.filter(item => item.category === category.name).slice(0, 4)
    }));

    res.json({
      success: true,
      data: {
        featured_items: groupedItems
      }
    });

  } catch (error) {
    console.error('Get featured menu error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   GET /api/menu/:id
// @desc    Get specific menu item
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`
      SELECT 
        mi.id,
        mi.name,
        mi.description,
        mi.price,
        mi.image_url,
        mi.is_vegetarian,
        mi.is_vegan,
        mi.is_gluten_free,
        mi.is_spicy,
        mi.preparation_time,
        mi.calories,
        mi.allergens,
        mi.customizations,
        c.name as category_name,
        c.id as category_id
      FROM menu_items mi
      LEFT JOIN categories c ON mi.category_id = c.id
      WHERE mi.id = $1 AND mi.is_available = true
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Menu item not found'
      });
    }

    res.json({
      success: true,
      data: {
        menu_item: result.rows[0]
      }
    });

  } catch (error) {
    console.error('Get menu item error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   GET /api/menu/category/:categoryId
// @desc    Get menu items by category
// @access  Public
router.get('/category/:categoryId', async (req, res) => {
  try {
    const { categoryId } = req.params;

    // First check if category exists
    const categoryResult = await pool.query(`
      SELECT id, name, description, image_url
      FROM categories 
      WHERE id = $1 AND is_active = true
    `, [categoryId]);

    if (categoryResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }

    const category = categoryResult.rows[0];

    // Get menu items for this category
    const menuResult = await pool.query(`
      SELECT 
        id,
        name,
        description,
        price,
        image_url,
        is_vegetarian,
        is_vegan,
        is_gluten_free,
        is_spicy,
        preparation_time,
        calories,
        allergens,
        customizations
      FROM menu_items 
      WHERE category_id = $1 AND is_available = true
      ORDER BY name ASC
    `, [categoryId]);

    res.json({
      success: true,
      data: {
        category,
        menu_items: menuResult.rows,
        total: menuResult.rows.length
      }
    });

  } catch (error) {
    console.error('Get category menu error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   GET /api/menu/search
// @desc    Search menu items
// @access  Public
router.get('/search', async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;

    if (!q || q.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Search query is required'
      });
    }

    const result = await pool.query(`
      SELECT 
        mi.id,
        mi.name,
        mi.description,
        mi.price,
        mi.image_url,
        mi.is_vegetarian,
        mi.is_vegan,
        mi.is_gluten_free,
        mi.is_spicy,
        c.name as category_name
      FROM menu_items mi
      LEFT JOIN categories c ON mi.category_id = c.id
      WHERE mi.is_available = true 
        AND (mi.name ILIKE $1 OR mi.description ILIKE $1)
      ORDER BY 
        CASE 
          WHEN mi.name ILIKE $1 THEN 1
          ELSE 2
        END,
        mi.name ASC
      LIMIT $2
    `, [`%${q.trim()}%`, parseInt(limit)]);

    res.json({
      success: true,
      data: {
        search_results: result.rows,
        total: result.rows.length,
        query: q.trim()
      }
    });

  } catch (error) {
    console.error('Search menu error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   GET /api/menu/filters
// @desc    Get available filters for menu items
// @access  Public
router.get('/filters', async (req, res) => {
  try {
    // Get dietary filters counts
    const dietaryResult = await pool.query(`
      SELECT 
        COUNT(*) FILTER (WHERE is_vegetarian = true) as vegetarian_count,
        COUNT(*) FILTER (WHERE is_vegan = true) as vegan_count,
        COUNT(*) FILTER (WHERE is_gluten_free = true) as gluten_free_count,
        COUNT(*) FILTER (WHERE is_spicy = true) as spicy_count
      FROM menu_items 
      WHERE is_available = true
    `);

    // Get price ranges
    const priceResult = await pool.query(`
      SELECT 
        MIN(price) as min_price,
        MAX(price) as max_price,
        AVG(price) as avg_price
      FROM menu_items 
      WHERE is_available = true
    `);

    // Get all allergens
    const allergensResult = await pool.query(`
      SELECT DISTINCT unnest(allergens) as allergen
      FROM menu_items 
      WHERE is_available = true AND allergens IS NOT NULL
      ORDER BY allergen
    `);

    res.json({
      success: true,
      data: {
        dietary: dietaryResult.rows[0],
        price_range: priceResult.rows[0],
        allergens: allergensResult.rows.map(row => row.allergen)
      }
    });

  } catch (error) {
    console.error('Get filters error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

module.exports = router;
