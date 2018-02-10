const settingGroups = require('../structure/settingGroups')

class SettingsHandler {
  constructor (bot) {
    this.bot = bot
  }

  async get (type, id) {
    let setting = await this._get(type, id)
    if (setting) {
      setting = this._addMissingPropertiesToSetting(type, setting)
      return setting
    }
    return null
  }

  _addMissingPropertiesToSetting (type, setting) {
    const keys = Object.keys(settingGroups)
    for (const key of keys) {
      if (settingGroups[key].apiType === type) {
        const settingKeys = Object.keys(settingGroups[key].settings)
        for (const settingKey of settingKeys) {
          if (typeof setting[settingKey] === 'undefined') {
            setting[settingKey] = settingGroups[key].settings[settingKey].standard
          }
        }
      }
    }
    return setting
  }

  async set (type, id, data) {
    const setting = await this.bot.handler.weebHandler.setSetting(type, id, data)
    await this.bot.handler.cacheHandler.set(`settings.${type}.${id}`, true, true, 3600, setting)
    return setting
  }

  async _get (type, id) {
    let setting = await this.bot.handler.cacheHandler.get(`settings.${type}.${id}`, true)
    if (!setting) {
      try {
        setting = await this.bot.handler.weebHandler.getSetting(type, id)
        await this.bot.handler.cacheHandler.set(`settings.${type}.${id}`, true, true, 3600, setting)
        return setting
      } catch (e) {
        if (e.response && e.response.status === 404) {
          return {}
        }
        return null
      }
    }
    return setting
  }

  async resolve (key, id) {
    const keySplit = key.split('.')
    if (!this.checkKeyExist(keySplit)) {
      throw new Error(`The key ${key} does not exist!`)
    }
    const apiType = this.getApiType(keySplit[0])
    const setting = await this.get(apiType, id)
    return setting[keySplit[1]]
  }

  getSettingFromGroup (keySplit) {
    if (!this.checkKeyExist(keySplit)) {
      return false
    }
    return settingGroups[keySplit[0]].settings[keySplit[1]]
  }

  checkTypeExist (type) {
    return !!settingGroups[type]
  }

  checkKeyExist (keySplit) {
    const type = keySplit[0]
    const settingKey = keySplit[1]
    if (settingGroups[type]) {
      if (settingGroups[type].settings[settingKey]) {
        return true
      }
    }
    return false
  }

  getApiType (type) {
    if (this.checkTypeExist(type)) {
      return settingGroups[type].apiType
    }
    return false
  }
}

module.exports = SettingsHandler
