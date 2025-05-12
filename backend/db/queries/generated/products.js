/**
 * Executes the 'getProducts' query.
 * @param {Object} params - Parameters for the query.
 * @returns {Promise<Array>} - Query result rows.
 */
export async function getProducts(pool, params = {}) {
    try {
        const query = `SELECT * FROM product
WHERE agency_id = $1 AND is_deleted = false
    AND CASE WHEN $2::VARCHAR IS NOT NULL THEN name ILIKE $2::VARCHAR ELSE true END
    AND CASE WHEN $3::product_type IS NOT NULL THEN category = $3::product_type ELSE true END
    AND CASE WHEN $4::VARCHAR IS NOT NULL THEN usages ILIKE $4::VARCHAR ELSE true END
ORDER BY id DESC
LIMIT $5 OFFSET $6;`;
        const { rows } = await pool.query(query, Object.values(params));
        return rows;
    } catch (error) {
        throw error;
    }
}

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
        throw error;
    }
}

/**
 * Executes the 'getProductById' query.
 * @param {Object} params - Parameters for the query.
 * @returns {Promise<Array>} - Query result rows.
 */
export async function getProductById(pool, params = {}) {
    try {
        const query = `SELECT * FROM product WHERE agency_id = $1 AND id = $2 AND is_deleted = false;`;
        const { rows } = await pool.query(query, Object.values(params));
        return rows;
    } catch (error) {
        throw error;
    }
}

/**
 * Executes the 'getProductQuantityInInventory' query.
 * @param {Object} params - Parameters for the query.
 * @returns {Promise<Array>} - Query result rows.
 */
export async function getProductQuantityInInventory(pool, params = {}) {
    try {
        const query = `SELECT SUM(quantity) AS total_quantity FROM inventory_product WHERE agency_id = $1 AND product_id = $2;`;
        const { rows } = await pool.query(query, Object.values(params));
        return rows;
    } catch (error) {
        throw error;
    }
}

/**
 * Executes the 'updateProduct' query.
 * @param {Object} params - Parameters for the query.
 * @returns {Promise<Array>} - Query result rows.
 */
export async function updateProduct(pool, params = {}) {
    try {
        const query = `UPDATE product
SET
    name = CASE WHEN $1::VARCHAR IS NOT NULL THEN $1::VARCHAR ELSE name END,
    brand = CASE WHEN $2::VARCHAR IS NOT NULL THEN $2::VARCHAR ELSE brand END,
    category = CASE WHEN $3::product_type IS NOT NULL THEN $3::product_type ELSE category END,
    production_place = CASE WHEN $4::VARCHAR IS NOT NULL THEN $4::VARCHAR ELSE production_place END,
    out_price = CASE WHEN $5::INTEGER IS NOT NULL THEN $5::INTEGER ELSE out_price END,
    usages = CASE WHEN $6::VARCHAR IS NOT NULL THEN $6 ELSE usages::VARCHAR END,
    guidelines = CASE WHEN $7::VARCHAR IS NOT NULL THEN $7 ELSE guidelines::VARCHAR END,
    image_path = CASE WHEN $8::VARCHAR IS NOT NULL THEN $8 ELSE image_path::VARCHAR END
WHERE agency_id = $9 AND id = $10 AND is_deleted = false
RETURNING *;`;
        const { rows } = await pool.query(query, Object.values(params));
        return rows;
    } catch (error) {
        throw error;
    }
}

/**
 * Executes the 'markProductAsDeleted' query.
 * @param {Object} params - Parameters for the query.
 * @returns {Promise<Array>} - Query result rows.
 */
export async function markProductAsDeleted(pool, params = {}) {
    try {
        const query = `UPDATE product
SET is_deleted = true
WHERE agency_id = $1 AND id = $2 AND is_deleted = false
RETURNING *;`;
        const { rows } = await pool.query(query, Object.values(params));
        return rows;
    } catch (error) {
        throw error;
    }
}

