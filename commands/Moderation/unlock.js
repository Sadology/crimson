const Discord = require('discord.js');
module.exports = {
    name: 'unlock',
    description: "Unlock a locked channel.",
    permissions: ["MANAGE_CHANNELS"],
    botPermission: ["MANAGE_CHANNELS"],
    usage: "unlock [ channel ]",
    category: "Moderation",
    cooldown: 1000,
    run: async(client, message, args,prefix) =>{
        const { author } = message;
        
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