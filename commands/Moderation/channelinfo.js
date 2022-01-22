const Discord = require('discord.js');
const fs = require('fs');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

module.exports = {
    name: 'channel-info',
    aliases: ['channelinfo'],
    description: "Server channel info",
    permissions: ["ADMINISTRATOR", "MANAGE_ROLES"],
    botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
    usage: "channel-info [ channel ]",
    category: "Moderation",
    cooldown: 3000,
    run: async(client, message, args,prefix) =>{
        fetchChannel()

        function fetchChannel(){
            let chanArgs = message.content.split(" ").slice(1)
            let chanItem = chanArgs.join(' ')
            let channel = message.mentions.channels.first() || 
            message.guild.channels.cache.find(c => c.name.toLowerCase() == chanItem.toLowerCase()) || 
            message.guild.channels.cache.find(c => c.id == args[0]) || message.channel;

            constructData(channel)
        }

        async function constructData(channel){
            let Embed = new Discord.MessageEmbed()
                .addField("Name", `\`\`\`${channel.name}\`\`\``, true)
                .addField("Position", `\`\`\`${channel.rawPosition}\`\`\``, true)
                .addField("Topic", `\`\`\`${channel.topic ? channel.topic : "None"}\`\`\``, true)
                .addField("Mention", `\`\`\`<#${channel.id}>\`\`\``, true)
                .addField("Cooldown", `\`\`\`${channel.rateLimitPerUser}\`\`\``, true)
                .setFooter({text: `Channel ID: ${channel.id}`})
                .setTimestamp()
                .setColor("WHITE")

            message.channel.send({embeds: [Embed]})
            .catch(err => {return console.log(err.stack)})
        }
    }
}