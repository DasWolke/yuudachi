const Command = require('../../structure/Command');

class Help extends Command {
    constructor(bot) {
        super();
        this.cmd = 'help';
        this.type = 'generic';
        this.bot = bot;
        this.typeMap = {
            'generic': '<:poicolle:380425500683927553> Standard Commands',
            'fun': '<:poiLove:379725495161323530> Fun Commands'
        }
    }

    async run(msg) {
        let embed = this.buildEmbed(Object.assign({}, this.bot.commands, this.bot.aliasMap));
        return this.bot.rest.channel.createMessage(msg.channel_id, embed);
    }

    buildEmbed(commands) {
        let cmds = Object.keys(commands).map((key) => '`' + key + '`').join(', ');
        return {
            embed: {
                title: "Hi, I'm Yuudachi, a Shiratsuyu-class destroyer. Nice to meet you!",
                description: 'What I can do for you, poi~ ? Feel free to take a look at my functions down below~',
                color: 15980350,
                thumbnail: {
                    url: 'https://cdn.discordapp.com/emojis/379720490924769292.png'
                },
                fields: this.buildFields(this.bot.commandTypes)
            }
        }
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