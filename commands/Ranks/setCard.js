const Discord = require('discord.js');
const { Member } = require('../../Functions');
const Canvas = require('canvas');
const canvacord = require("canvacord");
const { Guild, Profiles } = require('../../models');

module.exports = {
    name: 'edit-card',
    aliases: ['editcard'],
    description: "check your rank in the server",
    permissions: ["SEND_MESSAGES"],
    botPermission: ["SEND_MESSAGES", "ATTACH_FILES", "EMBED_LINKS"],
    usage: "rank [ user (optional)]",
    category: "Ranks",
    cooldown: 3000,
    run: async(client, message, args,prefix) =>{
        return message.channel.send("Coming soon...")
    }
}