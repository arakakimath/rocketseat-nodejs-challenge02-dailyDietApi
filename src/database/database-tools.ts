import { randomUUID } from "node:crypto"
import { knex } from "./database-setup"

export const database = {
  insert: async (table: string, data: {}) => {
    await knex(table).insert({
      id: randomUUID(), 
      ...data
    })
  },
  edit: () => {},
  remove: () => {},
  showAll: () => {},
  showOne: () => {},
}