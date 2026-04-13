import { ConceptualMap } from '../../models/ConceptualMap.js'
import { Flower } from '../../models/Flower.js'
import { Fruit } from '../../models/Fruit.js'
import { Seed } from '../../models/Seed.js'
import { includeSeedAuthors } from './productIncludes.js'

export const includeParticipationItems = () => {
  return [
    {
      model: Fruit
    },
    {
      model: Flower,
      attributes: {
        exclude: ['title', 'mainImage', 'concept', 'conceptualMap', 'state', 'seedId']
      },
      include: {
        model: Seed,
        attributes: {
          exclude: ['template', 'state', 'branchesOfKnowledge']
        },
        include: includeSeedAuthors
      }
    },
    {
      model: ConceptualMap,
      attributes: {
        exclude: ['seedId']
      },
      include: {
        model: Seed,
        attributes: {
          exclude: ['template', 'state', 'branchesOfKnowledge']
        }
      }
    }
  ]
}
