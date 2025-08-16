const express = require('express');
const { userStore } = require('../data/inMemoryStore');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    const user = userStore.getUser(req.user.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      data: {
        user: userWithoutPassword
      }
    });

  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, async (req, res) => {
  try {
    const { first_name, last_name, phone } = req.body;
    
    if (!first_name || !last_name) {
      return res.status(400).json({
        success: false,
        error: 'First name and last name are required'
      });
    }

    const updatedUser = userStore.updateUser(req.user.userId, {
      first_name,
      last_name,
      phone: phone || null
    });
    
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = updatedUser;

    res.json({
      success: true,
      data: {
        user: userWithoutPassword
      }
    });

  } catch (error) {
    console.error('Update user profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   GET /api/users/addresses
// @desc    Get user addresses
// @access  Private
router.get('/addresses', auth, async (req, res) => {
  try {
    // For demo purposes, return empty addresses array
    // In a real app, you'd store addresses in the user object or separate table
    res.json({
      success: true,
      data: {
        addresses: []
      }
    });

  } catch (error) {
    console.error('Get user addresses error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   POST /api/users/addresses
// @desc    Add user address
// @access  Private
router.post('/addresses', auth, async (req, res) => {
  try {
    const { street, city, state, zip_code, is_default } = req.body;
    
    if (!street || !city || !state || !zip_code) {
      return res.status(400).json({
        success: false,
        error: 'Street, city, state, and zip code are required'
      });
    }

    // For demo purposes, just return success
    // In a real app, you'd save the address
    res.status(201).json({
      success: true,
      data: {
        message: 'Address added successfully'
      }
    });

  } catch (error) {
    console.error('Add user address error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

module.exports = router;
