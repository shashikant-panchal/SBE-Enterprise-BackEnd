const express = require('express');
const router = express.Router();
const store = require('../data/store');

/**
 * GET /api/attendance
 * Get daily shift roll call & punch status
 */
router.get('/', (req, res) => {
  const attendance = store.getAttendance();
  res.status(200).json({
    success: true,
    date: new Date().toISOString().slice(0, 10),
    attendance,
  });
});

/**
 * POST /api/attendance/toggle
 * Toggle attendance status for a worker
 */
router.post('/toggle', (req, res) => {
  const { empId } = req.body;
  if (!empId) {
    return res.status(400).json({ success: false, error: 'empId is required.' });
  }

  const result = store.toggleAttendance(empId);
  res.status(200).json({
    success: true,
    empId: result.empId,
    status: result.status,
  });
});

/**
 * POST /api/attendance/set
 * Set specific status for a worker
 */
router.post('/set', (req, res) => {
  const { empId, status } = req.body;
  if (!empId || !status) {
    return res.status(400).json({ success: false, error: 'empId and status are required.' });
  }

  const validStatuses = ['Present', 'Absent', 'Shift Swapped'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
    });
  }

  const result = store.setAttendance(empId, status);
  res.status(200).json({
    success: true,
    empId: result.empId,
    status: result.status,
  });
});

module.exports = router;
