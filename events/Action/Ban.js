const { MessageEmbed } = require('discord.js');
const { GuildChannel, LogsDatabase } = require('../../models');
const { LogChannel } = require('../../Functions/logChannelFunctions');
module.exports = {
    event: "guildBanAdd",
    once: false,
    run: async(guild, member)=> {
        LogChannel("banLog", guild).then(async c => {
            if(!c) return;
            if(c === null) return;

            else {
                const fetchedLogs = await guild.fetchAuditLogs({
                    limit: 1,
                    type: 'MEMBER_BAN_ADD'
                })
    
                const BanLog = fetchedLogs.entries.first()
                
                if(!BanLog){
                    return console.log(`${member.id} was banned from ${guild.name} but couldn't find any informations`)
                }
    
                const { executor, target, reason } = BanLog
    
                function makeid() {
                    var text = "";
                    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                
                    for (var i = 0; i < 10; i++)
                    text += possible.charAt(Math.floor(Math.random() * possible.length));
                
                    return text;
                }
    
                const banEmbed = {
                    color: "#fc5947",
                    author: {
                        name: `BAN DETECTION - ${member.tag}`,
                        icon_url: member.displayAvatarURL({
                            dynamic: true , 
                            type: 'png'
                        })
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
                        {
                            name: `Reason for Ban`,
                            value: `\`\`\`${reason.toString() || 'No reason provided'}\`\`\``,
                            inline: false
                        }
                    ],
                    timestamp: new Date(),
                    footer: {
                        text: `${member.id}`
                    }
                }

                if(target.id === member.id){
    
                    await new LogsDatabase({
                        CaseID: makeid(),
                        guildID: guild.id,
                        guildName: guild.name,
                        userID: member.id,
                        userName: member.tag,
                        ActionType: "BAN",
                        Reason: reason || "No Reason Provided",
                        Moderator: executor.tag,
                        ModeratorID: executor.id,
                        Muted: false,
                        Banned: true,
                        softBanned: false,
                        Duration: "∞",
                        Expire: null,
                        ActionDate: new Date(),
                    }).save().catch(err => console.log(err.message))
    
                    const hasPermInChannel = c
                    .permissionsFor(client.user)
                    .has('SEND_MESSAGES', false);
                    if (hasPermInChannel) {
                        c.send({embeds: [banEmbed]})
                    }
            }else {
                const hasPermInChannel = c
                .permissionsFor(client.user)
                .has('SEND_MESSAGES', false);
                if (hasPermInChannel) {
                    c.send({embeds: [banEmbed]})
                }
            }
            }
        })
    }
}