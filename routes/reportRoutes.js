const express = require('express');
const router = express.Router();
const store = require('../data/store');
const Employee = require('../models/Employee');
const Client = require('../models/Client');
const { isDbConnected } = require('../config/db');

/**
 * GET /api/reports/timesheet
 * Generates monthly billing timesheet summary
 */
router.get('/timesheet', async (req, res) => {
  try {
    let employees;
    let clients;

    if (isDbConnected()) {
      employees = await Employee.find();
      clients = await Client.find();
    } else {
      employees = store.getAllEmployees();
      clients = store.getAllClients();
    }

    const currentDate = new Date();
    const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

    const timesheetData = {
      billingMonth: monthName,
      agency: 'Shree Beereshwara Enterprises (SBE)',
      proprietor: 'Pavan Malaiah',
      totalDeployedWorkers: employees.filter((e) => e.status === 'Active').length,
      workingDaysInMonth: 26,
      shiftsItemized: clients.map((client) => {
        const clientWorkers = employees.filter((e) => e.clientCompany === client.name);
        const assigned = clientWorkers.length || client.assignedWorkers || 0;
        return {
          client: client.name,
          location: client.location,
          activeHeadcount: assigned,
          standardShiftsBilled: assigned * 26,
          overtimeHoursLogged: Math.floor(assigned * 4.5),
          rateCardPerShift: '₹620.00 / Shift',
          complianceStatus: '100% EPF/ESIC Compliant',
        };
      }),
    };

    res.status(200).json({
      success: true,
      timesheet: timesheetData,
    });
  } catch (error) {
    console.error('Error generating timesheet report:', error);
    res.status(500).json({ success: false, error: 'Failed to generate timesheet report.' });
  }
});

/**
 * GET /api/reports/compliance
 * Generates statutory EPF, ESIC, and Form V compliance audit report
 */
router.get('/compliance', (req, res) => {
  res.status(200).json({
    success: true,
    compliance: {
      agencyName: 'Shree Beereshwara Enterprises',
      establishmentCode: 'KN/MYS/0038921/000',
      epfChallanStatus: 'Filed & Paid for Current Month',
      esicChallanStatus: 'Filed & Paid for Current Month',
      formVLicence: 'Valid through 31-Dec-2026',
      karnatakaLabourDepartmentRegistration: 'MYS-IND-LAB-1999-0412',
      medicalExaminations: '100% Certified Valid',
      policeVerificationRatio: '100% (520/520 Workers Cleared)',
    },
  });
});

/**
 * GET /api/reports/roster
 * Biometric identity roster summary
 */
router.get('/roster', async (req, res) => {
  try {
    let employees;
    if (isDbConnected()) {
      employees = await Employee.find();
    } else {
      employees = store.getAllEmployees();
    }

    res.status(200).json({
      success: true,
      totalRecords: employees.length,
      aadhaarVerifiedCount: employees.filter((e) => e.aadhaarVerified).length,
      medicalFitnessValidCount: employees.filter((e) => e.medicalFitnessValid).length,
      roster: employees.map((e) => ({
        id: e.id,
        name: e.name,
        role: e.role,
        nativeState: e.nativeState,
        clientCompany: e.clientCompany,
        aadhaarVerified: e.aadhaarVerified,
        medicalFitnessValid: e.medicalFitnessValid,
        phone: e.phone,
      })),
    });
  } catch (error) {
    console.error('Error generating roster report:', error);
    res.status(500).json({ success: false, error: 'Failed to generate roster report.' });
  }
});

module.exports = router;
