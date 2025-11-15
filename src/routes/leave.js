/**
 * Leave Routes
 * 
 * @fileoverview API routes for leave management
 * @author ALMS Team
 */

const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const leaveController = require('../controllers/leaveController');
const { authenticate, authorize } = require('../middleware/auth');
const validate = require('../middleware/validator');

// Validation rules
const createLeaveValidation = [
  body('leaveType').isIn(['sick', 'casual', 'annual', 'maternity', 'paternity', 'unpaid', 'compensatory'])
    .withMessage('Invalid leave type'),
  body('startDate').isISO8601().withMessage('Start date must be a valid date'),
  body('endDate').isISO8601().withMessage('End date must be a valid date'),
  body('reason').trim().notEmpty().withMessage('Reason is required')
    .isLength({ max: 500 }).withMessage('Reason cannot exceed 500 characters')
];

const updateLeaveValidation = [
  body('startDate').optional().isISO8601().withMessage('Start date must be a valid date'),
  body('endDate').optional().isISO8601().withMessage('End date must be a valid date'),
  body('reason').optional().trim().isLength({ max: 500 }).withMessage('Reason cannot exceed 500 characters')
];

const rejectLeaveValidation = [
  body('rejectionReason').trim().notEmpty().withMessage('Rejection reason is required')
    .isLength({ max: 500 }).withMessage('Rejection reason cannot exceed 500 characters')
];

// Employee routes (authenticated)
router.post('/', authenticate, createLeaveValidation, validate, leaveController.createLeave);
router.get('/', authenticate, leaveController.getLeaves);
router.get('/:id', authenticate, leaveController.getLeaveById);
router.put('/:id', authenticate, updateLeaveValidation, validate, leaveController.updateLeave);
router.delete('/:id', authenticate, leaveController.cancelLeave);

// Manager routes (authenticated + authorized)
router.get('/approvals/pending', authenticate, authorize('manager', 'hr', 'admin'), leaveController.getPendingApprovals);
router.post('/:id/approve', authenticate, authorize('manager', 'hr', 'admin'), leaveController.approveLeave);
router.post('/:id/reject', authenticate, authorize('manager', 'hr', 'admin'), rejectLeaveValidation, validate, leaveController.rejectLeave);

module.exports = router;

