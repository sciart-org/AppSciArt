export function customErrorHandler (req, res, next) {
  const oldSend = res.send

  res.send = function (data) {
    res.send = oldSend

    if (!(data.error && typeof data.error === 'string' && data.error.includes('RequestValidationError'))) {
      return res.send(data)
    }

    const lines = data.error?.split('\n')
    let userMessage = ''

    for (const line of lines) {
      const match = line.match(/#\/(?:anyOf\/\d+\/)?properties\/([^\/\s]+)\/?[^ ]* > (.+)/)
      if (match) {
        const [_, field, message] = match
        const friendlyField = field.charAt(0).toUpperCase() + field.slice(1)
        if (!userMessage.includes(`${friendlyField} ${message}. `)) {
          userMessage += `${friendlyField} ${message}. `
        }
      }
    }
    return res.send({
      error: userMessage
    })
  }
  next()
}
