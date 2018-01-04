const Command = require('../../structure/Command');
const idRegex = require('../../structure/utils').idRegex;

class ShitWaifu extends Command {
    constructor(bot) {
        super();
        this.cmd = 'shitwaifu';
        this.type = 'fun';
        this.bot = bot;
        this.help = {description: 'Simple image generation command to rate down waifus, just mention the bad waifu'};
    }

    async run(msg, args) {
        if (msg.mentions.length === 0 && args.length === 0) {
            return this.bot.rest.channel.createMessage(msg.channel_id, 'Please mention someone that is a bad waifu or pass the id of a user');
        }
        let user;
        if (msg.mentions.length > 0) {
            user = msg.mentions[0];
        } else {
            if (idRegex.test(args[0])) {
                user = await this.bot.cache.user.get(args[0].trim());
                if (!user) {
                    return this.bot.rest.channel.createMessage(msg.channel_id, 'No user was found with this id');
                }
            }
        }
        await this.bot.rest.channel.startChannelTyping(msg.channel_id);
        let avatar = this.bot.utils.getAvatarUrl(user);
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
