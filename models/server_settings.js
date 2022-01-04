const mongoose = require('mongoose');

const serverSchema = mongoose.Schema({
    guildID: String,
    guildName: String,
    Active: Boolean,
    prefix: String,
    ownerName: String,
    ownerID: String,
    botOwnerGuild: String,
    WelcomeMessage: String,
    Balance: Number,
    Settings: Map,
    RankSettings: {
        Channel: String,
        NoExpRole: String,
        NoExpChannel: Array,
        MinExp: Number,
        MaxExp: Number,
        ExpCD: Number,
        ExpMulti: Number,
        GuildCard: String,
        LvlupMsg: String,
    },
    Roles: Map,
    Modules: Map,
    Commands: Map
})

module.exports = mongoose.model('Server_Settings', serverSchema);