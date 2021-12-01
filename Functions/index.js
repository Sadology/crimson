const { LogCreate  } = require('./ActionClasses');
const { LogChannel } = require('./logChannelFunctions');
const { errLog } = require('./erroHandling');
module.exports = {
    LogCreate,
    commandCreate: require('./CommandObject'),
    LogChannel,
    errLog,
};