const request = require('supertest');
const db = require('../config/db');
const jwt = require('jsonwebtoken');

// Mock database and JWT before requiring app
jest.mock('../config/db', () => ({
  query: jest.fn()
}));
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => 'mock-token')
}));

const app = require('../app');

beforeAll(() => {
  // Setup mock database responses
  db.query.mockImplementation((sql, params, callback) => {
    if (sql.includes('INSERT INTO users')) {
      callback(null, { insertId: 1 });
    } else if (sql.includes('SELECT * FROM users WHERE email')) {
      if (params && params[0] === 'user@example.com') {
        callback(null, [{ id: 1, email: 'user@example.com', password: 'password123', role: 'employee', name: 'Test User' }]);
      } else if (params && params[0] === 'newuser@example.com') {
        callback(null, []);
      } else {
        callback(null, []);
      }
    } else {
      callback(null, []);
    }
  });
});

afterAll(() => {
  jest.clearAllMocks();
});

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
    expect([200, 201]).toContain(res.statusCode);
    expect(res.text).toMatch(/User registered successfully/);
  });
});