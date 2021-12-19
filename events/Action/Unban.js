const { MessageEmbed } = require('discord.js');
const { GuildChannel, LogsDatabase } = require('../../models');
const { LogManager } = require('../../Functions');
module.exports = {
    event: "guildBanRemove",
    once: false,
    run: async(Guild, client)=> {
        if(interaction.guild.me.roles.cache.size == 1 && interaction.guild.me.roles.cache.find(r => r.name == '@everyone')){
            return
        }
        if(!Guild.guild.me.permissions.has("VIEW_AUDIT_LOG")){
            return
        }
        try{ 
            const fetchedLogs = await Guild.guild.fetchAuditLogs({
                limit: 1,
                type: 'MEMBER_BAN_REMOVE:',
            });

            const unBanLog = fetchedLogs.entries.first()
            if(!unBanLog){
                return console.log(`${member.id} was banned from ${guild.name} but couldn't find any informations`)
            }

            const { executor, target } = unBanLog

            const unbanEmbed = {
                color: "#45ff6d",
                author: {
                    name: `Unban Detection - ${target.tag}`,
                    icon_url: target.displayAvatarURL({
                        dynamic: true , 
                        type: 'png'
                    })
                },
                fields: [
                    {
                        name: `Member`,
                        value: `\`\`\`${target.tag.toString()}\`\`\``,
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
                    text: `${target.id}`
                }
            }
            new LogManager(Guild.guild).sendData({type: 'banlog', data: unbanEmbed, client})
        }catch(err){
            return console.log(err.stack)
        }
    }
}