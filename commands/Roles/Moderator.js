const Discord = require('discord.js');
const { GuildRole } = require('../../models');
module.exports = {
    name: 'moderator',
    aliases: ["mod-role", "moderator-role"],
    description: "Set a moderator role in the server",
    permissions: ["ADMINISTRATOR"],
    usage: "moderator [ option ] [ roles ]",
    category: "Administrator",

    run: async(client, message, args, prefix) =>{
        message.channel.send("Temporary disabled")
    }
}