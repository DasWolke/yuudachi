const SubCommand = require('../../../structure/Subcommand')

class RecommendationLeaderboard extends SubCommand {
  constructor (bot) {
    super()
    this.cmd = 'leaderboard'
    this.parent = 'rec'
    this.bot = bot
    this.help = {description: 'Shows a leaderboard of the users with the highest amount of recommendation'}
  }

  async run (msg, selfUser) {
    let leaderboard
    try {
      leaderboard = await this._loadLeaderboard(selfUser.id)
    } catch (e) {
      return this.bot.rest.channel.createMessage(msg.channel_id, 'There was an error while trying to communicate with the recommendation service')
    }

    const embed = {
      title: '<:poiHappy:379720490924769292> Top 10 most recommended Admirals <:poiHappy:379720490924769292>',
      color: 0xF3E769,
      description: await this._prepareLeaderboardDescription(leaderboard)
    }
    return this.bot.rest.channel.createMessage(msg.channel_id, {embed})
  }

  async _prepareLeaderboardDescription (leaderboard) {
    let i = 0
    let description = ''
    for (const user of leaderboard) {
      description += await this._prepareLeaderboardName(user, i)
      i++
      if (i === 10) {
        break
      }
    }
    return description
  }

  async _loadLeaderboard (botId) {
    return this.bot.handler.weebHandler.loadReputationLeaderboard(botId)
  }

  async _prepareLeaderboardName (user, x) {
    const trophy = x === 0 ? ' :trophy:' : x === 1 ? ':second_place:' : x === 2 ? ':third_place:' : ':medal:'
    return `**${x + 1}.**${trophy}${(x + 1) === 10 ? '' : ' '} **${await this._getUsernameFromId(user.userId)}** (${user.reputation})\n\n`
  }

  async _getUsernameFromId (id) {
    const user = await this.bot.cache.user.get(id)
    if (!user) {
      return 'User not found'
    }
    return `${user.username}#${user.discriminator}`
  }
}

module.exports = RecommendationLeaderboard
