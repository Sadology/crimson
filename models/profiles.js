const mongoose = require('mongoose');

const profilesSchema = mongoose.Schema({
    guildID: String,
    guildName: String,
    userID: String,
    userName: String,
    Balance: Number,
    Story: Array
})

module.exports = mongoose.model('Profiles', profilesSchema);