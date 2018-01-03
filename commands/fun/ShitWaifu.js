const Command = require('../../structure/Command');

class ShitWaifu extends Command {
    constructor(bot) {
        super();
        this.cmd = 'shitwaifu';
        this.type = 'fun';
        this.bot = bot;
        this.help = {description: 'Simple image generation command to rate down waifus, just mention the bad waifu'};
    }

    async run(msg) {
        if (msg.mentions.length === 0) {
            this.bot.rest.channel.createMessage(msg.channel_id, 'Please mention someone that is a bad waifu');
        }
        await this.bot.rest.channel.startChannelTyping(msg.channel_id);
        let avatar = this.bot.utils.getAvatarUrl(msg.mentions[0]);
        let image;
        try {
            image = await this.bot.handler.weebHandler.getShitWaifu(avatar);
        } catch (e) {
            return this.bot.rest.channel.createMessage(msg.channel_id, 'There was an error while trying to communicate with the image generation service');
        }
        return this.bot.rest.channel.createMessage(msg.channel_id, {
            content: '',
            file: {file: image, name: 'waifu.png'}
        });
    }
}

module.exports = ShitWaifu;
