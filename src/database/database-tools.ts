import { randomUUID } from 'node:crypto'
import { knex } from './database-setup'

export const database = {
  showAll: async (table: string, sessionId: string) => {
    const meals = await knex<Meal>(table)
      .select()
      .where('session_id', sessionId)

    const dietMeals = meals.filter((meal) => meal.diet.toLowerCase() === 'yes')

    return {
      totalMeals: meals.length,
      dietMeals: dietMeals.length,
      offDietMeals: meals.length - dietMeals.length,
      meals,
    }
  },

  showOne: async (table: string, search: Search) => {
    console.log(search.id)
    return await knex<Meal>(table)
      .where({
        session_id: search.sessionId,
        id: search.id,
      })
      .first()
  },

  insert: async (table: string, data: Data) => {
    await knex<Meal>(table).insert({
      id: randomUUID(),
      ...data,
      updated_at: knex.fn.now(),
    })
  },

  edit: async (table: string, data: Data) => {
    await knex<Meal>('meals')
      .where({
        id: data.id,
        session_id: data.sessionId,
      })
      .update({
        name: data.name,
        description: data.description,
        meal_time: data.meal_time,
        diet: data.diet,
        updated_at: knex.fn.now(),
      })
  },
  remove: async (table: string, search: Search) => {
    await knex(table)
      .where({
        id: search.id,
        session_id: search.sessionId,
      })
      .del()
  },
}
