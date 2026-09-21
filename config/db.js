const mongoose = require('mongoose');

let cachedConnection = null;

const DEFAULT_MONGO_URL = 'mongodb+srv://nitinguttedar2000_db_user:hZbIDZU5FY3htIND@cluster0.f7a5bfy.mongodb.net/sbe_enterprise?retryWrites=true&w=majority';

/**
 * Connect to MongoDB with caching for serverless/Vercel and standard Node.js
 */
async function connectDB() {
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }

  const uri = process.env.MONGO_URI || process.env.MONGO_URL || DEFAULT_MONGO_URL;

  try {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
    };

    const conn = await mongoose.connect(uri, opts);
    cachedConnection = conn;
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host} (DB: ${conn.connection.name})`);

    // Run initial seed if needed in the background
    const { seedInitialData } = require('../utils/seedData');
    seedInitialData().catch((err) => {
      console.error('[MongoDB] Initial seeding error:', err.message);
    });

    return conn;
  } catch (error) {
    console.error(`[MongoDB] Connection failed: ${error.message}`);
    // Do not crash the entire process if MongoDB fails initially - fallback to in-memory store
    return null;
  }
}

/**
 * Check if MongoDB is currently connected
 */
function isDbConnected() {
  return mongoose.connection.readyState === 1;
}

module.exports = {
  connectDB,
  isDbConnected,
};
