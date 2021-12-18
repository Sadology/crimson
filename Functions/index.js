const { LogCreate  } = require('./ActionClasses');
const { LogChannel } = require('./LogManager');
const { errLog } = require('./erroHandling');
module.exports = {
    LogCreate,
    commandCreate: require('./CommandObject'),
    LogChannel,
    errLog,
    LogManager: require('./LogManager'),
    Member: require('./MemberManager'),
};