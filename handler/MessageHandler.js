let Help = require('../commands/generic/help');

class MessageHandler {
    constructor(bot, prefix, weebHandler) {
        this.commands = {
            ping: require('../commands/generic/ping'),
            test: require('../commands/generic/test'),
            help: new Help(bot)
        };
        this.bot = bot;
        this.prefix = prefix;
        this.weebHandler = weebHandler;
    }

    async onMessage(msg) {
        if (!msg.author.bot) {
            if (msg.content.startsWith(this.prefix)) {
                try {
                    let cmd = msg.content.substr(this.prefix.length + 1).trim().split(' ')[0]; //bump prefix length by one to not execute cmds without space
                    if (!cmd) {
                        return;
                    }
                    if (this.commands[cmd]) {
                        if (typeof this.commands[cmd].run === 'function') {
                            return this.commands[cmd].run(msg, this.bot, this.commands);
                        }
                        return this.commands[cmd](msg, this.bot);
                    }
                    if (this.weebHandler.types.includes(cmd)) {
                        let img = await this.weebHandler.getRandom(cmd, null, false, false);
                        return this.bot.rest.channel.createMessage(msg.channel_id, {
                            embed: {
                                description: `[Image Url](${img.url})`,
                                image: {url: img.url},
                                footer: {text: 'Powered by weeb.sh'}
                            }
                        });
                    }
                } catch (e) {

                }
            }
        }
    }
}

module.exports = MessageHandler;