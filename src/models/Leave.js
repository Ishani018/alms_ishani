/**
 * Leave Model
 * 
 * @fileoverview Mongoose schema for Leave model
 * @author ALMS Team
 */

const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Employee ID is required']
  },
  leaveType: {
    type: String,
    required: [true, 'Leave type is required'],
    enum: ['sick', 'casual', 'annual', 'maternity', 'paternity', 'unpaid', 'compensatory']
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required'],
    validate: {
      validator: function(value) {
        return value >= this.startDate;
      },
      message: 'End date must be greater than or equal to start date'
    }
  },
  numberOfDays: {
    type: Number,
    required: true,
    min: [0.5, 'Number of days must be at least 0.5'],
    default: function() {
      if (this.startDate && this.endDate) {
        const diffTime = Math.abs(this.endDate - this.startDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        return diffDays;
      }
      return 1;
    }
  },
  reason: {
    type: String,
    required: [true, 'Reason is required'],
    trim: true,
    maxlength: [500, 'Reason cannot exceed 500 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'cancelled'],
    default: 'pending'
  },
  appliedDate: {
    type: Date,
    default: Date.now
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  approvedDate: {
    type: Date,
    default: null
  },
  rejectionReason: {
    type: String,
    trim: true,
    maxlength: [500, 'Rejection reason cannot exceed 500 characters']
  },
  attachments: [{
    type: String // URLs or file paths
  }]
}, {
  timestamps: true
});

// Index for efficient queries
leaveSchema.index({ employeeId: 1, startDate: -1 });
leaveSchema.index({ status: 1, appliedDate: -1 });
leaveSchema.index({ approvedBy: 1, status: 1 });

// Virtual for checking if leave can be cancelled
leaveSchema.virtual('canCancel').get(function() {
  return this.status === 'pending' || (this.status === 'approved' && this.startDate > new Date());
});

// Method to check if dates overlap with existing leaves
leaveSchema.statics.checkOverlap = async function(employeeId, startDate, endDate, excludeLeaveId = null) {
  const query = {
    employeeId,
    status: { $in: ['pending', 'approved'] },
    $or: [
      { startDate: { $lte: endDate }, endDate: { $gte: startDate } }
    ]
  };

  if (excludeLeaveId) {
    query._id = { $ne: excludeLeaveId };
  }

  return await this.findOne(query);
};

const Leave = mongoose.model('Leave', leaveSchema);

module.exports = Leave;

