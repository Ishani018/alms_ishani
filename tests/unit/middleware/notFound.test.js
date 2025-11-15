/**
 * Not Found Middleware Tests
 * 
 * @fileoverview Unit tests for not found middleware
 * @author ALMS Team
 */

const request = require('supertest');
const app = require('../../src/app');
const { setupTestDB, closeTestDB } = require('../../setup/mongodb');

describe('Not Found Middleware', () => {
  beforeAll(async () => {
    await setupTestDB();
  }, 30000);

  afterAll(async () => {
    await closeTestDB();
  }, 30000);

  it('should return 404 for non-existent route', async () => {
    const response = await request(app)
      .get('/api/nonexistent/route')
      .expect(404);

    expect(response.body.error).toContain('not found');
    expect(response.body.code).toBe('NOT_FOUND');
  });

  it('should return 404 for invalid API endpoint', async () => {
    const response = await request(app)
      .get('/api/invalid')
      .expect(404);

    expect(response.body.error).toBeDefined();
    expect(response.body.code).toBe('NOT_FOUND');
  });
});

