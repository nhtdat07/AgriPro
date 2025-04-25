export const startTransaction = async (pool) => {
    await pool.query('BEGIN;');
}

export const commitTransaction = async (pool) => {
    await pool.query('COMMIT;');
}

export const rollbackTransaction = async (pool) => {
    await pool.query('ROLLBACK;');
}