const express = require('express');
const app = express();
const port = 8080;
const pool = require('./db');

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!')
})

// Test DB connection on startup
const startServer = async () => {
    try {
        // Check if the database is connected
        await pool.query('SELECT NOW()');
        console.log('Connected to the database');

        // Start the server after DB is ready
        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}/`);
        });
    } catch (err) {
        console.error('Failed to connect to the database:', err);
        process.exit(1); // Exit if DB connection fails
    }
};

startServer();