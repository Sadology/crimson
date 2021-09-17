const Discord = require('discord.js');
const { GuildRole } = require('../../models');
module.exports = {
    name: 'unlock',

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
                if(!message.member.permissions.has(["ADMINISTRATOR"])){
                    if(permData.ModOptions.Enabled === true){
                        if(!message.member.roles.cache.some(r=>roleSet.includes(r.id))){
                            if(!message.member.permissions.has(["MANAGE_GUILD", "ADMINISTRATOR", "BAN_MEMBERS"])){
                                return await message.channel.send({embeds: [missingPerm]}).then(m=>setTimeout(() => m.delete(), 1000 * 10));
                            }
                        }
                    }else if(permData.ModOptions.Enabled === false){
                        if(!message.member.permissions.has(["BAN_MEMBERS", "MANAGE_GUILD", "ADMINISTRATOR"])){
                            return await message.channel.send({embeds: [missingPerm]}).then(m=>setTimeout(() => m.delete(), 1000 * 10));
                        }
                    }
                }
            }
        } catch (err){
            errLog(err.stack.toString(), "text", "Mute", "Error in fetching User Role");
        }

        const lockChannel = message.mentions.channels.first() ||
        message.guild.channels.cache.get(args[0]);

        let errorEmbed = new Discord.MessageEmbed()
            .setAuthor("Command - Unlock")
            .setDescription(`\`Usage:\` ${prefix}unlock [ channel ] \nExample: ${prefix}unlock #general`)
            .setFooter("Require 'Manage_Channel' permission")
            .setColor("#fffafa")

        if(!args.length){
            message.channel.send(errorEmbed).then((m) =>{
                m.delete({timeout: 1000 * 5})
            })
        }
        if(!lockChannel){
            message.channel.send({embeds: [errorEmbed]}).then(m=>setTimeout(() => m.delete(), 1000 * 10))
        }

        await lockChannel.permissionOverwrites.edit(message.guild.roles.everyone, 
            {
                VIEW_CHANNEL: null,
                SEND_MESSAGES: true
            }
        );

        const embed = new Discord.MessageEmbed()
            .setAuthor("Channel Permission Updated")
            .setDescription(`🔒 ${lockChannel} has been Unlocked for everyone`)
            .setThumbnail("https://icons.iconarchive.com/icons/paomedia/small-n-flat/1024/sign-check-icon.png")
            .setColor("#63ff6e");
        await message.channel.send({embeds: [embed]})
    }
}