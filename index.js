const config = require('./config/config.json')
const StarGear = require('stargear')
const RainCache = require('raincache')
const RedisEngine = RainCache.Engines.RedisStorageEngine
const cache = new RainCache({
  storage: {
    default: new RedisEngine({
      host: config.redisHost,
      password: config.redisPassword
    })
  },
  debug: false
})
const AmqpConnector = require('stargear').Connectors.AmqpConnector
const con = new AmqpConnector({amqpUrl: config.amqpUrl})
// baseHost: 'http://localhost:4096'
const bot = new StarGear({cache, token: config.token, rest: {baseHost: config.snowGateUrl}}, con)
const BotLoader = require('./loader/BotLoader')
const util = require('util')
const init = async () => {
  await bot.initialize()
  const botLoader = await new BotLoader(bot, config)
  await botLoader.initialize()
}
init().then(() => {
  console.log('initialized successfully')
}).catch(e => console.error(e))

process.on('unhandledRejection', (reason, promise) => {
  console.log(util.inspect(promise, {depth: 4}))
})
