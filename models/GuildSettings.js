const mongoose = require('mongoose');

const serverSchema = mongoose.Schema({
    guildID: String,
    guildName: String,
    prefix: {
        type: String,
        default: ">"
    },
    Logchannels: Map,
    Modules: Map,
    Commands: Map,
})

module.exports = mongoose.model('GuildSettings', serverSchema);