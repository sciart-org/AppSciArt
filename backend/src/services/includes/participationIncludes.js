import { ConceptualMap } from '../../models/ConceptualMap.js'
import { Flower } from '../../models/Flower.js'
import { Fruit } from '../../models/Fruit.js'
import { Seed } from '../../models/Seed.js'

export const includeParticipationItems = () => {
  return [
    {
      model: Fruit
    },
    {
      model: Flower
    },
    {
      model: ConceptualMap,
      include: {
        model: Seed
      }
    }
  ]
}
