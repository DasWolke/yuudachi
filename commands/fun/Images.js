const Command = require('../../structure/Command');

class ImageCommands extends Command {
    constructor(bot) {
        super();
        this.cmd = 'image';
        this.aliases = ['images'];
        this.type = 'fun';
        this.bot = bot;
        this.types = [];
        this.baseFields = [{
            name: 'Pat / image pat',
            value: 'Give someone a headpat'
        }, {
            name: 'Cuddle / image cuddle',
            value: 'Cuddle someone'
        }, {
            name: 'Kiss / image kiss',
            value: 'Kiss someone'
        }, {
            name: 'Hug / image hug',
            value: 'Hug someone'
        }];
        this.init();
        this.help = {
            description: 'Reaction image commands, can be used for patting, hugging or cuddling people',
            thumbnail: 'https://cdn.discordapp.com/emojis/379725495161323530.png'
        };
    }

    async init() {
        try {
            this.types = await this.bot.handler.weebHandler.fetchTypes();
            this.types = this.types.sort();
        } catch (e) {
            console.error(e);
        }
    }

    async run(msg, args) {
        if (args.length === 0) {
            return this.bot.commands['help'].run(msg, [this.cmd]);
        }
        if (args.length === 1 && args[0] === 'types') {
            return this.runSubcommand('types', msg, args.splice(1), this);
        }
        if (this.types.find(type => type === args[0].toLowerCase())) {
            msg.cmd = args[0].toLowerCase();
            return this.bot.handler.weebHandler.handleCmd(msg);
        }
    }
}

module.exports = ImageCommands;
