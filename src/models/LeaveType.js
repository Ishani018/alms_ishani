/**
 * Leave Type Model
 * 
 * @fileoverview Mongoose schema for LeaveType model
 * @author ALMS Team
 */

const mongoose = require('mongoose');

const leaveTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Leave type name is required'],
    unique: true,
    trim: true,
    enum: ['sick', 'casual', 'annual', 'maternity', 'paternity', 'unpaid', 'compensatory']
  },
  description: {
    type: String,
    trim: true
  },
  maxDays: {
    type: Number,
    default: null, // null means unlimited
    min: [0, 'Max days cannot be negative']
  },
  requiresApproval: {
    type: Boolean,
    default: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  carryForward: {
    type: Boolean,
    default: false // Can unused leaves be carried to next year
  },
  maxCarryForward: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const LeaveType = mongoose.model('LeaveType', leaveTypeSchema);

module.exports = LeaveType;

