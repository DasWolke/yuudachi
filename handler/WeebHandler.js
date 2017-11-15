let axios = require('axios');

class WeebHandler {
    constructor(weebToken, bot) {
        this.weebToken = weebToken;
        this.client = axios.create({baseURL: 'https://api.weeb.sh', headers: {Authorization: `Wolke ${weebToken}`}});
        this.types = [];
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

    setTypes(types) {
        this.types = types;
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
}

module.exports = WeebHandler;