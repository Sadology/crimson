const { MessageEmbed } = require('discord.js');
const { LogManager } = require('../../Functions');
const { saveData, sendLogData, ModStatus } = require('../../Functions/functions');
const wait = require('util').promisify(setTimeout);
module.exports = {
    event: "guildBanAdd",
    once: false,
    run: async(bannedMember, client)=> {
        try{
            const clientPerm = bannedMember.guild.members.resolve( client.user ).permissions.any("VIEW_AUDIT_LOG");
            if (!clientPerm || clientPerm == false) return
            
            const fetchedLogs = await bannedMember.guild.fetchAuditLogs({
                limit: 1,
                type: 'MEMBER_BAN_ADD'
            })

            const BanLog = fetchedLogs.entries
                .filter(e => e.target.id === bannedMember.user.id)
                .sort((a, b) => b.createdAt - a.createdAt)
                .first()

            if(!BanLog){
                return console.log(`${bannedMember.user.id} was banned from ${bannedMember.guild.name} but couldn't find any informations`)
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
                guildID: bannedMember.guild.id, 
                guildName: bannedMember.guild.name,
                userID: target.id, 
                userName: target.tag,
                actionType: "Ban", 
                actionReason: reason ? reason : 'No reason provided',
                moderator: executor.tag,
                moderatorID: executor.id,
            }

            async function CreateLog(){
                try {
                    let logmanager = new LogManager(bannedMember.guild, client);
                    logmanager.logCreate({data: Data, user: bannedMember});
                    logmanager.sendData({type: 'banlog', data: banEmbed, client});

                    if(executor.bot == true) return
                    else ModStatus({type: "Ban", guild: bannedMember.guild, member: executor, content: "Banned " + ` ${target.tag}`})
                } catch (err) {
                    return console.log(err)
                }
            }
            CreateLog()
        }catch(err){
            return console.log(err)
        }
    }
}