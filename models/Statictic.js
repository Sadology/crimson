const mongoose = require('mongoose');
const type = {
    type: Number,
    default: 0
}

const moderatorSchema = mongoose.Schema({
    Global: Boolean,
    guildID: String,
    userID: String,
    AuditLog: Boolean,
    Audits: Array,
    Stats: {
        Mute: Number,
        Warn: Number,
        Ban: Number,
        Timeout: Number,
        Kick: Number,
        Unmute: Number,
        Unban: Number
    }
})

module.exports = mongoose.model('Statistics', moderatorSchema);