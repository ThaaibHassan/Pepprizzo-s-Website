const express = require('express');
const { menuStore } = require('../data/inMemoryStore');

const router = express.Router();

// @route   GET /api/menu/categories
// @desc    Get all menu categories
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = menuStore.getCategories();
    res.json({
      success: true,
      data: {
        categories: categories
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

    let items = menuStore.getMenuItems({
      category,
      vegetarian,
      spicy,
      featured,
      search
    });

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
// @desc    Get featured menu items
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const featuredItems = menuStore.getMenuItems({ featured: 'true' });
    
    res.json({
      success: true,
      data: {
        featured_items: featuredItems
      }
    });

  } catch (error) {
    console.error('Get featured items error:', error);
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
    const { q: searchQuery } = req.query;
    
    if (!searchQuery) {
      return res.status(400).json({
        success: false,
        error: 'Search query is required'
      });
    }

    const searchResults = menuStore.getMenuItems({ search: searchQuery });
    
    res.json({
      success: true,
      data: {
        search_results: searchResults,
        total: searchResults.length,
        query: searchQuery
      }
    });

  } catch (error) {
    console.error('Search menu items error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   GET /api/menu/filters
// @desc    Get available filters for menu
// @access  Public
router.get('/filters', async (req, res) => {
  try {
    const categories = menuStore.getCategories();
    const allItems = menuStore.getMenuItems();
    
    const filters = {
      categories: categories.map(cat => ({
        value: cat.name,
        label: cat.display_name,
        count: allItems.filter(item => item.category === cat.name).length
      })),
      price_range: {
        min: Math.min(...allItems.map(item => item.price)),
        max: Math.max(...allItems.map(item => item.price))
      },
      dietary_options: {
        vegetarian: allItems.filter(item => item.is_vegetarian).length,
        spicy: allItems.filter(item => item.is_spicy).length
      }
    };
    
    res.json({
      success: true,
      data: filters
    });

  } catch (error) {
    console.error('Get filters error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   GET /api/menu/:id
// @desc    Get menu item by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const menuItem = menuStore.getMenuItem(id);
    
    if (!menuItem) {
      return res.status(404).json({
        success: false,
        error: 'Menu item not found'
      });
    }
    
    res.json({
      success: true,
      data: {
        menu_item: menuItem
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

// @route   GET /api/menu/category/:category
// @desc    Get menu items by category
// @access  Public
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const categoryItems = menuStore.getMenuItems({ category });
    
    res.json({
      success: true,
      data: {
        category_items: categoryItems,
        total: categoryItems.length,
        category: category
      }
    });

  } catch (error) {
    console.error('Get category items error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

module.exports = router;
