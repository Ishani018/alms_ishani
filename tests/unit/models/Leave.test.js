/**
 * Leave Model Tests
 * 
 * @fileoverview Unit tests for Leave model
 * @author ALMS Team
 */

const Leave = require('../../../src/models/Leave');
const { setupTestDB, closeTestDB, clearTestDB } = require('../../setup/mongodb');
const mongoose = require('mongoose');

describe('Leave Model', () => {
  let employeeId;

  beforeAll(async () => {
    await setupTestDB();
    employeeId = new mongoose.Types.ObjectId();
  }, 30000);

  afterAll(async () => {
    await closeTestDB();
  }, 30000);

  beforeEach(async () => {
    await clearTestDB();
  });

  describe('Leave Creation', () => {
    it('should create a leave with valid data', async () => {
      const leaveData = {
        employeeId,
        leaveType: 'casual',
        startDate: '2025-12-01',
        endDate: '2025-12-03',
        numberOfDays: 3,
        reason: 'Test leave',
        status: 'pending'
      };

      const leave = await Leave.create(leaveData);
      expect(leave.leaveType).toBe('casual');
      expect(leave.status).toBe('pending');
      expect(leave.numberOfDays).toBe(3);
    });

    it('should calculate numberOfDays automatically', async () => {
      const leave = await Leave.create({
        employeeId,
        leaveType: 'casual',
        startDate: '2025-12-01',
        endDate: '2025-12-05',
        reason: 'Test'
      });

      expect(leave.numberOfDays).toBe(5);
    });

    it('should validate endDate is after startDate', async () => {
      const leaveData = {
        employeeId,
        leaveType: 'casual',
        startDate: '2025-12-05',
        endDate: '2025-12-01', // End before start
        reason: 'Test'
      };

      await expect(Leave.create(leaveData)).rejects.toThrow();
    });

    it('should validate minimum numberOfDays', async () => {
      const leaveData = {
        employeeId,
        leaveType: 'casual',
        startDate: '2025-12-01',
        endDate: '2025-12-01',
        numberOfDays: 0.3, // Less than 0.5
        reason: 'Test'
      };

      await expect(Leave.create(leaveData)).rejects.toThrow();
    });
  });

  describe('checkOverlap', () => {
    it('should detect overlapping leaves', async () => {
      await Leave.create({
        employeeId,
        leaveType: 'casual',
        startDate: '2025-12-01',
        endDate: '2025-12-05',
        status: 'approved',
        numberOfDays: 5,
        reason: 'Existing leave'
      });

      const overlap = await Leave.checkOverlap(
        employeeId,
        '2025-12-03',
        '2025-12-07'
      );

      expect(overlap).toBeTruthy();
    });

    it('should not detect overlap when excluding leave ID', async () => {
      const leave = await Leave.create({
        employeeId,
        leaveType: 'casual',
        startDate: '2025-12-01',
        endDate: '2025-12-05',
        status: 'approved',
        numberOfDays: 5,
        reason: 'Existing leave'
      });

      const overlap = await Leave.checkOverlap(
        employeeId,
        '2025-12-01',
        '2025-12-05',
        leave._id
      );

      expect(overlap).toBeNull();
    });

    it('should not detect overlap for non-overlapping dates', async () => {
      await Leave.create({
        employeeId,
        leaveType: 'casual',
        startDate: '2025-12-01',
        endDate: '2025-12-05',
        status: 'approved',
        numberOfDays: 5,
        reason: 'Existing leave'
      });

      const overlap = await Leave.checkOverlap(
        employeeId,
        '2025-12-10',
        '2025-12-15'
      );

      expect(overlap).toBeNull();
    });
  });

  describe('canCancel virtual', () => {
    it('should return true for pending leave', async () => {
      const leave = await Leave.create({
        employeeId,
        leaveType: 'casual',
        startDate: '2025-12-10',
        endDate: '2025-12-12',
        status: 'pending',
        numberOfDays: 3,
        reason: 'Test'
      });

      expect(leave.canCancel).toBe(true);
    });

    it('should return true for approved leave with future start date', async () => {
      const leave = await Leave.create({
        employeeId,
        leaveType: 'casual',
        startDate: '2025-12-10',
        endDate: '2025-12-12',
        status: 'approved',
        numberOfDays: 3,
        reason: 'Test'
      });

      expect(leave.canCancel).toBe(true);
    });
  });
});

