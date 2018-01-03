const Command = require('../../structure/Command');
const pkg = require('../../package');
const starGearVersion = require('stargear/package').version;

class Info extends Command {
    constructor(bot) {
        super();
        this.cmd = 'info';
        this.type = 'generic';
        this.bot = bot;
    }

    async run(msg) {
        let selfUser = await this.bot.cache.user.get('self');
        selfUser = await this.bot.cache.user.get(selfUser.id);
        return this.bot.rest.channel.createMessage(msg.channel_id, await this.buildEmbed(selfUser));
    }

    async buildEmbed(selfUser) {
        return {
            embed: {
                color: 0xF3E769,
                thumbnail: {
                    url: `https://cdn.discordapp.com/avatars/${selfUser.id}/${selfUser.avatar}.png`
                },
                fields: [{
                    name: 'Version',
                    value: pkg.version,
                    inline: true
                }, {
                    name: 'Library',
                    value: `Wolkeware, using stargear V${starGearVersion}`,
                    inline: true
                }, {
                    name: 'Guilds',
                    value: await this.bot.cache.guild.getIndexCount(),
                    inline: true
                }, {
                    name: 'Users',
                    value: await this.bot.cache.user.getIndexCount(),
                    inline: true
                }]
            }
        };
    }
}

module.exports = Info;
