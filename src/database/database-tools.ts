import { randomUUID } from 'node:crypto'
import { knex } from './database-setup'

export const database = {
  showAll: async (table: string) => {
    const meals = await knex<Meal>(table).select()

    const dietMeals = meals.filter((meal) => meal.diet.toLowerCase() === 'yes')

    return {
      totalMeals: meals.length,
      dietMeals: dietMeals.length,
      offDietMeals: meals.length - dietMeals.length,
      meals,
    }
  },

  showOne: async (table: string, id: string) => {
    return await knex<Meal>(table).where(id, 'id').first()
  },

  insert: async (table: string, data: {}) => {
    await knex(table).insert({
      id: randomUUID(),
      ...data,
      updated_at: knex.fn.now(),
    })
  },

  edit: async (table: string, id: string) => {
    
  },
  remove: () => {},
}
