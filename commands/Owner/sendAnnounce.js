const Discord = require('discord.js');
const { commandUsed } = require('../../Functions/CommandUsage');
const {Member} = require('../../Functions/MemberFunction');
module.exports = {
    name: 'sendannounce',
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
                        .setDescription("SADBOT UPDATE - v1.3\n\nWhats new: \n+ New command added `>setup`. Setup sadbot in your server more easily.\n**Note**:\nThis command is not stable yet. If you find any issue or bug please report it to <#913796472368144394>")
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