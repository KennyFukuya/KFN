import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('topics', function (table) {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.timestamps(true, true);
  }).then(function () {
    const topics = [
      { name: 'Foods' },
      { name: 'Cars' },
      { name: 'Cats' },
      { name: 'Dogs' },
      { name: 'Soccer' },
      { name: 'Math' },
      { name: 'School' },
      { name: 'Games' },
      { name: 'Cards' },
      { name: 'Brazil' },
      { name: 'Dragon Ball' },
    ];

    return knex('topics').insert(topics);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("topics");
}
