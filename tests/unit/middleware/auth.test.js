/**
 * Authentication Middleware Tests
 * 
 * @fileoverview Unit tests for authentication middleware
 * @author ALMS Team
 */

const request = require('supertest');
const app = require('../../src/app');
const User = require('../../src/models/User');
const { setupTestDB, closeTestDB, clearTestDB } = require('../../setup/mongodb');
const { generateToken } = require('../../src/utils/jwt');

describe('Authentication Middleware', () => {
  let userToken;
  let userId;

  beforeAll(async () => {
    await setupTestDB();
  }, 30000);

  afterAll(async () => {
    await closeTestDB();
  }, 30000);

  beforeEach(async () => {
    await clearTestDB();

    const user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'employee'
    });

    userId = user._id;
    userToken = generateToken({ id: user._id, email: user.email, role: user.role });
  });

  describe('authenticate middleware', () => {
    it('should allow access with valid token', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.user).toBeDefined();
    });

    it('should reject request without token', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .expect(401);

      expect(response.body.error).toContain('Authentication required');
    });

    it('should reject request with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', 'Bearer invalid_token')
        .expect(401);

      expect(response.body.error).toBeDefined();
    });

    it('should reject request with inactive user', async () => {
      await User.findByIdAndUpdate(userId, { isActive: false });

      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(401);

      expect(response.body.error).toContain('inactive');
    });
  });

  describe('authorize middleware', () => {
    it('should allow access for authorized role', async () => {
      const manager = await User.create({
        name: 'Manager',
        email: 'manager@example.com',
        password: 'password123',
        role: 'manager'
      });

      const managerToken = generateToken({
        id: manager._id,
        email: manager.email,
        role: manager.role
      });

      const response = await request(app)
        .get('/api/leaves/approvals/pending')
        .set('Authorization', `Bearer ${managerToken}`)
        .expect(200);

      expect(response.body).toBeDefined();
    });

    it('should reject access for unauthorized role', async () => {
      const response = await request(app)
        .get('/api/leaves/approvals/pending')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);

      expect(response.body.error).toContain('Access denied');
    });
  });
});

