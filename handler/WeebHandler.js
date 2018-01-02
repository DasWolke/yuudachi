let axios = require('axios');
const devToken = require('../config/config.json').weebDevToken;

class WeebHandler {
    constructor(weebToken, bot) {
        this.weebToken = weebToken;
        this.client = axios.create({baseURL: 'https://api.weeb.sh', headers: {Authorization: `Wolke ${weebToken}`}});
        this.bot = bot;
    }

    async fetchTypes() {
        let req = await this.client({method: 'get', url: '/images/types'});
        return req.data.types;
    }

    async getRandom(type, tags, nsfw, hidden) {
        let req = await this.client({method: 'get', url: '/images/random', params: {type, tags, nsfw, hidden}});
        return req.data;
    }

    async handleCmd(msg) {
        let image = await this.getRandom(msg.cmd, [], false, false);
        if (!image) {
            return this.bot.rest.channel.createMessage(msg.channel_id, '<:poiPeek:380429329877827595> Sorry, I was unable to find an image for you');
        }
        return this.bot.rest.channel.createMessage(msg.channel_id, {embed: this.buildImageEmbed(image)});
    }

    buildImageEmbed(image) {
        return {
            description: `[original image](${image.url})`,
            image: {url: image.url},
            footer: {text: 'Powered by Weeb.sh'}
        };
    }

    async getReputation(botId, userId) {
        let req = await axios.get(`http://weeb-dev.wolke.network/reputation/${botId}/${userId}`, {headers: {Authorization: `Wolke ${devToken}`}});
        return req.data.user;
    }

    async increaseReputation(botId, sourceUserId, targetUserId) {
        let req = await axios({
            url: `http://weeb-dev.wolke.network/reputation/${botId}/${targetUserId}`,
            headers: {
                Authorization: `Wolke ${devToken}`
            },
            data: {source_user: sourceUserId},
            method: 'post'
        });
        return req.data;
    }

    async loadReputationLeaderboard(botId) {
        let req = await axios.get(`http://weeb-dev.wolke.network/reputation/${botId}/leaderboard`, {headers: {Authorization: `Wolke ${devToken}`}});
        return req.data.users;
    }
}

module.exports = WeebHandler;
