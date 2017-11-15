class MessageHandler {
    constructor(bot) {
        this.bot = bot;
        this.commands = bot.commands;
        this.prefix = bot.config.prefix;
    }

    async onMessage(msg) {
        let selfUser = await this.bot.cache.user.get('self');
        selfUser = await this.bot.cache.user.get(selfUser.id);
        let channel = await this.bot.cache.channel.get(msg.channel_id);
        console.log(`${channel.name}: ${msg.author.username}#${msg.author.discriminator} [${msg.author.bot ? 'BOT' : 'USER'}]: ${msg.content}`);
        if (!msg.author.bot) {
            if (msg.content.startsWith(this.prefix) || msg.content.startsWith(`<@${selfUser.id}>`) || msg.content.startsWith(`<@!${selfUser.id}>`)) {
                try {
                    let cmd;
                    if (msg.content.startsWith(`<@${selfUser.id}>`) || msg.content.startsWith(`<@!${selfUser.id}>`)) {
                        if (msg.content.startsWith(`<@${selfUser.id}>`)) {
                            cmd = msg.content.substr(`<@${selfUser.id}>`.length + 1).trim().split(' ')[0];
                        } else if (msg.content.startsWith(`<@!${selfUser.id}>`)) {
                            cmd = msg.content.substr(`<@!${selfUser.id}>`.length + 1).trim().split(' ')[0];
                        }
                    } else {
                        cmd = msg.content.substr(this.prefix.length + 1).trim().split(' ')[0]; //bump prefix length by one to not execute cmds without space
                    }
                    if (!cmd) {
                        return;
                    }
                    msg.cmd = cmd;
                    if (this.commands[cmd]) {
                        return this.commands[cmd].run(msg, this.bot, this.commands);
                    }
                } catch (e) {

                }
            }
        }
    }
}

module.exports = MessageHandler;