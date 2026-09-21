const Admin = require('../models/Admin');
const Client = require('../models/Client');
const Employee = require('../models/Employee');
const Attendance = require('../models/Attendance');
const Proposal = require('../models/Proposal');
const store = require('../data/store');

/**
 * Ensure default Admin account exists in MongoDB so admin can log in.
 * Does NOT seed mock data - admin creates data dynamically.
 */
async function seedInitialData() {
  try {
    // Only seed default Admin if no admin exists
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      await Admin.create({
        email: store.admin.email,
        password: store.admin.password,
        name: store.admin.name,
        role: store.admin.role,
        phone: store.admin.phone,
      });
      console.log('[MongoDB] Default Admin account verified/created.');
    }
  } catch (error) {
    console.error('[MongoDB] Error during admin verification:', error.message);
  }
}

/**
 * Utility to clear mock data from MongoDB collections (leaves Admin intact)
 */
async function cleanMockData() {
  try {
    await Client.deleteMany({});
    await Employee.deleteMany({});
    await Attendance.deleteMany({});
    await Proposal.deleteMany({});
    console.log('[MongoDB] Cleared mock data from clients, employees, attendance, and proposals collections.');
  } catch (error) {
    console.error('[MongoDB] Error clearing mock data:', error.message);
  }
}

module.exports = {
  seedInitialData,
  cleanMockData,
};
