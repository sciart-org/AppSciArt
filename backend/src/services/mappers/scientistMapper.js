export const mapScientistEditions = (scientists) => {
  const mappedScientists = scientists.map(scientist => {
    return {
      ...scientist,
      editions: [...new Set(scientist.seeds.flatMap(seed => seed.editions.map(edition => edition.name)))],
      seeds: undefined
    }
  })
  return mappedScientists
}

export const mapScientistsOfOpenEditions = (scientists) => {
  return scientists.map(s => {
    const plain = s.toJSON()
    return { ...plain, editions: plain.editions.map(e => e.name) }
  })
}
