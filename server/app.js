// server/app.js
const express = require('express');
const app = express();

// Corrected imports
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const managerRoutes = require('./routes/manager');

// Middleware
app.use(express.json());

// Ensure a JWT secret is available in test environments
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_jwt_secret_for_tests';

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/manager', managerRoutes);

module.exports = app;