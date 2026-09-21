const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const store = require('../data/store');
const Client = require('../models/Client');
const { isDbConnected } = require('../config/db');
const { generateStrongPassword } = require('../utils/passwordGenerator');
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');

/**
 * GET /api/clients
 * Retrieve client companies (Public/Client HR/Admin)
 */
router.get('/', async (req, res) => {
  try {
    if (isDbConnected()) {
      const clients = await Client.find().sort({ createdAt: -1 });
      return res.status(200).json({
        success: true,
        count: clients.length,
        clients,
      });
    }

    const clients = store.getAllClients();
    res.status(200).json({
      success: true,
      count: clients.length,
      clients,
    });
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve clients.' });
  }
});

/**
 * GET /api/clients/:id
 * Retrieve a specific client company
 */
router.get('/:id', async (req, res) => {
  try {
    if (isDbConnected()) {
      const query = mongoose.Types.ObjectId.isValid(req.params.id)
        ? { $or: [{ id: req.params.id }, { _id: req.params.id }] }
        : { id: req.params.id };

      const client = await Client.findOne(query);
      if (!client) {
        return res.status(404).json({ success: false, error: 'Client company not found.' });
      }
      return res.status(200).json({ success: true, client });
    }

    const client = store.getClientById(req.params.id);
    if (!client) {
      return res.status(404).json({ success: false, error: 'Client company not found.' });
    }
    res.status(200).json({ success: true, client });
  } catch (error) {
    console.error('Error fetching client by id:', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve client.' });
  }
});

/**
 * POST /api/clients
 * Admin adds a new client company with an auto-generated or custom strong password
 */
router.post('/', async (req, res) => {
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

  try {
    if (isDbConnected()) {
      const lastCli = await Client.findOne().sort({ createdAt: -1 });
      let nextId = 'cli-01';
      if (lastCli && lastCli.id && /^cli-\d+$/.test(lastCli.id)) {
        const num = parseInt(lastCli.id.replace('cli-', ''), 10);
        nextId = `cli-${String(num + 1).padStart(2, '0')}`;
      } else {
        const count = await Client.countDocuments();
        nextId = `cli-${String(count + 1).padStart(2, '0')}`;
      }

      const assignedId = req.body.id || nextId;

      const dbClient = await Client.create({
        id: assignedId,
        name: name.trim(),
        industry: industry || 'General Industrial',
        location: location || 'Mysore Industrial Belt',
        assignedWorkers: Number(assignedWorkers) || 0,
        activeShifts: activeShifts || ['Shift A (06:00 - 14:00)'],
        contactPerson: contactPerson.trim(),
        contactEmail: contactEmail || `hr@${name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
        contactPhone: contactPhone || '+91 94800 00000',
        contractStatus: contractStatus || 'Active',
        logoPlaceholder: (name || 'PLANT').slice(0, 6).toUpperCase(),
        deploymentSince: new Date().getFullYear().toString(),
        password: securePassword,
      });

      // Keep in-memory store synchronized as fallback
      store.addClient(dbClient.toObject ? dbClient.toObject() : dbClient);

      return res.status(201).json({
        success: true,
        message: 'Client company registered successfully in database.',
        client: dbClient,
        generatedPassword: securePassword,
      });
    }

    const clientData = {
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
    };

    const newClientInStore = store.addClient(clientData);

    res.status(201).json({
      success: true,
      message: 'Client company registered successfully.',
      client: newClientInStore,
      generatedPassword: securePassword,
    });
  } catch (error) {
    console.error('Error creating client:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to create client company.' });
  }
});

/**
 * PUT /api/clients/:id
 * Update an existing client company
 */
router.put('/:id', async (req, res) => {
  try {
    // Keep in-memory store synchronized
    const updatedStore = store.updateClient(req.params.id, req.body);

    if (isDbConnected()) {
      const query = mongoose.Types.ObjectId.isValid(req.params.id)
        ? { $or: [{ id: req.params.id }, { _id: req.params.id }] }
        : { id: req.params.id };

      const updatedDb = await Client.findOneAndUpdate(
        query,
        { $set: req.body },
        { new: true }
      );
      if (!updatedDb && !updatedStore) {
        return res.status(404).json({ success: false, error: 'Client company not found.' });
      }
      return res.status(200).json({
        success: true,
        message: 'Client company updated successfully.',
        client: updatedDb || updatedStore,
      });
    }

    if (!updatedStore) {
      return res.status(404).json({ success: false, error: 'Client company not found.' });
    }
    res.status(200).json({
      success: true,
      message: 'Client company updated successfully.',
      client: updatedStore,
    });
  } catch (error) {
    console.error('Error updating client:', error);
    res.status(500).json({ success: false, error: 'Failed to update client company.' });
  }
});

/**
 * DELETE /api/clients/:id
 * Remove a client company
 */
router.delete('/:id', async (req, res) => {
  try {
    const storeSuccess = store.deleteClient(req.params.id);

    if (isDbConnected()) {
      const query = mongoose.Types.ObjectId.isValid(req.params.id)
        ? { $or: [{ id: req.params.id }, { _id: req.params.id }] }
        : { id: req.params.id };

      const deleted = await Client.findOneAndDelete(query);
      if (!deleted && !storeSuccess) {
        return res.status(404).json({ success: false, error: 'Client company not found.' });
      }
      return res.status(200).json({
        success: true,
        message: 'Client company deleted successfully from database.',
      });
    }

    if (!storeSuccess) {
      return res.status(404).json({ success: false, error: 'Client company not found.' });
    }
    res.status(200).json({
      success: true,
      message: 'Client company deleted successfully.',
    });
  } catch (error) {
    console.error('Error deleting client:', error);
    res.status(500).json({ success: false, error: 'Failed to delete client company.' });
  }
});

/**
 * POST /api/clients/:id/regenerate-password
 * Regenerate strong password for a client company
 */
router.post('/:id/regenerate-password', async (req, res) => {
  try {
    const newPassword = generateStrongPassword(16);
    const updatedStore = store.updateClient(req.params.id, { password: newPassword });

    if (isDbConnected()) {
      const query = mongoose.Types.ObjectId.isValid(req.params.id)
        ? { $or: [{ id: req.params.id }, { _id: req.params.id }] }
        : { id: req.params.id };

      const updatedDb = await Client.findOneAndUpdate(
        query,
        { password: newPassword },
        { new: true }
      );
      if (!updatedDb && !updatedStore) {
        return res.status(404).json({ success: false, error: 'Client company not found.' });
      }
      return res.status(200).json({
        success: true,
        message: 'Client credentials refreshed with a new strong password.',
        newPassword,
        client: updatedDb || updatedStore,
      });
    }

    if (!updatedStore) {
      return res.status(404).json({ success: false, error: 'Client company not found.' });
    }
    res.status(200).json({
      success: true,
      message: 'Client credentials refreshed with a new strong password.',
      newPassword,
      client: updatedStore,
    });
  } catch (error) {
    console.error('Error regenerating client password:', error);
    res.status(500).json({ success: false, error: 'Failed to regenerate client password.' });
  }
});

module.exports = router;
