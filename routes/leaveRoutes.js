const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leaveController');

router.post('/', leaveController.createLeave);
router.get('/', leaveController.getLeaves);
router.get('/employee/:id', leaveController.getEmployeeLeaves);
router.put('/:id', leaveController.updateStatus);

module.exports = router;
