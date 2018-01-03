const Command = require('../../structure/Command');

class Invite extends Command {
    constructor(bot) {
        super();
        this.cmd = 'invite';
        this.type = 'generic';
        this.bot = bot;
        this.help = {description: 'Invite the bot to your server'};
    }

    async run(msg) {
        let selfUser = await this.bot.cache.user.get('self');
        let link = `https://discordapp.com/oauth2/authorize?client_id=${selfUser.id}&scope=bot&permissions=379904`;
        return this.bot.rest.channel.createMessage(msg.channel_id, `Use the following link to allow me to dock at your guild: <${link}>`);
    }
}

module.exports = Invite;
