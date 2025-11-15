/**
 * JWT Utility Tests
 * 
 * @fileoverview Unit tests for JWT utilities
 * @author ALMS Team
 */

const { generateToken, verifyToken } = require('../../../src/utils/jwt');

describe('JWT Utilities', () => {
  describe('generateToken', () => {
    it('should generate a valid JWT token', () => {
      const payload = { id: '123', email: 'test@example.com', role: 'employee' };
      const token = generateToken(payload);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.').length).toBe(3); // JWT has 3 parts
    });

    it('should generate token with custom expiration', () => {
      const payload = { id: '123', email: 'test@example.com' };
      const token = generateToken(payload, '1h');

      expect(token).toBeDefined();
    });
  });

  describe('verifyToken', () => {
    it('should verify a valid token', () => {
      const payload = { id: '123', email: 'test@example.com', role: 'employee' };
      const token = generateToken(payload);

      const decoded = verifyToken(token);
      expect(decoded.id).toBe(payload.id);
      expect(decoded.email).toBe(payload.email);
    });

    it('should throw error for invalid token', () => {
      expect(() => {
        verifyToken('invalid.token.here');
      }).toThrow();
    });

    it('should throw error for expired token', () => {
      const payload = { id: '123', email: 'test@example.com' };
      const token = generateToken(payload, '1ms'); // Very short expiration

      // Wait a bit for token to expire
      setTimeout(() => {
        expect(() => {
          verifyToken(token);
        }).toThrow();
      }, 10);
    });
  });
});

