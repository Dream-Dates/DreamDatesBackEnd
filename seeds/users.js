/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').del()
  await knex('users').insert([
    {id: 1, email: 'damian@gmail.com', password: "damian"},
    {id: 2, email: 'charles@gmail.com', password: "charles"},
    {id: 3, email: 'alvin@gmail.com', password: "alvin"}
  ]);
};
