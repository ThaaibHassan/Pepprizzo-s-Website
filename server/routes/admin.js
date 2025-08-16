const express = require('express');
const { menuStore, orderStore, userStore } = require('../data/inMemoryStore');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Apply admin auth to all routes
router.use(auth, adminAuth);

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard data
// @access  Private/Admin
router.get('/dashboard', async (req, res) => {
  try {
    const allOrders = orderStore.getOrders();
    const allUsers = userStore.getAllUsers();
    const allMenuItems = menuStore.getMenuItems();
    
    const dashboardData = {
      total_orders: allOrders.length,
      total_users: allUsers.length,
      total_menu_items: allMenuItems.length,
      recent_orders: allOrders.slice(-5).reverse(),
      order_status_counts: {
        pending: allOrders.filter(o => o.status === 'pending').length,
        confirmed: allOrders.filter(o => o.status === 'confirmed').length,
        preparing: allOrders.filter(o => o.status === 'preparing').length,
        ready: allOrders.filter(o => o.status === 'ready').length,
        delivered: allOrders.filter(o => o.status === 'delivered').length,
        cancelled: allOrders.filter(o => o.status === 'cancelled').length
      }
    };
    
    res.json({
      success: true,
      data: dashboardData
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
// @desc    Get all orders (admin view)
// @access  Private/Admin
router.get('/orders', async (req, res) => {
  try {
    const allOrders = orderStore.getOrders();
    
    res.json({
      success: true,
      data: {
        orders: allOrders
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

// @route   GET /api/admin/orders/:id
// @desc    Get order details (admin view)
// @access  Private/Admin
router.get('/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const order = orderStore.getOrder(id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: {
        order
      }
    });

  } catch (error) {
    console.error('Get admin order error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   PUT /api/admin/orders/:id/status
// @desc    Update order status
// @access  Private/Admin
router.put('/orders/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({
        success: false,
        error: 'Status is required'
      });
    }

    const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status'
      });
    }

    const updatedOrder = orderStore.updateOrderStatus(id, status);
    
    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: {
        order: updatedOrder
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

// @route   GET /api/admin/menu
// @desc    Get all menu items (admin view)
// @access  Private/Admin
router.get('/menu', async (req, res) => {
  try {
    const allMenuItems = menuStore.getMenuItems();
    
    res.json({
      success: true,
      data: {
        menu_items: allMenuItems
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
// @access  Private/Admin
router.post('/menu', async (req, res) => {
  try {
    const { name, description, price, category, is_vegetarian, is_spicy, is_featured } = req.body;
    
    if (!name || !description || !price || !category) {
      return res.status(400).json({
        success: false,
        error: 'Name, description, price, and category are required'
      });
    }

    const newMenuItem = menuStore.addMenuItem({
      name,
      description,
      price: parseFloat(price),
      category,
      is_vegetarian: is_vegetarian || false,
      is_spicy: is_spicy || false,
      is_featured: is_featured || false,
      image_url: '/placeholder-pizza.svg',
      available_sizes: ['Small', 'Medium', 'Large'],
      available_crusts: ['Classic', 'Thin', 'Stuffed'],
      available_toppings: []
    });

    res.status(201).json({
      success: true,
      data: {
        menu_item: newMenuItem
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
// @access  Private/Admin
router.put('/menu/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const updatedMenuItem = menuStore.updateMenuItem(id, updates);
    
    if (!updatedMenuItem) {
      return res.status(404).json({
        success: false,
        error: 'Menu item not found'
      });
    }

    res.json({
      success: true,
      data: {
        menu_item: updatedMenuItem
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
// @access  Private/Admin
router.delete('/menu/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedMenuItem = menuStore.deleteMenuItem(id);
    
    if (!deletedMenuItem) {
      return res.status(404).json({
        success: false,
        error: 'Menu item not found'
      });
    }

    res.json({
      success: true,
      data: {
        message: 'Menu item deleted successfully',
        deleted_item: deletedMenuItem
      }
    });

  } catch (error) {
    console.error('Delete menu item error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   GET /api/admin/customers
// @desc    Get all customers
// @access  Private/Admin
router.get('/customers', async (req, res) => {
  try {
    const allUsers = userStore.getAllUsers();
    const customers = allUsers.filter(user => user.role === 'customer');
    
    res.json({
      success: true,
      data: {
        customers
      }
    });

  } catch (error) {
    console.error('Get customers error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

module.exports = router;
