const express = require('express');
const { loyaltyStore } = require('../data/inMemoryStore');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/loyalty/points
// @desc    Get user loyalty points
// @access  Private
router.get('/points', auth, async (req, res) => {
  try {
    const points = loyaltyStore.getPoints(req.user.userId);
    
    res.json({
      success: true,
      data: {
        points,
        user_id: req.user.userId
      }
    });

  } catch (error) {
    console.error('Get loyalty points error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   POST /api/loyalty/earn
// @desc    Earn loyalty points from order
// @access  Private
router.post('/earn', auth, async (req, res) => {
  try {
    const { points, order_id } = req.body;
    
    if (!points || points <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Valid points amount is required'
      });
    }

    const newBalance = loyaltyStore.addPoints(req.user.userId, points);
    
    res.json({
      success: true,
      data: {
        points_earned: points,
        new_balance: newBalance,
        user_id: req.user.userId
      }
    });

  } catch (error) {
    console.error('Earn loyalty points error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   POST /api/loyalty/redeem
// @desc    Redeem loyalty points
// @access  Private
router.post('/redeem', auth, async (req, res) => {
  try {
    const { points } = req.body;
    
    if (!points || points <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Valid points amount is required'
      });
    }

    const newBalance = loyaltyStore.deductPoints(req.user.userId, points);
    
    if (newBalance === false) {
      return res.status(400).json({
        success: false,
        error: 'Insufficient points'
      });
    }
    
    res.json({
      success: true,
      data: {
        points_redeemed: points,
        new_balance: newBalance,
        user_id: req.user.userId
      }
    });

  } catch (error) {
    console.error('Redeem loyalty points error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

module.exports = router;
