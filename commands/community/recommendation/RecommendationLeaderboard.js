const SubCommand = require('../../../structure/Subcommand');

class RecommendationLeaderboard extends SubCommand {
    constructor(bot) {
        super();
        this.cmd = 'leaderboard';
        this.parent = 'rec';
        this.bot = bot;
        this.help = {description: 'Shows a leaderboard of the users with the highest amount of recommendation'};
    }

    async run(msg, selfUser) {
        let leaderboard;
        try {
            leaderboard = await this._loadLeaderboard(selfUser.id);
        } catch (e) {
            return this.bot.rest.channel.createMessage(msg.channel_id, 'There was an error while trying to communicate with the recommendation service');
        }

        let embed = {
            title: '<:poiHappy:379720490924769292> Most recommended Admirals <:poiHappy:379720490924769292>',
            fields: await this._prepareLeaderboardFields(leaderboard)
        };
        return this.bot.rest.channel.createMessage(msg.channel_id, {embed});
    }

    async _prepareLeaderboardFields(leaderboard) {
        let i = 0;
        let x = 0;
        let fields = [];
        for (let user of leaderboard) {
            if ((i === 0 && x === 0) || (x % 3 === 0 && x > 0)) {
                fields.push({
                    name: `${x + 1}-${x + 3}`,
                    value: await this._prepareLeaderboardName(user, x),
                    inline: true
                });
                if (x !== 0) {
                    i++;
                }
            } else {
                fields[i].value += await this._prepareLeaderboardName(user, x);
            }
            x++;
        }
        return fields;
    }

    async _loadLeaderboard(botId) {
        return this.bot.handler.weebHandler.loadReputationLeaderboard(botId);
    }

    async _prepareLeaderboardName(user, x) {
        let trophy = x === 0 ? ' :trophy:' : x === 1 ? ':second_place:' : x === 2 ? ':third_place:' : '';
        return `**${x + 1}.**${trophy} <@${user.userId}> (**${await this._getUsernameFromId(user.userId)}**) (${user.reputation})\n`;
    }

    async _getUsernameFromId(id) {
        let user = await this.bot.cache.user.get(id);
        if (!user) {
            return 'User not found';
        }
        return `${user.username}#${user.discriminator}`;
    }
}

module.exports = RecommendationLeaderboard;
