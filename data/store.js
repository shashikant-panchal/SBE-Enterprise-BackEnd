const { generateStrongPassword } = require('../utils/passwordGenerator');

// In-Memory Data Store for SBE Enterprise
const ADMIN_CREDENTIALS = {
  email: 'sbeadmin@gmail.com',
  password: 'SbeAdmin@123',
  name: 'Pavan Malaiah (Proprietor)',
  role: 'admin',
  phone: '+91 94801 88392',
};

const INITIAL_CLIENTS = [
  {
    id: 'cli-01',
    name: 'TVS Motor Supplier / Two-Wheeler Assembly',
    industry: 'Automotive & Two-Wheeler',
    location: 'Kadakola Industrial Belt, Mysore',
    assignedWorkers: 145,
    activeShifts: ['Shift A (06:00 - 14:00)', 'Shift B (14:00 - 22:00)', 'Shift C (22:00 - 06:00)'],
    contactPerson: 'K. Ramesh (Plant Operations Head)',
    contactEmail: 'ramesh.k@tvs-auto-assembly.in',
    contactPhone: '+91 94802 11982',
    contractStatus: 'Active',
    logoPlaceholder: 'TVS-AUTO',
    deploymentSince: '2021',
    password: generateStrongPassword(16),
  },
  {
    id: 'cli-02',
    name: 'Hector Beverages (Paperboat Juices & Beverages)',
    industry: 'Beverage & FMCG',
    location: 'Tandavpura Industrial Area, Mysore',
    assignedWorkers: 98,
    activeShifts: ['Shift A (06:00 - 14:00)', 'Shift B (14:00 - 22:00)'],
    contactPerson: 'Anjali Sharma (Supply Chain Lead)',
    contactEmail: 'a.sharma@hector-beverages-mys.com',
    contactPhone: '+91 98450 77312',
    contractStatus: 'Active',
    logoPlaceholder: 'PAPERBOAT',
    deploymentSince: '2022',
    password: generateStrongPassword(16),
  },
  {
    id: 'cli-03',
    name: 'South Bottlers (Coca-Cola Bottling Partner)',
    industry: 'Beverage & FMCG Bottling',
    location: 'Nanjangud Industrial Cluster, Mysore',
    assignedWorkers: 112,
    activeShifts: ['Shift A (06:00 - 14:00)', 'Shift B (14:00 - 22:00)', 'Shift C (22:00 - 06:00)'],
    contactPerson: 'S. N. Mahadev (HR & Plant Admin)',
    contactEmail: 'mahadev.sn@southbottlers.co.in',
    contactPhone: '+91 98801 44520',
    contractStatus: 'Active',
    logoPlaceholder: 'COCA-COLA-PTNR',
    deploymentSince: '2020',
    password: generateStrongPassword(16),
  },
  {
    id: 'cli-04',
    name: 'AutoTech Precision Ancillary Components',
    industry: 'Automotive Components',
    location: 'Hebbal Industrial Estate, Mysore',
    assignedWorkers: 65,
    activeShifts: ['General Day (08:30 - 17:30)', 'Shift B (14:00 - 22:00)'],
    contactPerson: 'Girish Kumar (Factory Manager)',
    contactEmail: 'girish@autotechprecision.com',
    contactPhone: '+91 99014 88319',
    contractStatus: 'Scaling Up',
    logoPlaceholder: 'AUTOTECH',
    deploymentSince: '2023',
    password: generateStrongPassword(16),
  },
  {
    id: 'cli-05',
    name: 'LogiHub South Logistics & Warehouse Terminal',
    industry: 'Warehousing & Logistics',
    location: 'Hootagalli Industrial Suburb, Mysore',
    assignedWorkers: 54,
    activeShifts: ['Shift A (06:00 - 14:00)', 'Shift B (14:00 - 22:00)', 'Shift C (22:00 - 06:00)'],
    contactPerson: 'Vikram Singh (Dock Logistics Superintendent)',
    contactEmail: 'v.singh@logihub-south.in',
    contactPhone: '+91 97413 55901',
    contractStatus: 'Active',
    logoPlaceholder: 'LOGIHUB',
    deploymentSince: '2022',
    password: generateStrongPassword(16),
  },
  {
    id: 'cli-06',
    name: 'Metagalli Heavy Engineering & Line Parts',
    industry: 'Packaging & Line Operations',
    location: 'Metagalli Industrial Area, Mysore',
    assignedWorkers: 42,
    activeShifts: ['Shift A (06:00 - 14:00)', 'Shift B (14:00 - 22:00)'],
    contactPerson: 'Pradeep Gowda (HR Officer)',
    contactEmail: 'pgowda@metagalliparts.org',
    contactPhone: '+91 94480 33214',
    contractStatus: 'Active',
    logoPlaceholder: 'METAPARTS',
    deploymentSince: '2023',
    password: generateStrongPassword(16),
  }
];

