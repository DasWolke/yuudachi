class Help {
    constructor(bot) {
        this.cmd = 'help';
        this.bot = bot;
    }

    async run(msg, bot, commands) {
        let embed = this.buildEmbed(commands);
        console.log(embed);
        return this.bot.rest.channel.createMessage(msg.channel_id, embed);
    }

    buildEmbed(commands) {
        return {
            embed: {
                title: "Hi, I'm Yuudachi, a Shiratsuyu-class destroyer. Nice to meet you!",
                description: 'What I can do for you, poi~ ? Feel free to take a look at my functions down below~',
                color: 15980350,
                thumbnail: {
                    url: 'https://cdn.discordapp.com/emojis/379720490924769292.png'
                },
                fields: [
                    {
                        name: '<:poiLove:379725495161323530> Fun Commands',
                        value: '`cuddle`, `hug`, `etc`'
                    },
                    {
                        name: 'Support Server and other memes',
                        value: 'owo'
                    }
                ]
            }
        };
    }
}

module.exports = Help;