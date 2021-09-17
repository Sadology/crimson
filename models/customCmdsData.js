const mongoose = require('mongoose');

const serverSchema = mongoose.Schema({
    guildID: String,
    guildName: String,
    Active: Boolean,
    Command: String,
    CmdProperty: {
        Delete: Boolean,
        CmdID: String,
    },
    Content: String,
    Mention: Boolean,
    Embed: Boolean,
    EmbedProperty: {
        Desc: String,
        Author: String,
        Title: String,
        URL: String,
        Color: String
    },
    Perms: Array,
    Image: String,
    
})

module.exports = mongoose.model('Custom-Commands', serverSchema);