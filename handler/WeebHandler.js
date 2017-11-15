let axios = require('axios');

class WeebHandler {
    constructor(weebToken) {
        this.weebToken = weebToken;
        this.client = axios.create({baseURL: 'https://api.weeb.sh', headers: {Authorization: `Wolke ${weebToken}`}});
        this.types = [];
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
}

module.exports = WeebHandler;