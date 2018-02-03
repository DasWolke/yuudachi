const promisifyAll = require('tsubaki').promisifyAll
const redis = require('redis')
promisifyAll(redis.RedisClient.prototype)
promisifyAll(redis.Multi.prototype)

class CacheHandler {
  constructor (bot, options) {
    this.bot = bot
    this.options = options
    this.ready = false
    this.client = redis.createClient(options)
    this.client.on('error', (err) => {
      console.error(err)
    })
    this.client.on('ready', () => {
      this.ready = true
    })
  }

  async get (id, parseJson = false, setExpire = true, expireTime = 3600) {
    let item = await this.client.getAsync(id)
    if (item) {
      if (parseJson) {
        try {
          item = JSON.parse(item)
        } catch (e) {
          return null
        }
      }
      if (setExpire) {
        await this.client.expireAsync(id, expireTime)
      }
      return item
    }
    return null
  }

  async set (id, stringifyJson = false, setExpire = true, expireTime = 3600, data) {
    if (stringifyJson) {
      data = JSON.stringify(data)
    }
    await this.client.setAsync(id, data)
    if (setExpire) {
      await this.client.expireAsync(id, expireTime)
    }
  }
}

module.exports = CacheHandler
