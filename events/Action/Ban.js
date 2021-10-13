const { MessageEmbed } = require('discord.js');
const { GuildChannel, LogsDatabase } = require('../../models');
const { LogChannel } = require('../../Functions/logChannelFunctions');
module.exports = {
    event: "guildBanAdd",
    once: false,
    run: async(Guild)=> {
    try{ 
        const fetchedLogs = await Guild.guild.fetchAuditLogs({
            limit: 1,
            type: 'MEMBER_BAN_ADD',
        });

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
                name: `BAN DETECTION - ${target.tag}`,
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
                    value: `\`\`\`${reason.toString() || 'No reason provided'}\`\`\``,
                    inline: false
                }
            ],
            timestamp: new Date(),
            footer: {
                text: `${target.id}`
            }
        }
        const Data = {
            CaseID: makeid(),
            guildID: Guild.guild.id,
            guildName: Guild.guild.name,
            userID: target.id,
            userName: target.tag,
            ActionType: "Ban",
            Reason: reason || "No Reason Provided",
            Moderator: executor.tag,
            ModeratorID: executor.id,
            Banned: true,
            Duration: "∞",
            ActionDate: new Date(),
        }

        async function CreateLog(Member){
            try {
                await LogsDatabase.findOneAndUpdate({
                    guildID: Guild.guild.id,
                    userID: Member.id
                },{
                    guildName: Guild.guild.name,
                    $push: {
                        [`Action`]: {
                            Data
                        }
                    }
                },{
                    upsert: true,
                })
            } catch (err) {
                console.log(err)
            }
        }
        CreateLog(target)

        LogChannel('banLog', Guild.guild).then(c => {
            if(!c) return;
            if(c === null) return;

            else {
                c.send({embeds: [banEmbed]})
            }
        }).catch(err => console.log(err));
    }catch(err){
        return console.log(err)
    }
    }
}