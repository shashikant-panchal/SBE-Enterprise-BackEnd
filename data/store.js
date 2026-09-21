const { generateStrongPassword } = require('../utils/passwordGenerator');

// In-Memory Data Store for SBE Enterprise (initialized empty for Admin to create)
const ADMIN_CREDENTIALS = {
  email: 'sbeadmin@gmail.com',
  password: 'SbeAdmin@123',
  name: 'Pavan Malaiah (Proprietor)',
  role: 'admin',
  phone: '+91 94801 88392',
};

class Store {
  constructor() {
    this.admin = { ...ADMIN_CREDENTIALS };
    this.clients = [];
    this.employees = [];
    this.attendance = {};
    this.proposals = [];
  }

  // Auth
  validateAdmin(email, password) {
    if (!email || !password) return false;
    const cleanEmail = email.trim().toLowerCase();
    return cleanEmail === this.admin.email.toLowerCase() && password === this.admin.password;
  }

  validateClientHR(email, password) {
    if (!email || !password) return null;
    const cleanEmail = email.trim().toLowerCase();
    return this.clients.find(
      c => c.contactEmail.toLowerCase() === cleanEmail && c.password === password
    );
  }

  // Clients
  getAllClients() {
    return this.clients;
  }

  getClientById(id) {
    return this.clients.find(c => c.id === id);
  }

  addClient(clientData) {
    const nextNum = this.clients.length + 1;
    const id = clientData.id || `cli-0${nextNum}`;
    const password = clientData.password || generateStrongPassword(16);
    
    const newClient = {
      id,
      name: clientData.name || 'New Client Company',
      industry: clientData.industry || 'General Industrial',
      location: clientData.location || 'Mysore Industrial Belt',
      assignedWorkers: Number(clientData.assignedWorkers) || 0,
      activeShifts: clientData.activeShifts || ['Shift A (06:00 - 14:00)'],
      contactPerson: clientData.contactPerson || 'Site Contact',
      contactEmail: clientData.contactEmail || `hr@${(clientData.name || 'client').toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
      contactPhone: clientData.contactPhone || '+91 94800 00000',
      contractStatus: clientData.contractStatus || 'Active',
      logoPlaceholder: (clientData.name || 'PLANT').slice(0, 6).toUpperCase(),
      deploymentSince: clientData.deploymentSince || new Date().getFullYear().toString(),
      password,
    };

    this.clients.unshift(newClient);
    return newClient;
  }

  updateClient(id, updates) {
    const index = this.clients.findIndex(c => c.id === id);
    if (index === -1) return null;
    this.clients[index] = { ...this.clients[index], ...updates };
    return this.clients[index];
  }

  deleteClient(id) {
    const index = this.clients.findIndex(c => c.id === id);
    if (index === -1) return false;
    this.clients.splice(index, 1);
    return true;
  }

  // Employees
  getAllEmployees() {
    return this.employees;
  }

  getEmployeeById(id) {
    return this.employees.find(e => e.id === id);
  }

  addEmployee(empData) {
    const nextNum = this.employees.length + 101;
    const id = empData.id || `BE-0${nextNum}`;
    const newEmp = {
      id,
      name: empData.name,
      photo: empData.photo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      role: empData.role || 'Assembly Line Operator',
      nativeState: empData.nativeState || 'Karnataka',
      nativeDistrict: empData.nativeDistrict || 'Mysore',
      clientCompany: empData.clientCompany || 'Reserve Pool / Hot Standby',
      clientLocation: empData.clientLocation || 'Mysore',
      shift: empData.shift || 'Shift A (06:00 - 14:00)',
      joiningDate: empData.joiningDate || new Date().toISOString().slice(0, 10),
      status: empData.status || 'Active',
      phone: empData.phone || '+91 94801 00000',
      aadhaarVerified: empData.aadhaarVerified !== undefined ? empData.aadhaarVerified : true,
      medicalFitnessValid: empData.medicalFitnessValid !== undefined ? empData.medicalFitnessValid : true,
      supervisorName: empData.supervisorName || 'Site Supervisor',
      experienceYears: Number(empData.experienceYears) || 1,
    };

    this.employees.unshift(newEmp);
    this.attendance[id] = 'Present';
    return newEmp;
  }

  updateEmployee(id, updates) {
    const index = this.employees.findIndex(e => e.id === id);
    if (index === -1) return null;
    this.employees[index] = { ...this.employees[index], ...updates };
    return this.employees[index];
  }

  deleteEmployee(id) {
    const index = this.employees.findIndex(e => e.id === id);
    if (index === -1) return false;
    this.employees.splice(index, 1);
    delete this.attendance[id];
    return true;
  }

  // Attendance
  getAttendance() {
    return this.attendance;
  }

  toggleAttendance(empId) {
    const current = this.attendance[empId] || 'Present';
    const next = current === 'Present' ? 'Absent' : current === 'Absent' ? 'Shift Swapped' : 'Present';
    this.attendance[empId] = next;
    return { empId, status: next };
  }

  setAttendance(empId, status) {
    this.attendance[empId] = status;
    return { empId, status };
  }

  // Proposals
  getAllProposals() {
    return this.proposals;
  }

  addProposal(proposalData) {
    const newProp = {
      id: proposalData.id || `prop-${Date.now()}`,
      ...proposalData,
      status: proposalData.status || 'New',
      submittedAt: proposalData.submittedAt || new Date().toISOString(),
    };
    this.proposals.unshift(newProp);
    return newProp;
  }

  updateProposal(id, updates) {
    const index = this.proposals.findIndex(p => p.id === id);
    if (index === -1) return null;
    this.proposals[index] = { ...this.proposals[index], ...updates };
    return this.proposals[index];
  }
}

const store = new Store();
module.exports = store;
