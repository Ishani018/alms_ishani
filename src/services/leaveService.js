/**
 * Leave Service
 * 
 * @fileoverview Business logic for leave management
 * @author ALMS Team
 */

const Leave = require('../models/Leave');
const LeaveBalance = require('../models/LeaveBalance');
const User = require('../models/User');

/**
 * Create a new leave request
 * @param {Object} leaveData - Leave request data
 * @param {string} employeeId - Employee ID
 * @returns {Promise<Object>} Created leave
 */
const createLeave = async (leaveData, employeeId) => {
  const { leaveType, startDate, endDate, reason, attachments } = leaveData;

  // Check for overlapping leaves
  const overlap = await Leave.checkOverlap(employeeId, startDate, endDate);
  if (overlap) {
    throw new Error('Leave dates overlap with existing approved or pending leave');
  }

  // Calculate number of days
  const diffTime = Math.abs(new Date(endDate) - new Date(startDate));
  const numberOfDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

  // Check leave balance
  const balance = await LeaveBalance.findOne({ employeeId });
  if (balance) {
    const available = balance.getAvailable(leaveType);
    if (available < numberOfDays) {
      throw new Error(`Insufficient leave balance. Available: ${available} days`);
    }
  }

  // Create leave
  const leave = await Leave.create({
    employeeId,
    leaveType,
    startDate,
    endDate,
    numberOfDays,
    reason,
    attachments: attachments || []
  });

  // Update leave balance (add pending)
  if (balance) {
    balance.updateBalance(leaveType, 'add_pending', numberOfDays);
    await balance.save();
  }

  return leave;
};

/**
 * Get all leaves for a user
 * @param {string} employeeId - Employee ID
 * @param {Object} filters - Filter options
 * @returns {Promise<Array>} List of leaves
 */
const getLeaves = async (employeeId, filters = {}) => {
  const query = { employeeId };

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.leaveType) {
    query.leaveType = filters.leaveType;
  }

  if (filters.startDate || filters.endDate) {
    query.startDate = {};
    if (filters.startDate) {
      query.startDate.$gte = new Date(filters.startDate);
    }
    if (filters.endDate) {
      query.startDate.$lte = new Date(filters.endDate);
    }
  }

  const leaves = await Leave.find(query)
    .populate('employeeId', 'name email employeeId')
    .populate('approvedBy', 'name email')
    .sort({ appliedDate: -1 });

  return leaves;
};

/**
 * Get a single leave by ID
 * @param {string} leaveId - Leave ID
 * @param {string} userId - User ID (for authorization)
 * @returns {Promise<Object>} Leave details
 */
const getLeaveById = async (leaveId, userId) => {
  const leave = await Leave.findById(leaveId)
    .populate('employeeId', 'name email employeeId')
    .populate('approvedBy', 'name email');

  if (!leave) {
    throw new Error('Leave not found');
  }

  // Check authorization
  const user = await User.findById(userId);
  if (leave.employeeId._id.toString() !== userId && 
      user.role !== 'manager' && 
      user.role !== 'hr' && 
      user.role !== 'admin') {
    throw new Error('Access denied');
  }

  return leave;
};

/**
 * Update a leave request
 * @param {string} leaveId - Leave ID
 * @param {Object} updateData - Update data
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Updated leave
 */
const updateLeave = async (leaveId, updateData, userId) => {
  const leave = await Leave.findById(leaveId);

  if (!leave) {
    throw new Error('Leave not found');
  }

  if (leave.employeeId.toString() !== userId) {
    throw new Error('You can only update your own leave requests');
  }

  if (leave.status !== 'pending') {
    throw new Error('Only pending leaves can be updated');
  }

  // If dates are being updated, check for overlaps
  if (updateData.startDate || updateData.endDate) {
    const startDate = updateData.startDate || leave.startDate;
    const endDate = updateData.endDate || leave.endDate;
    const overlap = await Leave.checkOverlap(leave.employeeId, startDate, endDate, leaveId);
    if (overlap) {
      throw new Error('Leave dates overlap with existing approved or pending leave');
    }
  }

  // Update leave
  Object.assign(leave, updateData);
  
  // Recalculate number of days if dates changed
  if (updateData.startDate || updateData.endDate) {
    const diffTime = Math.abs(new Date(leave.endDate) - new Date(leave.startDate));
    leave.numberOfDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  }

  await leave.save();
  return leave;
};

