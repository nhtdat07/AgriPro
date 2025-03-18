import { app } from './app.js';
import * as consts from './consts/consts.js';
import { pool } from './db.js';

// Test DB connection on startup
const startServer = async () => {
    try {
        // Check if the database is connected
        await pool.query('SELECT NOW()');
        // console.log('Connected to the database');

        // Start the server after DB is ready
        app.listen(consts.SERVER_PORT, () => {
            console.log(`Server running at http://localhost:${consts.SERVER_PORT}/`);
        });
    } catch (err) {
        console.error('Failed to connect to the database:', err);
        process.exit(1); // Exit if DB connection fails
    }
};

startServer();