import { randomBytes, randomUUID } from 'crypto'
import { query } from '../db.js'

export const uniqueSuffix = () => randomBytes(4).toString('hex')

const MS_PER_DAY = 24 * 60 * 60 * 1000

export const daysFromNow = (days) => new Date(Date.now() + days * MS_PER_DAY)

const quotedColumns = (columns) => columns.map(column => `"${column}"`).join(', ')

const placeholders = (count) => Array.from({ length: count }, (_, index) => `$${index + 1}`).join(', ')

export const insertRow = async (table, values) => {
  const columns = Object.keys(values)
  const { rows: [row] } = await query(
    `INSERT INTO ${table} (${quotedColumns(columns)}) VALUES (${placeholders(columns.length)}) RETURNING *`,
    Object.values(values)
  )
  return row
}

export const insertTimestampedRow = (table, values) => {
  const now = new Date()
  return insertRow(table, { id: randomUUID(), ...values, createdAt: now, updatedAt: now })
}

export const linkRows = (table, values) => {
  const columns = Object.keys(values)
  return query(
    `INSERT INTO ${table} (${quotedColumns(columns)}) VALUES (${placeholders(columns.length)}) ON CONFLICT DO NOTHING`,
    Object.values(values)
  )
}
