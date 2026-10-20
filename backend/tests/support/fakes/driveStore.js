import { randomBytes } from 'crypto'
import { stateSharedWithApp } from '../native.js'

export const FOLDER_MIME = 'application/vnd.google-apps.folder'
export const DOCUMENT_MIME = 'application/vnd.google-apps.document'
export const PNG_MIME = 'image/png'

const filesById = stateSharedWithApp('driveFiles', () => new Map())

const newDriveId = () => randomBytes(24).toString('base64url').slice(0, 33)

const fileNotFoundError = (fileId) => {
  const error = new Error(`File not found: ${fileId}`)
  error.code = 404
  error.response = { status: 404 }
  return error
}

const existingFile = (fileId) => {
  const file = filesById.get(fileId)
  if (!file || file.trashed) throw fileNotFoundError(fileId)
  return file
}

const onlyRequestedFields = (file, fields) => {
  const everyField = { id: file.id, name: file.name, mimeType: file.mimeType, parents: [...file.parents] }
  if (!fields) return { id: file.id, name: file.name, mimeType: file.mimeType }
  return Object.fromEntries(Object.entries(everyField).filter(([key]) => fields.includes(key)))
}

const DRIVE_QUERY_CLAUSES = [
  { pattern: /'([^']*)' in parents/, matches: (file, parentId) => file.parents.includes(parentId) },
  { pattern: /name = '([^']*)'/, matches: (file, name) => file.name === name },
  { pattern: /name contains '([^']*)'/, matches: (file, text) => file.name.includes(text) },
  { pattern: /mimeType = '([^']*)'/, matches: (file, mimeType) => file.mimeType === mimeType },
  { pattern: /trashed = (true|false)/, matches: (file, trashed) => file.trashed === (trashed === 'true') }
]

const matchesDriveQuery = (file, query = '') => DRIVE_QUERY_CLAUSES.every(({ pattern, matches }) => {
  const clause = query.match(pattern)
  return !clause || matches(file, clause[1])
})

const storeFile = ({ name, mimeType = 'application/octet-stream', parents = [] }) => {
  const file = { id: newDriveId(), name, mimeType, parents: [...parents], trashed: false, permissions: [] }
  filesById.set(file.id, file)
  return file
}

export const driveApi = {
  files: {
    create: async ({ requestBody = {}, fields } = {}) => {
      return { data: onlyRequestedFields(storeFile(requestBody), fields) }
    },
    copy: async ({ fileId, requestBody = {}, fields } = {}) => {
      const source = existingFile(fileId)
      const copy = storeFile({
        name: requestBody.name ?? source.name,
        mimeType: source.mimeType,
        parents: requestBody.parents ?? source.parents
      })
      copy.copiedFrom = source.id
      return { data: onlyRequestedFields(copy, fields) }
    },
    get: async ({ fileId, fields } = {}) => {
      return { data: onlyRequestedFields(existingFile(fileId), fields) }
    },
    list: async ({ q, fields, pageSize } = {}) => {
      const matching = [...filesById.values()].filter(file => matchesDriveQuery(file, q))
      const page = pageSize ? matching.slice(0, pageSize) : matching
      return { data: { files: page.map(file => onlyRequestedFields(file, fields)) } }
    },
    update: async ({ fileId, requestBody = {}, addParents, removeParents, fields } = {}) => {
      const file = existingFile(fileId)
      if (requestBody.name) file.name = requestBody.name
      if (removeParents) {
        const removedParentIds = removeParents.split(',')
        file.parents = file.parents.filter(parentId => !removedParentIds.includes(parentId))
      }
      if (addParents) file.parents.push(...addParents.split(','))
      return { data: onlyRequestedFields(file, fields) }
    },
    delete: async ({ fileId } = {}) => {
      existingFile(fileId)
      filesById.delete(fileId)
      return { data: '' }
    }
  },
  permissions: {
    create: async ({ fileId, requestBody = {} } = {}) => {
      existingFile(fileId).permissions.push({ ...requestBody })
      return { data: { id: newDriveId(), ...requestBody } }
    }
  }
}

export const resetDrive = () => filesById.clear()

export const allFiles = () => [...filesById.values()].map(file => ({ ...file, parents: [...file.parents] }))

export const childrenOf = (folderId) => allFiles().filter(file => file.parents.includes(folderId))

export const childNamed = (folderId, name) => childrenOf(folderId).find(file => file.name === name)

export const createFolder = (name, parentId) =>
  storeFile({ name, mimeType: FOLDER_MIME, parents: parentId ? [parentId] : [] })

export const createDocument = (name, parentId) => storeFile({ name, mimeType: DOCUMENT_MIME, parents: [parentId] })

export const createImage = (name, parentId) => storeFile({ name, mimeType: PNG_MIME, parents: [parentId] })

export const folderLink = (folderId) => `https://drive.google.com/drive/folders/${folderId}`

export const folderIdFromLink = (link) => link?.match(/[-\w]{25,}/)?.[0] ?? null
