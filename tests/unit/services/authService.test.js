/**
 * Auth Service Tests
 * 
 * @fileoverview Unit tests for authentication service
 * @author ALMS Team
 */

const mongoose = require('mongoose');
const authService = require('../../../src/services/authService');
const User = require('../../../src/models/User');
const { setupTestDB, closeTestDB, clearTestDB } = require('../../setup/mongodb');

describe('Auth Service', () => {
  beforeAll(async () => {
    await setupTestDB();
  }, 30000);

  afterAll(async () => {
    await closeTestDB();
  }, 30000);

  beforeEach(async () => {
    await clearTestDB();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john1@example.com',
        password: 'password123',
        role: 'employee'
      };

      const result = await authService.register(userData);
      expect(result.user).toBeDefined();
      expect(result.token).toBeDefined();
      expect(result.user.email).toBe(userData.email);
    });

    it('should throw error if user already exists', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john2@example.com',
        password: 'password123'
      };

      await authService.register(userData);
      await expect(authService.register(userData)).rejects.toThrow('already exists');
    });
  });

  describe('login', () => {
    it('should login user with correct credentials', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john3@example.com',
        password: 'password123'
      };

      await authService.register(userData);
      const result = await authService.login(userData.email, userData.password);

      expect(result.user).toBeDefined();
      expect(result.token).toBeDefined();
      expect(result.user.email).toBe(userData.email);
    });

    it('should throw error with incorrect password', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john4@example.com',
        password: 'password123'
      };

      await authService.register(userData);
      await expect(authService.login(userData.email, 'wrongpassword')).rejects.toThrow('Invalid credentials');
    });

    it('should throw error with non-existent email', async () => {
      await expect(authService.login('nonexistent@example.com', 'password123')).rejects.toThrow('Invalid credentials');
    });
  });

  describe('getProfile', () => {
    it('should get user profile', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john5@example.com',
        password: 'password123'
      };

      const result = await authService.register(userData);
      const profile = await authService.getProfile(result.user._id);

      expect(profile).toBeDefined();
      expect(profile.email).toBe(userData.email);
    });

    it('should throw error if user not found', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      await expect(authService.getProfile(fakeId)).rejects.toThrow('User not found');
    });
  });
});

