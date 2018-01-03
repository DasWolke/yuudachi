const InvalidSubcommandError = require('./errors/InvalidSubcommandError');

class Command {
    constructor() {
        this.cmd = null;
        this.aliases = [];
        this.subCommands = {};
        this.baseFields = [];
        this.type = null;
    }

    static get isSubcommand() {
        return false;
    }

    runSubcommand(cmd, msg, args, parent) {
        if (!this.subCommands[cmd]) {
            throw new InvalidSubcommandError(`The subcommand ${cmd} does not exist`);
        }
        return this.subCommands[cmd].run(msg, args, parent);
    }
}

module.exports = Command;
