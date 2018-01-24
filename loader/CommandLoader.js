const recursive = require('recursive-readdir');
module.exports = async (dirPath, bot) => {
    let commands = {};
    let aliasMap = {};
    let types = {};
    let files = await recursive(dirPath);
    let subCommands = [];
    for (let file of files) {
        if (!file.endsWith('.js')) {
            return;
        }
        let commandClass = require('../' + file);
        if (commandClass.isSubcommand) {
            subCommands.push(commandClass);
            continue;
        }
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
    for (let subCommand of subCommands) {
        let cmd = new subCommand(bot);
        if (commands[cmd.parent]) {
            commands[cmd.parent].subCommands[cmd.cmd] = cmd;
        }
    }
    return {commands, aliasMap, types};
};
