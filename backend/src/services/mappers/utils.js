export function toPlainObject (rawItem) {
  return (typeof rawItem?.toJSON === 'function')
    ? rawItem.toJSON()
    : rawItem
}
