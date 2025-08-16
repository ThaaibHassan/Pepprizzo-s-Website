const express = require('express');
const router = express.Router();

// Demo loyalty data
const demoLoyaltyData = {
  points: 1250,
  tier: 'Gold',
  total_earned: 2500,
  total_redeemed: 1250,
  transactions: [
    {
      id: 1,
      type: 'earned',
      points: 150,
      description: 'Order PEP-2024-001',
      created_at: '2024-01-15T18:30:00Z'
    },
    {
      id: 2,
      type: 'redeemed',
      points: -500,
      description: 'Free Medium Pizza',
      created_at: '2024-01-10T14:20:00Z'
    },
    {
      id: 3,
      type: 'earned',
      points: 200,
      description: 'Order PEP-2024-002',
      created_at: '2024-01-08T19:15:00Z'
    }
  ],
  rewards: [
    {
      id: 1,
      name: 'Free Medium Pizza',
      points_required: 500,
      description: 'Get any medium pizza for free',
      is_available: true
    },
    {
      id: 2,
      name: 'Free Garlic Bread',
      points_required: 200,
      description: 'Get free garlic bread with any order',
      is_available: true
    },
    {
      id: 3,
      name: 'Free Large Pizza',
      points_required: 800,
      description: 'Get any large pizza for free',
      is_available: true
    },
    {
      id: 4,
      name: '50% Off Next Order',
      points_required: 1000,
      description: 'Get 50% off your next order',
      is_available: true
    }
  ]
};

// @route   GET /api/loyalty/points
// @desc    Get user loyalty points
// @access  Private
router.get('/points', async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        points: demoLoyaltyData.points,
        tier: demoLoyaltyData.tier,
        total_earned: demoLoyaltyData.total_earned,
        total_redeemed: demoLoyaltyData.total_redeemed
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

// @route   GET /api/loyalty/transactions
// @desc    Get loyalty transaction history
// @access  Private
router.get('/transactions', async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        transactions: demoLoyaltyData.transactions
      }
    });
  } catch (error) {
    console.error('Get loyalty transactions error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   GET /api/loyalty/rewards
// @desc    Get available rewards
// @access  Private
router.get('/rewards', async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        rewards: demoLoyaltyData.rewards
      }
    });
  } catch (error) {
    console.error('Get loyalty rewards error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   POST /api/loyalty/redeem
// @desc    Redeem loyalty points for reward
// @access  Private
router.post('/redeem', async (req, res) => {
  try {
    const { reward_id } = req.body;
    
    const reward = demoLoyaltyData.rewards.find(r => r.id === reward_id);
    if (!reward) {
      return res.status(404).json({
        success: false,
        error: 'Reward not found'
      });
    }
    
    if (demoLoyaltyData.points < reward.points_required) {
      return res.status(400).json({
        success: false,
        error: 'Insufficient points'
      });
    }
    
    // Update points
    demoLoyaltyData.points -= reward.points_required;
    demoLoyaltyData.total_redeemed += reward.points_required;
    
    // Add transaction
    const newTransaction = {
      id: demoLoyaltyData.transactions.length + 1,
      type: 'redeemed',
      points: -reward.points_required,
      description: reward.name,
      created_at: new Date().toISOString()
    };
    demoLoyaltyData.transactions.unshift(newTransaction);
    
    res.json({
      success: true,
      data: {
        message: `Successfully redeemed ${reward.name}`,
        remaining_points: demoLoyaltyData.points,
        reward
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
