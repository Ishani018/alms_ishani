const db = require('../config/db');

const User = {
  create: (data, callback) => {
    const sql = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';
    db.query(sql, [data.name, data.email, data.password, data.role], callback);
  },

  findByEmail: (email, callback) => {
    db.query('SELECT * FROM users WHERE email = ?', [email], callback);
  },

  getAll: (callback) => {
    db.query('SELECT * FROM users', callback);
  },

  findById: (id, callback) => {
    db.query('SELECT * FROM users WHERE id = ?', [id], callback);
  },

  update: (id, data, callback) => {
    const { name, email, role } = data;
    db.query('UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?', [name, email, role, id], callback);
  },

  delete: (id, callback) => {
    db.query('DELETE FROM users WHERE id = ?', [id], callback);
  },

  findByRole: (role, callback) => {
    db.query('SELECT * FROM users WHERE role = ?', [role], callback);
  }
};

module.exports = User;
