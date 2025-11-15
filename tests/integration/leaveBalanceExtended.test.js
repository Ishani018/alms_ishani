/**
 * Extended Leave Balance Integration Tests
 * 
 * @fileoverview Additional integration tests for leave balance
 * @author ALMS Team
 */

const request = require('supertest');
const app = require('../../src/app');
const { setupTestDB, closeTestDB, clearTestDB } = require('../setup/mongodb');

describe('Extended Leave Balance API', () => {
  let userToken;

  beforeAll(async () => {
    await setupTestDB();
  }, 30000);

  afterAll(async () => {
    await closeTestDB();
  }, 30000);

  beforeEach(async () => {
    await clearTestDB();

    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'password123',
        role: 'employee'
      });

    userToken = response.body.token;
  });

  describe('GET /api/leave-balance with year parameter', () => {
    it('should get leave balance for specific year', async () => {
      const response = await request(app)
        .get('/api/leave-balance?year=2024')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.balance).toBeDefined();
      expect(response.body.balance.year).toBe(2024);
    });
  });
});

