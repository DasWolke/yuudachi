const config = require('./config/config.json');
const StarGear = require('stargear');
const RainCache = require('raincache');
let RedisEngine = RainCache.Engines.RedisStorageEngine;
const cache = new RainCache({storage: {default: new RedisEngine({host: 'localhost'})}, debug: false});
const AmqpConnector = require('stargear').Connectors.AmqpConnector;
let con = new AmqpConnector({});

let bot = new StarGear({cache, token: config.token}, con);
let MessageHandler = require('./handler/MessageHandler');
let WeebHandler = require('./handler/WeebHandler');
const util = require("util");
let weebHandler = new WeebHandler(config.weebToken);
let msgHandler = new MessageHandler(bot, config.prefix, weebHandler);
let axios = require('axios');
bot.on('messageCreate', async (msg) => {
    let channel = await bot.cache.channel.get(msg.channel_id);
    msg.channel = channel;
    // console.log(channel);
    console.log(`${channel.name}: ${msg.author.username}#${msg.author.discriminator} [${msg.author.bot ? 'BOT' : 'USER'}]: ${msg.content}`);
    try {
        await msgHandler.onMessage(msg);
    } catch (e) {
        console.error(e);
    }

});
let init = async () => {
    await bot.initialize();
    let types = await weebHandler.fetchTypes();
    weebHandler.setTypes(types);
    setInterval(async () => {
        try {
            let req = await axios.get('http://localhost:7000/shards/status');
            if (!req.data.shards[0].ready) {
                let channel = await bot.rest.user.createDirectMessageChannel('128392910574977024');
                await bot.rest.channel.createMessage(channel.id, 'SHARD IS DOWN!!!!!!');
            }
        } catch(e) {
            let channel = await bot.rest.user.createDirectMessageChannel('128392910574977024');
            await bot.rest.channel.createMessage(channel.id, 'GATEWAY IS DOWN!!!!!!');
        }


    }, 10000)
};
init().then(() => {
    console.log('initialized successfully');
}).catch(e => console.error(e));

process.on('unhandledRejection', (reason, promise) => {
    // if (!reason) return;
    console.log(util.inspect(promise, {depth: 4}));
});