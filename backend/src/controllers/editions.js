import { EditionModel } from '../models/editions.js'
import { validateEdition } from '../schemas/edition.js'

export class EditionController {
  static async getAll (req, res) {
    const editions = await EditionModel.getAll()
    res.json(editions)
  }

  static async create (req, res) {
    const result = validateEdition(req.body)
    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }
    const newEdition = await EditionModel.create({ body: result.data })
    res.status(201).json(newEdition)
  }
}
