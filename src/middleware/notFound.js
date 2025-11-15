/**
 * Not Found Middleware
 * 
 * @fileoverview Middleware for handling 404 errors
 * @author ALMS Team
 */

/**
 * Handle 404 Not Found errors
 */
const notFound = (req, res, _next) => {
  res.status(404).json({
    error: `Route ${req.originalUrl} not found`,
    code: 'NOT_FOUND'
  });
};

module.exports = notFound;

