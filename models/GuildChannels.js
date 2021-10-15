const mongoose = require('mongoose');

const serverSchema = mongoose.Schema({
  guildID: String,
  guildName: String,
  Active: Boolean,
  statusLog: {
    Channel: String,
    Enabled: Boolean,
    msgID: String
  },
  Announce: {
    JOIN: String,
    JoinEnable: Boolean,
    LEAVE: String,
    leaveEnable: Boolean,
  },
  RolesLog: {
    RolesAddChannel: String,
    RolesAddEnabled: Boolean,
    RolesRemoveChannel: String,
    RolesRemoveEnabled: Boolean
  },
  UserLog: {
    UserChannel: String,
    UserEnabled: Boolean,
  },
  Data: Array,
  customMessage: {
    JoinedMsg: Array,
    LeftMsg: Array
  }
})

module.exports = mongoose.model('Guild-Channels', serverSchema);