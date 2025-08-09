import { Flower } from '../../models/Flower.js'
import { Fruit } from '../../models/Fruit.js'
import { Seed } from '../../models/Seed.js'

export const includeEditionFruits = {
  model: Seed,
  attributes: ['id', 'title'],
  include: [
    {
      model: Flower,
      attributes: ['id'],
      include: [
        {
          model: Fruit,
          attributes: ['id', 'title', 'mainImage']
        }
      ]
    }
  ]
}
