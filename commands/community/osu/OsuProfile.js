const Subcommand = require('../../../structure/Subcommand');

class OsuProfile extends Subcommand {
    constructor(bot) {
        super();
        this.cmd = 'profile';
        this.parent = 'osu';
        this.bot = bot;
        this.url = 'https://lemmmy.pw/osusig/sig.php?colour=hexffcc22&pp=2&darkheader&onlineindicator=undefined&xpbar&uname=';
        this.help = {description: 'Retrieve data about an osu profile by username'};
    }

    async run(msg, args, parent) {
        let osuUserName = this._buildOsuUsername(args);
        if (osuUserName !== '') {
            let loadingEmbed = {
                description: 'Loading Data from osu!...',
                image: {url: 'https://cdn.weeb.sh/assets/Bars.webp'},
                color: 0xcfa330
            };
            let message = await this.bot.rest.channel.createMessage(msg.channel_id, {embed: loadingEmbed});
            let osuUser;
            try {
                osuUser = await parent.osuApi.getUser({u: osuUserName});
            } catch (e) {
                if (e.message === 'User not found') {
                    return this.bot.rest.channel.editMessage(msg.channel_id, message.id, {embed: this._getErrorEmbed(`The user ${osuUserName} does not exist. :<`)});
                }
                return this.bot.rest.channel.editMessage(msg.channel_id, message.id, {embed: this._getErrorEmbed(`There was an error loading your user ${osuUserName}`)});
            }
            let userScores;
            try {
                userScores = await parent.osuApi.getUserBest({u: osuUser.id, type: 'id'});
            } catch (e) {
                console.log(e);
                return this.bot.rest.channel.editMessage(msg.channel_id, message.id, {embed: this._getErrorEmbed(`There was an error loading your user ${osuUserName}`)});
            }
            let embed = {
                title: `osu! profile of ${osuUserName}`,
                description: `:trophy: **Best plays of ${osuUserName}**`,
                fields: this._generateScoreFields(userScores),
                image: {url: this.url + osuUserName},
                url: `https://osu.ppy.sh/u/${osuUser.id}`,
                color: 0xcfa330,
                footer: {text: 'Uses lemmmy.pw and the official osu api'}
            };
            return this.bot.rest.channel.editMessage(msg.channel_id, message.id, {embed});
        } else {
            return this.bot.rest.channel.createMessage(msg.channel_id, 'Nya, this feature is not implemented yet, add a username!');
        }
    }

    _buildOsuUsername(args) {
        args = args.map(arg => arg.trim());
        return args.join('_');
    }

    _generateScoreFields(scores) {
        let fields = [];

        for (let item of scores) {
            let rank = this._unfuckRank(item[0].rank);
            let field = {
                name: item[1].title,
                value: `[Beatmap Link](https://osu.ppy.sh/b/${item[1].id})\nVersion: **${item[1].version}**\nScore: **${parseInt(item[0].score).toLocaleString()}**,\nPP: **${parseFloat(item[0].pp).toFixed(2)}**,\nRank: **${rank}**`,
                inline: true
            };
            fields.push(field);
        }
        return fields;
    }

    _unfuckRank(rank) {
        switch (rank) {
            case 'X':
                return 'SS';
            default:
                return rank;
        }
    }

    _getErrorEmbed(message) {
        return {
            color: 0xc00000,
            description: message
        };
    }

}

module.exports = OsuProfile;
