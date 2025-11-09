const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
// You will need a specific admin middleware
const adminMiddleware = require('../middleware/adminMiddleware'); 
const LeaveRequest = require('../models/LeaveRequest');
const moment = require('moment'); // Required for date handling
const json2csv = require('json2csv').parse; // You'll need to install this package

// Endpoint: GET /api/admin/reports/monthly-leave
router.get('/reports/monthly-leave', [authMiddleware, adminMiddleware], async (req, res) => {
    try {
        // 1. Get Month/Year from query (e.g., ?month=11&year=2025)
        const { month, year } = req.query;

        if (!month || !year) {
            return res.status(400).json({ msg: 'Month and year are required query parameters.' });
        }

        // 2. Calculate Start and End Dates for the month
        const startDate = moment([year, month - 1]).startOf('month').toDate();
        const endDate = moment([year, month - 1]).endOf('month').toDate();

        // 3. Query the database for approved leaves within the range
        const reports = await LeaveRequest.find({
            status: 'Approved', // Only count approved leaves
            startDate: { $lte: endDate },
            endDate: { $gte: startDate }
        }).populate('user', 'name email').sort({ startDate: 1 });

        // 4. Format the data for CSV
        const reportData = reports.map(req => ({
            'Employee Name': req.user ? req.user.name : 'N/A',
            'Employee Email': req.user ? req.user.email : 'N/A',
            'Leave Type': req.leaveType, // Assuming your model has this field
            'Start Date': moment(req.startDate).format('YYYY-MM-DD'),
            'End Date': moment(req.endDate).format('YYYY-MM-DD'),
            'Reason': req.reason
        }));

        // 5. Generate and Send CSV
        const csv = json2csv(reportData);
        
        const filename = `Leave_Report_${moment(startDate).format('MMM_YYYY')}.csv`;
        
        res.header('Content-Type', 'text/csv');
        res.attachment(filename);
        return res.send(csv);

    } catch (err) {
        console.error('Error generating report:', err.message);
        res.status(500).send('Server Error generating report');
    }
});

module.exports = router;