const express = require('express');
const router = express.Router();

// Demo orders data
const demoOrders = [
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
    user_id: 1,
    status: 'pending',
    total_amount: 25.98,
    created_at: '2024-01-15T20:00:00Z',
    delivery_address: '123 Main St, Downtown, City, State 12345',
    items: [
      { id: 3, name: 'BBQ Chicken Pizza', quantity: 1, price: 18.99 },
      { id: 5, name: 'Caesar Salad', quantity: 1, price: 8.99 }
    ]
  }
];

// @route   GET /api/orders
// @desc    Get user orders
// @access  Private
router.get('/', async (req, res) => {
  try {
    // For demo, return all orders for user_id 1
    const userOrders = demoOrders.filter(order => order.user_id === 1);
    
    res.json({
      success: true,
      data: {
        orders: userOrders
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   GET /api/orders/:id
// @desc    Get specific order
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const order = demoOrders.find(o => o.id === parseInt(id) && o.user_id === 1);
    
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
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   POST /api/orders
// @desc    Create new order
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { items, delivery_address, delivery_type } = req.body;
    
    // Calculate total
    const total_amount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Create new order
    const newOrder = {
      id: demoOrders.length + 1,
      order_number: `PEP-2024-${String(demoOrders.length + 1).padStart(3, '0')}`,
      user_id: 1,
      status: 'pending',
      total_amount,
      created_at: new Date().toISOString(),
      delivery_address,
      delivery_type,
      items
    };
    
    demoOrders.push(newOrder);

    res.status(201).json({
      success: true,
      data: {
        order: newOrder
      }
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

module.exports = router;
