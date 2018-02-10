const axios = require('axios')
const devToken = require('../config/config.json').weebDevToken
const pkg = require('../package')

class WeebHandler {
  constructor (weebToken, bot) {
    this.weebToken = weebToken
    this.client = axios.create({
      baseURL: 'https://api.weeb.sh',
      headers: {Authorization: `Wolke ${weebToken}`, 'User-Agent': `Yuudachi/${pkg.version}`}
    })
    this.bot = bot
  }

  async fetchTypes () {
    const req = await this.client({method: 'get', url: '/images/types'})
    return req.data.types
  }

  async getRandom (type, tags, nsfw, hidden) {
    const req = await this.client({method: 'get', url: '/images/random', params: {type, tags, nsfw, hidden}})
    return req.data
  }

  async handleCmd (msg) {
    let image
    try {
      image = await this.getRandom(msg.cmd, [], false, false)
    } catch (e) {
      return this.bot.rest.channel.createMessage(msg.channel_id, '<:poiPeek:380429329877827595> Sorry, I was unable to find an image for you')
    }
    if (!image) {
      return this.bot.rest.channel.createMessage(msg.channel_id, '<:poiPeek:380429329877827595> Sorry, I was unable to find an image for you')
    }
    return this.bot.rest.channel.createMessage(msg.channel_id, {embed: this.buildImageEmbed(image)})
  }

  buildImageEmbed (image) {
    return {
      description: `[original image](${image.url})`,
      image: {url: image.url},
      footer: {text: 'Powered by Weeb.sh'}
    }
  }

  async getReputation (botId, userId) {
    const req = await this.client({method: 'get', url: `/reputation/${botId}/${userId}`})
    return req.data.user
  }

  async increaseReputation (botId, sourceUserId, targetUserId) {
    const req = await this.client({
      method: 'post',
      url: `/reputation/${botId}/${targetUserId}`,
      data: {source_user: sourceUserId}
    })
    return req.data
  }

  async loadReputationLeaderboard (botId) {
    const req = await this.client({method: 'get', url: `/reputation/${botId}/leaderboard`})
    return req.data.users
  }

  async resetReputation (botId, userId, cooldown) {
    const req = await this.client({method: 'post', url: `/reputation/${botId}/${userId}/reset`, query: {cooldown}})
    return req.data.users
  }

  async getShitWaifu (avatar) {
    const req = await this.client({
      method: 'post',
      url: '/auto-image/waifu-insult',
      data: {avatar},
      responseType: 'arraybuffer'
    })
    return req.data
  }

  async getSetting (type, id) {
    const req = await this.client({method: 'get', url: `/settings/${type}/${id}`})
    return req.data.setting.data
  }

  async setSetting (type, id, data) {
    const req = await this.client({method: 'post', url: `/settings/${type}/${id}`, data})
    return req.data.setting.data
  }
}

module.exports = WeebHandler
