import { Edition } from './database/Edition.js'

export class EditionModel {
  static async getAll () {
    return Edition.findAll()
  }

  static async create ({ body }) {
    return Edition.create(body)
  }
}
