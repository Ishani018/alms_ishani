/**
 * Error Handler Middleware Tests
 * 
 * @fileoverview Unit tests for error handler middleware
 * @author ALMS Team
 */

const errorHandler = require('../../../src/middleware/errorHandler');

describe('Error Handler Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    process.env.NODE_ENV = 'test';
  });

  it('should handle CastError with 404', () => {
    const err = {
      name: 'CastError',
      message: 'Cast to ObjectId failed'
    };

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'Resource not found'
      })
    );
  });

  it('should handle duplicate key error with 400', () => {
    const err = {
      code: 11000,
      keyValue: { email: 'test@example.com' }
    };

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'email already exists'
      })
    );
  });

  it('should handle ValidationError with 400', () => {
    const err = {
      name: 'ValidationError',
      errors: {
        email: { message: 'Email is required' },
        password: { message: 'Password is required' }
      }
    };

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.stringContaining('Email is required')
      })
    );
  });

  it('should handle JsonWebTokenError with 401', () => {
    const err = {
      name: 'JsonWebTokenError',
      message: 'Invalid token'
    };

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'Invalid token'
      })
    );
  });

  it('should handle TokenExpiredError with 401', () => {
    const err = {
      name: 'TokenExpiredError',
      message: 'Token expired'
    };

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'Token expired'
      })
    );
  });

  it('should handle authentication errors with 401', () => {
    const err = {
      message: 'Invalid credentials'
    };

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'Invalid credentials'
      })
    );
  });

  it('should handle authorization errors with 403', () => {
    const err = {
      message: 'Access denied. Insufficient permissions'
    };

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'Access denied. Insufficient permissions'
      })
    );
  });

  it('should handle generic errors with 500', () => {
    const err = {
      message: 'Some unexpected error'
    };

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'Some unexpected error'
      })
    );
  });
});

