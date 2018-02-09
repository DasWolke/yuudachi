const utils = require('../structure/utils')
class MessageHandler {
  constructor (bot) {
    this.bot = bot
    this.commands = bot.commands
    this.prefix = bot.config.prefix
  }

  async onMessage (msg) {
    const selfUser = await utils.getSelfUser(this.bot)
    const data = await this._loadData(msg)
    if (!msg.author.bot) {
      msg.channel = data.channel
      msg.prefix = data.prefix
      msg.selfUser = selfUser
      if (msg.content.toLowerCase().startsWith(data.prefix) ||
        msg.content.startsWith(`<@${selfUser.id}>`) ||
        msg.content.startsWith(`<@!${selfUser.id}>`)) {
        try {
          let cmd
          if (msg.content.startsWith(`<@${selfUser.id}>`) || msg.content.startsWith(`<@!${selfUser.id}>`)) {
            if (msg.content.startsWith(`<@${selfUser.id}>`)) {
              cmd = msg.content.substr(`<@${selfUser.id}>`.length + 1).trim().split(' ')[0]
            } else if (msg.content.startsWith(`<@!${selfUser.id}>`)) {
              cmd = msg.content.substr(`<@!${selfUser.id}>`.length + 1).trim().split(' ')[0]
            }
          } else {
            if (msg.content.charAt(data.prefix.length) !== ' ') {
              return
            }
            cmd = msg.content.substr(data.prefix.length + 1).trim().split(' ')[0] // bump prefix length by one to not execute cmds without space
          }
          if (!cmd) {
            return
          }
          msg.cmd = cmd
          if (this.commands[cmd]) {
            const args = this._getCommandArguments(msg, cmd)
            return this.commands[cmd].run(msg, args, cmd)
          } else if (this.bot.aliases[cmd]) {
            msg.cmd = this.bot.aliases[cmd]
            const args = this._getCommandArguments(msg, cmd)
            return this.commands[msg.cmd].run(msg, args, cmd)
          }
        } catch (e) {

        }
      }
    }
  }

  async _loadData (msg) {
    const channel = await this.bot.cache.channel.get(msg.channel_id)
    let prefix = this.prefix
    if (channel.guild_id) {
      prefix = await this.bot.handler.settingsHandler.resolve('server.prefix', channel.guild_id)
    }
    return {channel, prefix}
  }

  _getCommandArguments (msg, cmd) {
    const index = msg.content.split(' ').indexOf(cmd)
    return msg.content.split(' ').splice(index + 1)
  }
}

module.exports = MessageHandler
