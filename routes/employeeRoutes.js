const express = require('express');
const router = express.Router();
const store = require('../data/store');
const Employee = require('../models/Employee');
const { isDbConnected } = require('../config/db');

/**
 * GET /api/employees
 * Retrieve workforce roster with optional search, company, role, status filters
 */
router.get('/', async (req, res) => {
  const { search, clientCompany, role, status } = req.query;

  try {
    if (isDbConnected()) {
      let filter = {};

      if (clientCompany) {
        filter.clientCompany = new RegExp('^' + clientCompany.trim() + '$', 'i');
      }
      if (role) {
        filter.role = new RegExp('^' + role.trim() + '$', 'i');
      }
      if (status) {
        filter.status = new RegExp('^' + status.trim() + '$', 'i');
      }
      if (search) {
        const sRegex = new RegExp(search.trim(), 'i');
        filter.$or = [
          { name: sRegex },
          { id: sRegex },
          { role: sRegex },
          { clientCompany: sRegex },
          { nativeDistrict: sRegex },
        ];
      }

      const employees = await Employee.find(filter).sort({ id: 1 });
      return res.status(200).json({
        success: true,
        count: employees.length,
        employees,
      });
    }

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
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve employees.' });
  }
});

/**
 * GET /api/employees/stats
 * Aggregated statistics for workforce deployment dashboard
 */
router.get('/stats', async (req, res) => {
  try {
    let employees;
    if (isDbConnected()) {
      employees = await Employee.find();
    } else {
      employees = store.getAllEmployees();
    }

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
  } catch (error) {
    console.error('Error fetching employee stats:', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve stats.' });
  }
});

/**
 * GET /api/employees/:id
 * Retrieve a single employee by ID
 */
router.get('/:id', async (req, res) => {
  try {
    if (isDbConnected()) {
      const employee = await Employee.findOne({ id: req.params.id });
      if (!employee) {
        return res.status(404).json({ success: false, error: 'Employee not found.' });
      }
      return res.status(200).json({ success: true, employee });
    }

    const employee = store.getEmployeeById(req.params.id);
    if (!employee) {
      return res.status(404).json({ success: false, error: 'Employee not found.' });
    }
    res.status(200).json({ success: true, employee });
  } catch (error) {
    console.error('Error fetching employee by id:', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve employee.' });
  }
});

/**
 * POST /api/employees
 * Admin enrolls a new industrial worker
 */
router.post('/', async (req, res) => {
  const { name, phone } = req.body;

  if (!name || !phone) {
    return res.status(400).json({
      success: false,
      error: 'Worker name and phone number are required.',
    });
  }

  try {
    const newEmpInStore = store.addEmployee(req.body);

    if (isDbConnected()) {
      const newDbEmp = await Employee.create({
        id: newEmpInStore.id,
        name: newEmpInStore.name,
        role: newEmpInStore.role,
        nativeState: newEmpInStore.nativeState,
        nativeDistrict: newEmpInStore.nativeDistrict,
        clientCompany: newEmpInStore.clientCompany,
        clientLocation: newEmpInStore.clientLocation,
        shift: newEmpInStore.shift,
        phone: newEmpInStore.phone,
        aadhaarVerified: newEmpInStore.aadhaarVerified,
        medicalFitnessValid: newEmpInStore.medicalFitnessValid,
        status: newEmpInStore.status,
        experienceYears: newEmpInStore.experienceYears,
        dailyWageRate: 550,
      });

      return res.status(201).json({
        success: true,
        message: 'Worker enrolled successfully into SBE roster and database.',
        employee: newDbEmp,
      });
    }

    res.status(201).json({
      success: true,
      message: 'Worker enrolled successfully into SBE roster.',
      employee: newEmpInStore,
    });
  } catch (error) {
    console.error('Error adding employee:', error);
    res.status(500).json({ success: false, error: 'Failed to enroll worker.' });
  }
});

/**
 * PUT /api/employees/:id
 * Update an employee record (e.g. status toggle or profile edits)
 */
router.put('/:id', async (req, res) => {
  try {
    const updatedStore = store.updateEmployee(req.params.id, req.body);

    if (isDbConnected()) {
      const updatedDb = await Employee.findOneAndUpdate(
        { id: req.params.id },
        { $set: req.body },
        { new: true }
      );
      if (!updatedDb && !updatedStore) {
        return res.status(404).json({ success: false, error: 'Employee not found.' });
      }
      return res.status(200).json({
        success: true,
        message: 'Worker record updated successfully in database.',
        employee: updatedDb || updatedStore,
      });
    }

    if (!updatedStore) {
      return res.status(404).json({ success: false, error: 'Employee not found.' });
    }
    res.status(200).json({
      success: true,
      message: 'Worker record updated successfully.',
      employee: updatedStore,
    });
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ success: false, error: 'Failed to update employee.' });
  }
});

/**
 * DELETE /api/employees/:id
 * Remove an employee from the SBE roster
 */
router.delete('/:id', async (req, res) => {
  try {
    const storeSuccess = store.deleteEmployee(req.params.id);

    if (isDbConnected()) {
      const deleted = await Employee.findOneAndDelete({ id: req.params.id });
      if (!deleted && !storeSuccess) {
        return res.status(404).json({ success: false, error: 'Employee not found.' });
      }
      return res.status(200).json({
        success: true,
        message: 'Worker removed from SBE roster and database.',
      });
    }

    if (!storeSuccess) {
      return res.status(404).json({ success: false, error: 'Employee not found.' });
    }
    res.status(200).json({
      success: true,
      message: 'Worker removed from SBE roster.',
    });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ success: false, error: 'Failed to delete worker.' });
  }
});

module.exports = router;
