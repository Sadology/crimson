const Discord = require('discord.js');
const { GuildChannel } = require('../../models');
const { errLog } = require('../../Functions/erroHandling');
const { LogManager } = require('../../Functions');
const ms = require('ms');
module.exports = {
    event: "guildMemberUpdate",
    once: false,
    run: async(oldMember, newMember, client)=> {
        try {
            const clientPerm = newMember.guild.members.resolve( client.user ).permissions.any("VIEW_AUDIT_LOG");
            if (!clientPerm || clientPerm == false) return

            const auditLogs = await oldMember.guild.fetchAuditLogs({ limit: 5, type: "MEMBER_UPDATE" });
            const logs = auditLogs.entries
                .filter(e => e.target.id === oldMember.user.id)
                .sort((a, b) => b.createdAt - a.createdAt)
                .first()

            if(!logs) return
            let date = (newMember.communicationDisabledUntilTimestamp ?? Date.now()) - Date.now()
            const timeoutChange = logs.changes?.find((c) => c.key == 'communication_disabled_until');
            if(!timeoutChange) return
            if(newMember.communicationDisabledUntilTimestamp == oldMember.communicationDisabledUntilTimestamp) return

            timeOutSet()
            function timeOutSet(){
                let timeAddEmbed = new Discord.MessageEmbed()
                .setAuthor({
                    name: "Timed out",
                    iconURL: newMember.user.displayAvatarURL({format: 'png'})
                })
                .addField("User", `\`\`\` ${newMember.user.tag} \`\`\``.toString(), true)
                .addField("Moderator", `\`\`\` ${logs.executor.tag} \`\`\``.toString(), true)
                .addField("Duration", `\`\`\` ${ms(date+1000, {long: true})} \`\`\``.toString(), true)
                .addField("Reason", `\`\`\` ${logs.reason} \`\`\``)
                .setColor("RED")
                .setFooter({
                    text: `User ID: ${newMember.user.id}`
                })
                .setTimestamp()

                const Data = {
                    guildID: newMember.guild.id, 
                    guildName: newMember.guild.name,
                    userID: newMember.user.id, 
                    userName: newMember.user.tag,
                    actionType: "Timeout", 
                    actionReason: logs.reason,
                    Expire: null,
                    actionLength: `${ms(date+1000, {long: true})}`,
                    moderator: logs.executor.tag,
                    moderatorID: logs.executor.id,
                }

                let logmanager = new LogManager(newMember.guild);
                logmanager.logCreate({data: Data, user: newMember});
                logmanager.sendData({type: 'actionlog', data: timeAddEmbed, client});
            }
        }catch(err){
            return console.log(err.stack)
        }
    }
}