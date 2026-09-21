const express = require('express');
const router = express.Router();
const store = require('../data/store');
const Proposal = require('../models/Proposal');
const { isDbConnected } = require('../config/db');

/**
 * GET /api/proposals
 * Retrieve all inbound commercial proposal requests and manpower requisitions
 */
router.get('/', async (req, res) => {
  try {
    if (isDbConnected()) {
      const proposals = await Proposal.find().sort({ submittedAt: -1 });
      return res.status(200).json({
        success: true,
        count: proposals.length,
        proposals,
      });
    }

    const proposals = store.getAllProposals();
    res.status(200).json({
      success: true,
      count: proposals.length,
      proposals,
    });
  } catch (error) {
    console.error('Error fetching proposals:', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve proposals.' });
  }
});

/**
 * POST /api/proposals
 * Submit a new requisition / proposal request (from ContactPage or ManpowerCalculator)
 */
router.post('/', async (req, res) => {
  const { companyName, contactName, phone } = req.body;

  if (!companyName || !contactName || !phone) {
    return res.status(400).json({
      success: false,
      error: 'Company name, contact name, and phone number are required.',
    });
  }

  try {
    const newPropInStore = store.addProposal(req.body);

    if (isDbConnected()) {
      const newDbProp = await Proposal.create({
        id: newPropInStore.id,
        companyName: newPropInStore.companyName,
        contactName: newPropInStore.contactName,
        email: newPropInStore.email,
        phone: newPropInStore.phone,
        location: newPropInStore.location,
        industry: newPropInStore.industry,
        manpowerCount: newPropInStore.manpowerCount,
        roleRequirement: newPropInStore.roleRequirement,
        shiftsRequired: newPropInStore.shiftsRequired,
        notes: newPropInStore.notes,
        status: newPropInStore.status || 'New',
        submittedAt: new Date(newPropInStore.submittedAt),
      });

      return res.status(201).json({
        success: true,
        message: 'Proposal request submitted successfully and stored in database. SBE desk will respond within 24 hours.',
        proposal: newDbProp,
      });
    }

    res.status(201).json({
      success: true,
      message: 'Proposal request submitted successfully. SBE desk will respond within 24 hours.',
      proposal: newPropInStore,
    });
  } catch (error) {
    console.error('Error adding proposal:', error);
    res.status(500).json({ success: false, error: 'Failed to submit proposal request.' });
  }
});

/**
 * PUT /api/proposals/:id
 * Update proposal status (e.g., Under Review, Contacted, Deployed, Closed)
 */
router.put('/:id', async (req, res) => {
  try {
    const updatedStore = store.updateProposal(req.params.id, req.body);

    if (isDbConnected()) {
      const updatedDb = await Proposal.findOneAndUpdate(
        { id: req.params.id },
        { $set: req.body },
        { new: true }
      );
      if (!updatedDb && !updatedStore) {
        return res.status(404).json({ success: false, error: 'Proposal not found.' });
      }
      return res.status(200).json({
        success: true,
        message: 'Proposal status updated successfully in database.',
        proposal: updatedDb || updatedStore,
      });
    }

    if (!updatedStore) {
      return res.status(404).json({ success: false, error: 'Proposal not found.' });
    }
    res.status(200).json({
      success: true,
      message: 'Proposal status updated successfully.',
      proposal: updatedStore,
    });
  } catch (error) {
    console.error('Error updating proposal:', error);
    res.status(500).json({ success: false, error: 'Failed to update proposal.' });
  }
});

module.exports = router;
