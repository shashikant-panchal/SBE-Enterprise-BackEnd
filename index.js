const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const clientRoutes = require('./routes/clientRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const proposalRoutes = require('./routes/proposalRoutes');
const reportRoutes = require('./routes/reportRoutes');

const app = express();
const PORT = process.env.PORT || 5001;

// Enable CORS for all incoming origins (frontend dev & Vercel production)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const { connectDB, isDbConnected } = require('./config/db');

// Connect to MongoDB
connectDB();

// Root Route: SBE enterprise in running in prod message as requested
app.get('/', (req, res) => {
  res.status(200).send('SBE enterprise in running in prod');
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'SBE enterprise in running in prod',
    database: isDbConnected() ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Mount modular API routes
app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/proposals', proposalRoutes);
app.use('/api/reports', reportRoutes);

// 404 Handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found on SBE Enterprise Backend.',
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('SBE Backend Error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: err.message,
  });
});

// Only listen if not running in a serverless environment (e.g. local development)
if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`=================================================`);
    console.log(`SBE Enterprise Backend running on port ${PORT}`);
    console.log(`Root: http://localhost:${PORT}/ ("SBE enterprise in running in prod")`);
    console.log(`Health: http://localhost:${PORT}/api/health`);
    console.log(`=================================================`);
  });
}

// Export app for Vercel serverless functions
module.exports = app;
