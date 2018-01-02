const Command = require('../../structure/Command');

class Help extends Command {
    constructor(bot) {
        super();
        this.cmd = 'help';
        this.type = 'generic';
        this.bot = bot;
        this.typeMap = {
            'generic': '<:poicolle:380425500683927553> Standard Commands',
            'fun': '<:poiLove:379725495161323530> Fun Commands',
            'community': '<:poiHappy:379720490924769292> Community Commands'
        };
    }

    async run(msg, args) {
        if (args.length > 0) {
            if (this.bot.commands[args[0]]) {
                let cmd = this.bot.commands[args[0]];
                if (cmd.help) {
                    let embed = this.buildCmdEmbed(cmd);
                    return this.bot.rest.channel.createMessage(msg.channel_id, embed);
                }
            }
        }
        let embed = this.buildEmbed();
        return this.bot.rest.channel.createMessage(msg.channel_id, embed);
    }

    buildCmdEmbed(cmd) {
        return {
            embed: {
                title: `Help for ${cmd.cmd} commands`,
                description: cmd.help.description,
                fields: this.buildCmdFields(cmd),
                thumbnail: {
                    url: cmd.help.thumbnail ? cmd.help.thumbnail : 'https://cdn.discordapp.com/emojis/379720490924769292.png'
                },
                color: cmd.help.color ? cmd.help.color : 15980350
            }
        };
    }

    buildCmdFields(cmd) {
        let fields = cmd.baseFields;
        for (let commandKey of Object.keys(cmd.subCommands)) {
            let subcommand = cmd.subCommands[commandKey];
            let field = {name: '', value: ''};
            field.name = `${cmd.cmd} ${subcommand.cmd}`;
            field.value = subcommand.help.description;
            fields.push(field);
        }
        return fields;
    }

    buildEmbed() {
        return {
            embed: {
                title: 'Hi, I\'m Yuudachi, a Shiratsuyu-class destroyer. Nice to meet you!',
                description: `What I can do for you, poi~ ? Feel free to take a look at my functions down below~\nMy prefix is \`${this.bot.config.prefix}\` but you can also mention me~`,
                color: 0xF3D73E,
                thumbnail: {
                    url: 'https://cdn.discordapp.com/emojis/379720490924769292.png'
                },
                fields: this.buildFields(this.bot.commandTypes)
            }
        };
    }

    buildFields(types) {
        let typeArray = Object.keys(types);
        let fields = [];
        for (let type of typeArray) {
            let field = {name: '', value: ''};
            field.name = this.typeMap[type];
            field.value = types[type].map((cmd) => '`' + cmd + '`').join(', ');
            fields.push(field);
        }
        return fields;
    }
}

module.exports = Help;
