module.exports = async (msg, bot) => {
    await bot.cache.user.filter((user) => {
        console.log(user);
    }, await bot.cache.user.getIndexMembers())

};