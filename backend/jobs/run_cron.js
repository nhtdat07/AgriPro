import { pool } from '../db.js';
import { checkInventory } from './check_inventory.js';
import { app } from '../app.js';
import { CRON_SECRET_KEY } from '../consts/consts.js';

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Checking inventory for all user agencies at 02:00 every day
app.post(
    "/run-inventory-check",
    cors({ origin: "*" }), // Allow all origins just for this endpoint
    async (req, res) => {
        const secret = req.headers[CRON_SECRET_KEY];
        if (secret !== process.env.CRON_SECRET) {
            return res.status(403).send('Forbidden');
        }

        console.log('[CRON] Running inventory check...');
        await checkInventory(pool);
        console.log('[CRON] Finish inventory check');
        res.status(200).send('Inventory check completed');
    }
);