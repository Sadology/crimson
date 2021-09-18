const mongoose = require('mongoose');

const serverSchema = mongoose.Schema({
    guildID: String,
    guildName: String,
    Data: Object
})

module.exports = mongoose.model('Custom-Commands', serverSchema);