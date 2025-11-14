const mysql = require('mysql2');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Harrystyles_123',
  database: 'leave_management'
});

connection.connect(err => {
  if (err) throw err;
  console.log('MySQL connected...');
});

module.exports = connection;
