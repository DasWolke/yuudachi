const Command = require('../../../structure/Command')
const Moment = require('moment')
const utils = require('../../../structure/utils')

class Recommendation extends Command {
  constructor (bot) {
    super()
    this.cmd = 'rec'
    this.type = 'community'
    this.bot = bot
    this.baseFields = [{
      name: 'rec',
      value: 'Shows the amount of letters of recommendation you currently have and how many you can write until you are exhausted'
    }, {
      name: 'rec @user',
      value: 'Write a letter of recommendation for the mentioned user'
    }]
    this.help = { description: 'Write letters of recommendation for other admirals and get an overview of the most recommended admirals around the world' }
  }

  async run (msg, args) {
    const selfUser = msg.selfUser
    if (!msg.channel.guild_id) {
      return this.bot.rest.channel.createMessage(msg.channel_id, '<:poiPeek:380429329877827595> This command can only be used inside servers')
    }
    if (args.length > 0 && args[0] === 'leaderboard') {
      return this.runSubcommand(args[0], msg, selfUser, this)
    }
    let user
    const smartRec = await this.bot.handler.settingsHandler.resolve('server.smartrec', msg.channel.guild_id)
    let unmentionUser = true
    if (args.length > 0) {
      const userData = await this._getUserForRec(msg, args, selfUser, unmentionUser)
      if (!userData.user) {
        return
      }
      user = userData.user
      unmentionUser = userData.unmentionUser
    }
    if (!user) {
      return this._showRec(msg, selfUser)
    }
    if (!unmentionUser && smartRec) {
      unmentionUser = await this.bot.handler.cacheHandler.get(`rec.${user.id}.${msg.channel_id}`, false, true, 300)
    }
    try {
      await this._updateRep(msg.author.id, user.id, selfUser.id)
      const username = unmentionUser ? `**${user.username}#${user.discriminator}**` : `<@${user.id}>`
      if (smartRec) {
        await this.bot.handler.cacheHandler.set(`rec.${user.id}.${msg.channel_id}`, false, true, 300, true)
      }
      return this.bot.rest.channel.createMessage(msg.channel_id, `<:poiHappy:379720490924769292> You just wrote a letter of recommendation for ${username}`)
    } catch (e) {
      console.log(e)
      if (e.response && e.response.data.code) {
        return this._processResponseError(e, msg)
      }
      if (!e.response || !e.response.data.code) {
        return this.bot.rest.channel.createMessage(msg.channel_id, 'There was an error while trying to communicate with the recommendation service')
      }
      console.error(e)
    }
  }

  async _showRec (msg, selfUser) {
    let recData
    try {
      recData = await this.bot.handler.weebHandler.getReputation(selfUser.id, msg.author.id)
    } catch (e) {
      return this.bot.rest.channel.createMessage(msg.channel_id, 'There was an error while trying to communicate with the recommendation service')
    }
    let hasEnergy
    if (recData.availableReputations > 0) {
      hasEnergy = `You can write ${recData.availableReputations} more letter${recData.availableReputations > 1 ? 's' : ''} today`
    } else {
      const startMoment = Moment(recData.date)
      const endMoment = Moment(new Date(recData.nextAvailableReputations[0]).getTime() + startMoment)
      const duration = startMoment.to(endMoment)
      hasEnergy = `You already wrote a lot of letters today, you can write the next letter ${duration}`
    }
    const embed = {
      embed: {
        description: `You currently have **${recData.reputation}** letter${recData.reputation === 1 ? '' : 's'} of recommendation\n\n**${hasEnergy}**`,
        color: 0xF3D73E,
        thumbnail: { url: 'https://cdn.weeb.sh/assets/reputation/tied-scroll.png' }
      }
    }
    return this.bot.rest.channel.createMessage(msg.channel_id, embed)
  }

  async _getUserForRec (msg, args, selfUser, unmentionUser) {
    let user
    if (msg.mentions.length > 0) {
      user = msg.mentions[0]
    } else if (utils.idRegex.test(args[0])) {
      user = await this.bot.cache.user.get(args[0].trim())
      unmentionUser = false
    }
    if (!user) {
      return this.bot.rest.channel.createMessage(msg.channel_id, 'No user was found with this id')
    }
    if (user.bot) {
      let recData
      try {
        recData = await this.bot.handler.weebHandler.getReputation(selfUser.id, user.id)
      } catch (e) {

      }
      if (recData) {
        try {
          await this.bot.handler.weebHandler.resetReputation(selfUser.id, user.id, true)
        } catch (e) {
        }
      }
      if (user.id === msg.selfUser.id) {
        return this.bot.rest.channel.createMessage(msg.channel_id, '<:poiLove:379725495161323530> Thanks for trying to write a recommendation letter for me, but only humans may get one')
      }
      return this.bot.rest.channel.createMessage(msg.channel_id, '<:poiPeek:380429329877827595> Only humans may get a recommendation letter')
    }
    if (user.id === msg.author.id) {
      return this.bot.rest.channel.createMessage(msg.channel_id, ':no_entry_sign: You can\'t write a letter of recommendation for yourself')
    }
    return { user, unmentionUser }
  }

  async _processResponseError (e, msg) {
    const startMoment = Moment(e.response.data.date)
    const sortedCooldowns = this._sortCooldown(e.response.data.user.cooldown)
    const endMoment = Moment(new Date(sortedCooldowns[0]).getTime() + 1000 * 60 * 60 * 24)
    const duration = startMoment.to(endMoment)
    return this.bot.rest.channel.createMessage(msg.channel_id, `<:poiSleeping:385511265222656000> You are too exhausted since you already wrote a lot of recommendation letters today, try again ${duration}`)
  }

  async _updateRep (sourceUserId, targetUserId, botId) {
    return this.bot.handler.weebHandler.increaseReputation(botId, sourceUserId, targetUserId)
  }

  _sortCooldown (cooldown) {
    return cooldown.sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
  }
}

module.exports = Recommendation
