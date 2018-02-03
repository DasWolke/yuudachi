const Command = require('../../structure/Command')

class ImageCommands extends Command {
  constructor (bot) {
    super()
    this.cmd = 'image'
    this.shortcuts = ['pat', 'cuddle', 'kiss', 'hug', 'poi']
    this.aliases = ['images'].concat(this.shortcuts)
    this.type = 'fun'
    this.bot = bot
    this.types = []
    this.baseFields = [{
      name: 'pat / image pat',
      value: 'Give someone a headpat'
    }, {
      name: 'cuddle / image cuddle',
      value: 'Cuddle someone'
    }, {
      name: 'kiss / image kiss',
      value: 'Kiss someone'
    }, {
      name: 'hug / image hug',
      value: 'Hug someone'
    }, {
      name: 'poi / image poi',
      value: 'Poi~'
    }]
    this.init()
    this.help = {
      description: 'Reaction image commands, can be used for patting, hugging or cuddling people',
      thumbnail: 'https://cdn.discordapp.com/emojis/379725495161323530.png'
    }
  }

  async init () {
    try {
      this.types = await this.bot.handler.weebHandler.fetchTypes()
      this.types = this.types.sort()
    } catch (e) {
      console.error(e)
    }
  }

  async run (msg, args, calledCmd) {
    if (this.shortcuts.find(sc => sc === calledCmd.toLowerCase())) {
      msg.cmd = calledCmd
      return this.bot.handler.weebHandler.handleCmd(msg)
    }
    if (args.length === 0) {
      return this.bot.commands['help'].run(msg, [this.cmd])
    }
    if (args.length === 1 && args[0] === 'types') {
      return this.runSubcommand('types', msg, args.splice(1), this)
    }
    if (this.types.find(type => type === args[0].toLowerCase())) {
      msg.cmd = args[0].toLowerCase()
      return this.bot.handler.weebHandler.handleCmd(msg)
    }
  }
}

module.exports = ImageCommands
