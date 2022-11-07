/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('dating_ideas').del()
  await knex('dating_ideas').insert([
    {id: 1, title: 'catcher in the rye', description: "this is a test", img: "/img", user_id: 0},
  ]);
};
