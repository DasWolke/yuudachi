const settingGroups = require('../structure/settingGroups');

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
        let keys = Object.keys(settingGroups);
        for (let key of keys) {
            if (settingGroups[key].apiType === type) {
                let settingKeys = Object.keys(settingGroups[key].settings);
                for (let settingKey of settingKeys) {
                    if (typeof setting[settingKey] === 'undefined') {
                        setting[settingKey] = settingGroups[key].settings[settingKey].standard;
                    }
                }
            }
        }
        return setting;
    }

    async set(type, id, data) {
        let setting = await this.bot.handler.weebHandler.setSetting(type, id, data);
        await this.bot.handler.cacheHandler.set(`settings.${type}.${id}`, true, true, 3600, setting);
        return setting;
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

    async resolve(key, id) {
        let keySplit = key.split('.');
        if (!this.checkKeyExist(keySplit)) {
            throw new Error(`The key ${key} does not exist!`);
        }
        let apiType = this.getApiType(keySplit[0]);
        let setting = await this.get(apiType, id);
        return setting[keySplit[1]];
    }

    getSettingFromGroup(keySplit) {
        if (!this.checkKeyExist(keySplit)) {
            return false;
        }
        return settingGroups[keySplit[0]].settings[keySplit[1]];
    }

    checkTypeExist(type) {
        return !!settingGroups[type];
    }

    checkKeyExist(keySplit) {
        let type = keySplit[0];
        let settingKey = keySplit[1];
        if (settingGroups[type]) {
            if (settingGroups[type].settings[settingKey]) {
                return true;
            }
        }
        return false;
    }

    getApiType(type) {
        if (this.checkTypeExist(type)) {
            return settingGroups[type].apiType;
        }
        return false;
    }
}

module.exports = SettingsHandler;
