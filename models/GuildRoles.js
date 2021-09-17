const mongoose = require('mongoose');

const serverSchema = mongoose.Schema({
  guildID: String,
  guildName: String,
  Active: Boolean,
  Moderator: Array,
  Overseer: Array,
  ModOptions: {
    Enabled: Boolean
  },
  OverseerOptions: {
    Enabled: Boolean
  }

})

module.exports = mongoose.model('Guild-Roles', serverSchema);