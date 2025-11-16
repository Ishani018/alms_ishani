// In config/db.js
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'your_local_username',
  password: process.env.DB_PASSWORD || 'your_local_password',
  database: process.env.DB_NAME || 'your_local_database_name'
});

// Handle connection errors gracefully (especially in test environments)
db.on('error', (err) => {
  // In test environment, ignore connection errors as we use mocks
  if (process.env.NODE_ENV === 'test' || process.env.JEST_WORKER_ID) {
    // Silently ignore connection errors in tests
    return;
  }
  console.error('Database connection error:', err);
});

module.exports = db;
