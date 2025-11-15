/**
 * Leave Balance Model Tests
 * 
 * @fileoverview Unit tests for LeaveBalance model
 * @author ALMS Team
 */

const LeaveBalance = require('../../../src/models/LeaveBalance');
const { setupTestDB, closeTestDB, clearTestDB } = require('../../setup/mongodb');
const mongoose = require('mongoose');

describe('Leave Balance Model', () => {
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

  describe('Leave Balance Creation', () => {
    it('should create leave balance with valid data', async () => {
      const balance = await LeaveBalance.create({
        employeeId,
        year: 2025,
        balances: {
          casual: { total: 10, used: 2, available: 8, pending: 0 }
        }
      });

      expect(balance.employeeId.toString()).toBe(employeeId.toString());
      expect(balance.year).toBe(2025);
      expect(balance.balances.casual.total).toBe(10);
    });
  });

  describe('updateBalance method', () => {
    it('should update balance for add_pending action', async () => {
      const balance = await LeaveBalance.create({
        employeeId,
        year: 2025,
        balances: {
          casual: { total: 10, used: 0, available: 10, pending: 0 }
        }
      });

      balance.updateBalance('casual', 'add_pending', 3);
      expect(balance.balances.casual.pending).toBe(3);
      expect(balance.balances.casual.available).toBe(7);
    });

    it('should update balance for approve action', async () => {
      const balance = await LeaveBalance.create({
        employeeId,
        year: 2025,
        balances: {
          casual: { total: 10, used: 0, available: 7, pending: 3 }
        }
      });

      balance.updateBalance('casual', 'approve', 3);
      expect(balance.balances.casual.pending).toBe(0);
      expect(balance.balances.casual.used).toBe(3);
    });

    it('should update balance for reject action', async () => {
      const balance = await LeaveBalance.create({
        employeeId,
        year: 2025,
        balances: {
          casual: { total: 10, used: 0, available: 7, pending: 3 }
        }
      });

      balance.updateBalance('casual', 'reject', 3);
      expect(balance.balances.casual.pending).toBe(0);
      expect(balance.balances.casual.available).toBe(10);
    });

    it('should update balance for cancel action', async () => {
      const balance = await LeaveBalance.create({
        employeeId,
        year: 2025,
        balances: {
          casual: { total: 10, used: 0, available: 7, pending: 3 }
        }
      });

      balance.updateBalance('casual', 'cancel', 3);
      expect(balance.balances.casual.pending).toBe(0);
      expect(balance.balances.casual.available).toBe(10);
    });

    it('should handle unknown action gracefully', async () => {
      const balance = await LeaveBalance.create({
        employeeId,
        year: 2025,
        balances: {
          casual: { total: 10, used: 0, available: 10, pending: 0 }
        }
      });

      const initialPending = balance.balances.casual.pending;
      balance.updateBalance('casual', 'unknown_action', 3);
      expect(balance.balances.casual.pending).toBe(initialPending);
    });
  });

  describe('getAvailable method', () => {
    it('should return available balance for leave type', async () => {
      const balance = await LeaveBalance.create({
        employeeId,
        year: 2025,
        balances: {
          casual: { total: 10, used: 2, available: 8, pending: 0 }
        }
      });

      const available = balance.getAvailable('casual');
      expect(available).toBe(8);
    });

    it('should return 0 for non-existent leave type', async () => {
      const balance = await LeaveBalance.create({
        employeeId,
        year: 2025,
        balances: {
          casual: { total: 10, used: 0, available: 10, pending: 0 }
        }
      });

      const available = balance.getAvailable('nonexistent');
      expect(available).toBe(0);
    });
  });
});

