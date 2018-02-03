const Subcommand = require('../../structure/Subcommand')

class ImageTypes extends Subcommand {
  constructor (bot) {
    super()
    this.bot = bot
    this.cmd = 'types'
    this.parent = 'image'

    this.help = {description: 'Get a list of all types that are currently available'}
  }

  async run (msg, args, parent) {
    const typeList = parent.types.map((type) => `${type}`)
    let typeString = '```less\n'
    for (const type of typeList) {
      const index = typeList.indexOf(type)
      typeString += type
      typeString += index === typeList.length - 1 ? '' : ', '
      if ((index + 1) % 5 === 0) {
        typeString += '\n\n'
      }
    }
    typeString += '\n```'
    return this.bot.rest.channel.createMessage(msg.channel_id, typeString)
  }
}

module.exports = ImageTypes
