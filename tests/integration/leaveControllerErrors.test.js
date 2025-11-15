/**
 * Leave Controller Error Handling Tests
 * 
 * @fileoverview Integration tests for leave controller error handling
 * @author ALMS Team
 */

const request = require('supertest');
const app = require('../../src/app');
const User = require('../../src/models/User');
const Leave = require('../../src/models/Leave');
const { setupTestDB, closeTestDB, clearTestDB } = require('../setup/mongodb');

describe('Leave Controller Error Handling', () => {
  let employeeToken;
  let otherEmployeeToken;
  let employeeId;
  let otherEmployeeId;

  beforeAll(async () => {
    await setupTestDB();
  }, 30000);

  afterAll(async () => {
    await closeTestDB();
  }, 30000);

  beforeEach(async () => {
    await clearTestDB();

    // Create first employee
    const employeeResponse = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Employee One',
        email: 'employee1@test.com',
        password: 'password123',
        role: 'employee'
      });
    employeeToken = employeeResponse.body.token;
    employeeId = employeeResponse.body.user._id;

    // Create second employee
    const otherResponse = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Employee Two',
        email: 'employee2@test.com',
        password: 'password123',
        role: 'employee'
      });
    otherEmployeeToken = otherResponse.body.token;
    otherEmployeeId = otherResponse.body.user._id;
  });

  describe('Error Handling', () => {
    it('should return 400 for non-existent leave', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .get(`/api/leaves/${fakeId}`)
        .set('Authorization', `Bearer ${employeeToken}`)
        .expect(400);

      expect(response.body.error).toContain('Leave not found');
    });

    it('should return 403 when accessing another employee\'s leave', async () => {
      // Create leave for first employee
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

      // Try to access from second employee
      const response = await request(app)
        .get(`/api/leaves/${leaveId}`)
        .set('Authorization', `Bearer ${otherEmployeeToken}`)
        .expect(403);

      expect(response.body.error).toContain('Access denied');
    });

    it('should return 400 when updating non-pending leave', async () => {
      // Create and approve a leave
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
      await Leave.findByIdAndUpdate(leaveId, { status: 'approved' });

      // Try to update
      const response = await request(app)
        .put(`/api/leaves/${leaveId}`)
        .set('Authorization', `Bearer ${employeeToken}`)
        .send({ reason: 'Updated reason' })
        .expect(400);

      expect(response.body.error).toContain('Only pending leaves can be updated');
    });

    it('should return 400 when updating another employee\'s leave', async () => {
      // Create leave for first employee
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

      // Try to update from second employee
      const response = await request(app)
        .put(`/api/leaves/${leaveId}`)
        .set('Authorization', `Bearer ${otherEmployeeToken}`)
        .send({ reason: 'Updated reason' })
        .expect(400);

      expect(response.body.error).toContain('You can only update your own leave requests');
    });
  });
});

