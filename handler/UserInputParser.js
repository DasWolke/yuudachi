const InvalidArgumentError = require('../structure/errors/InvalidArgumentError')
const utils = require('../structure/utils')

class UserInputParser {
  constructor (bot) {
    this.bot = bot
  }

  parse (type, input) {
    switch (type) {
      case 'boolean':
        return this._parseBoolean(input)
      case 'string':
        return this._parseString(input)
      case 'number':
        return this._parseNumber(input)
      default:
        break
    }
  }

  _parseBoolean (input) {
    switch (input.trim()) {
      case 'true':
        return true
      case 'false':
        return false
      default:
        throw new InvalidArgumentError('string', 'boolean')
    }
  }

  _parseString (input, regex) {
    return input
  }

  _parseNumber (input) {
    if (utils.numberRegex.test(input)) {
      return parseFloat(input)
    }
    throw new InvalidArgumentError('string', 'number')
  }
}

module.exports = UserInputParser
