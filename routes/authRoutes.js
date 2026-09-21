const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const store = require('../data/store');
const { JWT_SECRET, authenticateToken } = require('../middleware/authMiddleware');

/**
 * POST /api/auth/login
 * Handles Admin and Client HR authentication
 */
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: 'Please provide both email and password.',
    });
  }

  const cleanEmail = email.trim().toLowerCase();

  // 1. Check for Admin Login
  if (cleanEmail === store.admin.email.toLowerCase()) {
    if (password === store.admin.password) {
      const userPayload = {
        name: store.admin.name,
        email: store.admin.email,
        role: 'admin',
        phone: store.admin.phone,
      };

      const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '7d' });

      return res.status(200).json({
        success: true,
        message: 'Admin authentication successful.',
        token,
        user: userPayload,
      });
    } else {
      // Strictly reject invalid password for admin
      return res.status(401).json({
        success: false,
        error: 'Invalid administrator password.',
      });
    }
  }

  // 2. Check for Client HR Login
  const clientMatch = store.validateClientHR(cleanEmail, password);
  if (clientMatch) {
    const userPayload = {
      name: clientMatch.contactPerson,
      email: clientMatch.contactEmail,
      company: clientMatch.name,
      clientId: clientMatch.id,
      role: 'client_hr',
      location: clientMatch.location,
    };

    const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '7d' });

    return res.status(200).json({
      success: true,
      message: 'Client HR authentication successful.',
      token,
      user: userPayload,
    });
  }

  // 3. Neither matched
  return res.status(401).json({
    success: false,
    error: 'Invalid email or password. Please verify your credentials.',
  });
});

/**
 * GET /api/auth/me
 * Retrieves current authenticated user profile
 */
router.get('/me', authenticateToken, (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

module.exports = router;
