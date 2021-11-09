const mongoose = require('mongoose');

const modLogSchema = mongoose.Schema({
    guildID: String,
    userID: String,
    Muted: Boolean,
    Expire: Date,
    Action: Array
})

module.exports = mongoose.model('Action-logs', modLogSchema);