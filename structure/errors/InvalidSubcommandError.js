class InvalidSubcommandError extends Error {
  constructor (...args) {
    super(...args)
    Error.captureStackTrace(this, InvalidSubcommandError)
  }
}

module.exports = InvalidSubcommandError
