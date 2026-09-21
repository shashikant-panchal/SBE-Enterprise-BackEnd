const express = require('express');
const router = express.Router();
const store = require('../data/store');
const { generateStrongPassword } = require('../utils/passwordGenerator');
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');

/**
 * GET /api/clients
 * Retrieve client companies (Public/Client HR/Admin)
 */
router.get('/', (req, res) => {
  const clients = store.getAllClients();
  res.status(200).json({
    success: true,
    count: clients.length,
    clients,
  });
});

/**
 * GET /api/clients/:id
 * Retrieve a specific client company
 */
router.get('/:id', (req, res) => {
  const client = store.getClientById(req.params.id);
  if (!client) {
    return res.status(404).json({ success: false, error: 'Client company not found.' });
  }
  res.status(200).json({ success: true, client });
});

/**
 * POST /api/clients
 * Admin adds a new client company with an auto-generated or custom strong password
 */
router.post('/', (req, res) => {
  const {
    name,
    industry,
    location,
    assignedWorkers,
    activeShifts,
    contactPerson,
    contactEmail,
    contactPhone,
    contractStatus,
    password,
  } = req.body;

  if (!name || !contactPerson) {
    return res.status(400).json({
      success: false,
      error: 'Client company name and contact person are required.',
    });
  }

  // Generate strong password if not explicitly provided or if requested
  const securePassword = password && password.trim().length >= 8
    ? password.trim()
    : generateStrongPassword(16);

  const newClient = store.addClient({
    name,
    industry,
    location,
    assignedWorkers,
    activeShifts,
    contactPerson,
    contactEmail,
    contactPhone,
    contractStatus,
    password: securePassword,
  });

  res.status(201).json({
    success: true,
    message: 'Client company registered successfully.',
    client: newClient,
    generatedPassword: securePassword,
  });
});

/**
 * PUT /api/clients/:id
 * Update an existing client company
 */
router.put('/:id', (req, res) => {
  const updated = store.updateClient(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, error: 'Client company not found.' });
  }
  res.status(200).json({
    success: true,
    message: 'Client company updated successfully.',
    client: updated,
  });
});

/**
 * DELETE /api/clients/:id
 * Remove a client company
 */
router.delete('/:id', (req, res) => {
  const success = store.deleteClient(req.params.id);
  if (!success) {
    return res.status(404).json({ success: false, error: 'Client company not found.' });
  }
  res.status(200).json({
    success: true,
    message: 'Client company deleted successfully.',
  });
});

/**
 * POST /api/clients/:id/regenerate-password
 * Regenerate strong password for a client company
 */
router.post('/:id/regenerate-password', (req, res) => {
  const newPassword = generateStrongPassword(16);
  const updated = store.updateClient(req.params.id, { password: newPassword });
  if (!updated) {
    return res.status(404).json({ success: false, error: 'Client company not found.' });
  }
  res.status(200).json({
    success: true,
    message: 'Client credentials refreshed with a new strong password.',
    newPassword,
    client: updated,
  });
});

module.exports = router;
