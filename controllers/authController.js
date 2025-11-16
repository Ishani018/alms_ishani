const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db'); // Make sure this points to your MySQL connection

exports.login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).send('Email and password required');

  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) return res.status(500).send('Server error');
    if (results.length === 0) return res.status(401).send('Invalid email or password');
    const user = results[0];

    // For demo, plain password comparison (replace with bcrypt.compare in production)
    if (user.password !== password) return res.status(401).send('Invalid email or password');

    // Create JWT token including user ID and role
    const token = jwt.sign({ id: user.id, role: user.role }, 'secretkey');
    res.json({
      token,
      role: user.role,
      id: user.id
    });
  });
};

// Registration handler (optional - only if you want register page)
exports.register = (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) return res.status(400).send('All fields required');
  // For demo, plain text password (replace with bcrypt.hash for production)
  db.query(
    'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
    [name, email, password, role],
    (err, result) => {
      if (err) return res.status(500).send('Could not register');
      res.send('User registered successfully');
    }
  );
};
