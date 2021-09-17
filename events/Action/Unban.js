const { MessageEmbed } = require('discord.js');
const { GuildChannel, LogsDatabase } = require('../../models');
module.exports = {
    event: "guildBanRemove",
    once: false,
    run: async(guild, member)=> {
        const logging = await GuildChannel.findOneAndUpdate({
            guildID: guild.id,
            Active: true,
            "BanLog.BanLogEnabled": true
        })

        if(logging){
            const fetchedLogs = await guild.fetchAuditLogs({
                limit: 1,
                type: 'MEMBER_BAN_REMOVE'
            })
            const dataChannel = logging.BanLog.BanLogChannel;
    
            const BanLog = fetchedLogs.entries.first()
            
            if(!BanLog){
                return console.log(`${member.id} was unbanned from ${guild.name} but couldn't find any informations`)
            }
    
            const { executor, target, reason } = BanLog
    
            const banEmbed = {
                color: "#45f766",
                author: {
                    name: `Unban Detection - ${member.tag}`
                },
                fields: [
                    {
                        name: `Member`,
                        value: `\`\`\`${member.tag.toString()}\`\`\``,
                        inline: true
                    },
                    {
                        name: `Moderator`,
                        value: `\`\`\`${executor.tag.toString()}\`\`\``,
                        inline: true
                    },
                ],
                timestamp: new Date(),
                footer: {
                    text: `${member.id}`
                }
            }
    
            if(target.id === member.id){
    
                const LogChannel = guild.channels.cache.find(c => c.id === dataChannel)
                if(LogChannel){
                    LogChannel.send({embeds: [banEmbed]})
                }else {
                    return false
                }

            }else {
                const LogChannels = guild.channels.cache.find(c => c.id === dataChannel)
                if(LogChannels){
                    LogChannels.send({embeds: [banEmbed]})
                }else {
                    return false
                }
            }
        }
    }
}