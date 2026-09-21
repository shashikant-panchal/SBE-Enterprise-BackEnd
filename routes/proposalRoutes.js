const express = require('express');
const router = express.Router();
const store = require('../data/store');

/**
 * GET /api/proposals
 * Retrieve all inbound commercial proposal requests and manpower requisitions
 */
router.get('/', (req, res) => {
  const proposals = store.getAllProposals();
  res.status(200).json({
    success: true,
    count: proposals.length,
    proposals,
  });
});

/**
 * POST /api/proposals
 * Submit a new requisition / proposal request (from ContactPage or ManpowerCalculator)
 */
router.post('/', (req, res) => {
  const { companyName, contactName, phone } = req.body;

  if (!companyName || !contactName || !phone) {
    return res.status(400).json({
      success: false,
      error: 'Company name, contact name, and phone number are required.',
    });
  }

  const proposal = store.addProposal(req.body);

  res.status(201).json({
    success: true,
    message: 'Proposal request submitted successfully. SBE desk will respond within 24 hours.',
    proposal,
  });
});

/**
 * PUT /api/proposals/:id
 * Update proposal status (e.g., Under Review, Contacted, Deployed, Closed)
 */
router.put('/:id', (req, res) => {
  const updated = store.updateProposal(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, error: 'Proposal not found.' });
  }
  res.status(200).json({
    success: true,
    message: 'Proposal status updated successfully.',
    proposal: updated,
  });
});

module.exports = router;
