const fs = require('fs');
const path = require('path');

function readSQL(fileName) {
    return fs.readFileSync(path.join(__dirname, '../sql/migrations', fileName), 'utf8');
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    await knex.raw(readSQL('config.up.sql'));
    await knex.raw(readSQL('customer.up.sql'));
    await knex.raw(readSQL('inventory.up.sql'));
    await knex.raw(readSQL('notification.up.sql'));
    await knex.raw(readSQL('product.up.sql'));
    await knex.raw(readSQL('purchase_order.up.sql'));
    await knex.raw(readSQL('sales_invoice.up.sql'));
    await knex.raw(readSQL('supplier.up.sql'));
    await knex.raw(readSQL('user_agency.up.sql'));
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {

};
