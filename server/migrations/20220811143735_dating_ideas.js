/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("dating_ideas", (table) => {
        table.string("id")
        table.string("title").notNullable()
        table.string("description", 2000)
        table.string("img")
        table.integer("user_id")
        table.string("type")
        table.string("adress_street")
        table.string("city")
        table.string("venue")
        table.string("country")
        table.string("price_range")
        table.integer("votes")
      })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable("dating_ideas")
};
