/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("dating_ideas", (table) => {
        table.increments("id")
        table.string("title").notNullable()
        table.string("description")
        table.string("img")
        table.integer()
      })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.scheme.dropTable("dating_ideas")
};
