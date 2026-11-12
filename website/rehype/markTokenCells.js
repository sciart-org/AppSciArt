const TOKEN_CELL_CLASS = 'cell-token'
const MAX_TOKEN_LENGTH = 20
const TABLE_CELLS = new Set(['td', 'th'])

const textOf = (node) => node.type === 'text'
  ? node.value
  : (node.children ?? []).map(textOf).join('')

const isShortToken = (text) => text.length > 0 && text.length <= MAX_TOKEN_LENGTH && !/\s/.test(text)

const markCells = (node) => {
  if (node.type === 'element' && TABLE_CELLS.has(node.tagName) && isShortToken(textOf(node).trim())) {
    const classes = node.properties.className ?? []
    node.properties.className = [...classes, TOKEN_CELL_CLASS]
  }
  for (const child of node.children ?? []) markCells(child)
}

export default function markTokenCells () {
  return markCells
}
