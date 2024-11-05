import { randomUUID } from "node:crypto"
import { knex } from "./database-setup"

export const database = {
  showAll: async (table) => {
    return await knex(table).select()
  },

  showOne: () => {},

  insert: async (table: string, data: {}) => {
    await knex(table).insert({
      id: randomUUID(), 
      ...data,
      updated_at: knex.fn.now(),
    })
  },

  edit: () => {},
  remove: () => {},
}