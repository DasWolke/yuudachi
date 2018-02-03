let axios = require('axios');
const devToken = require('../config/config.json').weebDevToken;
const pkg = require('../package');

class WeebHandler {
    constructor(weebToken, bot) {
        this.weebToken = weebToken;
        this.client = axios.create({
            baseURL: 'https://api.weeb.sh',
            headers: {Authorization: `Wolke ${weebToken}`, 'User-Agent': `Yuudachi/${pkg.version}`}
        });
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
        let image;
        try {
            image = await this.getRandom(msg.cmd, [], false, false);
        } catch (e) {
            return this.bot.rest.channel.createMessage(msg.channel_id, '<:poiPeek:380429329877827595> Sorry, I was unable to find an image for you');
        }
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
        let req = await this.client({method: 'get', url: `/reputation/${botId}/${userId}`});
        return req.data.user;
    }

    async increaseReputation(botId, sourceUserId, targetUserId) {
        let req = await this.client({
            method: 'post',
            url: `/reputation/${botId}/${targetUserId}`,
            data: {source_user: sourceUserId},
        });
        return req.data;
    }

    async loadReputationLeaderboard(botId) {
        let req = await this.client({method: 'get', url: `/reputation/${botId}/leaderboard`});
        return req.data.users;
    }

    async getShitWaifu(avatar) {
        let req = await this.client({
            method: 'post',
            url: '/auto-image/waifu-insult',
            data: {avatar},
            responseType: 'arraybuffer'
        });
        return req.data;
    }

    async getSetting(type, id) {
        let req = await axios.get(`http://weeb-dev.wolke.network/settings/${type}/${id}`, {headers: {Authorization: `Wolke ${devToken}`}});
        return req.data.setting.data;
    }

    async setSetting(type, id, data) {
        let req = await axios.post(`http://weeb-dev.wolke.network/settings/${type}/${id}`, data, {
            headers: {Authorization: `Wolke ${devToken}`}
        });
        return req.data.setting.data;
    }
}

module.exports = WeebHandler;
