/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable("restaurants", (table) => {
        table.string("id")
        table.string("title")
        table.string("adress_street")
        table.string("price_range")
        table.string("rating")
        table.text("opening_hours")
        table.string("website")
        table.text("image")
        table.string("phone")
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable("restaurants")
};

