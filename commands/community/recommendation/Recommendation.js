const Command = require('../../../structure/Command');
const Moment = require('moment');

class Recommendation extends Command {
    constructor(bot) {
        super();
        this.cmd = 'rec';
        this.type = 'community';
        this.bot = bot;
        this.baseFields = [{
            name: 'rec',
            value: 'Shows the amount of letters of recommendation you currently have and how many you can write until you are exhausted'
        }, {
            name: 'rec @user',
            value: 'Write a letter of recommendation for the mentioned user'
        }];
        this.help = {description: 'Write letters of recommendation for other admirals and get an overview of the most recommended admirals around the world'};
    }

    async run(msg, args) {
        let selfUser = await this.bot.cache.user.get('self');
        selfUser = await this.bot.cache.user.get(selfUser.id);
        if (args.length > 0 && args[0] === 'leaderboard') {
            return this.runSubcommand(args[0], msg, selfUser, this);
        }
        if (msg.mentions.length === 0) {
            let recData;
            try {
                recData = await this.bot.handler.weebHandler.getReputation(selfUser.id, msg.author.id);
            } catch (e) {
                return this.bot.rest.channel.createMessage(msg.channel_id, 'There was an error while trying to communicate with the recommendation service');
            }
            let hasEnergy;
            if (recData.availableReputations > 0) {
                hasEnergy = `You can write ${recData.availableReputations} more letter${recData.availableReputations > 1 ? 's' : ''} today`;
            } else {
                let startMoment = Moment(recData.date);
                let endMoment = Moment(new Date(recData.nextAvailableReputations[0]).getTime() + startMoment);
                let duration = startMoment.to(endMoment);
                hasEnergy = `You already wrote a lot of letters today, you can write the next letter ${duration}`;
            }
            let embed = {
                embed: {
                    description: `You currently have **${recData.reputation}** letter${recData.reputation === 1 ? '' : 's'} of recommendation\n\n**${hasEnergy}**`,
                    color: 0xF3D73E,
                    thumbnail: {url: 'https://cdn.weeb.sh/assets/reputation/tied-scroll.png'}
                }
            };
            return this.bot.rest.channel.createMessage(msg.channel_id, embed);
        }

        let user = msg.mentions[0];
        if (user.id === msg.author.id) {
            return this.bot.rest.channel.createMessage(msg.channel_id, ':no_entry_sign: You can\'t write a letter of recommendation for yourself');
        }
        try {
            let data = await this.updateRep(msg.author.id, user.id, selfUser.id);
            return this.bot.rest.channel.createMessage(msg.channel_id, `<:poiHappy:379720490924769292> You just wrote a letter of recommendation for <@${data.targetUser.userId}>`);
        } catch (e) {
            console.log(e);
            if (e.response && e.response.data.code) {
                return this._processResponseError(e, msg);
            }
            if (!e.response || !e.response.data.code) {
                return this.bot.rest.channel.createMessage(msg.channel_id, 'There was an error while trying to communicate with the recommendation service');
            }
            console.error(e);
        }
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

    _sortCooldown(cooldown) {
        return cooldown.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    }

}

module.exports = Recommendation;
