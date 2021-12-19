const { MessageEmbed } = require('discord.js');
const { GuildChannel, LogsDatabase } = require('../../models');
const { LogManager } = require('../../Functions');
const { saveData, sendLogData, ModStatus } = require('../../Functions/functions');;
module.exports = {
    event: "guildBanAdd",
    once: false,
    run: async(Guild, client)=> {
        if(!Guild.guild.me.permissions.has("VIEW_AUDIT_LOG")){
            return
        }
        try{ 
            const fetchedLogs = await Guild.guild.fetchAuditLogs({
                limit: 1,
                type: 'MEMBER_BAN_ADD',
            });

            const BanLog = fetchedLogs.entries.first()
            if(!BanLog){
                return console.log(`${member.id} was banned from ${Guild.name} but couldn't find any informations`)
            }

            const { executor, target, reason } = BanLog
            const banEmbed = {
                color: "#fc5947",
                author: {
                    name: `Ban Detection - ${target.tag}`,
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
                    {
                        name: `Reason for Ban`,
                        value: `\`\`\`${reason ? reason : 'No reason provided'}\`\`\``.toString(),
                        inline: false
                    }
                ],
                timestamp: new Date(),
                footer: {
                    text: `${target.id}`
                }
            }
            const Data = {
                guildID: Guild.guild.id, 
                guildName: Guild.guild.name,
                userID: target.id, 
                userName: target.tag,
                actionType: "Ban", 
                actionReason: reason ? reason : 'No reason provided',
                moderator: executor.tag,
                moderatorID: executor.id,
            }

            async function CreateLog(Member){
                try {
                    saveData({
                        ...Data,
                    })
                    ModStatus({type: "Ban", guild: Guild.guild, member: executor, content: "Banned " + ` ${target.tag}`})
                } catch (err) {
                    return console.log(err)
                }
            }
            CreateLog(target)

            new LogManager(Guild.guild).sendData({type: 'banlog', data: banEmbed, client})
        }catch(err){
            return console.log(err)
        }
    }
}