const mongoose = require('mongoose');

const serverSchema = mongoose.Schema({
    guildID: String,
    guildName: String,
    Active: Boolean,
    prefix: String,
    ownerID: String,
    WelcomeMessage: String,
})

module.exports = mongoose.model('Guilds', serverSchema);