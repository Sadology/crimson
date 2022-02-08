const Discord = require('discord.js');
const moment = require('moment');
const { MessageActionRow, MessageButton } = require('discord.js');
const { Guild } = require('../../models');

module.exports = {
    name: 'server',
    aliases: ['guild', 'serverinfo', 'guildinfo', 'server-info', 'guild-info'],
    description: "Get informations about your server.",
    permissions: ["SEND_MESSAGES"],
    botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
    usage: "server",
    category: "Utils",
    cooldown: 3000,
    
    run: async (client, message, args,prefix) =>{
        let earlysupp = await Guild.findOne({
            guildID: message.guild.id,
            EarlySupporter: true
        }).catch(err => {return console.log(err.stack)});
        
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                .setCustomId('serverRoles')
                .setLabel("Roles")
                .setStyle("PRIMARY")
            )
        let roles = message.guild.roles.cache
        .sort((a,b) => b.position - a.position)
        .map(role => role.toString())
        .slice(0, -1)
        .join(', ') || "None"

        let Data = {
            Name: message.guild.name,
            Owner: message.guild.members.resolve(message.guild.ownerId),
            Member: message.guild.memberCount,
            Description: message.guild.description ? message.guild.description : "This is a cool server",
            Text: message.guild.channels.cache.filter(c => c.type === 'GUILD_TEXT').size,
            Voice: message.guild.channels.cache.filter(c => c.type === 'GUILD_VOICE').size,
            Category: message.guild.channels.cache.filter(c => c.type === 'GUILD_CATEGORY').size,
            Partner: message.guild.partnered == true ? "Yes" : "No",
            Verified: message.guild.verified == true ? "Yes" : "No",
            Boost: message.guild.premiumSubscriptionCount,
            Tier: replaceTier(message.guild.premiumTier),
            Banner: message.guild.banner ? message.guild.banner : "https://youtu.be/dQw4w9WgXcQ",
            Vanity: message.guild.vanityURLCode ? `https://discord.gg/${message.guild.vanityURLCode}`: "None",
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
        .setDescription(earlysupp ? "<:earlysupporter:940327468445888532> | "+`${Data.Description}` : `${Data.Description}`)
        .addField('Name', `${Data.Name}`, true)
        .addField('Owner', `${Data.Owner}`, true)
        .addField('Total-Members', `${Data.Member}`, true)
        .addField('Text-Channels', `${Data.Text}`, true)
        .addField('Voice-Channels', `${Data.Voice}`, true)
        .addField('Categories', `${Data.Category}`, true)
        .addField("Partnered", `${Data.Partner}`, true)
        .addField("Verified", `${Data.Verified}`, true)
        .addField("Banner", `[BANNER](${Data.Banner})`, true)
        .addField("Boost Level", `${Data.Tier}`, true)
        .addField("Boost Amount", `${Data.Boost}`, true)
        .addField("Vanity URL",`${Data.Vanity}`, true)
        .setFooter({text: `Created at: ${Data.Creation} | server ID: ${message.guild.id}`})
        .setColor("#fffafa")
        if(earlysupp){
            serverInfo.addField("Early supporter", "Yes", true)
        }
                
        message.channel.send({embeds: [serverInfo], components: [row]}).then(msg =>{
            const collector = msg.createMessageComponentCollector({ componentType: 'BUTTON', time: 1000 * 120 });
            collector.on('collect', (b) =>{
                if(b.user.id !== message.author.id) return
                if(b.customId === 'serverRoles'){
                    let rolesEmbed = new Discord.MessageEmbed()
                        .setDescription(`Server Roles \`[${message.guild.roles.cache.size}]\` \n${roles}`)
                        .setColor("#fffafa")
                    collector.stop()
                    b.update({embeds: [rolesEmbed], components: [row]}).catch(err => {return console.log(err)})
                }
            })

            collector.on('end', () =>{
                row.components[0].setDisabled(true)
                msg.edit({components: [row]}).catch(err => {return console.log(err)})
            })
        }).catch(err => {return console.log(err)});
    }
}
