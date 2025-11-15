/**
 * Validation Middleware
 * 
 * @fileoverview Request validation middleware using express-validator
 * @author ALMS Team
 */

const { validationResult } = require('express-validator');

/**
 * Validate request and return errors if any
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      code: 'VALIDATION_ERROR',
      errors: errors.array()
    });
  }
  next();
};

module.exports = validate;

