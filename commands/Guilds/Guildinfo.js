const Discord = require('discord.js');
const moment = require('moment');
const { GuildRole } = require("../../models");
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

const verificationLevels = {
    NONE: "None - unrestricted",
    LOW: "Low - Require verified Email",
    MEDIUM: "Medium - Must be a 5 minute old account",
    HIGH: "High - Have to wait 10 minute",
    VERY_HIGH: "Vey-High - Require verified phone number"
  };

module.exports = {
    name: 'server',
    aliases: ['guild', 'serverinfo', 'guildinfo', 'server-info', 'guild-info'],
    description: "Get informations about your server.",
    permissions: ["VIEW_MESSAGES"],
    usage: "server-info",
    category: "Utils",

    run: async (client, message, args,prefix) =>{
        const { author, content, guild } = message;

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                .setCustomId('serverRoles')
                .setLabel("Roles")
                .setStyle("PRIMARY")
            )

        const Channels = message.guild.channels.cache
        const Roles = message.guild.roles.cache
            .sort((a,b) => b.position - a.position)
            .map(role => role.toString())
            .slice(0, -1)
            .join(', ') || "No roles in this server yet"

        const Emojis = message.guild.emojis.cache
            .sort((a,b) => b.position - a.position)
            .map(e => e)
            .join(', ') || "No emojis in this server yet"
        
        const Stickers = message.guild.stickers.cache
            .sort((a,b) => b.position - a.position)
            .map(s => s)
            .join(', ') || "No stickers in this server yet"

        serverInfo = new Discord.MessageEmbed()
        .setAuthor(message.guild.name, message.guild.displayAvatarURL)
        .setThumbnail(message.guild.iconURL({
            dynamic: true , format: 'png' , size:1024
        }))
        .setDescription(message.guild.description ? message.guild.description : "Server description not available")
        .addField('Server name:', message.guild.name.toString(), true)
        .addField('Owner:', `<@${message.guild.ownerId}>`.toString(), true)
        .addField('Verification-Level:', `${verificationLevels[message.guild.verificationLevel]}`.toString())
        .addField('Total-Members:', message.guild.memberCount.toString())
        .addField('Text-Channels:', `${Channels.filter(c => c.type === 'GUILD_TEXT').size}`.toString(), true)
        .addField('Voice-Channels:', `${Channels.filter(vc => vc.type === 'GUILD_VOICE').size}`.toString(), true)
        .addField('Categories:', `${Channels.filter(cc => cc.type === 'GUILD_CATEGORY').size}`.toString(), true)
        .addField("MFS Levels", message.guild.mfaLevel.toString(), true)
        .addField("Explict Filter", message.guild.explicitContentFilter.toString(), true)
        .addField("Large Guild", message.guild.large.toString(), true)
        .addField("Max Members", message.guild.maximumMembers.toString(), true)
        .addField("Partnered", message.guild.partnered.toString(), true)
        .addField("Verified", message.guild.verified.toString(), true)
        .addField("Rules Channel", message.guild.rulesChannel.toString(), true)
        .addField("Shard", message.guild.shardId.toString(), true)
        .addField("Banner", `[Banner Link](${message.guild.banner ? message.guild.banner : "https://youtu.be/dQw4w9WgXcQ"})`.toString(), true)
        .addField("Boost Tier", message.guild.premiumTier.toString(), true)
        .addField("Boosters", message.guild.premiumSubscriptionCount.toString(), true)
        .addField("Vanity URL",`${message.guild.vanityURLCode ? message.guild.vanityURLCode : "None"}`.toString(), true)
        .setFooter(`Created at: ${moment(message.guild.createdTimestamp).format("LL")} | server ID:${message.guild.id}`)
        .setColor("#fffafa")
                
            message.channel.send({embeds: [serverInfo], components: [row]}).then(msg =>{
                const filter = (button) => button.clicker.user.id === message.author.id

                const collector = msg.createMessageComponentCollector({ componentType: 'BUTTON', time: 1000 * 120 });

                collector.on('collect', (b) =>{
                    if(b.user.id !== message.author.id) return
                    if(b.customId === 'serverRoles'){
                        let rolesEmbed = new Discord.MessageEmbed()
                            .setDescription(`Server Roles \`[${message.guild.roles.cache.size}]\` \n${Roles}`)
                            .setColor("#fffafa")
                            b.update({embeds: [rolesEmbed], components: []})
                    }
                })

                collector.on('end', () =>{})
            })
    }
}