const INITIAL_EMPLOYEES = [
  {
    id: 'BE-0101',
    name: 'Rajesh Kumar Yadav',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    role: 'Assembly Line Operator',
    nativeState: 'Uttar Pradesh',
    nativeDistrict: 'Varanasi',
    clientCompany: 'TVS Motor Supplier / Two-Wheeler Assembly',
    clientLocation: 'Kadakola Belt, Mysore',
    shift: 'Shift A (06:00 - 14:00)',
    joiningDate: '2021-03-15',
    status: 'Active',
    phone: '+91 98451 88392',
    aadhaarVerified: true,
    medicalFitnessValid: true,
    supervisorName: 'M. Ramesh',
    experienceYears: 4,
  },
  {
    id: 'BE-0102',
    name: 'Manoj Paswan',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    role: 'FMCG Packer',
    nativeState: 'Bihar',
    nativeDistrict: 'Patna',
    clientCompany: 'Hector Beverages (Paperboat Juices & Beverages)',
    clientLocation: 'Tandavpura Industrial Area',
    shift: 'Shift B (14:00 - 22:00)',
    joiningDate: '2022-07-10',
    status: 'Active',
    phone: '+91 97412 90412',
    aadhaarVerified: true,
    medicalFitnessValid: true,
    supervisorName: 'Suresh Kumar',
    experienceYears: 3,
  },
  {
    id: 'BE-0103',
    name: 'Amitabh Oraon',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    role: 'Heavy Loader',
    nativeState: 'Jharkhand',
    nativeDistrict: 'Ranchi',
    clientCompany: 'South Bottlers (Coca-Cola Bottling Partner)',
    clientLocation: 'Nanjangud Industrial Cluster',
    shift: 'Shift C (22:00 - 06:00)',
    joiningDate: '2020-11-20',
    status: 'Active',
    phone: '+91 99014 38291',
    aadhaarVerified: true,
    medicalFitnessValid: true,
    supervisorName: 'Prakash Rao',
    experienceYears: 5,
  },
  {
    id: 'BE-0104',
    name: 'Dharmendra Bind',
    photo: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    role: 'Machine Helper',
    nativeState: 'Uttar Pradesh',
    nativeDistrict: 'Gorakhpur',
    clientCompany: 'AutoTech Precision Ancillary Components',
    clientLocation: 'Hebbal Industrial Estate',
    shift: 'General Day (08:30 - 17:30)',
    joiningDate: '2023-01-18',
    status: 'Active',
    phone: '+91 94481 66209',
    aadhaarVerified: true,
    medicalFitnessValid: true,
    supervisorName: 'K. Somanna',
    experienceYears: 2,
  },
  {
    id: 'BE-0105',
    name: 'Sanjay Kumar Mahto',
    photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    role: 'Material Handler',
    nativeState: 'Jharkhand',
    nativeDistrict: 'Dhanbad',
    clientCompany: 'LogiHub South Logistics & Warehouse Terminal',
    clientLocation: 'Hootagalli Industrial Suburb',
    shift: 'Shift A (06:00 - 14:00)',
    joiningDate: '2022-04-05',
    status: 'Active',
    phone: '+91 97418 22104',
    aadhaarVerified: true,
    medicalFitnessValid: true,
    supervisorName: 'Vikram Singh',
    experienceYears: 3,
  },
  {
    id: 'BE-0106',
    name: 'Santosh Sahani',
    photo: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    role: 'Yard Specialist',
    nativeState: 'Bihar',
    nativeDistrict: 'Muzaffarpur',
    clientCompany: 'Metagalli Heavy Engineering & Line Parts',
    clientLocation: 'Metagalli Industrial Area',
    shift: 'Shift B (14:00 - 22:00)',
    joiningDate: '2023-05-12',
    status: 'Active',
    phone: '+91 98453 11849',
    aadhaarVerified: true,
    medicalFitnessValid: true,
    supervisorName: 'Pradeep Gowda',
    experienceYears: 2,
  },
  {
    id: 'BE-0107',
    name: 'Pradeep Kumar Chauhan',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    role: 'Housekeeping & Utility',
    nativeState: 'Uttar Pradesh',
    nativeDistrict: 'Azamgarh',
    clientCompany: 'TVS Motor Supplier / Two-Wheeler Assembly',
    clientLocation: 'Kadakola Belt, Mysore',
    shift: 'General Day (08:30 - 17:30)',
    joiningDate: '2021-09-01',
    status: 'Active',
    phone: '+91 99018 77412',
    aadhaarVerified: true,
    medicalFitnessValid: true,
    supervisorName: 'M. Ramesh',
    experienceYears: 3,
  },
  {
    id: 'BE-0108',
    name: 'Mukesh Tudu',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    role: 'FMCG Packer',
    nativeState: 'Jharkhand',
    nativeDistrict: 'Dumka',
    clientCompany: 'Hector Beverages (Paperboat Juices & Beverages)',
    clientLocation: 'Tandavpura Industrial Area',
    shift: 'Shift A (06:00 - 14:00)',
    joiningDate: '2022-10-14',
    status: 'In Reserve',
    phone: '+91 94803 66190',
    aadhaarVerified: true,
    medicalFitnessValid: true,
    supervisorName: 'Suresh Kumar',
    experienceYears: 1,
  },
  {
    id: 'BE-0109',
    name: 'Ravi Shankar Pandey',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    role: 'Machine Helper',
    nativeState: 'Uttar Pradesh',
    nativeDistrict: 'Deoria',
    clientCompany: 'South Bottlers (Coca-Cola Bottling Partner)',
    clientLocation: 'Nanjangud Industrial Cluster',
    shift: 'Shift A (06:00 - 14:00)',
    joiningDate: '2021-12-05',
    status: 'Active',
    phone: '+91 97415 88203',
    aadhaarVerified: true,
    medicalFitnessValid: true,
    supervisorName: 'Prakash Rao',
    experienceYears: 4,
  },
  {
    id: 'BE-0110',
    name: 'Sunil Paswan',
    photo: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    role: 'Heavy Loader',
    nativeState: 'Bihar',
    nativeDistrict: 'Gaya',
    clientCompany: 'LogiHub South Logistics & Warehouse Terminal',
    clientLocation: 'Hootagalli Industrial Suburb',
    shift: 'Shift C (22:00 - 06:00)',
    joiningDate: '2023-03-22',
    status: 'Active',
    phone: '+91 99012 44391',
    aadhaarVerified: true,
    medicalFitnessValid: true,
    supervisorName: 'Vikram Singh',
    experienceYears: 2,
  },
  {
    id: 'BE-0111',
    name: 'Anil Kumar Nishad',
    photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    role: 'Assembly Line Operator',
    nativeState: 'Uttar Pradesh',
    nativeDistrict: 'Mirzapur',
    clientCompany: 'TVS Motor Supplier / Two-Wheeler Assembly',
    clientLocation: 'Kadakola Belt, Mysore',
    shift: 'Shift B (14:00 - 22:00)',
    joiningDate: '2022-01-10',
    status: 'Active',
    phone: '+91 94483 55902',
    aadhaarVerified: true,
    medicalFitnessValid: true,
    supervisorName: 'M. Ramesh',
    experienceYears: 3,
  },
  {
    id: 'BE-0112',
    name: 'Babulal Murmu',
    photo: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    role: 'Material Handler',
    nativeState: 'Jharkhand',
    nativeDistrict: 'Giridih',
    clientCompany: 'AutoTech Precision Ancillary Components',
    clientLocation: 'Hebbal Industrial Estate',
    shift: 'Shift B (14:00 - 22:00)',
    joiningDate: '2023-08-01',
    status: 'Active',
    phone: '+91 98459 33418',
    aadhaarVerified: true,
    medicalFitnessValid: true,
    supervisorName: 'K. Somanna',
    experienceYears: 1,
  }
];

