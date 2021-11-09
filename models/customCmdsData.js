const mongoose = require('mongoose');

const serverSchema = mongoose.Schema({
    guildID: String,
    guildName: String,
    Data: Array
})

module.exports = mongoose.model('Custom-Commands', serverSchema);