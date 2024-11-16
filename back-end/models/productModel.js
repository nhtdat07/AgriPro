const db = require("../config/db");

const getProducts = async () => {
    const result = await db.query("SELECT * FROM products");
    return result.rows;
};

const createProduct = async (name, category, price) => {
    const result = await db.query(
        "INSERT INTO products (name, category, price) VALUES ($1, $2, $3) RETURNING *",
        [name, category, price]
    );
    return result.rows[0];
};

module.exports = {
    getProducts,
    createProduct,
};
