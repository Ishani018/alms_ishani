/**
 * Leave Service Tests
 * 
 * @fileoverview Unit tests for leave service
 * @author ALMS Team
 */

const leaveService = require('../../../src/services/leaveService');
const Leave = require('../../../src/models/Leave');
const LeaveBalance = require('../../../src/models/LeaveBalance');
const User = require('../../../src/models/User');
const { setupTestDB, closeTestDB, clearTestDB } = require('../../setup/mongodb');
const mongoose = require('mongoose');

describe('Leave Service', () => {
  let employeeId;
  let managerId;

  beforeAll(async () => {
    await setupTestDB();
    employeeId = new mongoose.Types.ObjectId();
    managerId = new mongoose.Types.ObjectId();
  }, 30000);

  afterAll(async () => {
    await closeTestDB();
  }, 30000);

  beforeEach(async () => {
    await clearTestDB();
    await User.create({
      _id: employeeId,
      name: 'Test Employee',
      email: 'employee@test.com',
      password: 'password123',
      role: 'employee',
      managerId
    });
    await LeaveBalance.create({
      employeeId,
      year: 2025,
      balances: {
        casual: { total: 10, used: 0, available: 10, pending: 0 },
        annual: { total: 15, used: 0, available: 15, pending: 0 }
      }
    });
  });

  describe('createLeave', () => {
    it('should create leave successfully', async () => {
      const leaveData = {
        leaveType: 'casual',
        startDate: '2025-12-01',
        endDate: '2025-12-03',
        reason: 'Test reason'
      };

      const leave = await leaveService.createLeave(leaveData, employeeId);
      expect(leave).toBeDefined();
      expect(leave.status).toBe('pending');
      expect(leave.numberOfDays).toBe(3);
    });

    it('should throw error for overlapping leaves', async () => {
      await Leave.create({
        employeeId,
        leaveType: 'casual',
        startDate: '2025-12-01',
        endDate: '2025-12-03',
        status: 'approved',
        numberOfDays: 3,
        reason: 'Existing leave'
      });

      const leaveData = {
        leaveType: 'casual',
        startDate: '2025-12-02',
        endDate: '2025-12-04',
        reason: 'Overlapping leave'
      };

      await expect(
        leaveService.createLeave(leaveData, employeeId)
      ).rejects.toThrow('overlap');
    });

    it('should throw error for insufficient balance', async () => {
      const leaveData = {
        leaveType: 'casual',
        startDate: '2025-12-01',
        endDate: '2025-12-15', // 15 days, but only 10 available
        reason: 'Long leave'
      };

      await expect(
        leaveService.createLeave(leaveData, employeeId)
      ).rejects.toThrow('Insufficient leave balance');
    });
  });

  describe('getLeaves', () => {
    it('should get all leaves for employee', async () => {
      await Leave.create({
        employeeId,
        leaveType: 'casual',
        startDate: '2025-12-01',
        endDate: '2025-12-03',
        status: 'pending',
        numberOfDays: 3,
        reason: 'Test'
      });

      const leaves = await leaveService.getLeaves(employeeId);
      expect(leaves.length).toBe(1);
    });

    it('should filter leaves by status', async () => {
      await Leave.create({
        employeeId,
        leaveType: 'casual',
        startDate: '2025-12-01',
        endDate: '2025-12-03',
        status: 'approved',
        numberOfDays: 3,
        reason: 'Test'
      });

      const leaves = await leaveService.getLeaves(employeeId, { status: 'approved' });
      expect(leaves.length).toBe(1);
      expect(leaves[0].status).toBe('approved');
    });
  });

  describe('updateLeave', () => {
    it('should update pending leave', async () => {
      const leave = await Leave.create({
        employeeId,
        leaveType: 'casual',
        startDate: '2025-12-01',
        endDate: '2025-12-03',
        status: 'pending',
        numberOfDays: 3,
        reason: 'Original reason'
      });

      const updated = await leaveService.updateLeave(leave._id, { reason: 'Updated reason' }, employeeId);
      expect(updated.reason).toBe('Updated reason');
    });

    it('should throw error when updating non-pending leave', async () => {
      const leave = await Leave.create({
        employeeId,
        leaveType: 'casual',
        startDate: '2025-12-01',
        endDate: '2025-12-03',
        status: 'approved',
        numberOfDays: 3,
        reason: 'Test'
      });

      await expect(
        leaveService.updateLeave(leave._id, { reason: 'New reason' }, employeeId)
      ).rejects.toThrow('Only pending leaves can be updated');
    });
  });

  describe('cancelLeave', () => {
    it('should cancel pending leave', async () => {
      const leave = await Leave.create({
        employeeId,
        leaveType: 'casual',
        startDate: '2025-12-01',
        endDate: '2025-12-03',
        status: 'pending',
        numberOfDays: 3,
        reason: 'Test'
      });

      const cancelled = await leaveService.cancelLeave(leave._id, employeeId);
      expect(cancelled.status).toBe('cancelled');
    });
  });

  describe('rejectLeave', () => {
    it('should reject leave request', async () => {
      const leave = await Leave.create({
        employeeId,
        leaveType: 'casual',
        startDate: '2025-12-01',
        endDate: '2025-12-03',
        status: 'pending',
        numberOfDays: 3,
        reason: 'Test'
      });

      const rejected = await leaveService.rejectLeave(leave._id, managerId, 'Not enough coverage');
      expect(rejected.status).toBe('rejected');
      expect(rejected.rejectionReason).toBe('Not enough coverage');
    });
  });
});

