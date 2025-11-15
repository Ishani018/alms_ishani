/**
 * Leave Balance Integration Tests
 * 
 * @fileoverview Integration tests for leave balance endpoints
 * @author ALMS Team
 */

const request = require('supertest');
const app = require('../../src/app');
const { setupTestDB, closeTestDB, clearTestDB } = require('../setup/mongodb');

describe('Leave Balance API', () => {
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

    // Create user
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'employee'
      });

    userToken = response.body.token;
    userId = response.body.user._id;
  });

  describe('GET /api/leave-balance', () => {
    it('should get leave balance for authenticated user', async () => {
      const response = await request(app)
        .get('/api/leave-balance')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.balance).toBeDefined();
      expect(response.body.balance.balances).toBeDefined();
    });

    it('should return 401 without authentication', async () => {
      await request(app)
        .get('/api/leave-balance')
        .expect(401);
    });
  });
});

