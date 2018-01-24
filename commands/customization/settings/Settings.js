const Command = require('../../../structure/Command');
const SettingGroups = require('../../../structure/SettingGroups');
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
            let embed = this._buildSubSettingsEmbed(SettingGroups[argSplit[0]]);
            return this.bot.rest.channel.createMessage(msg.channel_id, {embed});
        }
        if (SettingGroups[argSplit[0]] && SettingGroups[argSplit[0]].settings[argSplit[1]]) {
            let setting = SettingGroups[argSplit[0]].settings[argSplit[1]];
            let name = argSplit[1];
            let embed = this._buildSingleSettingEmbed(setting, name, this._combineGroupWithKey(argSplit[0], name));
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

    _buildSubSettingsEmbed(subSetting) {
        let embed = {
            title: `:tools: ${utils.uppercaseFirstChar(subSetting.name)} settings :tools:`,
            fields: [],
            footer: {text: `Type ${this.bot.config.prefix} settings settingName to get more info about a setting`}
        };
        let keys = Object.keys(subSetting.settings);
        for (let key of keys) {
            embed.fields.push({
                name: this._combineGroupWithKey(subSetting.name, key),
                value: subSetting.settings[key].short
            });
        }
        return embed;
    }

    _buildSingleSettingEmbed(setting, settingName, settingKey) {
        let embed = {
            title: `:tools: ${utils.uppercaseFirstChar(settingName)}/${settingKey} :tools:`,
            description: 'If you are seeing this, something went reallyyyyyy wrong >w<',
            footer: {text: `Type ${this.bot.config.prefix} settings ${settingKey} value to change the value of this setting`}
        };
        let description = '';
        description += `**Name**: \`${settingKey}\`\n`;
        if (setting.type) {
            description += `**Type**: ${setting.type}\n`;
        }
        if (setting.standard) {
            description += `**Default**: ${setting.standard}\n`;
        }
        if (setting.description) {
            description += `**Description** ${setting.description}`;
        }
        embed.description = description;
        return embed;
    }

    _combineGroupWithKey(group, key) {
        return `${group}.${key}`;
    }
}

module.exports = Settings;
