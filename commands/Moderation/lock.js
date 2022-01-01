const Discord = require('discord.js');
const { GuildRole } = require('../../models');
const { Permissions } = require('discord.js');
const { errLog } = require('../../Functions/erroHandling')
module.exports = {
    name: 'lock',
    description: "Locks a channel from everyone.",
    permissions: ["MANAGE_CHANNELS"],
    botPermission: ["MANAGE_CHANNELS", "SEND_MESSAGES", "EMBED_LINKS"],
    usage: "lock [ channel ]",
    category: "Moderation",
    cooldown: 1000,
    run: async(client, message, args,prefix) =>{
        const { author } = message;

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