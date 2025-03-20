/**
 * Executes the 'addProduct' query.
 * @param {Object} params - Parameters for the query.
 * @returns {Promise<Array>} - Query result rows.
 */
export async function addProduct(pool, params = {}) {
    try {
        const query = `INSERT INTO product (agency_id, name, brand, category, out_price, production_place, usages, guidelines, image_path)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
RETURNING *;`;
        const { rows } = await pool.query(query, Object.values(params));
        return rows;
    } catch (error) {
        console.error('Error executing addProduct:', error);
        throw error;
    }
}

