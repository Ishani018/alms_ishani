/**
 * Leave Balance Model
 * 
 * @fileoverview Mongoose schema for LeaveBalance model
 * @author ALMS Team
 */

const mongoose = require('mongoose');

const leaveBalanceSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Employee ID is required'],
    unique: true
  },
  year: {
    type: Number,
    required: [true, 'Year is required'],
    default: new Date().getFullYear()
  },
  balances: {
    sick: {
      total: { type: Number, default: 0 },
      used: { type: Number, default: 0 },
      available: { type: Number, default: 0 },
      pending: { type: Number, default: 0 }
    },
    casual: {
      total: { type: Number, default: 0 },
      used: { type: Number, default: 0 },
      available: { type: Number, default: 0 },
      pending: { type: Number, default: 0 }
    },
    annual: {
      total: { type: Number, default: 0 },
      used: { type: Number, default: 0 },
      available: { type: Number, default: 0 },
      pending: { type: Number, default: 0 },
      carryForward: { type: Number, default: 0 }
    },
    maternity: {
      total: { type: Number, default: 0 },
      used: { type: Number, default: 0 },
      available: { type: Number, default: 0 },
      pending: { type: Number, default: 0 }
    },
    paternity: {
      total: { type: Number, default: 0 },
      used: { type: Number, default: 0 },
      available: { type: Number, default: 0 },
      pending: { type: Number, default: 0 }
    },
    unpaid: {
      total: { type: Number, default: 0 },
      used: { type: Number, default: 0 },
      available: { type: Number, default: 0 },
      pending: { type: Number, default: 0 }
    },
    compensatory: {
      total: { type: Number, default: 0 },
      used: { type: Number, default: 0 },
      available: { type: Number, default: 0 },
      pending: { type: Number, default: 0 }
    }
  }
}, {
  timestamps: true
});

// Index for efficient queries
leaveBalanceSchema.index({ employeeId: 1, year: 1 }, { unique: true });

// Method to update balance for a leave type
leaveBalanceSchema.methods.updateBalance = function(leaveType, action, days) {
  if (!this.balances[leaveType]) {
    return;
  }

  const balance = this.balances[leaveType];

  switch (action) {
  case 'add_pending':
    balance.pending += days;
    balance.available -= days;
    break;
  case 'approve':
    balance.pending -= days;
    balance.used += days;
    break;
  case 'reject':
    balance.pending -= days;
    balance.available += days;
    break;
  case 'cancel':
    balance.pending -= days;
    balance.available += days;
    break;
  default:
    break;
  }
};

// Method to get available balance for a leave type
leaveBalanceSchema.methods.getAvailable = function(leaveType) {
  return this.balances[leaveType]?.available || 0;
};

const LeaveBalance = mongoose.model('LeaveBalance', leaveBalanceSchema);

module.exports = LeaveBalance;