const INITIAL_ATTENDANCE = {
  'BE-0101': 'Present',
  'BE-0102': 'Present',
  'BE-0103': 'Present',
  'BE-0104': 'Present',
  'BE-0105': 'Present',
  'BE-0106': 'Present',
  'BE-0107': 'Present',
  'BE-0108': 'Shift Swapped',
  'BE-0109': 'Present',
  'BE-0110': 'Absent',
  'BE-0111': 'Present',
  'BE-0112': 'Present',
};

const INITIAL_PROPOSALS = [
  {
    id: 'prop-101',
    companyName: 'Apex Auto Spares Mysore',
    contactName: 'Vijay Kumar',
    phone: '+91 98450 12345',
    email: 'vijay@apexauto.in',
    workersCount: 30,
    industry: 'Automotive & Two-Wheeler',
    shiftRequirement: '2 Shifts (A & B)',
    location: 'Kadakola Industrial Area',
    estimatedMonthlyTotal: 967200,
    status: 'Under Review',
    submittedAt: '2026-03-20T10:30:00.000Z',
    notes: 'Urgent need for 30 assembly helpers for expanded shop floor line.'
  }
];

// Data Store Singleton
class Store {
  constructor() {
    this.admin = { ...ADMIN_CREDENTIALS };
    this.clients = [...INITIAL_CLIENTS];
    this.employees = [...INITIAL_EMPLOYEES];
    this.attendance = { ...INITIAL_ATTENDANCE };
    this.proposals = [...INITIAL_PROPOSALS];
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
    const id = `cli-0${nextNum}`;
    const password = clientData.password || generateStrongPassword(16);
    
    const newClient = {
      id,
      name: clientData.name || 'New Client Company',
      industry: clientData.industry || 'General Industrial',
      location: clientData.location || 'Mysore Industrial Belt',
      assignedWorkers: Number(clientData.assignedWorkers) || 15,
      activeShifts: clientData.activeShifts || ['Shift A (06:00 - 14:00)'],
      contactPerson: clientData.contactPerson || 'Site Contact',
      contactEmail: clientData.contactEmail || `hr@${(clientData.name || 'client').toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
      contactPhone: clientData.contactPhone || '+91 94800 00000',
      contractStatus: clientData.contractStatus || 'Active',
      logoPlaceholder: (clientData.name || 'PLANT').slice(0, 6).toUpperCase(),
      deploymentSince: clientData.deploymentSince || '2026',
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
    const id = `BE-0${nextNum}`;
    const newEmp = {
      id,
      name: empData.name,
      photo: empData.photo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      role: empData.role || 'Assembly Line Operator',
      nativeState: empData.nativeState || 'Uttar Pradesh',
      nativeDistrict: empData.nativeDistrict || 'Varanasi',
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
      id: `prop-${Date.now()}`,
      ...proposalData,
      status: 'New',
      submittedAt: new Date().toISOString(),
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
