class Subcommand {
    constructor() {
        this.cmd = null;
        this.parent = null;
    }

    static get isSubcommand() {
        return true;
    }
}

module.exports = Subcommand;
