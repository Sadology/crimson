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
  MessageLog: {
    MessageDelete: String,
    DeleteEnabled: Boolean,
    MessageEdit: String,
    EditEnabled: Boolean,
    IgnoreChannels: Array,
    IgnoreRoles: Array
  },
  ActionLog: {
    MuteChannel: String,
    MuteEnabled: Boolean,
    UnMuteChannel: String,
    UnMuteEnanled: Boolean
  },
  BanLog: {
    BanLogChannel: String,
    BanLogEnabled: Boolean
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
  Ticket: {
    TicketChannel: String,
    TicketEnabled: Boolean,
  }
})

module.exports = mongoose.model('Guild-Channels', serverSchema);