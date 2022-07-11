const Discord = require('discord.js');
const moment = require('moment');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports.run = {
    run: async (client, interaction, args,prefix) =>{
        let roles = interaction.guild.roles.cache
            .sort((a,b) => b.position - a.position)
            .map(role => role.toString())
            .slice(0, -1)
            .join(', ') || "None"

        let Data = {
            Owner: interaction.guild.members.resolve(interaction.guild.ownerId),
            Member: interaction.guild.memberCount,
            Text: interaction.guild.channels.cache.filter(c => c.type === 'GUILD_TEXT').size,
            Voice: interaction.guild.channels.cache.filter(c => c.type === 'GUILD_VOICE').size,
            Category: interaction.guild.channels.cache.filter(c => c.type === 'GUILD_CATEGORY').size,
            Partner: interaction.guild.partnered == true ? "Yes" : "No",
            Verified: interaction.guild.verified == true ? "Yes" : "No",
            Boost: interaction.guild.premiumSubscriptionCount,
            Tier: replaceTier(interaction.guild.premiumTier),
            Creation: moment(interaction.guild.createdTimestamp).format("LL")
        }

        function replaceTier(data){
            return data
            .replace("NONE", "No level")
            .replace("TIER_1", "Level 1")
            .replace("TIER_2", "Level 2")
            .replace("TIER_3", "Level 3")
        }

        let serverInfo = new Discord.MessageEmbed()
        .setAuthor({name: interaction.guild.name, iconURL: interaction.guild.iconURL({format: 'png', dynamic: true})})
        .setThumbnail(interaction.guild.iconURL({
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
        .setFooter({text: `Creation date • ${Data.Creation} | server-id • ${interaction.guild.id}`})
        .setColor("#2f3136")
                
        interaction.reply({embeds: [serverInfo]}).catch(err => {return console.log(err.stack)})
    }
}

module.exports.slash = {
    data: new SlashCommandBuilder()
        .setName('server-info')
        .setDescription('Get infromation about the server')
}
