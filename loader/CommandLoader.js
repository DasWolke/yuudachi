const recursive = require('recursive-readdir');
module.exports = async (dirPath, bot) => {
    let commands = {};
    let aliasMap = {};
    let types = {};
    let files = await recursive(dirPath);
    for (let file of files) {
        let commandClass = require('../' + file);
        let command = new commandClass(bot);
        commands[command.cmd] = command;
        if (Array.isArray(types[command.type])) {
            types[command.type].push(command.cmd);
        } else {
            types[command.type] = [command.cmd];
        }
        for (let alias of command.aliases) {
            aliasMap[alias] = command.cmd;
        }
    }
    return {commands, aliasMap, types}
};