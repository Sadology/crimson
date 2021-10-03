const Discord = require('discord.js');
const { GuildChannel } = require('../../models');
const { errLog } = require('../../Functions/erroHandling');

module.exports = {
    event: "guildMemberUpdate",
    once: false,
    disabled: true,
    run: async(oldMember, newMember, client)=> {

        const { guild } = oldMember;

        if (oldMember.nickname !== newMember.nickname) {
            try{
                const userNickData = await GuildChannel.findOne({
                    guildID: guild.id,
                    Active: true,
                    'UserLog.UserEnabled': true
                })

                if(userNickData){
                    const dataChannel = userNickData.UserLog.UserChannel;
                    const LogChannel = guild.channels.cache.find(c => c.id === dataChannel);
        
                    if(LogChannel){
                        const hasPermissionInChannel = LogChannel
                            .permissionsFor(guild.me)
                            .has('SEND_MESSAGES', false);
                        if (!hasPermissionInChannel) {
                            return
                        }else {
                            const nickEmbed = {
                                color: "#fcdb35",
                                author: {
                                    name: newMember.user.tag,
                                    icon_url: newMember.user.displayAvatarURL({dynamic: true, type: "png", size: 1024})
                                },
                                thumbnail: {
                                    url: newMember.user.displayAvatarURL({dynamic: true, type: "png", size: 1024})
                                },
                                description: `Nickname Updated`,
                                fields: [
                                    {
                                        name: "Before",
                                        value: oldMember.nickname.toString(),
                                        inline: true
                                    },
                                    {
                                        name: "After",
                                        value: newMember.nickname.toString(),
                                        inline: true
                                    },
                                ],
                                footer: {
                                    text: newMember.user.id,
                                },
                                timestamp: new Date()
                            }

                            LogChannel.send({embeds: [nickEmbed]})
                        }
                    }else {
                        return
                    }
                }
            }catch(err){
                errLog(err.stack.toString(), "text", "Nickname", "Error in finding Nick");
            }
        }
    }
}