const mongoose = require('mongoose');

const serverSchema = mongoose.Schema({
    sentID: Array,
    ownerPass: {
        type: String,
        default: "35689"
    }
})

module.exports = mongoose.model('crimsonSettings', serverSchema);