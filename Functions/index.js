
const { LogManager } = require('./LogManager');
const { errLog } = require('./erroHandling');
const {Member, GuildMember, ClientMember, FindMember} = require('./MemberManager');
const {RoleManager, UserRoleManager} = require('./RolesManager');
const {Permissions} = require('./PermissionManager')
const { WebhookManager } = require('./WebHookManager')
const {GuildManager} = require('./GuildManager');
const {CacheManager} = require('./CacheManager')
module.exports = {
    errLog,
    GuildManager,
    Member,
    GuildMember,
    ClientMember,
    FindMember,
    RoleManager,
    UserRoleManager,
    LogManager,
    Permissions,
    WebhookManager

    //RankManager: require('./RankManager')

};