const Command = require('../../../structure/Command');
const osu = require('node-osu');
const InvalidSubcommandError = require('../../../structure/errors/InvalidSubcommandError');

class Osu extends Command {
    constructor(bot) {
        super();
        this.cmd = 'osu';
        this.type = 'community';
        this.bot = bot;
        this.osuApi = new osu.Api(bot.config.osuApiKey, {completeScores: true});
        this.help = {
            description: 'osu! related commands',
            thumbnail: 'https://cdn.weeb.sh/assets/osu_icon.png',
            color: 0xff66a9
        };
    }

    async run(msg, args) {
        if (args.length >= 1) {
            try {
                await this.runSubcommand(args[0], msg, args.splice(1), this);
            } catch (e) {
                if (e instanceof InvalidSubcommandError) {
                    return this.bot.commands['help'].run(msg, [this.cmd]);
                }
            }
        } else {
            return this.bot.commands['help'].run(msg, [this.cmd]);
        }
    }
}

module.exports = Osu;
