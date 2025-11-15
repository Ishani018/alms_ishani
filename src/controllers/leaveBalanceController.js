/**
 * Leave Balance Controller
 * 
 * @fileoverview Request handlers for leave balance management
 * @author ALMS Team
 */

const leaveBalanceService = require('../services/leaveBalanceService');

/**
 * Get leave balance for the authenticated user
 */
const getLeaveBalance = async (req, res, next) => {
  try {
    const year = req.query.year || new Date().getFullYear();
    const balance = await leaveBalanceService.getLeaveBalance(req.user._id, year);

    res.status(200).json({
      balance
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLeaveBalance
};

