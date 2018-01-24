const MessageHandler = require('../handler/MessageHandler');
const WeebHandler = require('../handler/WeebHandler');
const CacheHandler = require('../handler/CacheHandler');
const commandLoader = require('./CommandLoader');

class BotLoader {
    constructor(bot, config) {
        this.bot = bot;
        bot.config = config;
        bot.handler = {};
        bot.loaders = {};
        bot.commands = {};
        bot.aliases = {};
        bot.commandTypes = {};
    }

    async initialize() {
        this.bot.loaders.commands = commandLoader;
        this.bot.handler.weebHandler = new WeebHandler(this.bot.config.weebToken, this.bot);
        this.bot.handler.cacheHandler = new CacheHandler(this.bot, {
            host: this.bot.config.redisHost,
            password: this.bot.config.redisPassword,
            db: 1
        });
        let commandAliasObject = await this.bot.loaders.commands(this.bot.config.commandPath, this.bot);
        this.bot.commands = commandAliasObject.commands;
        this.bot.aliases = commandAliasObject.aliasMap;
        this.bot.commandTypes = commandAliasObject.types;
        this.bot.handler.messageHandler = new MessageHandler(this.bot);
        this.bot.on('messageCreate', async (msg) => {
            await this.bot.handler.messageHandler.onMessage(msg);
        });
    }
}

module.exports = BotLoader;
