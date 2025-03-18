import pkg from 'pg';
const { Pool } = pkg;
import { randomUUID } from 'crypto';
import { pool as mainPool } from '../db';

const testDbName = `test_db_${randomUUID().replace(/-/g, '')}`;

export async function setupTestDb() {
    await mainPool.query(`CREATE DATABASE ${testDbName}`);
    return new Pool({
        connectionString: `postgres://postgres:postgres@localhost:5432/${testDbName}`,
    });
}

export async function teardownTestDb(pool) {
    await pool.end();
    await mainPool.query(`DROP DATABASE ${testDbName}`);
}