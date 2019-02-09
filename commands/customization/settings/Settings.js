const Command = require('../../../structure/Command')
const InvalidArgumentError = require('../../../structure/errors/InvalidArgumentError')
const settingGroups = require('../../../structure/settingGroups')
const utils = require('../../../structure/utils')

class Settings extends Command {
  constructor (bot) {
    super()
    this.cmd = 'settings'
    this.aliases = ['setting', 'set']
    this.type = 'customization'
    this.bot = bot
    this.help = { description: 'Customize settings of the bot to fit your taste' }
    this.baseFields = Object.keys(settingGroups).map(k => {
      return { name: settingGroups[k].name, value: settingGroups[k].description }
    })
    if (bot.config.environment && bot.config.environment === 'development') {
      settingGroups.server.settings.prefix.standard = bot.config.prefix
    }
  }

  async run (msg, args) {
    if (args.length === 0) {
      const embed = this._buildMainSettingsEmbed(msg)
      return this.bot.rest.channel.createMessage(msg.channel_id, { embed })
    }
    const keySplit = args[0].split('.')
    if (this.bot.handler.settingsHandler.checkTypeExist(keySplit[0])) {
      if (!msg.channel.guild_id && settingGroups[keySplit[0]].serverOnly) {
        return this.bot.rest.channel.createMessage(msg.channel_id, `<:mark_cross:401923066197966848> The settings group \`${keySplit[0]}\` has to be used inside a server`)
      }
      const id = await this._getIdForType(msg, settingGroups[keySplit[0]].apiType)
      const settingsData = await this.bot.handler.settingsHandler.get(settingGroups[keySplit[0]].apiType, id)
      const fullKey = this._combineGroupWithKey(keySplit[0], keySplit[1])
      const name = keySplit[1]
      if (this.bot.handler.settingsHandler.checkKeyExist(keySplit)) {
        return this._runSingleSettingAction(msg, name, keySplit, settingsData, fullKey, id, args)
      }
      const embed = this._buildSubSettingsEmbed(msg, settingGroups[keySplit[0]], settingsData)
      return this.bot.rest.channel.createMessage(msg.channel_id, { embed })
    } else {
      return this.bot.rest.channel.createMessage(msg.channel_id, `<:mark_cross:401923066197966848> There does not seem to be a settings group called \`${keySplit[0]}\``)
    }
  }

  async _runSingleSettingAction (msg, name, keySplit, settingsData, fullKey, id, args) {
    const setting = this.bot.handler.settingsHandler.getSettingFromGroup(keySplit)
    if (args.length >= 2) {
      const member = await this.bot.handler.discordPermissionHandler.getPermissionsOfMember(msg.author.id, msg.channel.guild_id)
      if (member.isOwner || member.permissions.ADMINISTRATOR) {
        return this._updateSetting(msg, name, setting, settingsData, fullKey, id, args)
      }
      return this.bot.rest.channel.createMessage(msg.channel_id, '<:mark_cross:401923066197966848> You don\'t have the right permissions for this command, you either need to have the Administrator permission or be the owner of the server to use this command')
    }
    const embed = this._buildSingleSettingEmbed(msg, setting, name, fullKey, settingsData)
    return this.bot.rest.channel.createMessage(msg.channel_id, { embed })
  }

  async _updateSetting (msg, name, setting, settingsData, fullKey, id, args) {
    let newData = args.slice(1).join(' ')
    try {
      newData = this.bot.handler.userInputParser.parse(setting.type, newData)
    } catch (e) {
      if (e instanceof InvalidArgumentError) {
        const addData = '(true or false)'
        const errorMessage = `The setting \`${fullKey}\` expects a ${e.expectedType}${e.expectedType === 'boolean' ? addData : ''} as a value, not a ${e.actualType}`
        return this.bot.rest.channel.createMessage(msg.channel_id, '<:mark_cross:401923066197966848> ' + errorMessage)
      }
      return this.bot.rest.channel.createMessage(msg.channel_id, '<:mark_cross:401923066197966848> There was an error parsing your input, if you believe that this shouldn\'t have happened, please report it on our support server')
    }
    const apiType = this.bot.handler.settingsHandler.getApiType(fullKey.split('.')[0])
    await this._saveSetting(apiType, name, settingsData, id, newData)
    const embed = this._buildUpdatedSettingEmbed(setting, settingsData, name, fullKey, newData)
    return this.bot.rest.channel.createMessage(msg.channel_id, { embed })
  }

  _buildMainSettingsEmbed (msg) {
    const embed = {
      title: ':tools: Settings :tools:',
      fields: [],
      footer: { text: `Type ${msg.prefix} settings settingName to get more info about a setting` }
    }
    const keys = Object.keys(settingGroups)
    for (const key of keys) {
      embed.fields.push({
        name: `${utils.uppercaseFirstChar(key)}/${key} settings`,
        value: settingGroups[key].description
      })
    }
    return embed
  }

  _buildSubSettingsEmbed (msg, subSetting, settingsObject) {
    const embed = {
      title: `:tools: ${utils.uppercaseFirstChar(subSetting.name)} settings :tools:`,
      fields: [],
      footer: { text: `Type ${msg.prefix} settings settingName to get more info about a setting` }
    }
    const keys = Object.keys(subSetting.settings)
    for (const key of keys) {
      embed.fields.push({
        name: this._combineGroupWithKey(subSetting.name, key),
        value: `${subSetting.settings[key].short}\nValue: \`${settingsObject[key]}\`${settingsObject[key] === subSetting.settings[key].standard ? ' (Default)' : ''}`
      })
    }
    return embed
  }

  _buildSingleSettingEmbed (msg, setting, settingName, settingKey, settingsObject) {
    const embed = {
      title: `:tools: ${utils.uppercaseFirstChar(settingName)}/${settingKey} :tools:`,
      description: 'If you are seeing this, something went reallyyyyyy wrong >w<',
      footer: { text: `Type ${msg.prefix} settings ${settingKey} value to change the value of this setting` }
    }
    let description = ''
    description += `**Name**: \`${settingKey}\`\n`
    if (setting.type) {
      description += `**Type**: \`${setting.type}\`\n`
    }
    if (setting.standard) {
      description += `**Default**: \`${setting.standard}\`\n`
    }
    if (settingsObject[settingName]) {
      description += `**Current Value**: \`${settingsObject[settingName]}\`\n`
    }
    if (setting.description) {
      description += `**Description**: ${setting.description}`
    }
    embed.description = description
    return embed
  }

  _buildUpdatedSettingEmbed (setting, settingObject, settingName, settingKey, newValue) {
    const embed = {
      title: `:tools: Updated ${utils.uppercaseFirstChar(settingName)}/${settingKey} :tools:`,
      description: 'If you are seeing this, something went reallyyyyyy wrong >w<'
    }
    embed.description = `**Old Value**: \`${settingObject[settingName]}\`\n`
    embed.description += `**New Value**: \`${newValue}\``
    return embed
  }

  _combineGroupWithKey (group, key) {
    return `${group}.${key}`
  }

  async _saveSetting (type, name, settingsObject, id, newValue) {
    const newSetting = Object.assign({}, settingsObject)
    newSetting[name] = newValue
    return this.bot.handler.settingsHandler.set(type, id, newSetting)
  }

  async _getIdForType (msg, type) {
    let channel
    switch (type) {
      case 'guilds':
        channel = await this.bot.cache.channel.get(msg.channel_id)
        if (!channel.guild_id) {
          return null
        }
        return channel.guild_id
      case 'users':
        return msg.author.id
      default:
        return null
    }
  }
}

module.exports = Settings
