const Command = require('../../../structure/Command');
const SettingGroups = require('../../../structure/settingGroups');
const utils = require('../../../structure/utils');

class Settings extends Command {
    constructor(bot) {
        super();
        this.cmd = 'settings';
        this.aliases = ['setting', 'set'];
        this.type = 'customization';
        this.bot = bot;
    }

    async run(msg, args) {
        if (args.length === 0) {
            let embed = this._buildMainSettingsEmbed();
            return this.bot.rest.channel.createMessage(msg.channel_id, {embed});
        }
        let argSplit = args[0].split('.');
        if (SettingGroups[argSplit[0]] && argSplit.length === 1) {
            let id = await this._getIdForType(msg, SettingGroups[argSplit[0]].apiType);
            let settings = await this.bot.handler.settingsHandler.get(SettingGroups[argSplit[0]].apiType, id);
            let embed = this._buildSubSettingsEmbed(SettingGroups[argSplit[0]], settings);
            return this.bot.rest.channel.createMessage(msg.channel_id, {embed});
        }
        if (SettingGroups[argSplit[0]] && SettingGroups[argSplit[0]].settings[argSplit[1]]) {
            let id = await this._getIdForType(msg, SettingGroups[argSplit[0]].apiType);
            let settingsObject = await this.bot.handler.settingsHandler.get(SettingGroups[argSplit[0]].apiType, id);
            let setting = SettingGroups[argSplit[0]].settings[argSplit[1]];
            let name = argSplit[1];
            let embed = this._buildSingleSettingEmbed(setting, name, this._combineGroupWithKey(argSplit[0], name), settingsObject);
            return this.bot.rest.channel.createMessage(msg.channel_id, {embed});
        }

    }

    _buildMainSettingsEmbed() {
        let embed = {
            title: ':tools: Settings :tools:',
            fields: [],
            footer: {text: `Type ${this.bot.config.prefix} settings settingName to get more info about a setting`}
        };
        let keys = Object.keys(SettingGroups);
        for (let key of keys) {
            embed.fields.push({
                name: `${utils.uppercaseFirstChar(key)} settings`,
                value: SettingGroups[key].description
            });
        }
        return embed;
    }

    _buildSubSettingsEmbed(subSetting, settingsObject) {
        let embed = {
            title: `:tools: ${utils.uppercaseFirstChar(subSetting.name)} settings :tools:`,
            fields: [],
            footer: {text: `Type ${this.bot.config.prefix} settings settingName to get more info about a setting`}
        };
        let keys = Object.keys(subSetting.settings);
        for (let key of keys) {
            embed.fields.push({
                name: this._combineGroupWithKey(subSetting.name, key),
                value: `${subSetting.settings[key].short}\nValue: \`${settingsObject[key]}\`${settingsObject[key] === subSetting.settings[key].standard ? ' (Default)' : ''}`
            });
        }
        return embed;
    }

    _buildSingleSettingEmbed(setting, settingName, settingKey, settingsObject) {
        let embed = {
            title: `:tools: ${utils.uppercaseFirstChar(settingName)}/${settingKey} :tools:`,
            description: 'If you are seeing this, something went reallyyyyyy wrong >w<',
            footer: {text: `Type ${this.bot.config.prefix} settings ${settingKey} value to change the value of this setting`}
        };
        let description = '';
        description += `**Name**: \`${settingKey}\`\n`;
        if (setting.type) {
            description += `**Type**: \`${setting.type}\`\n`;
        }
        if (setting.standard) {
            description += `**Default**: \`${setting.standard}\`\n`;
        }
        if (settingsObject[settingName]) {
            description += `**Current Value**: \`${settingsObject[settingName]}\`\n`;
        }
        if (setting.description) {
            description += `**Description**: ${setting.description}`;
        }
        embed.description = description;
        return embed;
    }

    _combineGroupWithKey(group, key) {
        return `${group}.${key}`;
    }

    async _getIdForType(msg, type) {
        let channel;
        switch (type) {
            case 'guilds':
                channel = await this.bot.cache.channel.get(msg.channel_id);
                if (!channel.guild_id) {
                    return null;
                }
                return channel.guild_id;
            case 'users':
                return msg.author.id;
            default:
                return null;
        }
    }
}

module.exports = Settings;
