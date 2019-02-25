const Command = require('../../structure/Command')

class Support extends Command {
  constructor (bot) {
    super()
    this.cmd = 'support'
    this.type = 'generic'
    this.help = { description: 'Get an invite to my support server' }
    this.bot = bot
  }

  async run (msg) {
    return this.bot.rest.channel.createMessage(msg.channel_id, '<:poiLove:379725495161323530> Use the following link to join my support server: https://discord.gg/PMHNfsx')
  }
}

module.exports = Support
