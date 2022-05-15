const Discord = require('discord.js');
const moment = require('moment');

module.exports.run = {
    run: async (client, message, args,prefix) =>{
        let roles = message.guild.roles.cache
            .sort((a,b) => b.position - a.position)
            .map(role => role.toString())
            .slice(0, -1)
            .join(', ') || "None"

        let Data = {
            Owner: message.guild.members.resolve(message.guild.ownerId),
            Member: message.guild.memberCount,
            Text: message.guild.channels.cache.filter(c => c.type === 'GUILD_TEXT').size,
            Voice: message.guild.channels.cache.filter(c => c.type === 'GUILD_VOICE').size,
            Category: message.guild.channels.cache.filter(c => c.type === 'GUILD_CATEGORY').size,
            Partner: message.guild.partnered == true ? "Yes" : "No",
            Verified: message.guild.verified == true ? "Yes" : "No",
            Boost: message.guild.premiumSubscriptionCount,
            Tier: replaceTier(message.guild.premiumTier),
            Creation: moment(message.guild.createdTimestamp).format("LL")
        }

        function replaceTier(data){
            return data
            .replace("NONE", "No level")
            .replace("TIER_1", "Level 1")
            .replace("TIER_2", "Level 2")
            .replace("TIER_3", "Level 3")
        }

        let serverInfo = new Discord.MessageEmbed()
        .setAuthor({name: message.guild.name, iconURL: message.guild.iconURL({format: 'png', dynamic: true})})
        .setThumbnail(message.guild.iconURL({
            dynamic: true , format: 'png' , size:1024
        }))
        .addField('Owner', `${Data.Owner.user.username}`, true)
        .addField('Members', `${Data.Member}`, true)
        .addField('Text-Channels', `${Data.Text}`, true)
        .addField('Voice-Channels', `${Data.Voice}`, true)
        .addField('Categories', `${Data.Category}`, true)
        .addField("Partnered", `${Data.Partner}`, true)
        .addField("Verified", `${Data.Verified}`, true)
        .addField("Boost Level", `${Data.Tier}`, true)
        .addField("Boost Amount", `${Data.Boost}`, true)
        .setFooter({text: `Creation date • ${Data.Creation} | server-id • ${message.guild.id}`})
        .setColor("#2f3136")
                
        message.channel.send({embeds: [serverInfo]}).catch(err => {return console.log(err.stack)})
    }
}

module.exports.cmd = {
    name: 'server',
    aliases: ['guild', 'serverinfo', 'guildinfo', 'server-info', 'guild-info'],
    description: "Get informations about your server.",
    permissions: ["SEND_MESSAGES"],
    botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
    usage: "server",
    category: "Utils",
    cooldown: 3000,
}
