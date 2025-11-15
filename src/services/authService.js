/**
 * Authentication Service
 * 
 * @fileoverview Business logic for authentication
 * @author ALMS Team
 */

const User = require('../models/User');
const { generateToken } = require('../utils/jwt');

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} User and token
 */
const register = async (userData) => {
  const { name, email, password, role, employeeId, department } = userData;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role: role || 'employee',
    employeeId,
    department
  });

  // Generate token
  const token = generateToken({ id: user._id, email: user.email, role: user.role });

  return {
    user,
    token
  };
};

/**
 * Login user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} User and token
 */
const login = async (email, password) => {
  // Find user and include password
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw new Error('Invalid credentials');
  }

  if (!user.isActive) {
    throw new Error('Account is inactive');
  }

  // Check password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  // Generate token
  const token = generateToken({ id: user._id, email: user.email, role: user.role });

  return {
    user: user.toJSON(),
    token
  };
};

/**
 * Get current user profile
 * @param {string} userId - User ID
 * @returns {Promise<Object>} User profile
 */
const getProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

module.exports = {
  register,
  login,
  getProfile
};

