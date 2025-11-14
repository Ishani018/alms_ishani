const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

const authRoutes = require('./routes/authRoutes');
const leaveRoutes = require('./routes/leaveRoutes');
const userRoutes = require('./routes/userRoutes'); // Add user routes

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Serve static files from the public folder
app.use(express.static('public'));

// Route for home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Define routes
app.use('/auth', authRoutes);
app.use('/leaves', leaveRoutes);
app.use('/users', userRoutes);  // Mount user routes at /users path

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
