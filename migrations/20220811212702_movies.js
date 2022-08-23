/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.up = function(knex) {
    return knex.schema.createTable("movies", (table) => {
        table.string("id")
        table.string("title")
        table.string("description", 2000)
        table.string("img")
        table.integer("votes")
        table.string("price")
        table.string("link", 2000)
        
      })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable("movies")
};
