const Discord = require('discord.js');
const { commandUsed } = require('../../Functions/CommandUsage');
module.exports = {
    name: 'sendannounce',
    category: "Owner",
    run: async(client, message, args,prefix) =>{
        if(message.author.id !== "571964900646191104"){
            return
        }

        let guild
        client.guilds.cache.forEach(g => {
            if (g.id == args[0]){
                guild = g
            }
        })

        if(guild){
            let channel = guild.channels.cache.get(args[1])
            if(channel){
                channel.send({embeds: [
                    new Discord.MessageEmbed()
                        .setAuthor(client.user.tag, client.user.displayAvatarURL({dynamic: false, type: 'png'}))
                        .setDescription("SADBOT UPDATE - v1.3.1\n\nWhats new: \n+ Fixed issues for bot crashing while creating a new webhook.\n+ Added a new functionality for `modstats`. You can now check moderators online activity through stats. This setting will only apply on those who has \"Moderator\" category roles. Setup now by `/set-roles`.\n+ Added functionality for other bot mute. Sadbot will now log other bot mutes and you can check them by `logs` command. (Bot can't log mute reasons cause bot can't see them 😔)\n+ Logging system has been moved to a more faster system. \n\nMore bug fixes.")
                        .setColor("WHITE")
                ]})
            }else {
                return message.channel.send("Couldn't find the channel")
            }
        }else {
            return message.channel.send("Couldn't find the guild")
        }
    }
}