import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('meals', (table) => {
    table.uuid('id').primary()
    table.text('name').notNullable()
    table.text('description')
    table.string('meal_time').notNullable()
    table.string('diet').notNullable()
    table.string('created_at').notNullable().defaultTo(knex.fn.now())
    table.string('updated_at').notNullable()
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('meals')
}

