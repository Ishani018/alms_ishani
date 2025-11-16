const app = require('./app');
const db = require('./config/db');
const port = process.env.PORT || 3000;

// Connect to database
db.connect((err) => {
    if (err) throw err;
    console.log('MySQL Connected...');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});