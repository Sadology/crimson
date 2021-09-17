const mongoose = require('mongoose');

const modLogSchema = mongoose.Schema({
    CaseID: String,
    guildID: String,
    guildName: String,
    userID: String,
    userName: String,
    ActionType: String,
    Reason: String,
    Moderator: String,
    ModeratorID: String,
    Muted: Boolean,
    Banned: Boolean,
    softBanned: Boolean,
    Duration: String,
    Expire: Date,
    ActionDate: Date,
})

module.exports = mongoose.model('Action-logs', modLogSchema);