
const { LogChannel } = require('./LogManager');
const { errLog } = require('./erroHandling');
module.exports = {
    commandCreate: require('./CommandObject'),
    LogChannel,
    errLog,
    LogManager: require('./LogManager'),
    Member: require('./MemberManager'),
    GuildManager: require('./GuildManager')
};