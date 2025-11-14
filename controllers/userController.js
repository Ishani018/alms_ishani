const User = require('../models/userModel');

// List all users
exports.listUsers = (req, res) => {
  User.getAll((err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

// Get user by ID
exports.getUserById = (req, res) => {
  User.findById(req.params.id, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) return res.status(404).json({ message: "User not found" });
    res.json(results[0]);
  });
};

// Create new user
exports.createUser = (req, res) => {
  User.create(req.body, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "User created", id: result.insertId });
  });
};

// Update user details
exports.updateUser = (req, res) => {
  User.update(req.params.id, req.body, (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "User updated" });
  });
};

// Delete user
exports.deleteUser = (req, res) => {
  User.delete(req.params.id, (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "User deleted" });
  });
};

// List users by role (e.g. employee/manager/admin)
exports.listByRole = (req, res) => {
  User.findByRole(req.params.role, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};
