const express = require('express');
const router = express.Router();
const store = require('../data/store');

/**
 * GET /api/employees
 * Retrieve workforce roster with optional search, company, role, status filters
 */
router.get('/', (req, res) => {
  const { search, clientCompany, role, status } = req.query;
  let employees = store.getAllEmployees();

  if (clientCompany) {
    employees = employees.filter(
      (e) => e.clientCompany.toLowerCase() === clientCompany.toLowerCase()
    );
  }

  if (role) {
    employees = employees.filter(
      (e) => e.role.toLowerCase() === role.toLowerCase()
    );
  }

  if (status) {
    employees = employees.filter(
      (e) => e.status.toLowerCase() === status.toLowerCase()
    );
  }

  if (search) {
    const q = search.toLowerCase();
    employees = employees.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.id.toLowerCase().includes(q) ||
        e.role.toLowerCase().includes(q) ||
        e.clientCompany.toLowerCase().includes(q) ||
        (e.nativeDistrict && e.nativeDistrict.toLowerCase().includes(q))
    );
  }

  res.status(200).json({
    success: true,
    count: employees.length,
    employees,
  });
});

/**
 * GET /api/employees/stats
 * Aggregated statistics for workforce deployment dashboard
 */
router.get('/stats', (req, res) => {
  const employees = store.getAllEmployees();
  const totalOnRoll = employees.length;
  const activeCount = employees.filter((e) => e.status === 'Active').length;
  const inReserveCount = employees.filter((e) => e.status === 'In Reserve').length;
  const onLeaveCount = employees.filter((e) => e.status === 'On Leave').length;

  const stateCounts = {};
  const roleCounts = {};

  employees.forEach((e) => {
    stateCounts[e.nativeState] = (stateCounts[e.nativeState] || 0) + 1;
    roleCounts[e.role] = (roleCounts[e.role] || 0) + 1;
  });

  res.status(200).json({
    success: true,
    stats: {
      totalOnRoll,
      activeCount,
      inReserveCount,
      onLeaveCount,
      attendanceRateToday: '97.8%',
      reserveStandbyHours: '< 45 min dispatch',
      stateDistribution: stateCounts,
      roleDistribution: roleCounts,
    },
  });
});

/**
 * GET /api/employees/:id
 * Retrieve a single employee by ID
 */
router.get('/:id', (req, res) => {
  const employee = store.getEmployeeById(req.params.id);
  if (!employee) {
    return res.status(404).json({ success: false, error: 'Employee not found.' });
  }
  res.status(200).json({ success: true, employee });
});

/**
 * POST /api/employees
 * Admin enrolls a new industrial worker
 */
router.post('/', (req, res) => {
  const { name, phone } = req.body;

  if (!name || !phone) {
    return res.status(400).json({
      success: false,
      error: 'Worker name and phone number are required.',
    });
  }

  const newEmployee = store.addEmployee(req.body);

  res.status(201).json({
    success: true,
    message: 'Worker enrolled successfully into SBE roster.',
    employee: newEmployee,
  });
});

/**
 * PUT /api/employees/:id
 * Update an employee record (e.g. status toggle or profile edits)
 */
router.put('/:id', (req, res) => {
  const updated = store.updateEmployee(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, error: 'Employee not found.' });
  }
  res.status(200).json({
    success: true,
    message: 'Worker record updated successfully.',
    employee: updated,
  });
});

/**
 * DELETE /api/employees/:id
 * Remove an employee from the SBE roster
 */
router.delete('/:id', (req, res) => {
  const success = store.deleteEmployee(req.params.id);
  if (!success) {
    return res.status(404).json({ success: false, error: 'Employee not found.' });
  }
  res.status(200).json({
    success: true,
    message: 'Worker removed from SBE roster.',
  });
});

module.exports = router;
