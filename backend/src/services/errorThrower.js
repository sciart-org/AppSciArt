const errorThrower = (condition, message, status) => {
  if (condition) {
    const err = new Error(message)
    err.status = status
    throw err
  }
}

export { errorThrower }
