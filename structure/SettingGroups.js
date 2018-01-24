module.exports = {
    server: {
        name: 'server',
        description: 'Customize prefixes,  serverwide notifications and more',
        // icon:':tools:',
        settings: {
            prefix: {
                standard: 'poi',
                type: 'string',
                short: 'prefix of the bot',
                description: 'My prefix, you have to put this in front of the command so I know you are talking to me~\nHere is an example: **poi** __ping__\n**Prefix** / __Command__'
            }
        }
    }
};
