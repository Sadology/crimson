const mongoose = require('mongoose');

const profilesSchema = mongoose.Schema({
    guildID: String,
    guildName: String,
    userID: String,
    userName: String,
    Stories: Date,
    ModerationStats: {
        Recent: String,
        Mute: Number,
        Purge: Number,
        Ban: Number,
        kick: Number,
        Total: Number
    },
    Status: {
        Active: Boolean,
        MSG: String,
        Time: Date
    }
})

module.exports = mongoose.model('Profiles', profilesSchema);