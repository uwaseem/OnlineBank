function createReturnObject (code, success, message, error) {
  if (success !== true && success !== false) {
    return {
      code: 500,
      success: false,
      message: `${success} is not a valid value for success`
    }
  }

  if (error) {
    console.error(message, error)
  }

  return { code, success, message }
}

module.exports = { createReturnObject }
