/**
 * Error Handler Middleware
 * 
 * @fileoverview Global error handling middleware
 * @author ALMS Team
 */

/**
 * Global error handler
 */
const errorHandler = (err, req, res, _next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  // eslint-disable-next-line no-console
  console.error('Error:', err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = { message, statusCode: 404 };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${field} already exists`;
    error = { message, statusCode: 400 };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = { message, statusCode: 400 };
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = { message, statusCode: 401 };
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = { message, statusCode: 401 };
  }

  // Authentication/Authorization errors
  if (err.message && (
    err.message.includes('Invalid credentials') ||
    err.message.includes('Authentication required') ||
    err.message.includes('User not found or inactive') ||
    err.message.includes('Invalid or expired token')
  )) {
    error = { message: err.message, statusCode: 401 };
  }

  if (err.message && (
    err.message.includes('Access denied') ||
    err.message.includes('Insufficient permissions') ||
    err.message.includes('not authorized')
  )) {
    error = { message: err.message, statusCode: 403 };
  }

  // Handle specific business logic errors
  if (err.message && (
    err.message.includes('Leave not found') ||
    err.message.includes('User with this email already exists') ||
    err.message.includes('You can only update your own leave requests') ||
    err.message.includes('You can only cancel your own leave requests') ||
    err.message.includes('Only pending leaves can be updated') ||
    err.message.includes('Only pending leaves can be cancelled') ||
    err.message.includes('Only pending leaves can be approved') ||
    err.message.includes('Only pending leaves can be rejected')
  )) {
    error = { message: err.message, statusCode: 400 };
  }

  res.status(error.statusCode || 500).json({
    error: error.message || 'Server Error',
    code: error.code || 'INTERNAL_ERROR',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;

