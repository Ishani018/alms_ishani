/**
 * Auth Controller Error Handling Tests
 * 
 * @fileoverview Integration tests for auth controller error handling
 * @author ALMS Team
 */

const request = require('supertest');
const app = require('../../src/app');
const { setupTestDB, closeTestDB, clearTestDB } = require('../setup/mongodb');

describe('Auth Controller Error Handling', () => {
  beforeAll(async () => {
    await setupTestDB();
  }, 30000);

  afterAll(async () => {
    await closeTestDB();
  }, 30000);

  beforeEach(async () => {
    await clearTestDB();
  });

  describe('Error Handling', () => {
    it('should handle registration errors', async () => {
      // Register first time
      await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123'
        });

      // Try to register again with same email
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123'
        })
        .expect(400);

      expect(response.body.error).toBeDefined();
    });

    it('should handle login errors', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'wrongpassword'
        })
        .expect(401);

      expect(response.body.error).toBeDefined();
    });
  });
});

