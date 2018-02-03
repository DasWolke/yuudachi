const Command = require('../../structure/Command')
const pkg = require('../../package')
const starGearVersion = require('stargear/package').version

class Info extends Command {
  constructor (bot) {
    super()
    this.cmd = 'info'
    this.type = 'generic'
    this.bot = bot
    this.help = {description: 'Get information about the bot, like what library was used, what version is currently being ran and more'}
  }

  async run (msg) {
    let selfUser = await this.bot.cache.user.get('self')
    selfUser = await this.bot.cache.user.get(selfUser.id)
    return this.bot.rest.channel.createMessage(msg.channel_id, await this.buildEmbed(selfUser))
  }

  async buildEmbed (selfUser) {
    return {
      embed: {
        color: 0xF3E769,
        thumbnail: {
          url: this.bot.utils.getAvatarUrl(selfUser)
        },
        fields: [{
          name: 'Version',
          value: pkg.version,
          inline: true
        }, {
          name: 'Library',
          value: `Wolkeware/Stargear V${starGearVersion}`,
          inline: true
        }, {
          name: 'Guilds',
          value: await this.bot.cache.guild.getIndexCount(),
          inline: true
        }, {
          name: 'Users',
          value: await this.bot.cache.user.getIndexCount(),
          inline: true
        }]
      }
    }
  }
}

module.exports = Info
