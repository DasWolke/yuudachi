module.exports = {
  server: {
    name: 'server',
    description: 'Customize prefixes,  serverwide notifications and more',
    apiType: 'guilds',
    serverOnly: true,
    settings: {
      prefix: {
        standard: 'poi',
        type: 'string',
        short: 'prefix of the bot',
        description: 'My prefix, you have to put this in front of the command so I know you are talking to me~\nHere is an example: **poi** __ping__\n**Prefix** / __Command__'
      },
      rectag: {
        standard: true,
        type: 'boolean',
        short: 'tag user when they get a recommendation',
        description: 'This setting sets a server wide default whether a user will get @\u200bmentioned when they receive a recommendation via the rec command.\nA user can still overwrite this setting for themselves.'
      }
    }
  }
}
