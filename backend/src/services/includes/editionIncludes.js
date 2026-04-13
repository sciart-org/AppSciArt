import { Flower } from '../../models/Flower.js'
import { Fruit } from '../../models/Fruit.js'
import { Seed } from '../../models/Seed.js'

export const includeEditionFruits = {
  model: Seed,
  attributes: ['id'],
  required: false,
  through: { attributes: [] },
  include: [
    {
      model: Flower,
      attributes: ['id'],
      required: false,
      include: [
        {
          model: Fruit,
          attributes: ['id', 'title', 'mainImage'],
          required: false
        }
      ]
    }
  ]
}
