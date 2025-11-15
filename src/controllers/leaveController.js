/**
 * Leave Controller
 * 
 * @fileoverview Request handlers for leave management
 * @author ALMS Team
 */

const leaveService = require('../services/leaveService');

/**
 * Create a new leave request
 */
const createLeave = async (req, res, next) => {
  try {
    const leave = await leaveService.createLeave(req.body, req.user._id);

    res.status(201).json({
      message: 'Leave request created successfully',
      leave
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all leaves for the authenticated user
 */
const getLeaves = async (req, res, next) => {
  try {
    const filters = {
      status: req.query.status,
      leaveType: req.query.leaveType,
      startDate: req.query.startDate,
      endDate: req.query.endDate
    };

    const leaves = await leaveService.getLeaves(req.user._id, filters);

    res.status(200).json({
      count: leaves.length,
      leaves
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a single leave by ID
 */
const getLeaveById = async (req, res, next) => {
  try {
    const leave = await leaveService.getLeaveById(req.params.id, req.user._id);

    res.status(200).json({
      leave
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update a leave request
 */
const updateLeave = async (req, res, next) => {
  try {
    const leave = await leaveService.updateLeave(
      req.params.id,
      req.body,
      req.user._id
    );

    res.status(200).json({
      message: 'Leave request updated successfully',
      leave
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Cancel a leave request
 */
const cancelLeave = async (req, res, next) => {
  try {
    const leave = await leaveService.cancelLeave(req.params.id, req.user._id);

    res.status(200).json({
      message: 'Leave request cancelled successfully',
      leave
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get pending approvals (for managers)
 */
const getPendingApprovals = async (req, res, next) => {
  try {
    const leaves = await leaveService.getPendingApprovals(req.user._id);

    res.status(200).json({
      count: leaves.length,
      leaves
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Approve a leave request
 */
const approveLeave = async (req, res, next) => {
  try {
    const leave = await leaveService.approveLeave(req.params.id, req.user._id);

    res.status(200).json({
      message: 'Leave request approved successfully',
      leave
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Reject a leave request
 */
const rejectLeave = async (req, res, next) => {
  try {
    const { rejectionReason } = req.body;
    const leave = await leaveService.rejectLeave(
      req.params.id,
      req.user._id,
      rejectionReason
    );

    res.status(200).json({
      message: 'Leave request rejected',
      leave
    });
  } catch (error) {
    next(error);
  }
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

