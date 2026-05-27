const checkExists = (resource) => {
  if (!resource) return false
  if (Array.isArray(resource) || typeof resource === 'string') {
    return resource.length > 0
  }
  return true
}

export { checkExists }
