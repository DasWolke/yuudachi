const MessageHandler = require('../handler/MessageHandler');
const WeebHandler = require('../handler/WeebHandler');
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
        this.bot.loaders['commands'] = commandLoader;
        let commandAliasObject = await this.bot.loaders.commands(this.bot.config.commandPath, this.bot);
        this.bot.commands = commandAliasObject.commands;
        this.bot.aliases = commandAliasObject.aliasMap;
        this.bot.commandTypes = commandAliasObject.types;
        this.bot.handler['weebHandler'] = new WeebHandler(this.bot.config.weebToken, this.bot);
        try {
            let types = await this.bot.handler.weebHandler.fetchTypes();
            this.bot.handler.weebHandler.setTypes(types);
            if (types.length > 0) {
                if (!Array.isArray(this.bot.commandTypes['fun'])) {
                    this.bot.commandTypes['fun'] = [];
                }
                for (let type of types) {
                    this.bot.commandTypes['fun'].push(type);
                    this.bot.commands[type] = {
                        cmd: type,
                        type: 'fun',
                        run: async (msg) => {
                            return this.bot.handler.weebHandler.handleCmd(msg)
                        }
                    };
                }
            }
        } catch (e) {
            console.error(e);
        }
        this.bot.handler['messageHandler'] = new MessageHandler(this.bot);
        this.bot.on('messageCreate', async (msg) => {
            await this.bot.handler['messageHandler'].onMessage(msg);
        });
    }
}

module.exports = BotLoader;