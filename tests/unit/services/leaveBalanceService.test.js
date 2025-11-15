/**
 * Leave Balance Service Tests
 * 
 * @fileoverview Unit tests for leave balance service
 * @author ALMS Team
 */

const leaveBalanceService = require('../../../src/services/leaveBalanceService');
const LeaveBalance = require('../../../src/models/LeaveBalance');
const { setupTestDB, closeTestDB, clearTestDB } = require('../../setup/mongodb');
const mongoose = require('mongoose');

describe('Leave Balance Service', () => {
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

  describe('getLeaveBalance', () => {
    it('should get existing leave balance', async () => {
      const balance = await LeaveBalance.create({
        employeeId,
        year: 2025,
        balances: {
          casual: { total: 10, used: 2, available: 8, pending: 0 }
        }
      });

      const result = await leaveBalanceService.getLeaveBalance(employeeId, 2025);
      expect(result._id.toString()).toBe(balance._id.toString());
    });

    it('should create default balance if not exists', async () => {
      const result = await leaveBalanceService.getLeaveBalance(employeeId, 2025);
      expect(result).toBeDefined();
      expect(result.balances.sick.total).toBe(12);
      expect(result.balances.casual.total).toBe(10);
      expect(result.balances.annual.total).toBe(15);
    });
  });

  describe('initializeBalance', () => {
    it('should initialize balance with default values', async () => {
      const result = await leaveBalanceService.initializeBalance(employeeId, 2025);
      expect(result).toBeDefined();
      expect(result.balances.sick.total).toBe(12);
    });

    it('should initialize balance with custom values', async () => {
      const customBalances = {
        casual: { total: 20, used: 0, available: 20, pending: 0 }
      };
      const result = await leaveBalanceService.initializeBalance(employeeId, 2025, customBalances);
      expect(result.balances.casual.total).toBe(20);
      expect(result.balances.sick.total).toBe(12); // Default value
    });
  });

  describe('updateBalance', () => {
    it('should update balance for add_pending action', async () => {
      await LeaveBalance.create({
        employeeId,
        year: 2025,
        balances: {
          casual: { total: 10, used: 0, available: 10, pending: 0 }
        }
      });

      const result = await leaveBalanceService.updateBalance(employeeId, 'casual', 'add_pending', 3);
      expect(result.balances.casual.pending).toBe(3);
      expect(result.balances.casual.available).toBe(7);
    });

    it('should update balance for approve action', async () => {
      await LeaveBalance.create({
        employeeId,
        year: 2025,
        balances: {
          casual: { total: 10, used: 0, available: 7, pending: 3 }
        }
      });

      const result = await leaveBalanceService.updateBalance(employeeId, 'casual', 'approve', 3);
      expect(result.balances.casual.pending).toBe(0);
      expect(result.balances.casual.used).toBe(3);
    });

    it('should throw error if balance not found', async () => {
      await expect(
        leaveBalanceService.updateBalance(employeeId, 'casual', 'approve', 3)
      ).rejects.toThrow('Leave balance not found');
    });
  });
});

