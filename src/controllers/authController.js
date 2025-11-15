/**
 * Authentication Controller
 * 
 * @fileoverview Request handlers for authentication
 * @author ALMS Team
 */

const authService = require('../services/authService');

/**
 * Register a new user
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password, role, employeeId, department } = req.body;

    const result = await authService.register({
      name,
      email,
      password,
      role,
      employeeId,
      department
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: result.user,
      token: result.token
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Login user
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const result = await authService.login(email, password);

    res.status(200).json({
      message: 'Login successful',
      user: result.user,
      token: result.token
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get current user profile
 */
const getProfile = async (req, res, next) => {
  try {
    const user = await authService.getProfile(req.user._id);

    res.status(200).json({
      user
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getProfile
};

