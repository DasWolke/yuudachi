const settingsGroups = require('../structure/settingGroups');

class SettingsHandler {
    constructor(bot) {
        this.bot = bot;
    }

    async get(type, id) {
        let setting = await this._get(type, id);
        if (setting) {
            setting = this._addMissingPropertiesToSetting(type, setting);
            return setting;
        }
        return null;
    }

    _addMissingPropertiesToSetting(type, setting) {
        let keys = Object.keys(settingsGroups);
        for (let key of keys) {
            if (settingsGroups[key].apiType === type) {
                let settingKeys = Object.keys(settingsGroups[key].settings);
                for (let settingKey of settingKeys) {
                    if (typeof setting[settingKey] === 'undefined') {
                        setting[settingKey] = settingsGroups[key].settings[settingKey].standard;
                    }
                }
            }
        }
        return setting;
    }

    async set(type, id) {

    }

    async _get(type, id) {
        let setting = await this.bot.handler.cacheHandler.get(`settings.${type}.${id}`, true);
        if (!setting) {
            try {
                setting = await this.bot.handler.weebHandler.getSetting(type, id);
                await this.bot.handler.cacheHandler.set(`settings.${type}.${id}`, true, true, 3600, setting);
                return setting;
            } catch (e) {
                return null;
            }
        }
        return setting;
    }

    async _set(type, id, setting) {
        await this.bot.handler.cacheHandler.set(`settings.${type}.${id}`, true, true, 3600, setting);
        await this.bot.handler.weebHandler.setSetting(type, id, setting);
        return setting;
    }
}

module.exports = SettingsHandler;
