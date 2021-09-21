const Discord = require('discord.js');
const { GuildRole } = require('../../models');
const { Permissions } = require('discord.js');
const { errLog } = require('../../Functions/erroHandling')
module.exports = {
    name: 'lock',
    description: "Locks a channel from everyone.",
    permissions: ["MANAGE_CHANNELS"],
    usage: "lock [ channel ]",
    category: "Moderation",

    run: async(client, message, args,prefix) =>{
        await message.delete();
        const permData = await GuildRole.findOne({
            guildID: message.guild.id,
            Active: true
        });
        const { author } = message;

        const missingPerm = new Discord.MessageEmbed()
            .setAuthor(author.tag, author.displayAvatarURL({dynamic: false, format: "png", size: 1024}))
            .setDescription("Missing permission to execute this command")
            .setTimestamp()
            .setColor('#ff303e')

        const roleSet = permData.Moderator;
        try {
            if (message.guild.ownerID !== message.author.id){
                if(!permData.ModOptions){
                    if(!message.member.permissions.has([Permissions.FLAGS.BAN_MEMBERS, Permissions.FLAGS.MANAGE_GUILD, Permissions.FLAGS.ADMINISTRATOR])){
                        return await message.channel.send({embeds: [missingPerm]}).then(m=>setTimeout(() => m.delete(), 1000 * 10));
                    }
                }else if(!message.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR])){
                    if(permData.ModOptions.Enabled === true){
                        if(!message.member.roles.cache.some(r=>roleSet.includes(r.id))){
                            if(!message.member.permissions.has([Permissions.FLAGS.MANAGE_GUILD, Permissions.FLAGS.ADMINISTRATOR, Permissions.FLAGSBAN_MEMBERS])){
                                return await message.channel.send({embeds: [missingPerm]}).then(m=>setTimeout(() => m.delete(), 1000 * 10));
                            }
                        }
                    }else if(permData.ModOptions.Enabled === false){
                        if(!message.member.permissions.has([Permissions.FLAGS.BAN_MEMBERS, Permissions.FLAGS.MANAGE_GUILD, Permissions.FLAGS.ADMINISTRATOR])){
                            return await message.channel.send({embeds: [missingPerm]}).then(m=>setTimeout(() => m.delete(), 1000 * 10));
                        }
                    }
                }
            }
        } catch (err){
            errLog(err.stack.toString(), "text", "Mute", "Error in fetching User Role");
        }

        let lockChannel = message.mentions.channels.first() ||
        message.guild.channels.cache.get(args[0]);

        let errorEmbed = new Discord.MessageEmbed()
            .setAuthor("Command - Unlock")
            .setDescription(`\`Usage:\` ${prefix}unlock [ channel ] \nExample: ${prefix}unlock #general`)
            .setFooter("Require 'Manage_Channel' permission")
            .setColor("#fffafa")

        if(!args.length){
            message.channel.send({embeds: [errorEmbed]}).then(m=>setTimeout(() => m.delete(), 1000 * 10))
        }
        if(!lockChannel){
            message.channel.send({embeds: [errorEmbed]}).then(m=>setTimeout(() => m.delete(), 1000 * 10))
        }

        await lockChannel.permissionOverwrites.edit(message.guild.roles.everyone, 
            {
                VIEW_CHANNEL: false,
                SEND_MESSAGES: false
            }
        );

        const embed = new Discord.MessageEmbed()
            .setAuthor("Channel Permission Updated")
            .setDescription(`🔒 ${lockChannel} has been Locked for everyone`)
            .setThumbnail("https://icons.iconarchive.com/icons/paomedia/small-n-flat/1024/sign-check-icon.png")
            .setColor("#e0310d");
        await message.channel.send({embeds: [embed]})
    }
}