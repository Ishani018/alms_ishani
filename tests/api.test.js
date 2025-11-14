const request = require('supertest');
const app = require('../app'); // Your Express app

describe('Authentication', () => {
  test('should login a valid user', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'user@example.com', password: 'password123' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('role');
    expect(res.body).toHaveProperty('id');
  });

  test('should NOT login with wrong creds', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'user@example.com', password: 'wrong' });
    expect(res.statusCode).toBe(401);
    expect(res.text).toMatch(/Invalid email or password/);
  });
});

describe('Registration', () => {
  test('should register a new user', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ name: 'TestUser', email: 'newuser@example.com', password: 'pass123', role: 'employee' });
    expect(res.statusCode).toBe(200);
    expect(res.text).toMatch(/User registered successfully/);
  });
});

// And so on for leaves endpoints...
