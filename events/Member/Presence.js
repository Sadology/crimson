const Discord = require('discord.js');
const { GuildChannel } = require('../../models');

module.exports = {
    event: "presenceUpdate",
    once: false,
    run: async(oldPresence, newPresence, client)=> {
        //console.log(oldPresence)
    }
}