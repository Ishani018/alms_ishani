/**
 * Leave Balance Routes
 * 
 * @fileoverview API routes for leave balance management
 * @author ALMS Team
 */

const express = require('express');
const router = express.Router();
const leaveBalanceController = require('../controllers/leaveBalanceController');
const { authenticate } = require('../middleware/auth');

// Routes
router.get('/', authenticate, leaveBalanceController.getLeaveBalance);

module.exports = router;

