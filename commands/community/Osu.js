const Command = require('../../structure/Command');
const osu = require('node-osu');

class Osu extends Command {
    constructor(bot) {
        super();
        this.cmd = 'osu';
        this.type = 'community';
        this.bot = bot;
        this.url = 'https://lemmmy.pw/osusig/sig.php?colour=hexffcc22&pp=2&darkheader&onlineindicator=undefined&xpbar&uname=';
        this.osuApi = new osu.Api(bot.config.osuApiKey, {completeScores: true});
    }

    async run(msg) {
        let msgSplit = msg.content.split(' ');
        if (msgSplit.length > 2 && msgSplit[2] === 'profile') {
            if (msgSplit[3]) {
                let loadingEmbed = {
                    description: 'Loading Data from Osu...',
                    image: {url: 'https://cdn.weeb.sh/assets/Dual-Ring.webp'},
                    color: 0xcfa330
                };
                let message = await this.bot.rest.channel.createMessage(msg.channel_id, {embed: loadingEmbed});
                let osuUser;
                try {
                    osuUser = await this.osuApi.getUser({u: msgSplit[3]});
                } catch (e) {
                    return this.bot.rest.channel.editMessage(msg.channel_id, message.id, {embed: this._getErrorEmbed(`There was an error loading your user ${msgSplit[3]}`)});
                }
                let userScores;
                try {
                    userScores = await this.osuApi.getUserBest({u: osuUser.id, type: 'id'});
                } catch (e) {
                    return this.bot.rest.channel.editMessage(msg.channel_id, message.id, {embed: this._getErrorEmbed(`There was an error loading your user ${msgSplit[3]}`)});
                }
                let embed = {
                    title: `Osu profile for ${msgSplit[3]}`,
                    description: `:trophy: **Best plays of ${msgSplit[3]}**`,
                    fields: this._generateScoreFields(userScores),
                    image: {url: this.url + msgSplit[3]},
                    url: `https://osu.ppy.sh/u/${osuUser.id}`,
                    color: 0xcfa330,
                    footer: {text: 'Uses lemmmy.pw and the official osu api'}
                };
                return this.bot.rest.channel.editMessage(msg.channel_id, message.id, {embed});
            } else {
                return this.bot.rest.channel.createMessage(msg.channel_id, 'Nya, this feature is not implemented yet, add a username!');
            }
        }
    }

    _generateScoreFields(scores) {
        let fields = [];
        for (let item of scores) {
            let field = {
                name: item[1].title,
                value: `[Beatmap Link](https://osu.ppy.sh/b/${item[1].id})\nScore: **${item[0].score}**,\nPP: **${item[0].pp}**,\nRank: **${item[0].rank}**`,
                inline: true
            };
            fields.push(field);
        }
        return fields;
    }

    _getErrorEmbed(message) {
        return {
            color: 0xc00000,
            description: message
        };
    }
}

module.exports = Osu;
