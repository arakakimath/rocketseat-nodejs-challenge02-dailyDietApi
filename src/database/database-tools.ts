import { randomUUID } from 'node:crypto'
import { knex } from './database-setup'

export const database = {
  showAll: async (table: string, sessionId: string) => {
    const meals = await knex<Meal>(table)
      .select()
      .where('session_id', sessionId)

    const dietMeals = meals.filter((meal) => meal.diet.toLowerCase() === 'yes')

    const mealsInOrder = meals.sort((a, b) => {
      const [dayA, timeA] = a.meal_time.split(', ')
      const [dayB, timeB] = b.meal_time.split(', ')

      const arrayA = []
      const arrayB = []

      arrayA.push(dayA.split('/').reverse().join('-'), timeA)
      arrayB.push(dayB.split('/').reverse().join('-'), timeB)

      const dateA = new Date(
        arrayA.join('T'),
      )
      const dateB = new Date(
        arrayB.join('T'),
      )

      return dateA - dateB
    })

    const mealsRecords = {
      acc: 0,
      record: 0
    }

    for (const meal of mealsInOrder) {
      if (meal.diet === 'yes') {
        mealsRecords.acc++
        if (mealsRecords.acc > mealsRecords.record)
          mealsRecords.record = mealsRecords.acc
      } else {
        mealsRecords.acc = 0
      }
    }

    return {
      totalMeals: meals.length,
      dietMeals: dietMeals.length,
      offDietMeals: meals.length - dietMeals.length,
      biggestSequence: mealsRecords.record,
      meals: mealsInOrder,
    }
  },

  showOne: async (table: string, search: Search) => {
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
