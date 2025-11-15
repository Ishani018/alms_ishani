/**
 * Leave Balance Service
 * 
 * @fileoverview Business logic for leave balance management
 * @author ALMS Team
 */

const LeaveBalance = require('../models/LeaveBalance');
const User = require('../models/User');

/**
 * Get leave balance for a user
 * @param {string} employeeId - Employee ID
 * @param {number} year - Year (default: current year)
 * @returns {Promise<Object>} Leave balance
 */
const getLeaveBalance = async (employeeId, year = new Date().getFullYear()) => {
  let balance = await LeaveBalance.findOne({ employeeId, year });

  if (!balance) {
    // Create default balance for the year
    balance = await LeaveBalance.create({
      employeeId,
      year,
      balances: {
        sick: { total: 12, used: 0, available: 12, pending: 0 },
        casual: { total: 10, used: 0, available: 10, pending: 0 },
        annual: { total: 15, used: 0, available: 15, pending: 0 },
        maternity: { total: 180, used: 0, available: 180, pending: 0 },
        paternity: { total: 15, used: 0, available: 15, pending: 0 },
        unpaid: { total: 0, used: 0, available: 0, pending: 0 },
        compensatory: { total: 0, used: 0, available: 0, pending: 0 }
      }
    });
  }

  return balance;
};

/**
 * Initialize leave balance for a new employee
 * @param {string} employeeId - Employee ID
 * @param {number} year - Year
 * @param {Object} customBalances - Custom balance values
 * @returns {Promise<Object>} Created leave balance
 */
const initializeBalance = async (employeeId, year, customBalances = {}) => {
  const defaultBalances = {
    sick: { total: 12, used: 0, available: 12, pending: 0 },
    casual: { total: 10, used: 0, available: 10, pending: 0 },
    annual: { total: 15, used: 0, available: 15, pending: 0 },
    maternity: { total: 180, used: 0, available: 180, pending: 0 },
    paternity: { total: 15, used: 0, available: 15, pending: 0 },
    unpaid: { total: 0, used: 0, available: 0, pending: 0 },
    compensatory: { total: 0, used: 0, available: 0, pending: 0 }
  };

  const balances = { ...defaultBalances, ...customBalances };

  const balance = await LeaveBalance.create({
    employeeId,
    year,
    balances
  });

  return balance;
};

/**
 * Update leave balance (used internally)
 * @param {string} employeeId - Employee ID
 * @param {string} leaveType - Leave type
 * @param {string} action - Action (add_pending, approve, reject, cancel)
 * @param {number} days - Number of days
 * @returns {Promise<Object>} Updated balance
 */
const updateBalance = async (employeeId, leaveType, action, days) => {
  const balance = await LeaveBalance.findOne({ employeeId });
  if (!balance) {
    throw new Error('Leave balance not found');
  }

  balance.updateBalance(leaveType, action, days);
  await balance.save();

  return balance;
};

module.exports = {
  getLeaveBalance,
  initializeBalance,
  updateBalance
};

