const Discord = require('discord.js');
const { errLog } = require('../../Functions/erroHandling');
const { LogManager } = require('../../Functions')
module.exports = {
    event: "guildMemberUpdate",
    once: false,
    run: async(oldMember, newMember, client)=> {
        const clientPerm = newMember.guild.members.resolve( client.user ).permissions.any("VIEW_AUDIT_LOG");
        if (!clientPerm || clientPerm == false) return

        nickUpdate()
        function nickUpdate() {
            if(newMember.nickname !== oldMember.nickname){
                sendData()
            }else {
                return
            }
        }

        function sendData() {
            let nickEmbed = {
                color: "#fcdb35",
                author: {
                    name: newMember.user.tag,
                    icon_url: newMember.user.displayAvatarURL({dynamic: true, type: "png", size: 1024})
                },
                thumbnail: {
                    url: newMember.user.displayAvatarURL({dynamic: true, type: "png", size: 1024})
                },
                description: `Nickname Changed`,
                fields: [
                    {
                        name: "Old",
                        value: `${oldMember.nickname}`,
                        inline: true
                    },
                    {
                        name: "New",
                        value: `${newMember.nickname}`,
                        inline: true
                    },
                ],
                footer: {
                    text: "User ID: "+newMember.user.id,
                },
                timestamp: new Date()
            }
            new LogManager(newMember.guild).sendData({type: 'userlog', data: nickEmbed, client})
        }
    }
}