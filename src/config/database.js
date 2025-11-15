/**
 * Database Configuration
 * 
 * @fileoverview MongoDB connection configuration
 * @author ALMS Team
 */

const mongoose = require('mongoose');

/**
 * Connect to MongoDB database
 * @returns {Promise<void>}
 */
const connectDB = async () => {
  // Skip connection if already connected or in test environment
  if (mongoose.connection.readyState === 1) {
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/alms_db');

    if (process.env.NODE_ENV !== 'test') {
      // eslint-disable-next-line no-console
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`❌ MongoDB connection error: ${error.message}`);
    // Don't exit process in test environment
    if (process.env.NODE_ENV !== 'test') {
      process.exit(1);
    }
    throw error;
  }
};

module.exports = connectDB;

