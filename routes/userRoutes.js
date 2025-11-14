const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// List all users
router.get('/', userController.listUsers);

// Get single user by ID
router.get('/:id', userController.getUserById);

// Create user
router.post('/', userController.createUser);

// Update user by ID
router.put('/:id', userController.updateUser);

// Delete user by ID
router.delete('/:id', userController.deleteUser);

// List users by role
router.get('/role/:role', userController.listByRole);

module.exports = router;
