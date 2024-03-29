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
    table.string("address_street");
    table.string("city");
    table.string("venue");
    table.string("country");
    table.string("price_range");
    table.integer("votes");
    table.string("rating");
    table.string("link", 2000);
    table.string("time");
    table.string("price");
    table.text("opening_hours");
    table.string("website");
    table.text("image")
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("dating_ideas");
};
