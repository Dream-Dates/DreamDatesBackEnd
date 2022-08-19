/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.up = function(knex) {
    return knex.schema.createTable("movies", (table) => {
        table.string("id")
        table.string("title").notNullable()
        table.string("description", 2000)
        table.string("img")
        table.integer("votes")
        
      })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable("movies")
};
