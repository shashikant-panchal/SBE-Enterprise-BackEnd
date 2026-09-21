const mongoose = require('mongoose');

let cachedConnection = null;
let lastConnectionError = null;

const DEFAULT_MONGO_URL = 'mongodb+srv://nitinguttedar2000_db_user:hZbIDZU5FY3htIND@cluster0.f7a5bfy.mongodb.net/sbe_enterprise?retryWrites=true&w=majority';

/**
 * Connect to MongoDB with caching for serverless/Vercel and standard Node.js
 */
async function connectDB() {
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }

  // If connection is in progress, wait for it instead of trying to connect multiple times
  if (mongoose.connection.readyState === 2) {
    return new Promise((resolve) => {
      mongoose.connection.once('connected', () => {
        lastConnectionError = null;
        resolve(cachedConnection || mongoose.connection);
      });
      mongoose.connection.once('error', (err) => {
        lastConnectionError = err.message;
        resolve(null);
      });
    });
  }

  const uri = process.env.MONGO_URI || process.env.MONGO_URL || DEFAULT_MONGO_URL;

  try {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    };

    const conn = await mongoose.connect(uri, opts);
    cachedConnection = conn;
    lastConnectionError = null;
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host} (DB: ${conn.connection.name})`);

    // Ensure initial seed / admin exists
    const { seedInitialData } = require('../utils/seedData');
    seedInitialData().catch((err) => {
      console.error('[MongoDB] Initial seeding error:', err.message);
    });

    return conn;
  } catch (error) {
    lastConnectionError = error.message;
    console.error(`[MongoDB] Connection failed: ${error.message}`);
    return null;
  }
}

/**
 * Check if MongoDB is currently connected
 */
function isDbConnected() {
  return mongoose.connection.readyState === 1;
}

function getLastConnectionError() {
  return lastConnectionError;
}

module.exports = {
  connectDB,
  isDbConnected,
  getLastConnectionError,
};
