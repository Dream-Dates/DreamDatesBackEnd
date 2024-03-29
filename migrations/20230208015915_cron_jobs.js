/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable("cron_jobs", (table) => {
        table.increments("id")
        table.string("email")
        table.string("password")
        table.string("name")
        table.string("last_name")
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable("cron_jobs")
};
