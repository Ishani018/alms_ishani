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

    it('should create leave when balance does not exist', async () => {
      // Remove balance
      await LeaveBalance.deleteMany({ employeeId });

      const leaveData = {
        leaveType: 'casual',
        startDate: '2025-12-01',
        endDate: '2025-12-03',
        reason: 'Test reason'
      };

      const leave = await leaveService.createLeave(leaveData, employeeId);
      expect(leave).toBeDefined();
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

    it('should filter leaves by leaveType', async () => {
      await Leave.create({
        employeeId,
        leaveType: 'annual',
        startDate: '2025-12-01',
        endDate: '2025-12-03',
        status: 'pending',
        numberOfDays: 3,
        reason: 'Test'
      });

      const leaves = await leaveService.getLeaves(employeeId, { leaveType: 'annual' });
      expect(leaves.length).toBe(1);
      expect(leaves[0].leaveType).toBe('annual');
    });

    it('should filter leaves by date range', async () => {
      await Leave.create({
        employeeId,
        leaveType: 'casual',
        startDate: '2025-12-05',
        endDate: '2025-12-07',
        status: 'pending',
        numberOfDays: 3,
        reason: 'Test'
      });

      const leaves = await leaveService.getLeaves(employeeId, {
        startDate: '2025-12-01',
        endDate: '2025-12-10'
      });
      expect(leaves.length).toBe(1);
    });
  });

  describe('getLeaveById', () => {
    it('should get leave by ID for employee', async () => {
      const leave = await Leave.create({
        employeeId,
        leaveType: 'casual',
        startDate: '2025-12-01',
        endDate: '2025-12-03',
        status: 'pending',
        numberOfDays: 3,
        reason: 'Test'
      });

      const result = await leaveService.getLeaveById(leave._id, employeeId);
      expect(result._id.toString()).toBe(leave._id.toString());
    });

    it('should get leave by ID for manager', async () => {
      await User.create({
        _id: managerId,
        name: 'Manager',
        email: 'manager@test.com',
        password: 'password123',
        role: 'manager'
      });

      const leave = await Leave.create({
        employeeId,
        leaveType: 'casual',
        startDate: '2025-12-01',
        endDate: '2025-12-03',
        status: 'pending',
        numberOfDays: 3,
        reason: 'Test'
      });

      const result = await leaveService.getLeaveById(leave._id, managerId);
      expect(result._id.toString()).toBe(leave._id.toString());
    });

    it('should throw error if leave not found', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      await expect(
        leaveService.getLeaveById(fakeId, employeeId)
      ).rejects.toThrow('Leave not found');
    });

    it('should throw error for unauthorized access', async () => {
      const otherEmployeeId = new mongoose.Types.ObjectId();
      await User.create({
        _id: otherEmployeeId,
        name: 'Other Employee',
        email: 'other@test.com',
        password: 'password123',
        role: 'employee'
      });

      const leave = await Leave.create({
        employeeId,
        leaveType: 'casual',
        startDate: '2025-12-01',
        endDate: '2025-12-03',
        status: 'pending',
        numberOfDays: 3,
        reason: 'Test'
      });

      await expect(
        leaveService.getLeaveById(leave._id, otherEmployeeId)
      ).rejects.toThrow('Access denied');
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

    it('should update leave dates and recalculate days', async () => {
      const leave = await Leave.create({
        employeeId,
        leaveType: 'casual',
        startDate: '2025-12-01',
        endDate: '2025-12-03',
        status: 'pending',
        numberOfDays: 3,
        reason: 'Test'
      });

      const updated = await leaveService.updateLeave(leave._id, {
        startDate: '2025-12-05',
        endDate: '2025-12-10'
      }, employeeId);
      expect(updated.numberOfDays).toBe(6);
    });

    it('should throw error when updated dates overlap', async () => {
      // Create existing leave
      await Leave.create({
        employeeId,
        leaveType: 'casual',
        startDate: '2025-12-10',
        endDate: '2025-12-15',
        status: 'approved',
        numberOfDays: 6,
        reason: 'Existing'
      });

      // Create pending leave
      const leave = await Leave.create({
        employeeId,
        leaveType: 'casual',
        startDate: '2025-12-01',
        endDate: '2025-12-03',
        status: 'pending',
        numberOfDays: 3,
        reason: 'Test'
      });

      // Try to update to overlapping dates
      await expect(
        leaveService.updateLeave(leave._id, {
          startDate: '2025-12-12',
          endDate: '2025-12-18'
        }, employeeId)
      ).rejects.toThrow('overlap');
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

    it('should throw error when updating another employee\'s leave', async () => {
      const otherEmployeeId = new mongoose.Types.ObjectId();
      const leave = await Leave.create({
        employeeId: otherEmployeeId,
        leaveType: 'casual',
        startDate: '2025-12-01',
        endDate: '2025-12-03',
        status: 'pending',
        numberOfDays: 3,
        reason: 'Test'
      });

      await expect(
        leaveService.updateLeave(leave._id, { reason: 'New reason' }, employeeId)
      ).rejects.toThrow('You can only update your own leave requests');
    });

    it('should throw error when leave not found for update', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      await expect(
        leaveService.updateLeave(fakeId, { reason: 'New reason' }, employeeId)
      ).rejects.toThrow('Leave not found');
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

    it('should throw error when cancelling another employee\'s leave', async () => {
      const otherEmployeeId = new mongoose.Types.ObjectId();
      const leave = await Leave.create({
        employeeId: otherEmployeeId,
        leaveType: 'casual',
        startDate: '2025-12-01',
        endDate: '2025-12-03',
        status: 'pending',
        numberOfDays: 3,
        reason: 'Test'
      });

      await expect(
        leaveService.cancelLeave(leave._id, employeeId)
      ).rejects.toThrow('You can only cancel your own leave requests');
    });

    it('should throw error when cancelling already cancelled leave', async () => {
      const leave = await Leave.create({
        employeeId,
        leaveType: 'casual',
        startDate: '2025-12-01',
        endDate: '2025-12-03',
        status: 'cancelled',
        numberOfDays: 3,
        reason: 'Test'
      });

      await expect(
        leaveService.cancelLeave(leave._id, employeeId)
      ).rejects.toThrow('already cancelled');
    });

    it('should throw error when cancelling approved leave that has started', async () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 5); // 5 days ago

      const leave = await Leave.create({
        employeeId,
        leaveType: 'casual',
        startDate: pastDate,
        endDate: pastDate,
        status: 'approved',
        numberOfDays: 1,
        reason: 'Test'
      });

      await expect(
        leaveService.cancelLeave(leave._id, employeeId)
      ).rejects.toThrow('Cannot cancel an approved leave that has already started');
    });

    it('should cancel approved leave with future start date', async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 10); // 10 days from now

      const leave = await Leave.create({
        employeeId,
        leaveType: 'casual',
        startDate: futureDate,
        endDate: futureDate,
        status: 'approved',
        numberOfDays: 1,
        reason: 'Test'
      });

      const cancelled = await leaveService.cancelLeave(leave._id, employeeId);
      expect(cancelled.status).toBe('cancelled');
    });

    it('should throw error when leave not found for cancellation', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      await expect(
        leaveService.cancelLeave(fakeId, employeeId)
      ).rejects.toThrow('Leave not found');
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

    it('should throw error when rejecting non-pending leave', async () => {
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
        leaveService.rejectLeave(leave._id, managerId, 'Reason')
      ).rejects.toThrow('Only pending leaves can be rejected');
    });
  });

  describe('getPendingApprovals', () => {
    it('should get pending approvals for manager', async () => {
      await User.create({
        _id: employeeId,
        name: 'Employee',
        email: 'emp@test.com',
        password: 'password123',
        role: 'employee',
        managerId
      });

      await Leave.create({
        employeeId,
        leaveType: 'casual',
        startDate: '2025-12-01',
        endDate: '2025-12-03',
        status: 'pending',
        numberOfDays: 3,
        reason: 'Test'
      });

      const leaves = await leaveService.getPendingApprovals(managerId);
      expect(leaves.length).toBe(1);
    });
  });

  describe('approveLeave', () => {
    it('should approve leave successfully', async () => {
      const leave = await Leave.create({
        employeeId,
        leaveType: 'casual',
        startDate: '2025-12-01',
        endDate: '2025-12-03',
        status: 'pending',
        numberOfDays: 3,
        reason: 'Test'
      });

      const approved = await leaveService.approveLeave(leave._id, managerId);
      expect(approved.status).toBe('approved');
      expect(approved.approvedBy.toString()).toBe(managerId.toString());
    });

    it('should approve leave when balance does not exist', async () => {
      await LeaveBalance.deleteMany({ employeeId });

      const leave = await Leave.create({
        employeeId,
        leaveType: 'casual',
        startDate: '2025-12-01',
        endDate: '2025-12-03',
        status: 'pending',
        numberOfDays: 3,
        reason: 'Test'
      });

      const approved = await leaveService.approveLeave(leave._id, managerId);
      expect(approved.status).toBe('approved');
    });

    it('should throw error when approving non-pending leave', async () => {
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
        leaveService.approveLeave(leave._id, managerId)
      ).rejects.toThrow('Only pending leaves can be approved');
    });

    it('should throw error when leave not found', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      await expect(
        leaveService.approveLeave(fakeId, managerId)
      ).rejects.toThrow('Leave not found');
    });
  });

  describe('rejectLeave', () => {
    it('should reject leave when balance does not exist', async () => {
      await LeaveBalance.deleteMany({ employeeId });

      const leave = await Leave.create({
        employeeId,
        leaveType: 'casual',
        startDate: '2025-12-01',
        endDate: '2025-12-03',
        status: 'pending',
        numberOfDays: 3,
        reason: 'Test'
      });

      const rejected = await leaveService.rejectLeave(leave._id, managerId, 'Reason');
      expect(rejected.status).toBe('rejected');
    });

    it('should throw error when leave not found', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      await expect(
        leaveService.rejectLeave(fakeId, managerId, 'Reason')
      ).rejects.toThrow('Leave not found');
    });
  });
});

