const express = require('express');
const pool = require('../config/database');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Import demo data for mock database
const demoData = require('../config/database').demoData || {
  menuItems: []
};

// @route   GET /api/admin/menu
// @desc    Get all menu items for admin
// @access  Private (Admin)
router.get('/menu', protect, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Access denied. Admin privileges required.'
      });
    }

    res.json({
      success: true,
      data: {
        items: demoData.menuItems
      }
    });

  } catch (error) {
    console.error('Get admin menu error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   POST /api/admin/menu
// @desc    Add new menu item
// @access  Private (Admin)
router.post('/menu', protect, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Access denied. Admin privileges required.'
      });
    }

    const {
      name,
      description,
      price,
      category,
      image_url,
      is_vegetarian = false,
      is_spicy = false,
      is_featured = false,
      available_sizes = [],
      available_crusts = [],
      available_toppings = []
    } = req.body;

    // Validate required fields
    if (!name || !description || !price || !category) {
      return res.status(400).json({
        success: false,
        error: 'Name, description, price, and category are required'
      });
    }

    // Create new menu item
    const newItem = {
      id: demoData.menuItems.length + 1,
      name,
      description,
      price: parseFloat(price),
      category,
      image_url: image_url || 'https://via.placeholder.com/400x300?text=Pizza',
      is_vegetarian: Boolean(is_vegetarian),
      is_spicy: Boolean(is_spicy),
      is_featured: Boolean(is_featured),
      available_sizes: Array.isArray(available_sizes) ? available_sizes : [],
      available_crusts: Array.isArray(available_crusts) ? available_crusts : [],
      available_toppings: Array.isArray(available_toppings) ? available_toppings : []
    };

    // Add to demo data
    demoData.menuItems.push(newItem);

    res.status(201).json({
      success: true,
      data: {
        menu_item: newItem
      }
    });

  } catch (error) {
    console.error('Add menu item error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   PUT /api/admin/menu/:id
// @desc    Update menu item
// @access  Private (Admin)
router.put('/menu/:id', protect, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Access denied. Admin privileges required.'
      });
    }

    const { id } = req.params;
    const updates = req.body;

    // Find menu item
    const itemIndex = demoData.menuItems.findIndex(item => item.id === parseInt(id));
    
    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Menu item not found'
      });
    }

    // Update item
    const updatedItem = {
      ...demoData.menuItems[itemIndex],
      ...updates,
      id: parseInt(id), // Ensure ID doesn't change
      price: updates.price ? parseFloat(updates.price) : demoData.menuItems[itemIndex].price
    };

    demoData.menuItems[itemIndex] = updatedItem;

    res.json({
      success: true,
      data: {
        menu_item: updatedItem
      }
    });

  } catch (error) {
    console.error('Update menu item error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   DELETE /api/admin/menu/:id
// @desc    Delete menu item
// @access  Private (Admin)
router.delete('/menu/:id', protect, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Access denied. Admin privileges required.'
      });
    }

    const { id } = req.params;

    // Find menu item
    const itemIndex = demoData.menuItems.findIndex(item => item.id === parseInt(id));
    
    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Menu item not found'
      });
    }

    // Remove item
    demoData.menuItems.splice(itemIndex, 1);

    res.json({
      success: true,
      message: 'Menu item deleted successfully'
    });

  } catch (error) {
    console.error('Delete menu item error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard data
// @access  Private (Admin)
router.get('/dashboard', protect, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Access denied. Admin privileges required.'
      });
    }

    // Calculate dashboard stats
    const totalMenuItems = demoData.menuItems.length;
    const featuredItems = demoData.menuItems.filter(item => item.is_featured).length;
    const totalOrders = demoData.orders.length;
    const totalUsers = demoData.users.length;

    // Recent orders
    const recentOrders = demoData.orders
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 5);

    // Category breakdown
    const categoryStats = {};
    demoData.menuItems.forEach(item => {
      categoryStats[item.category] = (categoryStats[item.category] || 0) + 1;
    });

    res.json({
      success: true,
      data: {
        stats: {
          totalMenuItems,
          featuredItems,
          totalOrders,
          totalUsers
        },
        recentOrders,
        categoryStats
      }
    });

  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   GET /api/admin/orders
// @desc    Get all orders for admin
// @access  Private (Admin)
router.get('/orders', protect, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Access denied. Admin privileges required.'
      });
    }

    // Enhance orders with customer information
    const ordersWithCustomerInfo = demoData.orders.map(order => {
      const customer = demoData.users.find(user => user.id === order.user_id);
      return {
        ...order,
        customer_name: customer ? `${customer.first_name} ${customer.last_name}` : 'Unknown Customer',
        customer_email: customer ? customer.email : 'unknown@example.com',
        total: order.total_amount // Map total_amount to total for frontend compatibility
      };
    });

    res.json({
      success: true,
      data: {
        orders: ordersWithCustomerInfo
      }
    });

  } catch (error) {
    console.error('Get admin orders error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   PUT /api/admin/orders/:id/status
// @desc    Update order status
// @access  Private (Admin)
router.put('/orders/:id/status', protect, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Access denied. Admin privileges required.'
      });
    }

    const { id } = req.params;
    const { status } = req.body;
    
    const order = demoData.orders.find(o => o.id === parseInt(id));
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }
    
    order.status = status;
    
    res.json({
      success: true,
      data: {
        order
      }
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   GET /api/admin/customers
// @desc    Get all customers for admin
// @access  Private (Admin)
router.get('/customers', protect, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Access denied. Admin privileges required.'
      });
    }

    // Filter customers and add order statistics
    const customers = demoData.users
      .filter(user => user.role === 'customer')
      .map(user => {
        // Calculate order statistics for this customer
        const customerOrders = demoData.orders.filter(order => order.user_id === user.id);
        const totalOrders = customerOrders.length;
        const totalSpent = customerOrders.reduce((sum, order) => sum + order.total_amount, 0);
        const lastOrder = customerOrders.length > 0 
          ? customerOrders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0].created_at
          : null;

        return {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          phone: user.phone,
          total_orders: totalOrders,
          total_spent: totalSpent,
          last_order: lastOrder || new Date().toISOString()
        };
      });

    res.json({
      success: true,
      data: {
        customers
      }
    });

  } catch (error) {
    console.error('Get admin customers error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

module.exports = router;
