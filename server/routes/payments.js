const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const pool = require('../config/database');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/payments/create-payment-intent
// @desc    Create a payment intent for an order
// @access  Private
router.post('/create-payment-intent', protect, async (req, res) => {
  try {
    const { order_id, amount, currency = 'usd' } = req.body;

    if (!order_id || !amount) {
      return res.status(400).json({
        success: false,
        error: 'Order ID and amount are required'
      });
    }

    // Verify order belongs to user
    const orderResult = await pool.query(`
      SELECT id, order_number, total_amount, payment_status
      FROM orders 
      WHERE id = $1 AND user_id = $2
    `, [order_id, req.user.id]);

    if (orderResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    const order = orderResult.rows[0];

    // Check if order is already paid
    if (order.payment_status === 'paid') {
      return res.status(400).json({
        success: false,
        error: 'Order is already paid'
      });
    }

    // Verify amount matches order total
    if (parseFloat(amount) !== parseFloat(order.total_amount)) {
      return res.status(400).json({
        success: false,
        error: 'Payment amount does not match order total'
      });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency,
      metadata: {
        order_id: order.id,
        order_number: order.order_number,
        user_id: req.user.id
      }
    });

    // Update order with payment intent ID
    await pool.query(`
      UPDATE orders 
      SET stripe_payment_intent_id = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
    `, [paymentIntent.id, order_id]);

    res.json({
      success: true,
      data: {
        client_secret: paymentIntent.client_secret,
        payment_intent_id: paymentIntent.id
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
// @desc    Confirm payment and update order status
// @access  Private
router.post('/confirm-payment', protect, async (req, res) => {
  try {
    const { payment_intent_id, order_id } = req.body;

    if (!payment_intent_id || !order_id) {
      return res.status(400).json({
        success: false,
        error: 'Payment intent ID and order ID are required'
      });
    }

    // Verify payment intent
    const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent_id);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({
        success: false,
        error: 'Payment not completed'
      });
    }

    // Verify order belongs to user
    const orderResult = await pool.query(`
      SELECT id, order_number, total_amount, payment_status, user_id
      FROM orders 
      WHERE id = $1 AND user_id = $2
    `, [order_id, req.user.id]);

    if (orderResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    const order = orderResult.rows[0];

    // Update order payment status
    await pool.query(`
      UPDATE orders 
      SET payment_status = 'paid', updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
    `, [order_id]);

    // Award loyalty points (1 point per $1 spent)
    const pointsToAward = Math.floor(order.total_amount);
    if (pointsToAward > 0) {
      await pool.query(`
        INSERT INTO loyalty_transactions (user_id, order_id, type, points, description)
        VALUES ($1, $2, $3, $4, $5)
      `, [req.user.id, order_id, 'earned', pointsToAward, 'Order completed']);

      await pool.query(`
        UPDATE loyalty_points 
        SET points = points + $1,
            total_earned = total_earned + $1,
            last_activity = CURRENT_TIMESTAMP
        WHERE user_id = $2
      `, [pointsToAward, req.user.id]);
    }

    // Emit real-time update
    const io = req.app.get('io');
    io.to(`order-${order_id}`).emit('order-update', {
      order_id: order_id,
      status: 'confirmed',
      payment_status: 'paid',
      timestamp: new Date().toISOString()
    });

    res.json({
      success: true,
      message: 'Payment confirmed successfully',
      data: {
        order_id: order_id,
        payment_status: 'paid',
        loyalty_points_earned: pointsToAward
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

// @route   POST /api/payments/webhook
// @desc    Handle Stripe webhooks
// @access  Public
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object);
        break;
      case 'payment_intent.payment_failed':
        await handlePaymentFailure(event.data.object);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
});

// Handle successful payment
const handlePaymentSuccess = async (paymentIntent) => {
  const { order_id, user_id } = paymentIntent.metadata;

  if (!order_id) {
    console.error('No order_id in payment intent metadata');
    return;
  }

  try {
    // Update order payment status
    await pool.query(`
      UPDATE orders 
      SET payment_status = 'paid', updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
    `, [order_id]);

    // Award loyalty points
    const orderResult = await pool.query(`
      SELECT total_amount FROM orders WHERE id = $1
    `, [order_id]);

    if (orderResult.rows.length > 0) {
      const pointsToAward = Math.floor(orderResult.rows[0].total_amount);
      if (pointsToAward > 0) {
        await pool.query(`
          INSERT INTO loyalty_transactions (user_id, order_id, type, points, description)
          VALUES ($1, $2, $3, $4, $5)
        `, [user_id, order_id, 'earned', pointsToAward, 'Order completed']);

        await pool.query(`
          UPDATE loyalty_points 
          SET points = points + $1,
              total_earned = total_earned + $1,
              last_activity = CURRENT_TIMESTAMP
          WHERE user_id = $2
        `, [pointsToAward, user_id]);
      }
    }

    console.log(`Payment succeeded for order ${order_id}`);
  } catch (error) {
    console.error('Error handling payment success:', error);
  }
};

// Handle failed payment
const handlePaymentFailure = async (paymentIntent) => {
  const { order_id } = paymentIntent.metadata;

  if (!order_id) {
    console.error('No order_id in payment intent metadata');
    return;
  }

  try {
    // Update order payment status
    await pool.query(`
      UPDATE orders 
      SET payment_status = 'failed', updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
    `, [order_id]);

    console.log(`Payment failed for order ${order_id}`);
  } catch (error) {
    console.error('Error handling payment failure:', error);
  }
};

// @route   GET /api/payments/methods
// @desc    Get user's saved payment methods
// @access  Private
router.get('/methods', protect, async (req, res) => {
  try {
    // Get user's Stripe customer ID (you might want to store this in your users table)
    // For now, we'll return an empty array
    res.json({
      success: true,
      data: {
        payment_methods: []
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

// @route   POST /api/payments/refund
// @desc    Process refund for an order
// @access  Private (Admin)
router.post('/refund', protect, async (req, res) => {
  try {
    const { order_id, amount, reason } = req.body;

    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to process refunds'
      });
    }

    if (!order_id || !amount) {
      return res.status(400).json({
        success: false,
        error: 'Order ID and amount are required'
      });
    }

    // Get order details
    const orderResult = await pool.query(`
      SELECT id, order_number, total_amount, stripe_payment_intent_id, payment_status
      FROM orders 
      WHERE id = $1
    `, [order_id]);

    if (orderResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    const order = orderResult.rows[0];

    if (order.payment_status !== 'paid') {
      return res.status(400).json({
        success: false,
        error: 'Order is not paid'
      });
    }

    if (!order.stripe_payment_intent_id) {
      return res.status(400).json({
        success: false,
        error: 'No payment intent found for this order'
      });
    }

    // Process refund through Stripe
    const refund = await stripe.refunds.create({
      payment_intent: order.stripe_payment_intent_id,
      amount: Math.round(amount * 100), // Convert to cents
      reason: reason || 'requested_by_customer'
    });

    // Update order payment status
    await pool.query(`
      UPDATE orders 
      SET payment_status = 'refunded', updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
    `, [order_id]);

    res.json({
      success: true,
      message: 'Refund processed successfully',
      data: {
        refund_id: refund.id,
        amount: amount,
        status: refund.status
      }
    });

  } catch (error) {
    console.error('Process refund error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

module.exports = router;
