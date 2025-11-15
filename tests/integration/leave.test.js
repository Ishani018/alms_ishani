/**
 * Leave Management Integration Tests
 * 
 * @fileoverview Integration tests for leave management endpoints
 * @author ALMS Team
 */

const request = require('supertest');
const app = require('../../src/app');
const User = require('../../src/models/User');
const Leave = require('../../src/models/Leave');
const LeaveBalance = require('../../src/models/LeaveBalance');
const { setupTestDB, closeTestDB, clearTestDB } = require('../setup/mongodb');

describe('Leave Management API', () => {
  let employeeToken;
  let managerToken;
  let employeeId;
  let managerId;

  beforeAll(async () => {
    await setupTestDB();
  }, 30000);

  afterAll(async () => {
    await closeTestDB();
  }, 30000);

  beforeEach(async () => {
    await clearTestDB();

    // Create employee
    const employeeResponse = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'John Employee',
        email: 'employee@example.com',
        password: 'password123',
        role: 'employee'
      });
    employeeToken = employeeResponse.body.token;
    employeeId = employeeResponse.body.user._id;

    // Create manager
    const managerResponse = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Jane Manager',
        email: 'manager@example.com',
        password: 'password123',
        role: 'manager'
      });
    managerToken = managerResponse.body.token;
    managerId = managerResponse.body.user._id;

    // Set manager for employee
    await User.findByIdAndUpdate(employeeId, { managerId });

    // Initialize leave balance
    await LeaveBalance.create({
      employeeId,
      year: new Date().getFullYear(),
      balances: {
        casual: { total: 10, used: 0, available: 10, pending: 0 },
        annual: { total: 15, used: 0, available: 15, pending: 0 }
      }
    });
  });

  describe('POST /api/leaves', () => {
    it('should create a leave request', async () => {
      const leaveData = {
        leaveType: 'casual',
        startDate: '2025-12-01',
        endDate: '2025-12-03',
        reason: 'Personal work'
      };

      const response = await request(app)
        .post('/api/leaves')
        .set('Authorization', `Bearer ${employeeToken}`)
        .send(leaveData)
        .expect(201);

      expect(response.body.leave).toBeDefined();
      expect(response.body.leave.leaveType).toBe(leaveData.leaveType);
      expect(response.body.leave.status).toBe('pending');
    });

    it('should return 401 without authentication', async () => {
      await request(app)
        .post('/api/leaves')
        .send({})
        .expect(401);
    });
  });

  describe('GET /api/leaves', () => {
    it('should get all leaves for authenticated user', async () => {
      // Create a leave first
      await request(app)
        .post('/api/leaves')
        .set('Authorization', `Bearer ${employeeToken}`)
        .send({
          leaveType: 'casual',
          startDate: '2025-12-01',
          endDate: '2025-12-03',
          reason: 'Personal work'
        });

      const response = await request(app)
        .get('/api/leaves')
        .set('Authorization', `Bearer ${employeeToken}`)
        .expect(200);

      expect(response.body.leaves).toBeDefined();
      expect(Array.isArray(response.body.leaves)).toBe(true);
    });
  });

  describe('POST /api/leaves/:id/approve', () => {
    it('should approve a leave request', async () => {
      // Ensure employee has manager set
      const employee = await User.findById(employeeId);
      if (!employee.managerId || employee.managerId.toString() !== managerId.toString()) {
        employee.managerId = managerId;
        await employee.save();
      }

      // Create a leave
      const leaveResponse = await request(app)
        .post('/api/leaves')
        .set('Authorization', `Bearer ${employeeToken}`)
        .send({
          leaveType: 'casual',
          startDate: '2025-12-01',
          endDate: '2025-12-03',
          reason: 'Personal work'
        });

      const leaveId = leaveResponse.body.leave._id;

      // Approve the leave
      const response = await request(app)
        .post(`/api/leaves/${leaveId}/approve`)
        .set('Authorization', `Bearer ${managerToken}`)
        .expect(200);

      expect(response.body.leave.status).toBe('approved');
    });
  });
});

