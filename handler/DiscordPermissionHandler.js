const permissionProcessor = require('stargear').PermissionProcessor;

class DiscordPermissionHandler {
    constructor(bot) {
        this.bot = bot;
    }

    async getPermissionsOfMember(userId, guildId) {
        let member = await this.bot.cache.member.get(userId, guildId);
        member = await this._getRolesOfMember(member);
        member.isOwner = await this.isOwner(userId, guildId);
        member.permissions = this._calculatePermissionsOfMember(member);
        return member;
    }

    _calculatePermissionsOfMember(member) {
        let perms = {};
        for (let role of member.roles) {
            Object.assign(perms, permissionProcessor.calculatePermissions(role.permissions));
        }
        return perms;
    }

    async _getRolesOfMember(member) {
        let rolePromises = member.roles.map((r => {
            return this.bot.cache.role.get(r, member.guild_id);
        }));
        member.roles = await Promise.all(rolePromises);
        return member;
    }

    async isOwner(userId, guildId) {
        let guild = await this.bot.cache.guild.get(guildId);
        return guild.owner_id === userId;
    }
}

module.exports = DiscordPermissionHandler;
