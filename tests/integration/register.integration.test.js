const request = require('supertest');
const app = require('../../server/app');
const db = require('../config/db');

// Integration test for POST /api/auth/register
describe('POST /api/auth/register', () => {
  const testEmail = `integration_test_${Date.now()}@example.com`;

  afterAll(done => {
    // Clean up created user and close DB connection
    db.query('DELETE FROM users WHERE email = ?', [testEmail], (err) => {
      // close connection gracefully
      try { db.end(); } catch (e) {}
      done(err);
    });
  });

  test('registers a new user and returns success message', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .set('Accept', 'application/json')
      .send({ name: 'IntegrationTest', email: testEmail, password: 'testpass', role: 'employee' });

    // Controller sends plain text 'User registered successfully' on success
    expect([200, 201]).toContain(res.statusCode);
    expect(res.text).toMatch(/User registered successfully/);
  });
});
