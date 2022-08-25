/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("events", (table) => {
        table.integer("id")
        table.string("title")
        table.string("type")
        table.string("adress_street")
        table.string("city")
        table.string("venue")
        table.string("country")
        table.string("price_range")
        table.string("img")
        table.string("time")
        table.string("link")
      })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable("events")
};