const Discord = require('discord.js');
const { GuildRole } = require('../../models');
module.exports = {
    name: 'overseer',
    aliases: ["overseer-role"],
    description: "Set a moderator role in the server",
    permissions: ["ADMINISTRATOR"],
    usage: "overseer [ option ] [ roles ]",
    category: "Administrator",
    
    run: async(client, message, args, prefix) =>{
        message.channel.send("Temporary disabled")
    }
}