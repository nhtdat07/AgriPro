import cron from 'node-cron';
import { pool } from '../db.js';
import { checkInventory } from './check_inventory.js';

// Checking inventory for all user agencies at 02:00 GMT+7 every day
cron.schedule('40 4 * * *', async () => {
    console.log('[CRON] Running inventory check...');
    await checkInventory(pool);
    console.log('[CRON] Finish inventory check');
});