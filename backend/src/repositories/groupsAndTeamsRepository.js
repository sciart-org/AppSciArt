import { ConceptualMap } from '../models/ConceptualMap.js'

export const getConceptualMapsOfHackathon = (hackathonId) => {
  return ConceptualMap.scope({ method: ['withSeedsOfHackathon', hackathonId] }).findAll()
}

export const getConceptualMap = (conceptualMapId) => {
  return ConceptualMap.findByPk(conceptualMapId)
}

export const getConceptualMapWithSeeds = (conceptualMapId) => {
  return ConceptualMap.scope('withSeeds').findByPk(conceptualMapId)
}

export const getDeliveredMapIdsOfSeed = (seedId) => {
  return ConceptualMap.findAll({
    attributes: ['id'],
    where: {
      seedId,
      isDelivered: true
    }
  })
}

export const getMinimalConceptualMap = (conceptualMapId) => {
  return ConceptualMap.findByPk(conceptualMapId, {
    attributes: ['map']
  })
}

export const getConceptualMapOfHackathon = (conceptualMapId, hackathonId) => {
  return ConceptualMap.scope({ method: ['withSeedsOfHackathon', hackathonId] }).findOne({
    where: { id: conceptualMapId }
  })
}

export const createConceptualMapOfSeed = (seedId) => {
  return ConceptualMap.create({ seedId })
}

export const deleteConceptualMap = (conceptualMapId) => {
  return ConceptualMap.destroy({
    where: {
      id: conceptualMapId
    }
  })
}
