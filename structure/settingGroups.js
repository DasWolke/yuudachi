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
      smartrec: {
        standard: true,
        type: 'boolean',
        short: 'Only mention user when they get a recommendation for the first time in a while',
        description: 'This setting sets a server wide default whether a user will get @\u200bmentioned when they receive a recommendation via the rec command.\nA user will get mentioned if they are getting recommend by using the id and they haven\'t been mentioned within the channel for 5 minutes.'
      }
    }
  }
}
