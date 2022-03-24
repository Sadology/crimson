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
            
            await wait(2000)
            const fetchedLogs = await bannedMember.guild.fetchAuditLogs({
                limit: 5,
                type: 'MEMBER_BAN_REMOVE',
            });

            const unBanLog = fetchedLogs.entries
                .filter(e => e.target.id == bannedMember.user.id)
                .first()

            if(!unBanLog){
                return console.log(`${member.user.id} was unbanned from ${bannedMember.guild.name} but couldn't find any informations`)
            }

            const { executor, target } = unBanLog

            const unbanEmbed = {
                color: "#2f3136",
                author: {
                    name: `Unban - ${target.tag}`,
                    icon_url: target.displayAvatarURL({
                        dynamic: true , 
                        format: 'png'
                    })
                },
                fields: [
                    {
                        name: `<:user_icon:953192887779221574> User`,
                        value: `${target.tag.toString()}`,
                        inline: true
                    },
                    {
                        name: `<:staff:956457533957079080><:staff:956457534334566420> Moderator`,
                        value: `${executor.tag.toString()}`,
                        inline: true
                    },
                ],
                timestamp: new Date(),
                footer: {
                    text: `User-ID: ${target.id}`
                }
            }
            new LogManager(bannedMember.guild).sendData({type: 'banlog', data: unbanEmbed, client})
        }catch(err){
            return console.log(err.stack)
        }
    }
}