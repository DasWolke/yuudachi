const Command = require('../../structure/Command');
const Moment = require('moment');

class Recommendation extends Command {
    constructor(bot) {
        super();
        this.cmd = 'rec';
        this.type = 'community';
        this.bot = bot;

    }

    async run(msg) {
        let selfUser = await this.bot.cache.user.get('self');
        selfUser = await this.bot.cache.user.get(selfUser.id);
        let msgSplit = msg.content.split(' ');
        if (msgSplit.length === 3 && msgSplit[2] === 'leaderboard') {
            return this.leaderboard(msg, selfUser);
        }
        if (msg.mentions.length === 0) {
            let recData;
            try {
                recData = await this.bot.handler.weebHandler.getReputation(selfUser.id, msg.author.id);
            } catch (e) {
                return this.bot.rest.channel.createMessage(msg.channel_id, 'There was an error while trying to communicate with the recommendation service');
            }
            return this.bot.rest.channel.createMessage(msg.channel_id, `<:poiHappy:379720490924769292> You currently have ${recData.reputation} letter${recData.reputation === 1 ? '' : 's'} of recommendation`);
        }
        let user = msg.mentions[0];
        if (user.id === msg.author.id) {
            return this.bot.rest.channel.createMessage(msg.channel_id, ':no_entry_sign: You can\'t write a letter of recommendation for yourself');
        }
        try {
            let data = await this.updateRep(msg.author.id, user.id, selfUser.id);
            return this.bot.rest.channel.createMessage(msg.channel_id, `<:poiHappy:379720490924769292> You just wrote a letter of recommendation for <@${data.targetUser.userId}>`);
        } catch (e) {
            if (e.response && e.response.data.code) {
                return this._processResponseError(e, msg);
            }
            if (!e.response || !e.response.data.code) {
                return this.bot.rest.channel.createMessage(msg.channel_id, 'There was an error while trying to communicate with the recommendation service');
            }
            console.error(e);
        }
    }

    async leaderboard(msg, selfUser) {
        let leaderboard;
        try {
            leaderboard = await this.loadLeaderboard(selfUser.id);
        } catch (e) {
            return this.bot.rest.channel.createMessage(msg.channel_id, 'There was an error while trying to communicate with the recommendation service');
        }

        let embed = {
            title: '<:poiHappy:379720490924769292> Most recommended Admirals <:poiHappy:379720490924769292>',
            fields: this._prepareLeaderboardFields(leaderboard)
        };
        return this.bot.rest.channel.createMessage(msg.channel_id, {embed});
    }

    _prepareLeaderboardFields(leaderboard) {
        let i = 0;
        let x = 0;
        let fields = [];
        for (let user of leaderboard) {
            if ((i === 0 && x === 0) || (x % 3 === 0 && x > 0)) {
                fields.push({name: `${x + 1}-${x + 3}`, value: this._prepareLeaderboardName(user, x)});
                if (x !== 0) {
                    i++;
                }
            } else {
                fields[i].value += this._prepareLeaderboardName(user, x);
            }
            x++;
        }
        return fields;
    }

    _prepareLeaderboardName(user, x) {
        let trophy = x === 0 ? ' :trophy:' : x === 1 ? ':second_place:' : x === 2 ? ':third_place:' : '';
        return `**${x + 1}.**${trophy} <@${user.userId}> (${user.reputation})\n`;
    }

    async _processResponseError(e, msg) {
        let startMoment = Moment(e.response.data.date);
        let sortedCooldowns = this._sortCooldown(e.response.data.user.cooldown);
        let endMoment = Moment(new Date(sortedCooldowns[0]).getTime() + 1000 * 60 * 60 * 24);
        let duration = startMoment.to(endMoment);
        return this.bot.rest.channel.createMessage(msg.channel_id, `<:poiSleeping:385511265222656000> You are too exhausted since you already wrote a lot of recommendation letters today, try again ${duration}`);

    }

    async updateRep(sourceUserId, targetUserId, botId) {
        return this.bot.handler.weebHandler.increaseReputation(botId, sourceUserId, targetUserId);
    }

    async loadLeaderboard(botId) {
        return this.bot.handler.weebHandler.loadReputationLeaderboard(botId);
    }

    _sortCooldown(cooldown) {
        return cooldown.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    }

}

module.exports = Recommendation;