/**
 * Cancel a leave request
 * @param {string} leaveId - Leave ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Cancelled leave
 */
const cancelLeave = async (leaveId, userId) => {
  const leave = await Leave.findById(leaveId);

  if (!leave) {
    throw new Error('Leave not found');
  }

  if (leave.employeeId.toString() !== userId) {
    throw new Error('You can only cancel your own leave requests');
  }

  if (leave.status === 'cancelled') {
    throw new Error('Leave is already cancelled');
  }

  if (leave.status === 'approved' && new Date(leave.startDate) <= new Date()) {
    throw new Error('Cannot cancel an approved leave that has already started');
  }

  // Update leave balance
  const balance = await LeaveBalance.findOne({ employeeId: leave.employeeId });
  if (balance && leave.status === 'pending') {
    balance.updateBalance(leave.leaveType, 'cancel', leave.numberOfDays);
    await balance.save();
  }

  leave.status = 'cancelled';
  await leave.save();

  return leave;
};

/**
 * Get pending approvals for a manager
 * @param {string} managerId - Manager ID
 * @returns {Promise<Array>} List of pending leaves
 */
const getPendingApprovals = async (managerId) => {
  // Get all employees under this manager
  const employees = await User.find({ managerId });

  const employeeIds = employees.map(emp => emp._id);

  const leaves = await Leave.find({
    employeeId: { $in: employeeIds },
    status: 'pending'
  })
    .populate('employeeId', 'name email employeeId department')
    .sort({ appliedDate: -1 });

  return leaves;
};

/**
 * Approve a leave request
 * @param {string} leaveId - Leave ID
 * @param {string} managerId - Manager ID
 * @returns {Promise<Object>} Approved leave
 */
const approveLeave = async (leaveId, managerId) => {
  const leave = await Leave.findById(leaveId).populate({
    path: 'employeeId',
    select: 'name email managerId role'
  });

  if (!leave) {
    throw new Error('Leave not found');
  }

  if (leave.status !== 'pending') {
    throw new Error('Only pending leaves can be approved');
  }

  // Check if manager is authorized
  const employee = leave.employeeId;
  // If employee has a managerId, it must match the approving manager
  // If no managerId is set, allow any manager/hr/admin to approve (for flexibility)
  if (employee.managerId) {
    const employeeManagerId = employee.managerId.toString ? employee.managerId.toString() : employee.managerId;
    const managerIdStr = managerId.toString ? managerId.toString() : managerId;
    if (employeeManagerId !== managerIdStr) {
      throw new Error('You are not authorized to approve this leave');
    }
  }

  // Update leave balance
  const balance = await LeaveBalance.findOne({ employeeId: leave.employeeId });
  if (balance) {
    balance.updateBalance(leave.leaveType, 'approve', leave.numberOfDays);
    await balance.save();
  }

  leave.status = 'approved';
  leave.approvedBy = managerId;
  leave.approvedDate = new Date();
  await leave.save();

  return leave;
};

/**
 * Reject a leave request
 * @param {string} leaveId - Leave ID
 * @param {string} managerId - Manager ID
 * @param {string} rejectionReason - Reason for rejection
 * @returns {Promise<Object>} Rejected leave
 */
const rejectLeave = async (leaveId, managerId, rejectionReason) => {
  const leave = await Leave.findById(leaveId).populate('employeeId');

  if (!leave) {
    throw new Error('Leave not found');
  }

  if (leave.status !== 'pending') {
    throw new Error('Only pending leaves can be rejected');
  }

  // Check if manager is authorized
  const employee = leave.employeeId;
  if (employee.managerId && employee.managerId.toString() !== managerId) {
    throw new Error('You are not authorized to reject this leave');
  }

  // Update leave balance
  const balance = await LeaveBalance.findOne({ employeeId: leave.employeeId });
  if (balance) {
    balance.updateBalance(leave.leaveType, 'reject', leave.numberOfDays);
    await balance.save();
  }

  leave.status = 'rejected';
  leave.approvedBy = managerId;
  leave.approvedDate = new Date();
  leave.rejectionReason = rejectionReason;
  await leave.save();

  return leave;
};

module.exports = {
  createLeave,
  getLeaves,
  getLeaveById,
  updateLeave,
  cancelLeave,
  getPendingApprovals,
  approveLeave,
  rejectLeave
};

