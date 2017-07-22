function createReturnObject (code, success, message, error) {
  if (error) {
    console.error(message, error)
  }

  return { code, success, message }
}

module.exports = { createReturnObject }
