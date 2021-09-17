const mongoose = require('mongoose');
const type = {
    type: Number,
    default: 0
}

const moderatorSchema = mongoose.Schema({
    guildID: String,
    guildName: String,
    userName: String,
    userID: String,
    Recent: String,
    Mute: type,
    Warn: type,
    Ban: type,
    Kick: type,
    Purge: type,
    Clean: type,
    Command: type,
    Status: {
        Active: Boolean,
        MSG: String,
        Time: Date
    }
})

module.exports = mongoose.model('Mods-Stats', moderatorSchema);