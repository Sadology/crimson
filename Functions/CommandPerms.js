const { GuildRole } = require('../models');
const Discord = require('discord.js');
async function permission(message, cmdName) {

    const permData = await GuildRole.findOne({
        guildID: message.guild.id,
        Active: true
    });

    const missingPerm = new Discord.MessageEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL({dynamic: false, format: "png", size: 1024}))
        .setDescription("Missing permission to execute this command")
        .setTimestamp()
        .setColor('#ff303e')

    const roleSet = permData.Moderator;
    if (message.guild.ownerID !== message.author.id){
        if(!message.member.permissions.has(["ADMINISTRATOR"])){
            if(permData.ModOptions.Enabled === true){
                if(!message.member.roles.cache.some(r=>roleSet.includes(r.id))){
                    if(!message.member.permissions.has(["MANAGE_GUILD", "ADMINISTRATOR", "BAN_MEMBERS"])){
                        return await message.channel.send(missingPerm).then(m=>setTimeout(() => m.delete(), 1000 * 10));
                    }
                }
            }else if(permData.ModOptions.Enabled === false){
                if(!message.member.permissions.has(["BAN_MEMBERS", "MANAGE_GUILD", "ADMINISTRATOR"])){
                    return await message.channel.send(missingPerm).then(m=>setTimeout(() => m.delete(), 1000 * 10));
                }
            }
        }
    } 
}

async function adminCommand(message) {
    
}

module.exports = { permission, adminCommand };