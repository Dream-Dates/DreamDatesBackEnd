/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable("restaurants", (table) => {
        table.string("id")
        table.string("title")
        table.string("address_street")
        table.string("price_range")
        table.text("opening_hours")
        table.string("website")
        table.text("image")
        table.string("phone")
        table.jsonb("reviews")
        table.string("rating")
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable("restaurants")
};

