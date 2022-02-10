const mongoose = require('mongoose');

const rankSchema = mongoose.Schema({
    guildID: String,
    guildName: String,
    Rewards: Map,
    Members: Map,
    Settings: Map
})

module.exports = mongoose.model('Ranks', rankSchema);