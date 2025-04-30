import { pool } from '../db.js';
import { checkInventory } from './check_inventory.js';

// Checking inventory for all user agencies at 02:00 every day
(async () => {
    console.log('[CRON] Running inventory check...');
    await checkInventory(pool);
    console.log('[CRON] Finish inventory check');
    await pool.end();
    process.exit(0);
})();