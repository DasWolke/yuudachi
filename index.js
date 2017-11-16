const config = require('./config/config.json');
const StarGear = require('stargear');
const RainCache = require('raincache');
let RedisEngine = RainCache.Engines.RedisStorageEngine;
const cache = new RainCache({storage: {default: new RedisEngine({})}, debug: false});
const AmqpConnector = require('stargear').Connectors.AmqpConnector;
let con = new AmqpConnector({});
// baseHost: 'http://localhost:4096'
let bot = new StarGear({cache, token: config.token, rest: {}}, con);
const BotLoader = require('./loader/BotLoader');
const util = require('util');
let axios = require('axios');
let init = async () => {
    await bot.initialize();
    let botLoader = await new BotLoader(bot, config);
    await botLoader.initialize();
    setInterval(async () => {
        try {
            let req = await axios.get('http://localhost:7000/shards/status');
            if (!req.data.shards[0].ready) {
                let channel = await bot.rest.user.createDirectMessageChannel('128392910574977024');
                await bot.rest.channel.createMessage(channel.id, 'SHARD IS DOWN!!!!!!');
            }
        } catch (e) {
            let channel = await bot.rest.user.createDirectMessageChannel('128392910574977024');
            await bot.rest.channel.createMessage(channel.id, 'GATEWAY IS DOWN!!!!!!');
        }
    }, 10000);
};
init().then(() => {
    console.log('initialized successfully');
}).catch(e => console.error(e));

process.on('unhandledRejection', (reason, promise) => {
    // if (!reason) return;
    console.log(util.inspect(promise, {depth: 4}));
});