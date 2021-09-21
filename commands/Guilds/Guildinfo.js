const Discord = require('discord.js');
const moment = require('moment');
const { GuildRole } = require("../../models");
const { MessageEmbed } = require('discord.js');
const Regions = {
    brazil: "Brazil",
    europe: "Europe",
    hongkong: "Hong Kong",
    india: "India",
    japan: "Japan",
    russia: "Russia",
    singapore: "Singapore",
    southafrica: "South Africa",
    sydeny: "Sydeny",
    "us-central": "US Central",
    "us-east": "US East",
    "us-west": "US West",
    "us-south": "US South"
}
const verificationLevels = {
    NONE: "None - unrestricted",
    LOW: "Low - Require verified Email",
    MEDIUM: "Medium - Must be a 5 minute old account",
    HIGH: "High - Have to wait 10 minute",
    VERY_HIGH: "Vey-High - Require verified phone number"
  };

module.exports = {
    name: 'server',
    aliases: ['guild'],
    description: "Get informations of your server.",
    permissions: ["EVERYONE"],
    usage: "server [ options ]",
    category: "Utils",

    run: async (client, message, args,prefix) =>{
        const { author, content, guild } = message;

        if(!args[0]){
            message.channel.send({embeds: [new Discord.MessageEmbed()
                .setAuthor("Command - Server")
                .setDescription(`Which option you would like to check? \ninfo\nroles \n**Example**: ${prefix}server info`)
                .setColor("#fffafa")
            ]
            })

        }
        let serverCmd = args[0]
        const Channels = message.guild.channels.cache
        
        const Roles = message.guild.roles.cache
            .sort((a,b) => b.position - a.position)
            .map(role => role.toString())
            .slice(0, -1)
            .join(', ') || "No roles in this server yet"

        switch(serverCmd){
            case'info':{
                serverInfo = new Discord.MessageEmbed()
                .setAuthor(message.guild.name, message.guild.displayAvatarURL)
                .setThumbnail(message.guild.iconURL({
                    dynamic: true , format: 'png' , size:1024
                }))
                .addField('Server name:', message.guild.name)
                .addField('Owner:', message.guild.owner.user.tag, true)
                .addField('Server-Region:',`${Regions[message.guild.region]}`, true )
                .addField('Verification-Level:', `${verificationLevels[message.guild.verificationLevel]}`)
                .addField('Total-Members:', message.guild.memberCount)
                .addField('Text-Channels:', `${Channels.filter(c => c.type === 'text').size}`, true)
                .addField('Voice-Channels:', `${Channels.filter(vc => vc.type === 'voice').size}`, true)
                .addField('Categories:', `${Channels.filter(cc => cc.type === 'category').size}`, true)
                .setFooter(`Created at: ${moment(message.guild.createdTimestamp).format("LL")} | server ID:${message.guild.id}`)
                .setColor("#fffafa")
             message.channel.send({embeds: [serverInfo]})
            }
        break;
            case'roles':{
                serverInfo = new Discord.MessageEmbed()
                .setAuthor(`${message.guild.name}'s server roles: `)
                .setDescription(Roles)
                .setColor("#fffafa")
             message.channel.send({embeds: [serverInfo]})
            }
        }

    }
}
