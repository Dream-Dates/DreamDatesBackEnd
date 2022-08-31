/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("dating_ideas", (table) => {
    table.string("id");
    table.string("title");
    table.string("description", 2000);
    table.text("img");
    table.integer("user_id");
    table.string("type");
    table.string("adress_street");
    table.string("city");
    table.string("venue");
    table.string("country");
    table.string("price_range");
    table.integer("votes");
    table.string("rating");
    table.string("link");
    table.string("time");
    table.string("price");
    table.string("opening_hours");
    table.string("website");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("dating_ideas");
};
