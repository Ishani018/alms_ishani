// In config/db.js
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'your_local_username',
  password: process.env.DB_PASSWORD || 'your_local_password',
  database: process.env.DB_NAME || 'your_local_database_name'
});

module.exports = db;