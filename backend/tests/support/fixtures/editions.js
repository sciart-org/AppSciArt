import { insertTimestampedRow, uniqueSuffix } from './rows.js'
import { createEditionFolders } from './driveTemplates.js'

export const anEdition = ({
  state = 'PLANNED',
  name = `Edition ${uniqueSuffix()}`,
  year = new Date().getFullYear(),
  shortDescription = 'A short description of the edition',
  longDescription = 'A long description of the edition, with everything about it.',
  catalogLink = state === 'PUBLISHED' ? `https://example.com/catalogue-${uniqueSuffix()}.pdf` : null,
  logo = true
} = {}) => insertTimestampedRow('public.editions', {
  name,
  year,
  shortDescription,
  longDescription,
  catalogLink,
  state,
  driveLink: createEditionFolders({ year, name, logo })
})

export const aNotAnnouncedEdition = (overrides) => anEdition({ ...overrides, state: 'PLANNED' })
export const anAnnouncedEdition = (overrides) => anEdition({ ...overrides, state: 'ACTIVE' })
export const aClosedEdition = (overrides) => anEdition({ ...overrides, state: 'CLOSED' })
export const aPublishedEdition = (overrides) => anEdition({ ...overrides, state: 'PUBLISHED' })
