const { MessageEmbed } = require('discord.js');
const { LogManager } = require('../../Functions');
const wait = require('util').promisify(setTimeout);
module.exports = {
    event: "guildBanRemove",
    once: false,
    run: async(bannedMember, client)=> {
        try{ 
            const clientPerm = bannedMember.guild.members.resolve( client.user ).permissions.any("VIEW_AUDIT_LOG");
            if (!clientPerm || clientPerm == false) return
            
            wait(2000)
            const fetchedLogs = await bannedMember.guild.fetchAuditLogs({
                limit: 5,
                type: 'MEMBER_BAN_REMOVE',
            });

            const unBanLog = fetchedLogs.entries
                .filter(e => e.target.id == bannedMember.user.id)
                .sort((a, b) => b.createdAt - a.createdAt)
                .first()

            if(!unBanLog){
                return console.log(`${member.user.id} was unbanned from ${bannedMember.guild.name} but couldn't find any informations`)
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
            new LogManager(bannedMember.guild).sendData({type: 'banlog', data: unbanEmbed, client})
        }catch(err){
            return console.log(err.stack)
        }
    }
}