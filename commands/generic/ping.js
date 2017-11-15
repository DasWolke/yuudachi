module.exports = async (msg, bot) => {
    let time = Date.now();
    let pingMsg = await bot.rest.channel.createMessage(msg.channel_id, 'pong');
    return bot.rest.channel.editMessage(msg.channel_id, pingMsg.id, `pong \`${Date.now() - time}ms\``);
};