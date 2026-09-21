const express = require('express');
const router = express.Router();
const store = require('../data/store');
const Attendance = require('../models/Attendance');
const { isDbConnected } = require('../config/db');

/**
 * GET /api/attendance
 * Get daily shift roll call & punch status
 */
router.get('/', async (req, res) => {
  const today = new Date().toISOString().slice(0, 10);

  try {
    if (isDbConnected()) {
      let record = await Attendance.findOne({ date: today });
      if (!record) {
        const attendanceMap = new Map();
        Object.entries(store.attendance || {}).forEach(([k, v]) => {
          attendanceMap.set(k, v);
        });
        record = await Attendance.create({ date: today, records: attendanceMap });
      }

      const attendanceObj = {};
      if (record.records instanceof Map) {
        record.records.forEach((value, key) => {
          attendanceObj[key] = value;
        });
      } else if (typeof record.records === 'object') {
        Object.assign(attendanceObj, record.records);
      }

      return res.status(200).json({
        success: true,
        date: today,
        attendance: attendanceObj,
      });
    }

    const attendance = store.getAttendance();
    res.status(200).json({
      success: true,
      date: today,
      attendance,
    });
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve attendance.' });
  }
});

/**
 * POST /api/attendance/toggle
 * Toggle attendance status for a worker
 */
router.post('/toggle', async (req, res) => {
  const { empId } = req.body;
  if (!empId) {
    return res.status(400).json({ success: false, error: 'empId is required.' });
  }

  const today = new Date().toISOString().slice(0, 10);

  try {
    const storeResult = store.toggleAttendance(empId);

    if (isDbConnected()) {
      let record = await Attendance.findOne({ date: today });
      if (!record) {
        const attendanceMap = new Map();
        Object.entries(store.attendance || {}).forEach(([k, v]) => {
          attendanceMap.set(k, v);
        });
        record = await Attendance.create({ date: today, records: attendanceMap });
      }

      const current = record.records.get(empId) || 'Present';
      const next = current === 'Present' ? 'Absent' : current === 'Absent' ? 'Shift Swapped' : 'Present';
      record.records.set(empId, next);
      await record.save();

      return res.status(200).json({
        success: true,
        empId,
        status: next,
      });
    }

    res.status(200).json({
      success: true,
      empId: storeResult.empId,
      status: storeResult.status,
    });
  } catch (error) {
    console.error('Error toggling attendance:', error);
    res.status(500).json({ success: false, error: 'Failed to toggle attendance.' });
  }
});

/**
 * POST /api/attendance/set
 * Set specific status for a worker
 */
router.post('/set', async (req, res) => {
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

  const today = new Date().toISOString().slice(0, 10);

  try {
    const storeResult = store.setAttendance(empId, status);

    if (isDbConnected()) {
      let record = await Attendance.findOne({ date: today });
      if (!record) {
        const attendanceMap = new Map();
        Object.entries(store.attendance || {}).forEach(([k, v]) => {
          attendanceMap.set(k, v);
        });
        record = await Attendance.create({ date: today, records: attendanceMap });
      }

      record.records.set(empId, status);
      await record.save();

      return res.status(200).json({
        success: true,
        empId,
        status,
      });
    }

    res.status(200).json({
      success: true,
      empId: storeResult.empId,
      status: storeResult.status,
    });
  } catch (error) {
    console.error('Error setting attendance:', error);
    res.status(500).json({ success: false, error: 'Failed to update attendance.' });
  }
});

module.exports = router;
