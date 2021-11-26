const mongoose = require('mongoose');

const serverSchema = mongoose.Schema({
  guildID: String,
  guildName: String,
  Active: Boolean,
  Roles: Array,
})

module.exports = mongoose.model('Guild-Roles', serverSchema);