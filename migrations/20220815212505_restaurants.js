/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.up = function(knex) {
    return knex.schema.createTable("restaurants", (table) => {
        table.string("id")
        table.string("title")
        table.string("adress_street")
        table.string("price_range")
        table.string("rating")
        table.string("opening_hours")
        table.string("website")
        table.string("image")
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable("restaurants")
};
 
