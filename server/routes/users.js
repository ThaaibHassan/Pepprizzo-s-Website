const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../config/database');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users/addresses
// @desc    Get user's addresses
// @access  Private
router.get('/addresses', protect, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, type, address_line1, address_line2, city, state, postal_code, country, is_default
      FROM addresses 
      WHERE user_id = $1
      ORDER BY is_default DESC, created_at ASC
    `, [req.user.id]);

    res.json({
      success: true,
      data: {
        addresses: result.rows
      }
    });

  } catch (error) {
    console.error('Get addresses error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   POST /api/users/addresses
// @desc    Add new address
// @access  Private
router.post('/addresses', protect, [
  body('type').isIn(['home', 'work', 'other']).withMessage('Type must be home, work, or other'),
  body('address_line1').notEmpty().trim().withMessage('Address line 1 is required'),
  body('city').notEmpty().trim().withMessage('City is required'),
  body('state').notEmpty().trim().withMessage('State is required'),
  body('postal_code').notEmpty().trim().withMessage('Postal code is required'),
  body('country').optional().isString().withMessage('Country must be a string'),
  body('is_default').optional().isBoolean().withMessage('is_default must be a boolean')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const {
      type,
      address_line1,
      address_line2,
      city,
      state,
      postal_code,
      country = 'USA',
      is_default = false
    } = req.body;

    // If this is the default address, unset other defaults
    if (is_default) {
      await pool.query(`
        UPDATE addresses 
        SET is_default = false 
        WHERE user_id = $1
      `, [req.user.id]);
    }

    // Add new address
    const result = await pool.query(`
      INSERT INTO addresses (
        user_id, type, address_line1, address_line2, city, state, postal_code, country, is_default
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id, type, address_line1, address_line2, city, state, postal_code, country, is_default
    `, [req.user.id, type, address_line1, address_line2, city, state, postal_code, country, is_default]);

    res.status(201).json({
      success: true,
      message: 'Address added successfully',
      data: {
        address: result.rows[0]
      }
    });

  } catch (error) {
    console.error('Add address error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   PUT /api/users/addresses/:id
// @desc    Update address
// @access  Private
router.put('/addresses/:id', protect, [
  body('type').optional().isIn(['home', 'work', 'other']).withMessage('Type must be home, work, or other'),
  body('address_line1').optional().notEmpty().trim().withMessage('Address line 1 cannot be empty'),
  body('city').optional().notEmpty().trim().withMessage('City cannot be empty'),
  body('state').optional().notEmpty().trim().withMessage('State cannot be empty'),
  body('postal_code').optional().notEmpty().trim().withMessage('Postal code cannot be empty'),
  body('country').optional().isString().withMessage('Country must be a string'),
  body('is_default').optional().isBoolean().withMessage('is_default must be a boolean')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { id } = req.params;
    const {
      type,
      address_line1,
      address_line2,
      city,
      state,
      postal_code,
      country,
      is_default
    } = req.body;

    // Check if address belongs to user
    const existingAddress = await pool.query(`
      SELECT id FROM addresses WHERE id = $1 AND user_id = $2
    `, [id, req.user.id]);

    if (existingAddress.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Address not found'
      });
    }

    // If setting as default, unset other defaults
    if (is_default) {
      await pool.query(`
        UPDATE addresses 
        SET is_default = false 
        WHERE user_id = $1 AND id != $2
      `, [req.user.id, id]);
    }

    // Update address
    const result = await pool.query(`
      UPDATE addresses 
      SET type = COALESCE($1, type),
          address_line1 = COALESCE($2, address_line1),
          address_line2 = COALESCE($3, address_line2),
          city = COALESCE($4, city),
          state = COALESCE($5, state),
          postal_code = COALESCE($6, postal_code),
          country = COALESCE($7, country),
          is_default = COALESCE($8, is_default),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $9 AND user_id = $10
      RETURNING id, type, address_line1, address_line2, city, state, postal_code, country, is_default
    `, [type, address_line1, address_line2, city, state, postal_code, country, is_default, id, req.user.id]);

    res.json({
      success: true,
      message: 'Address updated successfully',
      data: {
        address: result.rows[0]
      }
    });

  } catch (error) {
    console.error('Update address error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   DELETE /api/users/addresses/:id
// @desc    Delete address
// @access  Private
router.delete('/addresses/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if address belongs to user
    const existingAddress = await pool.query(`
      SELECT id, is_default FROM addresses WHERE id = $1 AND user_id = $2
    `, [id, req.user.id]);

    if (existingAddress.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Address not found'
      });
    }

    // Delete address
    await pool.query(`
      DELETE FROM addresses WHERE id = $1 AND user_id = $2
    `, [id, req.user.id]);

    // If deleted address was default, set another as default
    if (existingAddress.rows[0].is_default) {
      const newDefault = await pool.query(`
        SELECT id FROM addresses WHERE user_id = $1 ORDER BY created_at ASC LIMIT 1
      `, [req.user.id]);

      if (newDefault.rows.length > 0) {
        await pool.query(`
          UPDATE addresses SET is_default = true WHERE id = $1
        `, [newDefault.rows[0].id]);
      }
    }

    res.json({
      success: true,
      message: 'Address deleted successfully'
    });

  } catch (error) {
    console.error('Delete address error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   GET /api/users/orders
// @desc    Get user's order history
// @access  Private
router.get('/orders', protect, async (req, res) => {
  try {
    const { status, limit = 10, offset = 0 } = req.query;

    let query = `
      SELECT 
        o.id,
        o.order_number,
        o.status,
        o.order_type,
        o.total_amount,
        o.created_at,
        o.estimated_delivery_time,
        o.actual_delivery_time
      FROM orders o
      WHERE o.user_id = $1
    `;

    const params = [req.user.id];
    let paramCount = 1;

    if (status) {
      paramCount++;
      query += ` AND o.status = $${paramCount}`;
      params.push(status);
    }

    query += ` ORDER BY o.created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(parseInt(limit), parseInt(offset));

    const result = await pool.query(query, params);

    res.json({
      success: true,
      data: {
        orders: result.rows,
        total: result.rows.length
      }
    });

  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

module.exports = router;
