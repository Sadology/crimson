const { MessageEmbed, MessageAttachment } = require('discord.js')
const moment = require('moment')
module.exports = {
    name: 'color',
    aliases: ['colors'],
    description: "check a color with hex color code",
    permissions: ["SEND_MESSAGES"],
    botPermission: ["SEND_MESSAGES"],
    usage: "color #ffffaf",
    category: "Utils",
    cooldown: 3000,
    run: async(client, message, args,prefix) =>{
        
    }
}