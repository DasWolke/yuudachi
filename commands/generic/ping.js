const Command = require('../../structure/Command')

class Ping extends Command {
  constructor (bot) {
    super()
    this.cmd = 'ping'
    this.type = 'generic'
    this.bot = bot
    this.help = {description: 'Get the ping from the bot to discord'}
  }

  async run (msg) {
    const time = Date.now()
    const pingMsg = await this.bot.rest.channel.createMessage(msg.channel_id, 'pong')
    return this.bot.rest.channel.editMessage(msg.channel_id, pingMsg.id, `pong \`${Date.now() - time}ms\``)
  }
}

module.exports = Ping
