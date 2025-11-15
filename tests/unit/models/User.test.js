/**
 * User Model Tests
 * 
 * @fileoverview Unit tests for User model
 * @author ALMS Team
 */

const User = require('../../../src/models/User');
const { setupTestDB, closeTestDB, clearTestDB } = require('../../setup/mongodb');

describe('User Model', () => {
  beforeAll(async () => {
    await setupTestDB();
  }, 30000);

  afterAll(async () => {
    await closeTestDB();
  }, 30000);

  beforeEach(async () => {
    await clearTestDB();
  });

  describe('User Creation', () => {
    it('should create a user with valid data', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'employee'
      };

      const user = await User.create(userData);
      expect(user.name).toBe(userData.name);
      expect(user.email).toBe(userData.email);
      expect(user.role).toBe('employee');
      expect(user.password).not.toBe(userData.password); // Should be hashed
    });

    it('should not create user without required fields', async () => {
      const userData = {
        name: 'John Doe'
      };

      await expect(User.create(userData)).rejects.toThrow();
    });

    it('should hash password before saving', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
      };

      const user = await User.create(userData);
      expect(user.password).not.toBe('password123');
      expect(user.password.length).toBeGreaterThan(20); // Bcrypt hash length
    });
  });

  describe('Password Comparison', () => {
    it('should compare password correctly', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
      };

      const user = await User.create(userData);
      const isMatch = await user.comparePassword('password123');
      expect(isMatch).toBe(true);

      const isWrong = await user.comparePassword('wrongpassword');
      expect(isWrong).toBe(false);
    });
  });

  describe('User JSON', () => {
    it('should not include password in JSON output', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
      };

      const user = await User.create(userData);
      const userJSON = user.toJSON();
      expect(userJSON.password).toBeUndefined();
    });
  });
});

