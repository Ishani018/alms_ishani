// admin.test.js

const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const adminRoutes = require('../routes/admin'); // Adjust path as needed
const LeaveRequest = require('../models/LeaveRequest');
const User = require('../models/User');

// --- Mock Middleware ---
// Mock the auth and admin middleware to allow the request through
// and simulate an authenticated Admin user.
jest.mock('../middleware/authMiddleware', () => (req, res, next) => {
    // Inject a mock Admin user into the request
    req.user = { id: 'mockAdminId', role: 'admin' };
    next();
});
jest.mock('../middleware/adminMiddleware', () => (req, res, next) => next());

// Set up a basic app to mount the routes
const app = express();
app.use(express.json());
app.use('/api/admin', adminRoutes);

// --- Test Setup ---
beforeAll(async () => {
    // Connect to your test database
    await mongoose.connect(process.env.MONGO_URI_TEST || 'mongodb://localhost/leave_test_db', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

afterEach(async () => {
    // Clean up the database after each test
    await LeaveRequest.deleteMany({});
    await User.deleteMany({});
});

afterAll(async () => {
    // Close the database connection
    await mongoose.connection.close();
});

// --- Test Suite for GET /api/admin/reports/monthly-leave ---
describe('GET /api/admin/reports/monthly-leave', () => {
    let testUser;

    beforeEach(async () => {
        // Setup a user
        testUser = await User.create({ name: 'Report User', email: 'report@test.com', password: 'p', role: 'employee' });

        // Setup Approved Leaves for January 2025
        await LeaveRequest.create({ 
            user: testUser._id, 
            startDate: new Date('2025-01-10'), 
            endDate: new Date('2025-01-12'), 
            reason: 'Vacation',
            leaveType: 'Annual', 
            status: 'Approved' 
        });
        
        // Setup Rejected Leave (should NOT be included in report)
        await LeaveRequest.create({ 
            user: testUser._id, 
            startDate: new Date('2025-01-20'), 
            endDate: new Date('2025-01-22'), 
            reason: 'Sick', 
            leaveType: 'Sick', 
            status: 'Rejected' 
        });
        
        // Setup Approved Leave for a different month (should NOT be included)
        await LeaveRequest.create({ 
            user: testUser._id, 
            startDate: new Date('2025-02-05'), 
            endDate: new Date('2025-02-06'), 
            reason: 'Conference', 
            leaveType: 'Other', 
            status: 'Approved' 
        });
    });

    it('should return a 400 error if month or year query parameters are missing', async () => {
        await request(app)
            .get('/api/admin/reports/monthly-leave')
            .expect(400)
            .then(res => {
                expect(res.body.msg).toBe('Month and year are required query parameters.');
            });
    });

    it('should return a CSV file containing only the approved leaves for the specified month', async () => {
        const response = await request(app)
            .get('/api/admin/reports/monthly-leave?month=1&year=2025') // Requesting January 2025
            .expect('Content-Type', /csv/)
            .expect('Content-Disposition', /attachment; filename="Leave_Report_Jan_2025.csv"/)
            .expect(200);

        const csvContent = response.text;
        
        // Split CSV into lines
        const lines = csvContent.trim().split('\n');
        
        // Check for header (line 1)
        expect(lines[0]).toBe('Employee Name,Employee Email,Leave Type,Start Date,End Date,Reason');
        
        // Check for data row (line 2) - Should only have 1 approved request for Jan 2025
        expect(lines.length).toBe(2); 
        
        // Verify the content of the data row
        expect(lines[1]).toContain('Report User');
        expect(lines[1]).toContain('Vacation');
        expect(lines[1]).toContain('2025-01-10');
        expect(lines[1]).not.toContain('Rejected');
    });

    it('should return only the CSV header if no approved requests are found for the month', async () => {
        const response = await request(app)
            .get('/api/admin/reports/monthly-leave?month=3&year=2025') // Requesting March 2025 (empty)
            .expect('Content-Type', /csv/)
            .expect(200);

        const lines = response.text.trim().split('\n');
        
        // Should only contain the header row
        expect(lines.length).toBe(1); 
        expect(lines[0]).toBe('Employee Name,Employee Email,Leave Type,Start Date,End Date,Reason');
    });
});