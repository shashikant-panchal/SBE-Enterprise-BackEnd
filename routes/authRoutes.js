const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const store = require('../data/store');
const { JWT_SECRET, authenticateToken } = require('../middleware/authMiddleware');
const Admin = require('../models/Admin');
const Client = require('../models/Client');
const { isDbConnected } = require('../config/db');

/**
 * POST /api/auth/login
 * Handles Admin and Client HR authentication
 */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: 'Please provide both email and password.',
    });
  }

  const cleanEmail = email.trim().toLowerCase();

  try {
    // 1. Check for Admin Login
    if (isDbConnected()) {
      const adminRecord = await Admin.findOne({ email: cleanEmail });
      if (adminRecord) {
        if (password === adminRecord.password) {
          const userPayload = {
            name: adminRecord.name,
            email: adminRecord.email,
            role: adminRecord.role || 'admin',
            phone: adminRecord.phone,
          };
          const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '7d' });
          return res.status(200).json({
            success: true,
            message: 'Admin authentication successful.',
            token,
            user: userPayload,
          });
        } else {
          return res.status(401).json({
            success: false,
            error: 'Invalid administrator password.',
          });
        }
      }
    } else if (cleanEmail === store.admin.email.toLowerCase()) {
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
        return res.status(401).json({
          success: false,
          error: 'Invalid administrator password.',
        });
      }
    }

    // 2. Check for Client HR Login
    if (isDbConnected()) {
      const clientMatch = await Client.findOne({ contactEmail: cleanEmail });
      if (clientMatch) {
        if (clientMatch.password === password) {
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
        } else {
          return res.status(401).json({
            success: false,
            error: 'Invalid email or password. Please verify your credentials.',
          });
        }
      }
    } else {
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
    }

    // 3. Neither matched
    return res.status(401).json({
      success: false,
      error: 'Invalid email or password. Please verify your credentials.',
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal authentication error.',
    });
  }
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
