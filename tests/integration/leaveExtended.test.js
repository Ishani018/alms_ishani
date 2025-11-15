/**
 * Extended Leave Management Integration Tests
 * 
 * @fileoverview Additional integration tests for leave management
 * @author ALMS Team
 */

const request = require('supertest');
const app = require('../../src/app');
const User = require('../../src/models/User');
const Leave = require('../../src/models/Leave');
const { setupTestDB, closeTestDB, clearTestDB } = require('../setup/mongodb');

describe('Extended Leave Management API', () => {
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
        email: 'employee2@example.com',
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
        email: 'manager2@example.com',
        password: 'password123',
        role: 'manager'
      });
    managerToken = managerResponse.body.token;
    managerId = managerResponse.body.user._id;

    // Set manager for employee
    await User.findByIdAndUpdate(employeeId, { managerId });
  });

  describe('GET /api/leaves/:id', () => {
    it('should get a specific leave by ID', async () => {
      // Create a leave first
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

      // Wait a bit for the leave to be saved
      await new Promise(resolve => setTimeout(resolve, 100));

      // Get the leave
      const response = await request(app)
        .get(`/api/leaves/${leaveId}`)
        .set('Authorization', `Bearer ${employeeToken}`)
        .expect(200);

      expect(response.body.leave).toBeDefined();
      expect(response.body.leave._id).toBe(leaveId);
    });
  });

  describe('PUT /api/leaves/:id', () => {
    it('should update a pending leave request', async () => {
      // Create a leave
      const leaveResponse = await request(app)
        .post('/api/leaves')
        .set('Authorization', `Bearer ${employeeToken}`)
        .send({
          leaveType: 'casual',
          startDate: '2025-12-01',
          endDate: '2025-12-03',
          reason: 'Original reason'
        });

      const leaveId = leaveResponse.body.leave._id;

      // Update the leave
      const response = await request(app)
        .put(`/api/leaves/${leaveId}`)
        .set('Authorization', `Bearer ${employeeToken}`)
        .send({
          reason: 'Updated reason'
        })
        .expect(200);

      expect(response.body.leave.reason).toBe('Updated reason');
    });
  });

  describe('DELETE /api/leaves/:id', () => {
    it('should cancel a leave request', async () => {
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

      // Cancel the leave
      const response = await request(app)
        .delete(`/api/leaves/${leaveId}`)
        .set('Authorization', `Bearer ${employeeToken}`)
        .expect(200);

      expect(response.body.leave.status).toBe('cancelled');
    });
  });

  describe('POST /api/leaves/:id/reject', () => {
    it('should reject a leave request', async () => {
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

      // Reject the leave
      const response = await request(app)
        .post(`/api/leaves/${leaveId}/reject`)
        .set('Authorization', `Bearer ${managerToken}`)
        .send({
          rejectionReason: 'Insufficient team coverage'
        })
        .expect(200);

      expect(response.body.leave.status).toBe('rejected');
      expect(response.body.leave.rejectionReason).toBe('Insufficient team coverage');
    });
  });

  describe('GET /api/leaves/approvals/pending', () => {
    it('should get pending approvals for manager', async () => {
      // Create a leave
      await request(app)
        .post('/api/leaves')
        .set('Authorization', `Bearer ${employeeToken}`)
        .send({
          leaveType: 'casual',
          startDate: '2025-12-01',
          endDate: '2025-12-03',
          reason: 'Personal work'
        });

      // Get pending approvals
      const response = await request(app)
        .get('/api/leaves/approvals/pending')
        .set('Authorization', `Bearer ${managerToken}`)
        .expect(200);

      expect(response.body.leaves).toBeDefined();
      expect(Array.isArray(response.body.leaves)).toBe(true);
    });
  });
});

