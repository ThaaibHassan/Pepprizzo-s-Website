const express = require('express');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/payments/create-payment-intent
// @desc    Create payment intent (simplified for demo)
// @access  Private
router.post('/create-payment-intent', auth, async (req, res) => {
  try {
    const { amount, currency = 'usd' } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Valid amount is required'
      });
    }

    // For demo purposes, create a mock payment intent
    const paymentIntent = {
      id: `pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      status: 'requires_payment_method',
      client_secret: `pi_${Date.now()}_secret_${Math.random().toString(36).substr(2, 9)}`,
      created: Math.floor(Date.now() / 1000)
    };
    
    res.json({
      success: true,
      data: {
        payment_intent: paymentIntent
      }
    });

  } catch (error) {
    console.error('Create payment intent error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   POST /api/payments/confirm-payment
// @desc    Confirm payment (simplified for demo)
// @access  Private
router.post('/confirm-payment', auth, async (req, res) => {
  try {
    const { payment_intent_id, payment_method } = req.body;
    
    if (!payment_intent_id) {
      return res.status(400).json({
        success: false,
        error: 'Payment intent ID is required'
      });
    }

    // For demo purposes, simulate successful payment
    const payment = {
      id: payment_intent_id,
      status: 'succeeded',
      amount: 0, // Will be set from payment intent
      currency: 'usd',
      payment_method: payment_method || 'card',
      created: Math.floor(Date.now() / 1000),
      user_id: req.user.userId
    };
    
    res.json({
      success: true,
      data: {
        payment,
        message: 'Payment confirmed successfully'
      }
    });

  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   GET /api/payments/methods
// @desc    Get available payment methods
// @access  Private
router.get('/methods', auth, async (req, res) => {
  try {
    const paymentMethods = [
      {
        id: 'card',
        type: 'card',
        name: 'Credit/Debit Card',
        description: 'Pay with Visa, Mastercard, American Express, or Discover',
        is_available: true
      },
      {
        id: 'cash',
        type: 'cash',
        name: 'Cash on Delivery',
        description: 'Pay with cash when your order arrives',
        is_available: true
      }
    ];
    
    res.json({
      success: true,
      data: {
        payment_methods: paymentMethods
      }
    });

  } catch (error) {
    console.error('Get payment methods error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

module.exports = router;
