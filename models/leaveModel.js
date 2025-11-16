const db = require('../config/db');

const Leave = {
  create: (data, callback) => {
    const sql = 'INSERT INTO leaves (employee_id, start_date, end_date, reason, status) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [data.employee_id, data.start_date, data.end_date, data.reason, 'Pending'], callback);
  },

  getAll: callback => {
    db.query('SELECT * FROM leaves', callback);
  },

  updateStatus: (id, status, callback) => {
    db.query('UPDATE leaves SET status = ? WHERE id = ?', [status, id], callback);
  },

  getByEmployee: (id, callback) => {
    db.query('SELECT * FROM leaves WHERE employee_id = ?', [id], callback);
  }
};

module.exports = Leave;
