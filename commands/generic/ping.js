const Command = require('../../structure/Command');

class Ping extends Command {
    constructor(bot) {
        super();
        this.cmd = 'ping';
        this.type = 'generic';
        this.bot = bot;
    }

    async run(msg) {
        let time = Date.now();
        let pingMsg = await this.bot.rest.channel.createMessage(msg.channel_id, 'pong');
        return this.bot.rest.channel.editMessage(msg.channel_id, pingMsg.id, `pong \`${Date.now() - time}ms\``);
    }

}

module.exports = Ping;